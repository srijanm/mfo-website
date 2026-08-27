// MyFinanceOfficer — owner-approved commercial mapping
//
// The provided source material establishes:
// - annual prices: 19,999 / 24,999 / 34,999
// - existence of broader services: FX, insurance, loans, wealth planning, MIS
//
// It does NOT establish the exact current plan names or which feature belongs
// to which price point. Do not fabricate them.
//
// The website is deliberately complete without this mapping.
// When the business owner supplies it, populate this one object and enable
// the detailed plan-comparison matrix.

export type PlanScope = {
  annualPrice: 19999 | 24999 | 34999;
  displayName: string;
  coreScopeIds: string[];
  additionalSupportIds: string[];
};

export const approvedPlanScope: PlanScope[] | null = null;

// Rendering rule:
// if approvedPlanScope === null:
//   - show three price-first annual plan columns;
//   - show core scope and additional support as separate global sections;
//   - do not render checkmarks or claim which tier includes which feature.
//
// if populated:
//   - render the owner-approved comparison matrix;
//   - do not alter the homepage positioning hierarchy.
