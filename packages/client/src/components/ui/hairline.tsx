import { useEffect } from 'react'
import { View, Text, type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated'
import { type, motion, useTheme } from '@/theme'

interface Marker {
  position: number // 0..1
  label?: string
}

interface HairlineProps {
  width?: number | 'full'
  color?: string
  opacity?: number
  markers?: Marker[]
  animate?: 'grow' | 'none'
  delay?: number
  style?: StyleProp<ViewStyle>
  decorative?: boolean
}

/**
 * Linha 1px com markers opcionais (motif do tempo).
 * - decorative=true (default quando sem markers): oculto para leitores de tela.
 */
export function Hairline({
  width = 'full',
  color,
  opacity = 1,
  markers = [],
  animate = 'none',
  delay = 0,
  style,
  decorative,
}: HairlineProps) {
  const { colors } = useTheme()
  const lineColor = color ?? colors.border
  const progress = useSharedValue(animate === 'none' ? 1 : 0)

  useEffect(() => {
    if (animate === 'grow') {
      progress.value = withDelay(
        delay,
        withTiming(1, {
          duration: motion.durations.narrative + 450,
          easing: motion.easings.outExpo,
        }),
      )
    } else {
      progress.value = 1
    }
  }, [animate, delay, progress])

  const lineStyle = useAnimatedStyle(() => {
    if (typeof width === 'number') {
      return { width: interpolate(progress.value, [0, 1], [0, width]) }
    }
    return { width: `${interpolate(progress.value, [0, 1], [0, 100])}%` as const }
  })

  const isDecorative = decorative ?? markers.length === 0

  return (
    <View
      accessibilityElementsHidden={isDecorative}
      importantForAccessibility={isDecorative ? 'no-hide-descendants' : 'auto'}
      style={[
        { width: width === 'full' ? '100%' : width, alignItems: 'flex-start' },
        style,
      ]}
    >
      <Animated.View
        style={[{ height: 1, backgroundColor: lineColor, opacity }, lineStyle]}
      />
      {markers.length > 0 && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
          }}
        >
          {markers.map((m, i) => (
            <MarkerDot
              key={i}
              position={m.position}
              label={m.label}
              color={colors.accent}
              delay={delay + 300 + i * motion.stagger.default}
              show={animate === 'none'}
            />
          ))}
        </View>
      )}
    </View>
  )
}

function MarkerDot({
  position,
  label,
  color,
  delay,
  show,
}: {
  position: number
  label?: string
  color: string
  delay: number
  show: boolean
}) {
  const { colors } = useTheme()
  const opacity = useSharedValue(show ? 1 : 0)

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: motion.durations.base,
        easing: motion.easings.outExpo,
      }),
    )
  }, [delay, opacity])

  const dotStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: `${position * 100}%`,
          top: -1.5,
          alignItems: 'center',
          transform: [{ translateX: -2 }],
        },
        dotStyle,
      ]}
    >
      <View style={{ width: 4, height: 4, backgroundColor: color, borderRadius: 2 }} />
      {label && (
        <Text style={{ ...type.label, color: colors.textMuted, marginTop: 6 }}>
          {label}
        </Text>
      )}
    </Animated.View>
  )
}
