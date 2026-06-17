import { Prisma } from '@prisma/client'
import { calculateEvolution } from '@vineo/shared'
import type { BottleResponse } from '@vineo/shared'

/** Minimal bottle shape (with its wine reference) needed to build a response. */
export interface BottleWithWine {
  id: string
  vintage: number
  purchaseDate: Date | null
  price: Prisma.Decimal | null
  rowPosition: number
  columnPosition: number
  status: string
  notes: string | null
  wineReference: {
    name: string
    winery: string
    grape: string
    region: string
    country: string
  }
}

/**
 * Maps a Prisma bottle row (with `wineReference`) into the public
 * {@link BottleResponse} DTO, converting Decimal/Date values and computing the
 * maturation window. Shared by the bottles and cellars routes so every endpoint
 * serializes bottles identically.
 */
export function formatBottleResponse(bottle: BottleWithWine): BottleResponse {
  const evolution = calculateEvolution(bottle.vintage, bottle.wineReference.grape)

  return {
    id: bottle.id,
    vintage: bottle.vintage,
    purchaseDate: bottle.purchaseDate?.toISOString() ?? null,
    price: bottle.price ? bottle.price.toNumber() : null,
    rowPosition: bottle.rowPosition,
    columnPosition: bottle.columnPosition,
    status: bottle.status as BottleResponse['status'],
    notes: bottle.notes,
    wine: {
      name: bottle.wineReference.name,
      winery: bottle.wineReference.winery,
      grape: bottle.wineReference.grape,
      region: bottle.wineReference.region,
      country: bottle.wineReference.country,
    },
    evolution,
  }
}
