import { z } from 'zod'

export const bottleStatusSchema = z.enum(['STORED', 'CONSUMED', 'GIFTED'])

export const matchOrCreateSchema = z.object({
  barcode: z.string().nullable(),
  rawOcrText: z.string().nullable(),
  cellarId: z.string(),
  rowPosition: z.number().int().min(0),
  columnPosition: z.number().int().min(0),
  vintage: z.number().int().min(1900).max(2100),
})

export const moveBottleSchema = z.object({
  rowPosition: z.number().int().min(0),
  columnPosition: z.number().int().min(0),
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
export type BottleResponse = z.infer<typeof bottleResponseSchema>
