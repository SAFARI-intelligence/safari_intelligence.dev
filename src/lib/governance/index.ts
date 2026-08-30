// Governance kernel — public barrel (client-safe).
export { createGovernedFn } from "./pipeline";
export { assertRoles, resolveRoles } from "./authorize";
export { CURRENT_PHASE, PHASE_REGISTRY, isPhaseEnabled, type Phase } from "./phaseGate";
export { DOMAINS, GovernanceError, type Domain, type GovernanceSpec, type GovernedContext } from "./types";
