import { View, Text } from 'react-native'
import { Card } from '@/components/ui/card'
import { spacing } from '@/theme/spacing'
import { type as typo, useTheme } from '@/theme'

type AlertType = 'peak' | 'evolving' | 'declining'

interface AlertCardProps {
  type: AlertType
  title: string
  count: number
  subtitle: string
}

export function AlertCard({ type, title, count, subtitle }: AlertCardProps) {
  const { colors } = useTheme()

  const alertConfig: Record<AlertType, { color: string; bg: string }> = {
    peak: { color: colors.green, bg: colors.greenDim },
    evolving: { color: colors.blue, bg: colors.blueDim },
    declining: { color: colors.red, bg: colors.redDim },
  }

  const config = alertConfig[type]

  return (
    <Card
      style={{
        width: 200,
        marginRight: spacing.md,
        borderLeftWidth: 3,
        borderLeftColor: config.color,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: config.color,
            marginRight: spacing.sm,
          }}
        />
        <Text style={{ ...typo.label, color: config.color }}>
          {title}
        </Text>
      </View>

      <Text
        style={{
          ...typo.displayM,
          color: colors.text,
          marginBottom: spacing.xs,
        }}
      >
        {count}
      </Text>

      <Text style={{ ...typo.bodyS, color: colors.textSecondary }}>
        {subtitle}
      </Text>
    </Card>
  )
}
