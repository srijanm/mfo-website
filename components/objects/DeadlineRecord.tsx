import type { ReactNode } from "react";

import { factValue, type ReviewedFact } from "@/lib/content/reviewed";

import { RecordSurface, type RecordRow } from "./RecordSurface";

const DEFAULT_TITLE = "Next obligation";

type DeadlineRecordProps = {
  title?: string;
  /**
   * What is due is a tax fact, so it is typed as ReviewedFact and a bare
   * literal will not compile — that is how §33 is enforced here rather than
   * merely stated.
   *
   * A plain string is accepted for one case only: naming a subject that
   * carries no tax meaning, such as a stage the reader is already looking at
   * by name. Anything that states an obligation must still be a ReviewedFact.
   */
  what: ReviewedFact | string | null;
  /** Null until a CA supplies and reviews a date; renders the empty marker. */
  when: ReviewedFact | null;
  /** Marketing status, e.g. "MFO tracks". Not a tax fact. */
  status: string;
  note?: ReactNode;
  className?: string;
};

/**
 * The deadline object from §11.
 *
 * This component renders whatever it is given and never decides what an
 * obligation is or when it falls due.
 */
export function DeadlineRecord({
  title = DEFAULT_TITLE,
  what,
  when,
  status,
  note,
  className,
}: DeadlineRecordProps) {
  const rows: RecordRow[] = [
    { label: "What", value: typeof what === "string" ? what : what && factValue(what) },
    { label: "When", value: when && factValue(when) },
    { label: "Status", value: status },
  ];

  return <RecordSurface title={title} groups={[rows]} note={note} className={className} />;
}
