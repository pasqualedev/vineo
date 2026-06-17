import { describe, it, expect } from 'vitest'
import {
  isSlotOccupied,
  findFirstAvailableSlot,
  countAvailableSlots,
  resolveSoleCellarId,
} from './slots'

const occupants = [
  { rowPosition: 0, columnPosition: 0 },
  { rowPosition: 0, columnPosition: 1 },
  { rowPosition: 1, columnPosition: 0 },
]

describe('isSlotOccupied', () => {
  it('true quando há garrafa na posição', () => {
    expect(isSlotOccupied(occupants, 0, 0)).toBe(true)
  })
  it('false quando a posição está livre', () => {
    expect(isSlotOccupied(occupants, 1, 1)).toBe(false)
  })
})

describe('findFirstAvailableSlot', () => {
  it('retorna o primeiro slot livre em ordem row-major', () => {
    expect(findFirstAvailableSlot(2, 2, occupants)).toEqual({ row: 1, column: 1 })
  })
  it('retorna o primeiro gap no meio da linha', () => {
    const middleGap = [
      { rowPosition: 0, columnPosition: 0 },
      { rowPosition: 0, columnPosition: 2 },
    ]
    expect(findFirstAvailableSlot(2, 3, middleGap)).toEqual({ row: 0, column: 1 })
  })
  it('retorna null quando a grade está cheia', () => {
    const full = [
      { rowPosition: 0, columnPosition: 0 },
      { rowPosition: 0, columnPosition: 1 },
      { rowPosition: 1, columnPosition: 0 },
      { rowPosition: 1, columnPosition: 1 },
    ]
    expect(findFirstAvailableSlot(2, 2, full)).toBeNull()
  })
})

describe('countAvailableSlots', () => {
  it('conta os slots livres', () => {
    expect(countAvailableSlots(2, 2, occupants)).toBe(1)
  })
  it('grade vazia conta tudo', () => {
    expect(countAvailableSlots(3, 4, [])).toBe(12)
  })
})

describe('resolveSoleCellarId', () => {
  it('retorna o id quando há exatamente uma adega', () => {
    expect(resolveSoleCellarId([{ id: 'abc' }])).toBe('abc')
  })
  it('retorna null com zero adegas', () => {
    expect(resolveSoleCellarId([])).toBeNull()
  })
  it('retorna null com múltiplas adegas', () => {
    expect(resolveSoleCellarId([{ id: 'a' }, { id: 'b' }])).toBeNull()
  })
})
