import { useMemo } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Hero } from '@/components/ui/hero'
import { VMonogram } from '@/components/ui/v-monogram'
import { SuggestionCard } from '@/components/suggestion-card'
import { RecentBottles } from '@/components/recent-bottles'
import { useCellars } from '@/hooks/use-cellars'
import { useCellarBottles } from '@/hooks/use-bottles'
import { useUserId } from '@/lib/user-context'

const PREMIUM_FEATURES = [
  { label: 'Fichas técnicas completas', hint: 'Safra, uva, vinícola, região' },
  { label: 'Harmonização com alimentos', hint: 'Queijos, carnes, massas, sobremesas' },
  { label: 'Sugestões inteligentes', hint: 'Baseadas no clima, dia da semana e seu perfil' },
]

export default function DashboardScreen() {
  const { userId } = useUserId()
  const { data: cellars } = useCellars(userId)
  const { colors } = useTheme()

  const firstCellar = cellars?.[0]
  const { data: bottles = [] } = useCellarBottles(firstCellar?.id ?? '')

  const suggestion = useMemo(() => {
    if (bottles.length === 0) return null
    const peakOrEvolving = bottles.filter(
      (b) => b.evolution.currentStatus === 'PEAK' || b.evolution.currentStatus === 'EVOLVING',
    )
    if (peakOrEvolving.length > 0) {
      const today = new Date().getDate()
      const index = today % peakOrEvolving.length
      return peakOrEvolving[index]
    }
    const today = new Date().getDate()
    return bottles[today % bottles.length]
  }, [bottles])

  const recentBottles = useMemo(() => {
    return [...bottles].reverse().slice(0, 10)
  }, [bottles])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md }}>
          <Hero
            eyebrow="VÍNEO"
            title="Sua adega"
            subtitle={`${cellars?.length ?? 0} ${(cellars?.length ?? 0) === 1 ? 'adega' : 'adegas'} • ${bottles.length} ${bottles.length === 1 ? 'garrafa' : 'garrafas'}`}
            titleVariant="displayM"
          />
        </View>

        {suggestion ? (
          <View style={{ marginTop: spacing.sm }}>
            <SuggestionCard bottle={suggestion} />
          </View>
        ) : (
          <View
            style={{
              marginHorizontal: spacing.lg,
              marginTop: spacing.sm,
              height: 200,
              backgroundColor: colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.md,
            }}
          >
            <View style={{ opacity: 0.15 }}>
              <VMonogram size={48} color={colors.textMuted} weight="regular" />
            </View>
            <Text style={{ ...type.bodyS, color: colors.textMuted, textAlign: 'center' }}>
              Adicione garrafas para ver sugestões
            </Text>
          </View>
        )}

        <RecentBottles bottles={recentBottles} />

        <View style={{ marginTop: spacing.xl, paddingHorizontal: spacing.lg }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                backgroundColor: colors.accentDim,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
              }}
            >
              <Text style={{ ...type.headline, color: colors.accent }}>
                Víneo Premium
              </Text>
              <Text
                style={{
                  ...type.bodyS,
                  color: colors.textSecondary,
                  marginTop: spacing.xs,
                }}
              >
                Desbloqueie o potencial de cada garrafa
              </Text>
            </View>

            <View style={{ padding: spacing.lg, gap: spacing.md }}>
              {PREMIUM_FEATURES.map((feature, index) => (
                <View key={index} style={{ flexDirection: 'row', gap: spacing.md }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: colors.accentDim,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 2,
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: colors.accent,
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...type.body, color: colors.text, fontWeight: '600' }}>
                      {feature.label}
                    </Text>
                    <Text
                      style={{
                        ...type.bodyS,
                        color: colors.textSecondary,
                        marginTop: 2,
                      }}
                    >
                      {feature.hint}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
              <Pressable
                style={({ pressed }) => ({
                  backgroundColor: colors.accent,
                  borderRadius: 12,
                  paddingVertical: spacing.md,
                  alignItems: 'center',
                  opacity: pressed ? 0.85 : 1,
                })}
                accessibilityLabel="Assinar Premium"
                accessibilityRole="button"
              >
                <Text style={{ ...type.title, color: '#FFFFFF' }}>
                  Assinar Premium
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={{ height: spacing.huge }} />
      </ScrollView>
    </SafeAreaView>
  )
}
