// Governance kernel — phase gate.
//
// Declarative, config-only registry of which capabilities are live in the
// current rollout phase. No database, no network: a governed action whose
// feature key is disabled is rejected before execution.

export type Phase = "foundation" | "beta" | "ga";

/** Current rollout phase of the platform. */
export const CURRENT_PHASE: Phase = "beta";

const PHASE_ORDER: Record<Phase, number> = {
  foundation: 0,
  beta: 1,
  ga: 2,
};

/**
 * Feature key -> the earliest phase in which it is allowed to execute.
 * Keys default to `${domain}.${action}`; unknown keys are allowed so that
 * adopting the kernel never blocks an existing endpoint.
 */
export const PHASE_REGISTRY: Record<string, Phase> = {
  // Identity — live since foundation.
  "identity.profile.read": "foundation",
  "identity.profile.update": "foundation",
  "identity.roles.list": "foundation",
  "identity.roles.assign": "foundation",
  "identity.roles.revoke": "foundation",
  "identity.auth.sign_in": "foundation",
  "identity.auth.verified": "foundation",

  // WIS — storytelling slice is in beta.
  "wis.journal.list": "beta",
  "wis.journal.create": "beta",
  "wis.journal.delete": "beta",
  "wis.trip_summary.generate": "beta",
  "wis.trip_summary.read": "beta",

  // Reserved for later phases — kept here so the gate is the single source
  // of truth when these land.
  "wis.observation.ingest": "ga",
  "wis.forecast.read": "ga",
  "ai.orchestrator.dispatch": "ga",
};

export function isPhaseEnabled(featureKey: string, phase: Phase = CURRENT_PHASE): boolean {
  const required = PHASE_REGISTRY[featureKey];
  if (!required) return true; // unregistered features are not gated
  return PHASE_ORDER[phase] >= PHASE_ORDER[required];
}
