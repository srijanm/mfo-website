import type { Metadata } from "next";

import { Container } from "@/components/foundation";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Get started",
};

/**
 * Route stub. The four-step intake specified in MASTER_BUILD_SPEC.md §27 is
 * built in a later pass; this exists so every primary call to action already
 * lands somewhere real.
 */
export default function GetStartedPage() {
  return (
    <Container className={styles.page}>
      <h1 className={styles.title}>Tell us how you earn.</h1>
      <p className={styles.lead}>
        The intake questions are being built. When they are ready, this is where you will
        describe how you are paid and where you are today, and we will tell you what
        applies to your situation.
      </p>
    </Container>
  );
}
