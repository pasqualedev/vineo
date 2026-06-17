import { View, Text } from 'react-native'
import { type, useTheme } from '@/theme'

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

/**
 * Badge outline 1px + label uppercase em type.label.
 */
export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const { colors } = useTheme()

  const color: Record<BadgeVariant, string> = {
    success: colors.green,
    warning: colors.amber,
    error: colors.red,
    info: colors.blue,
    neutral: colors.textSecondary,
  }

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: color[variant],
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ ...type.label, color: color[variant] }}>{label}</Text>
    </View>
  )
}
