import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./Button.module.css";

/**
 * `acid` is the dominant call to action. `ink` is the same button reversed, for
 * the one place it sits on an acid field. `secondary` is the outlined one: the
 * second action beside an acid button, and every section-ending action that
 * used to be a bare text link. Only one dominant acid CTA should be visible per
 * viewport — §10 — which is exactly why the others are still buttons but are
 * not filled.
 */
type ButtonTone = "acid" | "ink" | "secondary";

type CommonProps = {
  tone?: ButtonTone;
  /** Trailing arrow. On for link buttons, off for form controls. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  type?: never;
  disabled?: never;
  onClick?: never;
};

type ButtonAsButton = CommonProps &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled" | "onClick"> & {
    href?: never;
  };

type ButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * Renders an anchor when given `href` and a real button otherwise, so a
 * navigation never becomes a click handler on a div. 48px minimum height and
 * 2px radius come from the canonical .button-primary.
 */
export function Button(props: ButtonProps) {
  const { tone = "acid", className, children } = props;
  const isLink = props.href !== undefined;
  /* An arrow means "this goes somewhere", so it is on for link buttons and off
     for anything that submits or advances in place. */
  const { arrow = isLink } = props;

  const classes = cx(
    tone === "secondary" ? "button-secondary" : "button-primary",
    styles.button,
    tone === "ink" && styles.ink,
    tone === "secondary" && styles.secondary,
    className,
  );

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {arrow ? (
        <span aria-hidden="true" className={styles.arrow}>
          →
        </span>
      ) : null}
    </>
  );

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  const { type = "button", disabled, onClick } = props;

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
