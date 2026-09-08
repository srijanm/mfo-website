import { hero } from "@/lib/content/homepage";
import { paymentGraphic } from "@/lib/content/graphics";
import { cx } from "@/lib/cx";

import styles from "./PaymentComposition.module.css";

type PaymentCompositionProps = { className?: string };

/**
 * Graphic A — an illustrative payment, and the work that sits around it.
 *
 * Every word in here is real HTML text at a real size, so it stays crisp,
 * selectable and translatable; the only SVG is the marker glyph, which is
 * decorative and repeats what the label beside it already says. It is not a
 * picture of a product: there is no interface chrome, no fake dashboard and
 * nothing that could be mistaken for a live account.
 *
 * What it must not imply, and does not: that MyFinanceOfficer moves money,
 * provides the bank account, or has completed anything for a real customer. The
 * eyebrow says "Illustrative payment" on the face of the document, the docket
 * rows are open squares rather than ticks, and the qualification under them
 * says scope depends on the reader's own setup.
 *
 * Composition: a flat acid rectangle offset up and to the right gives the
 * document presence, then the white payment document, then a narrower dark
 * docket that overlaps its lower edge. The overlap is a constant negative
 * margin on an element in normal flow — the figure's height therefore accounts
 * for the docket, and no document content is hidden underneath it.
 */
export function PaymentComposition({ className }: PaymentCompositionProps) {
  const { paymentExample } = hero;
  const { eyebrow, status, rowLabels, docket } = paymentGraphic;

  const rows = [
    { label: rowLabels.from, value: paymentExample.from },
    { label: rowLabels.into, value: paymentExample.into },
    { label: rowLabels.frequency, value: paymentExample.frequency },
  ];

  return (
    <figure className={cx(styles.figure, className)}>
      <div className={styles.documentWrap}>
        {/* The backing sits inside the figure's padding, so the composition
            never paints outside its own layout bounds. */}
        <span aria-hidden="true" className={styles.backing} />

        <article className={styles.document}>
          <p className={styles.eyebrow}>{eyebrow}</p>

          <p className={cx(styles.amount, "data-number")}>{paymentExample.amount}</p>

          <hr aria-hidden="true" className={styles.rule} />

          <dl className={styles.rows}>
            {rows.map((row) => (
              <div key={row.label} className={styles.row}>
                <dt className={styles.rowLabel}>{row.label}</dt>
                <dd className={styles.rowValue}>{row.value}</dd>
              </div>
            ))}
          </dl>

          {/* State is carried by the words, not by the colour: the marker is
              decorative and the label says the same thing. */}
          <p className={styles.status}>
            <span aria-hidden="true" className={styles.statusMarker} />
            {status}
          </p>
        </article>
      </div>

      <aside className={styles.docket}>
        <p className={styles.docketTitle}>{docket.title}</p>

        <ul className={styles.docketList}>
          {docket.items.map((item) => (
            <li key={item} className={styles.docketItem}>
              <span aria-hidden="true" className={styles.docketMarker} />
              {item}
            </li>
          ))}
        </ul>

        <p className={styles.docketQualification}>{docket.qualification}</p>
      </aside>
    </figure>
  );
}
