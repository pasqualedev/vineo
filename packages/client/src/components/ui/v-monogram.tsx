import { useEffect } from 'react'
import { Text } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated'
import { type, motion, useTheme } from '@/theme'

interface VMonogramProps {
  size?: number
  color?: string
  weight?: 'light' | 'regular'
  animate?: 'reveal' | 'fade' | 'none'
  delay?: number
}

/**
 * V Monograma — brand mark do Víneo (glyph V de Fraunces).
 * - reveal: fade-in suave (proxy de stroke-reveal — pode virar SVG path depois)
 * - fade: fade-in simples
 * - none: imediato
 */
export function VMonogram({
  size = 56,
  color,
  weight = 'light',
  animate = 'none',
  delay = 0,
}: VMonogramProps) {
  const { colors } = useTheme()
  const opacity = useSharedValue(animate === 'none' ? 1 : 0)

  useEffect(() => {
    if (animate === 'reveal') {
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: motion.durations.narrative + 150,
          easing: motion.easings.outExpo,
        }),
      )
    } else if (animate === 'fade') {
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: motion.durations.base,
          easing: motion.easings.outExpo,
        }),
      )
    } else {
      opacity.value = 1
    }
  }, [animate, delay, opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  const familyToken = weight === 'light' ? type.monumental : type.displayM

  return (
    <Animated.View style={animatedStyle}>
      <Text
        accessibilityLabel="Víneo"
        style={{
          fontFamily: familyToken.fontFamily,
          fontSize: size,
          lineHeight: size * 1.05,
          letterSpacing: size * -0.03,
          color: color ?? colors.text,
        }}
      >
        V
      </Text>
    </Animated.View>
  )
}
