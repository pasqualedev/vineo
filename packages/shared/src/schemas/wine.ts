import { z } from 'zod'

export const wineReferenceSchema = z.object({
  id: z.string(),
  name: z.string(),
  winery: z.string(),
  grape: z.string(),
  region: z.string(),
  country: z.string(),
  barcode: z.string().nullable(),
  guardMin: z.number().int(),
  guardMax: z.number().int(),
})

export const createWineReferenceSchema = z.object({
  name: z.string().min(1, 'Nome do vinho é obrigatório'),
  winery: z.string().min(1, 'Vinícola é obrigatória'),
  grape: z.string().min(1, 'Uva é obrigatória'),
  region: z.string().min(1, 'Região é obrigatória'),
  country: z.string().min(1, 'País é obrigatório'),
  barcode: z.string().nullable(),
  guardMin: z.number().int().min(0),
  guardMax: z.number().int().min(0),
})

export type WineReference = z.infer<typeof wineReferenceSchema>
export type CreateWineReferenceInput = z.infer<typeof createWineReferenceSchema>
