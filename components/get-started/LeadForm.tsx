"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { Button, ThresholdNode } from "@/components/foundation";
import { track, trackOnce } from "@/lib/analytics/track";
import type { StepId } from "@/lib/analytics/events";
import { detailsStep, getStarted, intakeSteps } from "@/lib/content/get-started";
import { hasPublicContact } from "@/lib/content/contact";
import { legalPublished } from "@/lib/content/legal";
import { cx } from "@/lib/cx";
import { validateContactFields, type LeadField } from "@/lib/leads/validation";
import { HONEYPOT_FIELD, type FieldErrors } from "@/lib/leads/types";

import styles from "./LeadForm.module.css";

const TOTAL_STEPS = intakeSteps.length + 1;
const DETAILS_STEP = intakeSteps.length;

/** The question strings themselves, so the ledger names steps rather than inventing labels. */
const STEP_QUESTIONS = [...intakeSteps.map((s) => s.question), detailsStep.question];

/** Stable ids for analytics. Never an answer — only which step was reached. */
const STEP_IDS: readonly StepId[] = [...intakeSteps.map((s) => s.id), "details"];

type Answers = {
  paidBy: string;
  stage: string;
  needs: string[];
  name: string;
  email: string;
  phone: string;
  note: string;
};

const EMPTY: Answers = {
  paidBy: "",
  stage: "",
  needs: [],
  name: "",
  email: "",
  phone: "",
  note: "",
};

const CONTACT_FIELDS = ["name", "email", "phone", "note"] as const;

type Status = "editing" | "sending" | "sent" | "failed" | "timeout";

type LeadFormProps = {
  /**
   * The page the reader started from, passed in by the route that rendered the
   * form. Context only: it is shown to the reader, and it never pre-answers a
   * question about how they are paid.
   */
  sourcePage?: string;
  /** Human-readable name of that page, for the visible context line. */
  sourceLabel?: string;
};

/**
 * The enquiry: three short questions, then contact details.
 *
 * Answers live in component state for the length of the visit and are never
 * written to storage — nothing personal outlives the session, and nothing
 * personal is put in a URL or sent to analytics.
 *
 * What this is not: an instant assessment. A person reads every enquiry, and
 * the form says so at the point where it asks for a commitment.
 */
export function LeadForm({ sourcePage, sourceLabel }: LeadFormProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("editing");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  /**
   * Reused across retries of the same enquiry, so the provider's idempotency
   * key suppresses a duplicate send. Regenerated only after a success.
   */
  const submissionId = useRef<string>(newId());
  /** Guards against a double submit while a request is already in flight. */
  const inFlight = useRef(false);
  const fieldId = useId();

  const isDetails = step === DETAILS_STEP;
  const currentChoice = isDetails ? null : intakeSteps[step];

  useEffect(() => {
    trackOnce({ name: "enquiry_start", props: { page: sourcePage ?? "/get-started" } });
  }, [sourcePage]);

  /**
   * Move to a step. Errors are deliberately *not* cleared: an error belongs to
   * the field that owns it, and clearing on navigation meant that being sent
   * back to an invalid step erased the message explaining why.
   */
  const goTo = (next: number) => {
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const setAnswer = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    /* Only this field's error goes: the person has just addressed it. */
    setErrors((prev) => ({ ...prev, [key]: undefined, form: undefined }));
  };

  const toggleNeed = (option: string) => {
    setAnswer(
      "needs",
      answers.needs.includes(option)
        ? answers.needs.filter((item) => item !== option)
        : [...answers.needs, option],
    );
  };

  /** Put the caret on the first thing that needs attention. */
  const focusFirstInvalid = (invalid: readonly string[]) => {
    requestAnimationFrame(() => {
      const first = invalid[0];
      if (!first) return;
      const el = formRef.current?.querySelector<HTMLElement>(
        `#${CSS.escape(`${fieldId}-${first}`)}`,
      );
      if (el) {
        el.focus();
        return;
      }
      /* Choice steps have no single focusable field; the group's heading is
         where the summary sits. */
      headingRef.current?.focus();
    });
  };

  /**
   * Advancing must cancel the click's default action explicitly: React reuses
   * the same button node across steps and flips its type from "button" to
   * "submit" during this handler, so without preventDefault the click that
   * moves to the last step also submits the form.
   */
  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (currentChoice) {
      const unanswered = currentChoice.multiple
        ? answers.needs.length === 0
        : !answers[currentChoice.id];

      if (unanswered) {
        setErrors((prev) => ({
          ...prev,
          [currentChoice.id]: currentChoice.multiple
            ? getStarted.chooseAtLeastOne
            : getStarted.chooseAnOption,
        }));
        track({
          name: "enquiry_validation_error",
          props: { step: STEP_IDS[step], fields: currentChoice.id, code: "client" },
        });
        headingRef.current?.focus();
        return;
      }
    }

    track({
      name: "enquiry_step_complete",
      props: { step: STEP_IDS[step], index: step + 1 },
    });
    goTo(step + 1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    /* `noValidate` is set on the form so the browser's own bubbles do not
       compete with inline messages — which means this check is the only
       client-side gate, and it has to actually run. */
    const contactErrors = validateContactFields(answers);
    const invalid = Object.keys(contactErrors);

    if (invalid.length > 0) {
      setErrors((prev) => ({ ...prev, ...contactErrors }));
      track({
        name: "enquiry_validation_error",
        props: { step: "details", fields: invalid.join(","), code: "client" },
      });
      focusFirstInvalid(invalid);
      return;
    }

    /* One request at a time, whatever the button does. */
    if (inFlight.current) return;
    inFlight.current = true;

    setStatus("sending");
    setErrors({});
    track({ name: "enquiry_submit_attempt", props: { step: "details" } });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          sourcePage: sourcePage ?? "",
          submissionId: submissionId.current,
          [HONEYPOT_FIELD]: honeypotRef.current?.value ?? "",
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        errors?: FieldErrors;
        retryAfterSeconds?: number;
      };

      if (response.ok && data.ok) {
        track({ name: "enquiry_submit_success", props: {} });
        /* A new enquiry is a new submission, so the idempotency key rolls. */
        submissionId.current = newId();
        setStatus("sent");
        return;
      }

      if (response.status === 429) {
        /* The retry window comes from the server's Retry-After, so the
           message tells the reader how long rather than "try later". */
        const seconds = data.retryAfterSeconds ?? 60;
        setErrors({ form: getStarted.tooManyRequests(seconds) });
        setStatus("editing");
        track({ name: "enquiry_submit_failure", props: { reason: "rate-limited" } });
        return;
      }

      /* 422 is a validation problem, and the form stays exactly where it is
         with the messages attached to their fields. It is never the generic
         delivery-failure screen — which is what used to happen to a contact
         field rejected by the server. */
      if (response.status === 422) {
        const returned = data.errors ?? {};
        setErrors(returned);
        setStatus("editing");
        track({
          name: "enquiry_validation_error",
          props: { step: "details", fields: Object.keys(returned).join(","), code: "server" },
        });

        const owning = intakeSteps.findIndex((s) => returned[s.id]);
        if (owning >= 0) {
          /* Errors survive the move: goTo no longer clears them. */
          goTo(owning);
        } else {
          focusFirstInvalid(Object.keys(returned).filter((k) => k !== "form"));
        }
        return;
      }

      if (response.status === 504) {
        setStatus("timeout");
        track({ name: "enquiry_submit_failure", props: { reason: "timeout" } });
        return;
      }

      setStatus("failed");
      track({ name: "enquiry_submit_failure", props: { reason: "delivery" } });
    } catch {
      setStatus("failed");
      track({ name: "enquiry_submit_failure", props: { reason: "network" } });
    } finally {
      inFlight.current = false;
    }
  };

  /* ------------------------------------------------------------- outcomes */

  if (status === "sent") {
    return (
      <div className={styles.form}>
        <div className={styles.outcomeBlock} role="status">
          <p className={styles.outcome}>{getStarted.success}</p>
          <p className={styles.outcomeBody}>{getStarted.successDetail}</p>
        </div>
      </div>
    );
  }

  if (status === "failed" || status === "timeout") {
    const copy = status === "timeout" ? getStarted.timeout : getStarted.failure;
    return (
      <div className={styles.form}>
        <div className={styles.outcomeBlock} role="alert">
          <p className={styles.outcome}>{copy.heading}</p>
          <p className={styles.outcomeBody}>{copy.body}</p>
          <div className={styles.actions}>
            {/* Every answer is still in state — returning to the form loses
                nothing and starts the reader back at the last step. */}
            <Button onClick={() => setStatus("editing")}>{copy.retry}</Button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------- editing */

  const errorId = (field: string) => `${fieldId}-${field}-error`;
  const legendId = `${fieldId}-legend`;
  const hintId = `${fieldId}-hint`;

  const isResolved = (field: "name" | "email" | "phone") =>
    answers[field].trim().length > 0 && !errors[field];

  /* Errors owned by the step currently on screen, for the summary line. */
  const visibleErrors = (
    isDetails ? CONTACT_FIELDS : ([currentChoice!.id] as readonly LeadField[])
  ).filter((field) => errors[field]);

  return (
    <form
      ref={formRef}
      className={cx("rule-grid", "rule-grid--4-8", styles.form)}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Visible progress, and the left four columns of the grid. Hidden from
          assistive tech: the step label below carries the same position as
          text, and the current question is already the h2. */}
      <ol aria-hidden="true" className={styles.ledger}>
        {STEP_QUESTIONS.map((question, index) => (
          <li
            key={question}
            className={cx(
              styles.ledgerStep,
              index <= step && styles.ledgerStepReached,
              index === step && styles.ledgerStepNow,
            )}
          >
            <span className={styles.ledgerNode} />
            <span className={styles.ledgerLabel}>{question}</span>
          </li>
        ))}
      </ol>

      <div className={styles.main}>
        <span className={styles.progressLabel}>
          {getStarted.progressLabel(step + 1, TOTAL_STEPS)}
        </span>

        <h2 className={styles.question} ref={headingRef} tabIndex={-1}>
          {currentChoice ? currentChoice.question : detailsStep.question}
        </h2>

        {/* One live region for the whole flow, so sending, failure and the
            error summary are all announced from the same place. */}
        <p className={styles.srOnly} role="status" aria-live="polite">
          {status === "sending" ? getStarted.sendingAnnouncement : ""}
        </p>

        {/* A visual summary, deliberately not an alert: the inline message
            below carries role="alert" so what is announced is the actual
            problem rather than a count of problems. */}
        {visibleErrors.length > 0 ? (
          <p className={styles.errorSummary}>
            {getStarted.errorSummary(visibleErrors.length)}
          </p>
        ) : null}

        {currentChoice ? (
          <fieldset
            className={styles.fieldset}
            /* An explicit radiogroup, so the group carries its own invalid
               state: aria-invalid is not supported on role=radio. The
               multi-select step is a group of checkboxes and mirrors the
               pattern — the invalid state stays on the group either way. */
            role={currentChoice.multiple ? "group" : "radiogroup"}
            aria-labelledby={legendId}
            aria-invalid={errors[currentChoice.id] ? true : undefined}
            aria-describedby={
              cx(
                currentChoice.hint ? hintId : "",
                errors[currentChoice.id] ? errorId(currentChoice.id) : "",
              ) || undefined
            }
          >
            <legend id={legendId} className={styles.legend}>
              {currentChoice.question}
            </legend>

            {currentChoice.hint ? (
              <p id={hintId} className={styles.hint}>
                {currentChoice.hint}
              </p>
            ) : null}

            <div className={styles.choices}>
              {currentChoice.options.map((option) => (
                <label key={option} className={styles.choice}>
                  <input
                    type={currentChoice.multiple ? "checkbox" : "radio"}
                    className={styles.control}
                    name={currentChoice.id}
                    value={option}
                    checked={
                      currentChoice.multiple
                        ? answers.needs.includes(option)
                        : answers[currentChoice.id] === option
                    }
                    onChange={() =>
                      currentChoice.multiple
                        ? toggleNeed(option)
                        : setAnswer(currentChoice.id, option)
                    }
                  />
                  <span
                    aria-hidden="true"
                    className={cx(styles.marker, currentChoice.multiple && styles.markerBox)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>

            {errors[currentChoice.id] ? (
              <p id={errorId(currentChoice.id)} className={styles.error} role="alert">
                {errors[currentChoice.id]}
              </p>
            ) : null}
          </fieldset>
        ) : (
          <div className={styles.fields}>
            {(["name", "email", "phone"] as const).map((field) => {
              const optional = field === "phone";
              const describedBy =
                cx(errors[field] ? errorId(field) : "", optional ? `${fieldId}-phone-hint` : "") ||
                undefined;

              return (
                <div key={field} className={styles.field}>
                  <label className={styles.label} htmlFor={`${fieldId}-${field}`}>
                    {detailsStep.fields[field].label}
                    {optional ? (
                      <span className={styles.optional}>Optional</span>
                    ) : null}
                    <ThresholdNode className={styles.fieldNode} active={isResolved(field)} />
                  </label>
                  {/* The focus underline is drawn on this wrapper, not on the
                      field: the field now also contains the hint and the error
                      message, so an underline anchored to its bottom edge drew
                      itself under those instead of under the control. */}
                  <span className={styles.inputWrap}>
                    <input
                      id={`${fieldId}-${field}`}
                      className={cx(styles.input, errors[field] && styles.inputInvalid)}
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      name={field}
                      autoComplete={detailsStep.fields[field].autoComplete}
                      value={answers[field]}
                      onChange={(event) => setAnswer(field, event.target.value)}
                      aria-invalid={errors[field] ? true : undefined}
                      aria-describedby={describedBy}
                      /* Name and email only. Phone is genuinely optional, and
                         `required` here would contradict the label. */
                      required={!optional}
                    />
                  </span>
                  {optional ? (
                    <p id={`${fieldId}-phone-hint`} className={styles.hint}>
                      Only if you would rather we called.
                    </p>
                  ) : null}
                  {errors[field] ? (
                    <p id={errorId(field)} className={styles.error} role="alert">
                      {errors[field]}
                    </p>
                  ) : null}
                </div>
              );
            })}

            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${fieldId}-note`}>
                {detailsStep.fields.note.label}{" "}
                <span className={styles.optional}>{detailsStep.fields.note.optional}</span>
              </label>
              <span className={styles.inputWrap}>
                <textarea
                  id={`${fieldId}-note`}
                  className={styles.textarea}
                  name="note"
                  value={answers.note}
                  onChange={(event) => setAnswer("note", event.target.value)}
                  aria-invalid={errors.note ? true : undefined}
                  aria-describedby={errors.note ? errorId("note") : undefined}
                />
              </span>
              {errors.note ? (
                <p id={errorId("note")} className={styles.error} role="alert">
                  {errors.note}
                </p>
              ) : null}
            </div>

            {/* Where the reader started, shown rather than applied. It carries
                no claim about how they are paid — the questions above do. */}
            {sourcePage && sourceLabel ? (
              <p className={styles.sourceNote}>
                <span className={styles.sourceLabel}>{getStarted.sourceLabel}:</span>{" "}
                {sourceLabel}. {getStarted.sourceNote}
              </p>
            ) : null}

            {/* Not shown, not announced, not reachable by keyboard. */}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor={`${fieldId}-${HONEYPOT_FIELD}`}>Company</label>
              <input
                ref={honeypotRef}
                id={`${fieldId}-${HONEYPOT_FIELD}`}
                name={HONEYPOT_FIELD}
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
          </div>
        )}

        {errors.form ? (
          <p className={styles.error} role="alert" style={{ marginTop: 24 }}>
            {errors.form}
          </p>
        ) : null}

        {/* The commitment is being asked for on the last step, so this is where
            the reassurance and the privacy note sit. */}
        {isDetails ? (
          <>
            <p className={styles.reassurance}>{getStarted.reassurance}</p>
            <p className={styles.privacy}>
              {getStarted.privacy.body}{" "}
              {/* Linked only once there is a real document to link to.
                  Pointing at a page that says "this is being prepared" is
                  worse than saying nothing. */}
              {legalPublished("privacy") ? (
                <Link href={getStarted.privacy.href}>{getStarted.privacy.linkLabel}</Link>
              ) : null}
            </p>
          </>
        ) : null}

        <div className={styles.actions}>
          {/* Distinct keys so the two actions are separate elements rather than
              one node whose type is rewritten between steps. */}
          {isDetails ? (
            <Button key="submit" type="submit" disabled={status === "sending"}>
              {status === "sending" ? getStarted.sending : getStarted.submit}
            </Button>
          ) : (
            <Button key="next" type="button" onClick={handleNext}>
              {getStarted.next}
            </Button>
          )}

          {step > 0 ? (
            <button type="button" className={styles.back} onClick={() => goTo(step - 1)}>
              {getStarted.back}
            </button>
          ) : null}
        </div>

        {/* Only offered where a genuinely independent route exists. While the
            contact page has nothing but a link back here, advertising it as an
            alternative sends the reader in a circle. */}
        {hasPublicContact() ? (
          <div className={styles.alternative}>
            <p className={styles.alternativePrompt}>{getStarted.alternative.prompt}</p>
            <Button href={getStarted.alternative.href} tone="secondary">
              {getStarted.alternative.label}
            </Button>
          </div>
        ) : null}
      </div>
    </form>
  );
}

/** uuid v4 where available, with a plain fallback for older browsers. */
function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;
}
