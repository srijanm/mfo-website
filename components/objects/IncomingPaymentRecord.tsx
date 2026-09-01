import type { ReactNode } from "react";

import type { AmountFormatterName } from "@/lib/content/format";

import { RecordSurface, type RecordRow } from "./RecordSurface";

const DEFAULT_TITLE = "Incoming payment";

type IncomingPaymentRecordProps = {
  title?: string;
  /** Formatted by the caller, including its currency symbol. */
  amount: string;
  /** Optional: the same figure as a number plus a formatter, so it counts up. */
  amountValue?: number;
  amountFormat?: AmountFormatterName;
  from?: string | null;
  received?: string | null;
  into?: string | null;
  frequency?: string | null;
  /**
   * The India-side group. These are deliberately not tax conclusions: they say
   * that an answer is needed, not what the answer is. §11 forbids implying that
   * every overseas payslip is treated the same way.
   */
  indianPayroll?: string | null;
  indiaSideSetup?: string | null;
  note?: ReactNode;
  className?: string;
};

/**
 * The incoming payment object from §11.
 *
 * Every figure, date and destination arrives as a prop. Nothing about a
 * specific payment is written into this file.
 */
export function IncomingPaymentRecord({
  title = DEFAULT_TITLE,
  amount,
  amountValue,
  amountFormat,
  from = null,
  received = null,
  into = null,
  frequency = null,
  indianPayroll = null,
  indiaSideSetup = null,
  note,
  className,
}: IncomingPaymentRecordProps) {
  const source: RecordRow[] = [
    { label: "From", value: from },
    { label: "Received", value: received },
    { label: "Into", value: into },
    { label: "Frequency", value: frequency },
  ];

  const indiaSide: RecordRow[] = [
    { label: "Indian payroll", value: indianPayroll },
    /* The one open question in the object. The node says an answer is needed,
       which is exactly what the row already says in words. */
    { label: "India-side setup", value: indiaSideSetup, state: "unresolved" },
  ];

  return (
    <RecordSurface
      title={title}
      amount={amount}
      amountValue={amountValue}
      amountFormat={amountFormat}
      groups={[source, indiaSide]}
      note={note}
      className={className}
    />
  );
}
