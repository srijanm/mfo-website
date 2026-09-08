/**
 * Firm identity and approved professional information.
 *
 * One object, every field owner-supplied, everything null until it is. The site
 * renders only what is populated — no field here has an invented default, and
 * no component may substitute one.
 *
 * `publishTeam` is a deliberate owner decision rather than a missing value: the
 * firm may choose not to publish individual profiles at all, and that is a
 * complete answer, not a gap to be filled later.
 */

export type FirmProfile = {
  /** Registered entity name, if different from the trading name. */
  registeredName: string | null;
  /** e.g. an ICAI firm registration line, exactly as approved. */
  registrationLine: string | null;
  /** Registered address, as approved for publication. */
  address: string | null;
  /**
   * Whether individual profiles are published. `false` is a decision, not a
   * placeholder: the site says nothing about people either way.
   */
  publishTeam: boolean;
  /** Approved professional statements, rendered verbatim where supplied. */
  statements: readonly string[];
};

export const firm: FirmProfile = {
  registeredName: null,
  registrationLine: null,
  address: null,
  publishTeam: false,
  statements: [],
};

/** True once there is anything approved to render about the entity. */
export function hasFirmIdentity(): boolean {
  return Boolean(firm.registeredName || firm.registrationLine || firm.address) ||
    firm.statements.length > 0;
}
