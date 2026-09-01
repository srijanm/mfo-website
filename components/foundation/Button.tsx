import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./Button.module.css";

/**
 * `acid` is the dominant call to action. `ink` is the same button reversed, for
 * the one place it sits on an acid field. Only one dominant acid CTA should be
 * visible per viewport — §10.
 */
type ButtonTone = "acid" | "ink";

type CommonProps = {
  tone?: ButtonTone;
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
  const classes = cx("button-primary", styles.button, tone === "ink" && styles.ink, className);

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        <span className={styles.label}>{children}</span>
      </Link>
    );
  }

  const { type = "button", disabled, onClick } = props;

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      <span className={styles.label}>{children}</span>
    </button>
  );
}
