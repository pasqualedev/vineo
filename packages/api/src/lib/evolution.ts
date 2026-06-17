import { GUARD_MATRIX, DEFAULT_GUARD } from '@vineo/shared'
import type { EvolutionStatus } from '@vineo/shared'

export function calculateEvolution(
  vintage: number,
  grape: string,
  currentYear: number = new Date().getFullYear(),
): { startDrinkingYear: number; maxDrinkingYear: number; currentStatus: EvolutionStatus } {
  const rule = GUARD_MATRIX[grape] ?? DEFAULT_GUARD
  const startDrinkingYear = vintage + rule.min
  const maxDrinkingYear = vintage + rule.max

  let currentStatus: EvolutionStatus
  if (currentYear < startDrinkingYear) {
    currentStatus = 'EVOLVING'
  } else if (currentYear <= maxDrinkingYear) {
    currentStatus = 'PEAK'
  } else {
    currentStatus = 'DECLINING'
  }

  return { startDrinkingYear, maxDrinkingYear, currentStatus }
}
