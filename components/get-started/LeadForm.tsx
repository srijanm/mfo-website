"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";

import { Button, ThresholdNode } from "@/components/foundation";
import { detailsStep, getStarted, intakeSteps } from "@/lib/content/get-started";
import { cx } from "@/lib/cx";
import { HONEYPOT_FIELD, type FieldErrors, type LeadPayload } from "@/lib/leads/types";

import styles from "./LeadForm.module.css";

const TOTAL_STEPS = intakeSteps.length + 1;

/**
 * The four questions, in order, for the progress ledger. These are the approved
 * question strings themselves — the ledger names the steps rather than counting
 * them, so nothing is invented to label it.
 */
const STEP_QUESTIONS = [...intakeSteps.map((s) => s.question), detailsStep.question];

type Answers = {
  paidBy: string;
  stage: string;
  needs: string;
  name: string;
  email: string;
  phone: string;
  note: string;
};

const EMPTY: Answers = {
  paidBy: "",
  stage: "",
  needs: "",
  name: "",
  email: "",
  phone: "",
  note: "",
};

type Status = "editing" | "sending" | "sent" | "failed";

/**
 * The four-step intake.
 *
 * All answers live in component state for the length of the visit and are never
 * written to storage, so nothing personal outlives the session — the spec is
 * explicit about that.
 *
 * The browser validates to keep the round trip short, but the route validates
 * independently; this component's checks are a convenience, not the gate.
 */
export function LeadForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("editing");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const fieldId = useId();

  const isDetails = step === intakeSteps.length;
  const currentChoice = isDetails ? null : intakeSteps[step];

  /* Focus the new question so a screen reader announces it. This is assistive
     behaviour, not motion — nothing moves. */
  const goTo = (next: number) => {
    setStep(next);
    setErrors({});
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const setAnswer = (key: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /**
   * Advancing must cancel the click's default action explicitly.
   *
   * React reuses the same button node across steps and flips its type from
   * "button" to "submit" during this handler — before the browser evaluates the
   * default action — so without preventDefault the click that moves to the last
   * step also submits the empty form.
   */
  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (currentChoice && !answers[currentChoice.id]) {
      setErrors({ [currentChoice.id]: getStarted.chooseAnOption });
      return;
    }
    goTo(step + 1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setErrors({});

    const payload: LeadPayload & { [HONEYPOT_FIELD]: string } = {
      ...answers,
      [HONEYPOT_FIELD]: honeypotRef.current?.value ?? "",
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        errors?: FieldErrors;
      };

      if (response.ok && data.ok) {
        setStatus("sent");
        return;
      }

      if (response.status === 429) {
        setErrors({ form: getStarted.tooManyRequests });
        setStatus("editing");
        return;
      }

      /* Field errors send the person back to the step that owns them. */
      const returned = data.errors ?? {};
      const choiceStep = intakeSteps.findIndex((s) => returned[s.id]);

      setErrors(returned);
      setStatus(choiceStep >= 0 ? "editing" : "failed");
      if (choiceStep >= 0) goTo(choiceStep);
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div className={styles.form}>
        <p className={styles.outcome}>{getStarted.success}</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className={styles.form}>
        <p className={styles.outcome}>{getStarted.failure.heading}</p>
        <p className={styles.outcomeBody}>{getStarted.failure.body}</p>
        <div className={styles.actions}>
          <Button onClick={() => setStatus("editing")}>{getStarted.failure.retry}</Button>
          <Link href={getStarted.alternative.href}>{getStarted.alternative.label}</Link>
        </div>
      </div>
    );
  }

  const errorId = (field: string) => `${fieldId}-${field}-error`;
  const legendId = `${fieldId}-legend`;

  /* Resolved means: the person has put something in and nothing has come back
     about it. Read from the answers and errors the form already holds, so the
     node never claims more than the form knows. */
  const isResolved = (field: keyof Answers) =>
    answers[field].trim().length > 0 && !errors[field];

  return (
    <form
      className={cx("rule-grid", "rule-grid--4-8", styles.form)}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Visible progress, as the spec requires, and the left four columns of
          the grid. Hidden from assistive tech: the step label below carries the
          same position as text, and the current question is already the h2. */}
      <ol aria-hidden="true" className={styles.ledger}>
        {STEP_QUESTIONS.map((question, index) => (
          <li
            key={question}
            className={cx(styles.ledgerStep, index === step && styles.ledgerStepNow)}
          >
            <span className={styles.ledgerRail}>
              <ThresholdNode
                className={styles.ledgerNode}
                orientation="vertical"
                active={index <= step}
                lineBefore={index > 0}
                lineAfter={index < TOTAL_STEPS - 1}
              />
            </span>
            <span className={styles.ledgerLabel}>{question}</span>
          </li>
        ))}
      </ol>

      <div className={cx("rule-grid-flush", styles.main)}>
      <span className={styles.progressLabel}>
        {getStarted.progressLabel(step + 1, TOTAL_STEPS)}
      </span>

      <h2 className={styles.question} ref={headingRef} tabIndex={-1}>
        {currentChoice ? currentChoice.question : detailsStep.question}
      </h2>

      {currentChoice ? (
        <fieldset
          className={styles.fieldset}
          /* An explicit radiogroup, so the group can carry its own invalid
             state: aria-invalid is not supported on role=radio, which is what
             the inputs are, and a bare fieldset exposes no role that takes it.
             With the role set the legend no longer names the group on its own,
             so the name is stated with aria-labelledby. */
          role="radiogroup"
          aria-labelledby={legendId}
          aria-invalid={errors[currentChoice.id] ? true : undefined}
          aria-describedby={errors[currentChoice.id] ? errorId(currentChoice.id) : undefined}
        >
          <legend id={legendId} className={styles.legend}>
            {currentChoice.question}
          </legend>

          <div className={styles.choices}>
            {currentChoice.options.map((option) => (
              <label key={option} className={styles.choice}>
                <input
                  type="radio"
                  className={styles.radio}
                  name={currentChoice.id}
                  value={option}
                  checked={answers[currentChoice.id] === option}
                  onChange={() => setAnswer(currentChoice.id, option)}
                />
                <span aria-hidden="true" className={styles.marker} />
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
          {(["name", "email", "phone"] as const).map((field) => (
            <div key={field} className={styles.field}>
              <label className={styles.label} htmlFor={`${fieldId}-${field}`}>
                {detailsStep.fields[field].label}
                <ThresholdNode
                  className={styles.fieldNode}
                  active={isResolved(field)}
                />
              </label>
              <input
                id={`${fieldId}-${field}`}
                className={styles.input}
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                name={field}
                autoComplete={detailsStep.fields[field].autoComplete}
                value={answers[field]}
                onChange={(event) => setAnswer(field, event.target.value)}
                aria-invalid={errors[field] ? true : undefined}
                aria-describedby={errors[field] ? errorId(field) : undefined}
                required
              />
              {errors[field] ? (
                <p id={errorId(field)} className={styles.error} role="alert">
                  {errors[field]}
                </p>
              ) : null}
            </div>
          ))}

          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${fieldId}-note`}>
              {detailsStep.fields.note.label}{" "}
              <span className={styles.optional}>{detailsStep.fields.note.optional}</span>
            </label>
            <textarea
              id={`${fieldId}-note`}
              className={styles.textarea}
              name="note"
              value={answers.note}
              onChange={(event) => setAnswer("note", event.target.value)}
              aria-invalid={errors.note ? true : undefined}
              aria-describedby={errors.note ? errorId("note") : undefined}
            />
            {errors.note ? (
              <p id={errorId("note")} className={styles.error} role="alert">
                {errors.note}
              </p>
            ) : null}
          </div>

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

      {/* The action sits on its own row rather than inline in the sentence, so
          it clears the project's 44px target minimum. Outlined: the acid
          control on this screen is the form's own Continue. */}
      <div className={styles.alternative}>
        <p className={styles.alternativePrompt}>{getStarted.alternative.prompt}</p>
        <Button href={getStarted.alternative.href} tone="secondary">
          {getStarted.alternative.label}
        </Button>
      </div>
      </div>
    </form>
  );
}
