import { describe, it, expect } from 'vitest'
import { matchOrCreateSchema, moveBottleSchema, updateBottleStatusSchema } from './bottle'
import { createCellarSchema } from './cellar'
import { createUserSchema } from './user'

const VALID_UUID = '11111111-1111-4111-8111-111111111111'

describe('matchOrCreateSchema', () => {
  const base = {
    barcode: null,
    rawOcrText: 'Almafuerte Malbec',
    cellarId: VALID_UUID,
    rowPosition: 0,
    columnPosition: 0,
    vintage: 2020,
  }

  it('accepts a minimal valid payload', () => {
    expect(matchOrCreateSchema.parse(base)).toMatchObject(base)
  })

  it('accepts optional structured wine fields and price', () => {
    const parsed = matchOrCreateSchema.parse({
      ...base,
      winery: 'Catena',
      grape: 'Malbec',
      region: 'Mendoza',
      country: 'Argentina',
      price: 120.5,
    })
    expect(parsed.grape).toBe('Malbec')
    expect(parsed.price).toBe(120.5)
  })

  it('rejects a vintage outside the allowed range', () => {
    expect(matchOrCreateSchema.safeParse({ ...base, vintage: 1800 }).success).toBe(false)
    expect(matchOrCreateSchema.safeParse({ ...base, vintage: 2200 }).success).toBe(false)
  })

  it('rejects negative grid positions', () => {
    expect(matchOrCreateSchema.safeParse({ ...base, rowPosition: -1 }).success).toBe(false)
  })

  it('rejects a non-uuid cellarId', () => {
    expect(matchOrCreateSchema.safeParse({ ...base, cellarId: 'not-a-uuid' }).success).toBe(false)
  })

  it('rejects a negative price', () => {
    expect(matchOrCreateSchema.safeParse({ ...base, price: -1 }).success).toBe(false)
  })
})

describe('moveBottleSchema', () => {
  it('accepts valid positions', () => {
    expect(moveBottleSchema.parse({ rowPosition: 2, columnPosition: 3 })).toEqual({
      rowPosition: 2,
      columnPosition: 3,
    })
  })

  it('rejects non-integer positions', () => {
    expect(moveBottleSchema.safeParse({ rowPosition: 1.5, columnPosition: 0 }).success).toBe(false)
  })
})

describe('updateBottleStatusSchema', () => {
  it.each(['STORED', 'CONSUMED', 'GIFTED'])('accepts the %s status', (status) => {
    expect(updateBottleStatusSchema.parse({ status }).status).toBe(status)
  })

  it('rejects an unknown status', () => {
    expect(updateBottleStatusSchema.safeParse({ status: 'DRUNK' }).success).toBe(false)
  })
})

describe('createCellarSchema', () => {
  const base = { name: 'Adega Principal', rows: 6, columns: 12, userId: VALID_UUID }

  it('accepts a valid cellar', () => {
    expect(createCellarSchema.parse(base)).toEqual(base)
  })

  it('rejects an empty name', () => {
    expect(createCellarSchema.safeParse({ ...base, name: '' }).success).toBe(false)
  })

  it('rejects grid dimensions outside 1..50', () => {
    expect(createCellarSchema.safeParse({ ...base, rows: 0 }).success).toBe(false)
    expect(createCellarSchema.safeParse({ ...base, columns: 51 }).success).toBe(false)
  })
})

describe('createUserSchema', () => {
  it('defaults the name to "Enófilo" when omitted', () => {
    expect(createUserSchema.parse({})).toEqual({ name: 'Enófilo' })
  })

  it('keeps a provided name', () => {
    expect(createUserSchema.parse({ name: 'Ana' })).toEqual({ name: 'Ana' })
  })
})
