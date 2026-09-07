/**
 * Item 15. Two illustrative years, as fields of weeks.
 *
 * These are shapes, not records. Nothing here describes a real person's year
 * and nothing here carries tax meaning: a cell is either empty, a week money
 * arrived, or a week something needed doing. There are no dates, no months, no
 * amounts and no obligations named.
 *
 * The pattern is generated rather than typed out, from a fixed seed, so it is
 * identical on every render and on the server and the client. The generator is
 * here in the content layer rather than in a component, because the shape of
 * the field is a content decision.
 */

export type FieldCell = "none" | "payment" | "todo";

const WEEKS = 52;
const ROWS = 5;

/**
 * A small deterministic generator. Not cryptographic and not meant to be: it
 * exists so the two shapes are stable and reviewable rather than random.
 */
function sequence(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function build(
  seed: number,
  /** Roughly how often money arrives, per week. */
  paymentRate: number,
  /** Whether payments land on a regular beat or wherever they land. */
  regular: boolean,
  /** Weeks where something needed doing. Indices only — never dates. */
  todoWeeks: readonly number[],
): FieldCell[][] {
  const next = sequence(seed);
  const todo = new Set(todoWeeks);

  return Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: WEEKS }, (_, week): FieldCell => {
      if (row === 0 && todo.has(week)) return "todo";
      if (regular) return week % 4 === row ? "payment" : "none";
      return next() < paymentRate ? "payment" : "none";
    }),
  );
}

export const incomeField = {
  /** Says plainly what these are, so no reader takes them for real records. */
  caption: "Two illustrative years. Shapes, not anyone's records.",

  /* What the drawing is, said before it is read rather than after. Two grids of
     small squares mean nothing until someone says what one square is; the
     caption below says what they are *not*, which is a different job. Neither
     sentence names a month, a date or an obligation. */
  legend:
    "Each square is a week of the year. The marked ones are weeks where something needed attention.",
  shapes: [
    {
      id: "salaried",
      label: "A salaried year",
      /* One arrival, on a beat, and almost nothing to attend to. */
      cells: build(20260101, 0.25, true, [25]),
    },
    {
      id: "yours",
      label: "A year like yours",
      /* Money arrives when it arrives, and more of the year needs attention. */
      cells: build(20260902, 0.34, false, [6, 14, 23, 31, 40, 48]),
    },
  ],
} as const;

export const FIELD_WEEKS = WEEKS;
