import type { ReactNode } from 'react'
import { Pressable, View, type ViewStyle, type StyleProp } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { motion, useTheme } from '@/theme'

type CardVariant = 'surface' | 'parchment'

interface CardProps {
  children: ReactNode
  variant?: CardVariant
  interactive?: boolean
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

/**
 * Container base. Variantes:
 * - surface: fundo escuro com border sutil
 * - parchment: fundo cream, momentos premium (texto deve ser invertido pelo consumidor)
 */
export function Card({
  children,
  variant = 'surface',
  interactive = false,
  onPress,
  style,
}: CardProps) {
  const { colors } = useTheme()
  const pressed = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pressed.value, [0, 1], [1, 0.95]),
    transform: [{ scale: interpolate(pressed.value, [0, 1], [1, 0.99]) }],
  }))

  const bg = variant === 'parchment' ? colors.parchment : colors.surface
  const borderColor = variant === 'parchment' ? 'transparent' : colors.border

  const baseStyle: ViewStyle = {
    backgroundColor: bg,
    borderWidth: variant === 'parchment' ? 0 : 1,
    borderColor,
    borderRadius: 12,
    padding: spacing.lg,
    opacity: variant === 'parchment' ? 1 : 0.95,
  }

  if (!interactive || !onPress) {
    return <View style={[baseStyle, style]}>{children}</View>
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        // eslint-disable-next-line react-hooks/immutability
        pressed.value = withTiming(1, { duration: motion.durations.fast })
      }}
      onPressOut={() => {
        // eslint-disable-next-line react-hooks/immutability
        pressed.value = withTiming(0, { duration: motion.durations.fast })
      }}
    >
      <Animated.View style={[baseStyle, animatedStyle, style]}>{children}</Animated.View>
    </Pressable>
  )
}
