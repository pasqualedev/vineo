import { z } from 'zod'

export const bottleStatusSchema = z.enum(['STORED', 'CONSUMED', 'GIFTED'])

export const matchOrCreateSchema = z.object({
  barcode: z.string().nullable(),
  rawOcrText: z.string().nullable(),
  cellarId: z.string().uuid(),
  rowPosition: z.number().int().min(0),
  columnPosition: z.number().int().min(0),
  vintage: z.number().int().min(1900).max(2100),
  /**
   * Structured wine details captured in the confirm step. When provided, they are
   * used to create a WineReference (instead of the previous 'Unknown' placeholders)
   * so the maturation window can be computed from a real grape.
   */
  name: z.string().min(1).nullable().optional(),
  winery: z.string().min(1).nullable().optional(),
  grape: z.string().min(1).nullable().optional(),
  region: z.string().min(1).nullable().optional(),
  country: z.string().min(1).nullable().optional(),
  /** Optional purchase price, persisted on the bottle. */
  price: z.number().nonnegative().nullable().optional(),
})

export const moveBottleSchema = z.object({
  rowPosition: z.number().int().min(0),
  columnPosition: z.number().int().min(0),
})

export const updateBottleStatusSchema = z.object({
  status: bottleStatusSchema,
})

export const evolutionStatusSchema = z.enum(['EVOLVING', 'PEAK', 'DECLINING'])

export const bottleResponseSchema = z.object({
  id: z.string(),
  vintage: z.number(),
  purchaseDate: z.string().datetime().nullable(),
  price: z.number().nullable(),
  rowPosition: z.number(),
  columnPosition: z.number(),
  status: bottleStatusSchema,
  notes: z.string().nullable(),
  wine: z.object({
    name: z.string(),
    winery: z.string(),
    grape: z.string(),
    region: z.string(),
    country: z.string(),
  }),
  evolution: z.object({
    startDrinkingYear: z.number(),
    maxDrinkingYear: z.number(),
    currentStatus: evolutionStatusSchema,
  }),
})

export type BottleStatus = z.infer<typeof bottleStatusSchema>
export type EvolutionStatus = z.infer<typeof evolutionStatusSchema>
export type MatchOrCreateInput = z.infer<typeof matchOrCreateSchema>
export type MoveBottleInput = z.infer<typeof moveBottleSchema>
export type UpdateBottleStatusInput = z.infer<typeof updateBottleStatusSchema>
export type BottleResponse = z.infer<typeof bottleResponseSchema>
