/** Mínimo necessário para localizar uma garrafa numa grade de adega. */
export interface SlotOccupant {
  readonly rowPosition: number
  readonly columnPosition: number
}

export interface SlotPosition {
  readonly row: number
  readonly column: number
}

/**
 * Indica se a posição (row, column) já está ocupada por uma garrafa.
 *
 * @param occupants Lista de garrafas existentes
 * @param row Linha da posição a verificar
 * @param column Coluna da posição a verificar
 * @returns true se a posição está ocupada
 */
export function isSlotOccupied(
  occupants: readonly SlotOccupant[],
  row: number,
  column: number,
): boolean {
  return occupants.some(
    (occupant) => occupant.rowPosition === row && occupant.columnPosition === column,
  )
}

/**
 * Primeiro slot livre em ordem row-major, ou null se a grade estiver cheia.
 *
 * @param rows Número total de linhas na grade
 * @param columns Número total de colunas na grade
 * @param occupants Lista de garrafas existentes
 * @returns Primeira posição livre ou null
 */
export function findFirstAvailableSlot(
  rows: number,
  columns: number,
  occupants: readonly SlotOccupant[],
): SlotPosition | null {
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (!isSlotOccupied(occupants, row, column)) {
        return { row, column }
      }
    }
  }
  return null
}

/**
 * Quantidade de slots livres na grade.
 *
 * @param rows Número total de linhas na grade
 * @param columns Número total de colunas na grade
 * @param occupants Lista de garrafas existentes
 * @returns Quantidade de posições disponíveis
 */
export function countAvailableSlots(
  rows: number,
  columns: number,
  occupants: readonly SlotOccupant[],
): number {
  const occupiedInGrid = new Set<string>()
  for (const occupant of occupants) {
    const { rowPosition, columnPosition } = occupant
    if (
      rowPosition >= 0 &&
      rowPosition < rows &&
      columnPosition >= 0 &&
      columnPosition < columns
    ) {
      occupiedInGrid.add(`${rowPosition}:${columnPosition}`)
    }
  }
  return rows * columns - occupiedInGrid.size
}

/**
 * Retorna o id da única adega quando houver exatamente uma (para auto-pular o
 * passo de seleção), ou null caso contrário.
 *
 * @param cellars Lista de adegas
 * @returns ID da única adega, ou null
 */
export function resolveSoleCellarId(
  cellars: readonly { readonly id: string }[],
): string | null {
  return cellars.length === 1 ? cellars[0].id : null
}
