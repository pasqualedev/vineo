import { View, Text, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { countAvailableSlots } from '@vineo/shared'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Hero } from '@/components/ui/hero'
import { CellarGrid } from '@/components/cellar-grid'
import { useCellar } from '@/hooks/use-cellars'
import { useCellarBottles } from '@/hooks/use-bottles'
import { useAddBottleDraft } from '@/lib/add-bottle-draft'

export default function SelectSlotScreen() {
  const { colors } = useTheme()
  const { draft, update } = useAddBottleDraft()
  const cellarId = draft.cellarId ?? ''
  const { data: cellar, isLoading: loadingCellar } = useCellar(cellarId)
  const { data: bottles, isLoading: loadingBottles } = useCellarBottles(cellarId)

  function selectSlot(row: number, column: number) {
    update({ row, col: column })
    router.replace('/add/bottle/confirm')
  }

  if (loadingCellar || loadingBottles || !cellar) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    )
  }

  const available = countAvailableSlots(cellar.rows, cellar.columns, bottles ?? [])

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View style={{ padding: spacing.xxl, gap: spacing.sm }}>
        <Hero eyebrow="PASSO 3 DE 4" title="Onde guardar?" />
      </View>
      {available === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl }}>
          <Text style={{ ...type.body, color: colors.textSecondary, textAlign: 'center' }}>
            Esta adega está cheia. Escolha outra adega ou consuma uma garrafa antes.
          </Text>
        </View>
      ) : (
        <CellarGrid
          cellarId={cellarId}
          rows={cellar.rows}
          columns={cellar.columns}
          bottles={bottles ?? []}
          onSelectEmpty={selectSlot}
        />
      )}
    </SafeAreaView>
  )
}
