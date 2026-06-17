import { describe, it, expect } from 'vitest'
import {
  GUARD_MATRIX,
  DEFAULT_GUARD,
  getGuardRule,
  calculateEvolutionYears,
  getCurrentStatus,
  calculateEvolution,
} from './maturation'

describe('getGuardRule', () => {
  it('returns the matrix rule for a known grape', () => {
    expect(getGuardRule('Cabernet Sauvignon')).toEqual(GUARD_MATRIX['Cabernet Sauvignon'])
  })

  it('falls back to the default rule for an unknown grape', () => {
    expect(getGuardRule('Unknown')).toEqual(DEFAULT_GUARD)
    expect(getGuardRule('Totally Made Up Grape')).toEqual(DEFAULT_GUARD)
  })
})

describe('calculateEvolutionYears', () => {
  it('derives the drinking window from vintage + guard rule', () => {
    // Cabernet Sauvignon: min 5, max 15
    expect(calculateEvolutionYears(2020, 'Cabernet Sauvignon')).toEqual({
      startDrinkingYear: 2025,
      maxDrinkingYear: 2035,
    })
  })

  it('uses the default window for an unknown grape', () => {
    // DEFAULT_GUARD: min 2, max 8
    expect(calculateEvolutionYears(2020, 'Unknown')).toEqual({
      startDrinkingYear: 2022,
      maxDrinkingYear: 2028,
    })
  })

  it('supports grapes with a zero minimum (drink immediately)', () => {
    // Sauvignon Blanc: min 0, max 3
    expect(calculateEvolutionYears(2024, 'Sauvignon Blanc')).toEqual({
      startDrinkingYear: 2024,
      maxDrinkingYear: 2027,
    })
  })
})

describe('getCurrentStatus', () => {
  const vintage = 2020
  const grape = 'Cabernet Sauvignon' // window 2025–2035

  it('is EVOLVING before the start year', () => {
    expect(getCurrentStatus(vintage, grape, 2024)).toBe('EVOLVING')
  })

  it('is PEAK at the start-year boundary (inclusive)', () => {
    expect(getCurrentStatus(vintage, grape, 2025)).toBe('PEAK')
  })

  it('is PEAK at the max-year boundary (inclusive)', () => {
    expect(getCurrentStatus(vintage, grape, 2035)).toBe('PEAK')
  })

  it('is DECLINING after the max year', () => {
    expect(getCurrentStatus(vintage, grape, 2036)).toBe('DECLINING')
  })
})

describe('calculateEvolution', () => {
  it('combines the drinking window and current status', () => {
    expect(calculateEvolution(2020, 'Cabernet Sauvignon', 2030)).toEqual({
      startDrinkingYear: 2025,
      maxDrinkingYear: 2035,
      currentStatus: 'PEAK',
    })
  })

  it('reports DECLINING for an old bottle past its window', () => {
    expect(calculateEvolution(2000, 'Sauvignon Blanc', 2026)).toEqual({
      startDrinkingYear: 2000,
      maxDrinkingYear: 2003,
      currentStatus: 'DECLINING',
    })
  })

  it('reports EVOLVING for a young bottle still maturing', () => {
    expect(calculateEvolution(2024, 'Nebbiolo', 2026)).toEqual({
      startDrinkingYear: 2031, // min 7
      maxDrinkingYear: 2049, // max 25
      currentStatus: 'EVOLVING',
    })
  })
})
