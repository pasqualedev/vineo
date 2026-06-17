import { View, ScrollView, useColorScheme, Dimensions } from 'react-native'
import { BottleCell } from '@/components/bottle-cell'
import { spacing } from '@/theme/spacing'
import { rackColors } from '@/theme/rack-colors'
import type { BottleResponse } from '@vineo/shared'
import { useRouter } from 'expo-router'

const SCREEN_WIDTH = Dimensions.get('window').width
const SHELF_HEIGHT = 2
const FRAME_BORDER = 1
const FRAME_PADDING = spacing.xs
const COLUMN_GAP = 0

interface CellarGridProps {
  cellarId: string
  rows: number
  columns: number
  bottles: BottleResponse[]
  /** Quando fornecido, tocar num slot vazio chama isto em vez de navegar pro /add. */
  onSelectEmpty?: (row: number, column: number) => void
}

export function CellarGrid({ cellarId, rows, columns, bottles, onSelectEmpty }: CellarGridProps) {
  const router = useRouter()
  const scheme = useColorScheme() ?? 'dark'
  const rack = rackColors[scheme === 'dark' ? 'dark' : 'light']

  const outerPadding = spacing.lg * 2 + FRAME_PADDING * 2 + FRAME_BORDER * 2
  const innerWidth = SCREEN_WIDTH - outerPadding
  const gapTotal = (columns - 1) * COLUMN_GAP
  const cellWidth = Math.min((innerWidth - gapTotal) / columns, 80)

  function getBottleAtPosition(row: number, column: number): BottleResponse | undefined {
    return bottles.find(
      (b) => b.rowPosition === row && b.columnPosition === column,
    )
  }

  function handleCellPress(row: number, column: number, bottle?: BottleResponse) {
    if (bottle) {
      router.push(`/bottle/${bottle.id}`)
      return
    }
    if (onSelectEmpty) {
      onSelectEmpty(row, column)
      return
    }
    router.push(`/add/bottle/capture?cellarId=${cellarId}&row=${row}&col=${column}`)
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          backgroundColor: rack.frame,
          borderRadius: 6,
          borderWidth: FRAME_BORDER,
          borderColor: rack.frame,
          padding: FRAME_PADDING,
        }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <View key={`row-${rowIndex}`}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: COLUMN_GAP,
                position: 'relative',
              }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => {
                const bottle = getBottleAtPosition(rowIndex, colIndex)

                return (
                  <BottleCell
                    key={`cell-${rowIndex}-${colIndex}`}
                    bottle={bottle}
                    isEmpty={!bottle}
                    onPress={() => handleCellPress(rowIndex, colIndex, bottle)}
                    cellWidth={cellWidth}
                  />
                )
              })}
            </View>

            {rowIndex < rows - 1 && (
              <View style={{ paddingVertical: FRAME_PADDING }}>
                <View
                  style={{
                    height: SHELF_HEIGHT + 1,
                    backgroundColor: rack.shelfBar,
                    borderRadius: 1,
                    position: 'relative',
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 1,
                      backgroundColor: rack.shelfHighlight,
                      borderTopLeftRadius: 1,
                      borderTopRightRadius: 1,
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
