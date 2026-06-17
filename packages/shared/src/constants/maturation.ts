export interface GuardRule {
  min: number
  max: number
}

export const GUARD_MATRIX: Record<string, GuardRule> = {
  'Cabernet Sauvignon': { min: 5, max: 15 },
  'Nebbiolo': { min: 7, max: 25 },
  'Malbec': { min: 3, max: 8 },
  'Syrah': { min: 3, max: 8 },
  'Merlot': { min: 3, max: 10 },
  'Pinot Noir': { min: 2, max: 8 },
  'Sangiovese': { min: 4, max: 12 },
  'Tempranillo': { min: 4, max: 12 },
  'Chardonnay': { min: 1, max: 5 },
  'Sauvignon Blanc': { min: 0, max: 3 },
  'White/Rosé': { min: 0, max: 2 },
  'Sparkling': { min: 1, max: 5 },
  'Dessert': { min: 5, max: 20 },
}

export const DEFAULT_GUARD: GuardRule = { min: 2, max: 8 }

export function getGuardRule(grape: string): GuardRule {
  return GUARD_MATRIX[grape] ?? DEFAULT_GUARD
}

export function calculateEvolutionYears(
  vintage: number,
  grape: string,
): { startDrinkingYear: number; maxDrinkingYear: number } {
  const rule = getGuardRule(grape)
  return {
    startDrinkingYear: vintage + rule.min,
    maxDrinkingYear: vintage + rule.max,
  }
}

export function getCurrentStatus(
  vintage: number,
  grape: string,
  currentYear: number = new Date().getFullYear(),
): 'EVOLVING' | 'PEAK' | 'DECLINING' {
  const { startDrinkingYear, maxDrinkingYear } = calculateEvolutionYears(vintage, grape)

  if (currentYear < startDrinkingYear) return 'EVOLVING'
  if (currentYear <= maxDrinkingYear) return 'PEAK'
  return 'DECLINING'
}
