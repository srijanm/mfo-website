import type { ReactNode } from "react";

import { factValue, type ReviewedFact } from "@/lib/content/reviewed";

import { RecordSurface, type RecordRow } from "./RecordSurface";

const DEFAULT_TITLE = "Next obligation";

type DeadlineRecordProps = {
  title?: string;
  /**
   * What is due and when it is due are tax facts, so they are typed as
   * ReviewedFact rather than string. A bare literal will not compile, which is
   * how §33 is enforced here rather than merely stated.
   */
  what: ReviewedFact;
  when: ReviewedFact;
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
    { label: "What", value: factValue(what) },
    { label: "When", value: factValue(when) },
    { label: "Status", value: status },
  ];

  return <RecordSurface title={title} groups={[rows]} note={note} className={className} />;
}
