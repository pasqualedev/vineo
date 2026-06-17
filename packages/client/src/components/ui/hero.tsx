import { useEffect } from 'react'
import { View, Text, type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { type, motion, useTheme } from '@/theme'

interface HeroProps {
  eyebrow?: string
  title: string
  subtitle?: string
  titleVariant?: 'displayM' | 'displayL'
  style?: StyleProp<ViewStyle>
  animateIn?: boolean
}

/**
 * Header vertical-stacked com stagger automático na entrada (60ms entre slots).
 */
export function Hero({
  eyebrow,
  title,
  subtitle,
  titleVariant = 'displayM',
  style,
  animateIn = true,
}: HeroProps) {
  const { colors } = useTheme()
  const titleDelay = animateIn && eyebrow ? motion.stagger.default : 0
  const subtitleDelay = animateIn
    ? titleDelay + motion.stagger.default
    : 0

  return (
    <View style={[{ gap: spacing.sm }, style]}>
      {eyebrow && (
        <Slot delay={0} animateIn={animateIn}>
          <Text style={{ ...type.label, color: colors.textMuted }}>{eyebrow}</Text>
        </Slot>
      )}
      <Slot delay={titleDelay} animateIn={animateIn}>
        <Text style={{ ...type[titleVariant], color: colors.text }}>{title}</Text>
      </Slot>
      {subtitle && (
        <Slot delay={subtitleDelay} animateIn={animateIn}>
          <Text style={{ ...type.body, color: colors.textSecondary }}>{subtitle}</Text>
        </Slot>
      )}
    </View>
  )
}

function Slot({
  children,
  delay,
  animateIn,
}: {
  children: React.ReactNode
  delay: number
  animateIn: boolean
}) {
  const progress = useSharedValue(animateIn ? 0 : 1)

  useEffect(() => {
    if (animateIn) {
      progress.value = withDelay(
        delay,
        withTiming(1, {
          duration: motion.durations.base,
          easing: motion.easings.outExpo,
        }),
      )
    }
  }, [animateIn, delay, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: interpolate(progress.value, [0, 1], [6, 0]) }],
  }))

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}
