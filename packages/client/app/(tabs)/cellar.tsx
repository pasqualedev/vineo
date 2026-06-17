import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Hero } from '@/components/ui/hero'
import { VMonogram } from '@/components/ui/v-monogram'
import { CellarGrid } from '@/components/cellar-grid'
import { useCellars } from '@/hooks/use-cellars'
import { useUserId } from '@/lib/user-context'
import { useCellarBottles } from '@/hooks/use-bottles'
import { Button } from '@/components/ui/button'

export default function CellarScreen() {
  const { userId } = useUserId()
  const { data: cellars, isLoading } = useCellars(userId)
  const firstCellar = cellars?.[0]
  const { data: bottles } = useCellarBottles(firstCellar?.id ?? '')
  const { colors } = useTheme()

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ ...type.body, color: colors.textSecondary }}>
            Carregando…
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!firstCellar) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.xxl,
            gap: spacing.lg,
          }}
        >
          <View style={{ opacity: 0.15 }}>
            <VMonogram size={64} color={colors.textMuted} weight="regular" />
          </View>
          <Text
            style={{
              ...type.headline,
              color: colors.text,
              textAlign: 'center',
            }}
          >
            Nenhuma adega cadastrada
          </Text>
          <Text
            style={{
              ...type.body,
              color: colors.textSecondary,
              textAlign: 'center',
              marginBottom: spacing.lg,
            }}
          >
            Crie sua primeira adega para começar a organizar seus vinhos.
          </Text>
          <Button title="Criar Adega" onPress={() => {}} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md }}>
        <Hero
          eyebrow="ADEGA"
          title={firstCellar.name}
          subtitle={`${firstCellar.rows} × ${firstCellar.columns} • ${bottles?.length ?? 0} ${bottles?.length === 1 ? 'garrafa' : 'garrafas'}`}
          titleVariant="displayM"
        />
      </View>

      <CellarGrid
        cellarId={firstCellar.id}
        rows={firstCellar.rows}
        columns={firstCellar.columns}
        bottles={bottles ?? []}
      />
    </SafeAreaView>
  )
}
