import type { ReactNode } from "react";

import { RecordSurface, type RecordRow } from "./RecordSurface";

const DEFAULT_TITLE = "Income tax return";

type FilingRecordProps = {
  title?: string;
  /** Marketing status language only — see the approved list in the copy doc. */
  status: string;
  prepared?: string | null;
  sentToYou?: string | null;
  approved?: string | null;
  filed?: string | null;
  note?: ReactNode;
  className?: string;
};

/**
 * The filing object from §11. Shows the sequence a return moves through, with
 * unreached steps rendered as the empty marker rather than omitted, so the
 * whole sequence stays visible.
 */
export function FilingRecord({
  title = DEFAULT_TITLE,
  status,
  prepared = null,
  sentToYou = null,
  approved = null,
  filed = null,
  note,
  className,
}: FilingRecordProps) {
  const rows: RecordRow[] = [
    { label: "Status", value: status },
    { label: "Prepared", value: prepared },
    { label: "Sent to you", value: sentToYou },
    { label: "Approved", value: approved },
    { label: "Filed", value: filed },
  ];

  return (
    <RecordSurface title={title} groups={[rows]} note={note} className={className} />
  );
}
