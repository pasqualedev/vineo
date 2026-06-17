import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Hairline } from '@/components/ui/hairline'
import { MaturationBar } from '@/components/maturation-bar'
import { Button } from '@/components/ui/button'
import type { BottleResponse } from '@vineo/shared'

const MOCK_BOTTLE: BottleResponse = {
  id: 'btl_mock',
  vintage: 2020,
  purchaseDate: '2023-06-15T00:00:00.000Z',
  price: 189.90,
  rowPosition: 2,
  columnPosition: 3,
  status: 'STORED',
  notes: null,
  wine: {
    name: 'Almafuerte Malbec Gran Reserva',
    winery: 'Catena Zapata',
    grape: 'Malbec',
    region: 'Mendoza',
    country: 'Argentina',
  },
  evolution: {
    startDrinkingYear: 2023,
    maxDrinkingYear: 2028,
    currentStatus: 'PEAK',
  },
}

export default function BottleDetailScreen() {
  useLocalSearchParams<{ id: string }>()
  const bottle = MOCK_BOTTLE
  const { colors } = useTheme()

  const statusLabel = {
    STORED: 'Guardada',
    CONSUMED: 'Consumida',
    GIFTED: 'Presenteada',
  }[bottle.status]

  const statusBadgeVariant = {
    STORED: 'info' as const,
    CONSUMED: 'success' as const,
    GIFTED: 'warning' as const,
  }[bottle.status]

  const evolutionYearProgress =
    (new Date().getFullYear() - bottle.evolution.startDrinkingYear) /
    (bottle.evolution.maxDrinkingYear - bottle.evolution.startDrinkingYear || 1)

  const currentYear = new Date().getFullYear()
  const yearsUntilMax = Math.max(0, bottle.evolution.maxDrinkingYear - currentYear)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Button title="Voltar" variant="ghost" onPress={() => router.back()} />

        <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
          <Text style={{ ...type.displayM, color: colors.text }}>
            {bottle.wine.name}
          </Text>
          <Text style={{ ...type.body, color: colors.textSecondary }}>
            {bottle.wine.winery}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
              marginTop: spacing.xs,
            }}
          >
            <Hairline width={20} color={colors.border} />
            <Text style={{ ...type.label, color: colors.textSecondary }}>
              {bottle.vintage}
            </Text>
            <Hairline width={20} color={colors.border} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg }}>
          <Badge label={statusLabel} variant={statusBadgeVariant} />
          <Badge label={bottle.wine.country} variant="info" />
        </View>

        <Card style={{ marginTop: spacing.xl }}>
          <Text
            style={{
              ...type.headline,
              color: colors.text,
              marginBottom: spacing.lg,
            }}
          >
            Maturação
          </Text>

          <View style={{ gap: spacing.md }}>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                <Text style={{ ...type.bodyS, color: colors.textSecondary }}>
                  Janela de Consumo
                </Text>
                <Text style={{ ...type.bodyS, color: colors.text, fontWeight: '600' }}>
                  {bottle.evolution.startDrinkingYear} – {bottle.evolution.maxDrinkingYear}
                </Text>
              </View>
              <MaturationBar
                currentStatus={bottle.evolution.currentStatus}
                progress={evolutionYearProgress}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.lg }}>
              <View style={{ flex: 1 }}>
                <Text style={{ ...type.label, color: colors.textSecondary }}>
                  Estado Atual
                </Text>
                <Text
                  style={{
                    ...type.body,
                    color: colors.text,
                    fontWeight: '600',
                    marginTop: spacing.xs,
                  }}
                >
                  {bottle.evolution.currentStatus === 'PEAK'
                    ? 'No Platô'
                    : bottle.evolution.currentStatus === 'EVOLVING'
                      ? 'Em Evolução'
                      : 'Em Declínio'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...type.label, color: colors.textSecondary }}>
                  Janela Restante
                </Text>
                <Text
                  style={{
                    ...type.body,
                    color: colors.text,
                    fontWeight: '600',
                    marginTop: spacing.xs,
                  }}
                >
                  {yearsUntilMax > 0 ? `${yearsUntilMax} anos` : 'Último ano'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text
            style={{
              ...type.headline,
              color: colors.text,
              marginBottom: spacing.lg,
            }}
          >
            Detalhes
          </Text>

          <View style={{ gap: spacing.md }}>
            {[
              { label: 'Vinícola', value: bottle.wine.winery },
              { label: 'Uva', value: bottle.wine.grape },
              { label: 'Região', value: bottle.wine.region },
              { label: 'País', value: bottle.wine.country },
              { label: 'Safra', value: String(bottle.vintage) },
              ...(bottle.price ? [{ label: 'Preço', value: `R$ ${bottle.price.toFixed(2)}` }] : []),
              ...(bottle.purchaseDate
                ? [
                    {
                      label: 'Data de Compra',
                      value: new Date(bottle.purchaseDate).toLocaleDateString('pt-BR'),
                    },
                  ]
                : []),
            ].map(({ label, value }) => (
              <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ ...type.body, color: colors.textSecondary }}>
                  {label}
                </Text>
                <Text style={{ ...type.body, color: colors.text, fontWeight: '600' }}>
                  {value}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={{ marginTop: spacing.xxl, gap: spacing.md }}>
          <Button title="Marcar como Consumida" variant="secondary" />
          <Button title="Mover Posição" variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
