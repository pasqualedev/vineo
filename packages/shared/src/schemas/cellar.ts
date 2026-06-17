import { z } from 'zod'

export const createCellarSchema = z.object({
  name: z.string().min(1, 'Nome da adega é obrigatório'),
  rows: z.number().int().min(1).max(50),
  columns: z.number().int().min(1).max(50),
  userId: z.string().uuid(),
})

export const cellarResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  rows: z.number(),
  columns: z.number(),
  createdAt: z.string().datetime(),
})

export type CreateCellarInput = z.infer<typeof createCellarSchema>
export type CellarResponse = z.infer<typeof cellarResponseSchema>
