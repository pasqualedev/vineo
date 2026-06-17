import { View, Text, FlatList } from 'react-native'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import type { BottleResponse } from '@vineo/shared'

interface RecentBottlesProps {
  bottles: BottleResponse[]
}

const STATUS_COLORS: Record<string, string> = {
  EVOLVING: '#22C55E',
  PEAK: '#6366F1',
  DECLINING: '#F59E0B',
}

export function RecentBottles({ bottles }: RecentBottlesProps) {
  const { colors } = useTheme()

  if (bottles.length === 0) return null

  return (
    <View style={{ marginTop: spacing.xl }}>
      <Text
        style={{
          ...type.headline,
          color: colors.text,
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.md,
        }}
      >
        Adicionadas Recentemente
      </Text>

      <FlatList
        horizontal
        data={bottles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={{
              width: 140,
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.md,
            }}
          >
            <Text
              style={{ ...type.bodyS, color: colors.text, fontWeight: '600' }}
              numberOfLines={1}
            >
              {item.wine.name}
            </Text>

            {item.vintage ? (
              <Text
                style={{
                  ...type.label,
                  color: colors.textSecondary,
                  marginTop: spacing.xs,
                }}
              >
                {item.vintage}
              </Text>
            ) : null}

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: spacing.xs }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: STATUS_COLORS[item.evolution.currentStatus] ?? '#6B7280',
                }}
              />
              <Text style={{ ...type.label, color: colors.textMuted }}>
                {item.evolution.currentStatus === 'EVOLVING'
                  ? 'Evoluindo'
                  : item.evolution.currentStatus === 'PEAK'
                    ? 'No platô'
                    : 'Declínio'}
              </Text>
            </View>

            <Text
              style={{
                ...type.label,
                color: colors.textMuted,
                marginTop: spacing.sm,
              }}
            >
              {item.wine.winery}
            </Text>
          </View>
        )}
      />
    </View>
  )
}
