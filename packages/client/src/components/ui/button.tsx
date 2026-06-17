import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { type, motion, useTheme } from '@/theme'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'hero'

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string
  variant?: ButtonVariant
  style?: StyleProp<ViewStyle>
  chevron?: boolean
}

/**
 * Botão base do Víneo. Variantes:
 * - primary: oxblood fill, texto branco
 * - secondary: outline 1px, texto primário
 * - ghost: só texto
 * - hero: texto + underline 1px animado no press, sem caixa
 */
export function Button({
  title,
  variant = 'primary',
  style,
  chevron = false,
  ...props
}: ButtonProps) {
  const { colors } = useTheme()
  const pressed = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    if (variant === 'hero') {
      return { opacity: interpolate(pressed.value, [0, 1], [1, 0.6]) }
    }
    return {
      opacity: interpolate(pressed.value, [0, 1], [1, 0.85]),
      transform: [{ scale: interpolate(pressed.value, [0, 1], [1, 0.98]) }],
    }
  })

  const underlineStyle = useAnimatedStyle(() => ({
    width: `${interpolate(pressed.value, [0, 1], [40, 100])}%`,
  }))

  const handlePressIn: PressableProps['onPressIn'] = () => {
    // eslint-disable-next-line react-hooks/immutability
    pressed.value = withTiming(1, { duration: motion.durations.fast })
  }
  const handlePressOut: PressableProps['onPressOut'] = () => {
    // eslint-disable-next-line react-hooks/immutability
    pressed.value = withTiming(0, { duration: motion.durations.fast })
  }

  if (variant === 'hero') {
    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={title}
        {...props}
      >
        <Animated.View style={[{ alignItems: 'center' }, animatedStyle, style]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Text style={{ ...type.title, color: colors.text }}>{title}</Text>
            {chevron && <Text style={{ ...type.title, color: colors.text }}>›</Text>}
          </View>
          <View style={{ height: 8 }} />
          <Animated.View
            style={[
              { height: 1, backgroundColor: colors.text, opacity: 0.6 },
              underlineStyle,
            ]}
          />
        </Animated.View>
      </Pressable>
    )
  }

  const variantViewStyle: Record<Exclude<ButtonVariant, 'hero'>, ViewStyle> = {
    primary: { backgroundColor: colors.accent },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    ghost: { backgroundColor: 'transparent' },
  }

  const textColor: Record<Exclude<ButtonVariant, 'hero'>, string> = {
    primary: colors.white,
    secondary: colors.text,
    ghost: colors.text,
  }

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={title}
      {...props}
    >
      <Animated.View
        style={[
          {
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          },
          variantViewStyle[variant],
          animatedStyle,
          style,
        ]}
      >
        <Text
          style={{
            ...type.title,
            color: textColor[variant],
            letterSpacing: 0.6,
          }}
        >
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  )
}
