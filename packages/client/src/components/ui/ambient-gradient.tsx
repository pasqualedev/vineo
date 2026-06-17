import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useReducedMotion,
  Easing,
} from 'react-native-reanimated'
import { motion, useTheme } from '@/theme'

interface AmbientGradientProps {
  overlayOpacity?: number
}

/**
 * Background gradient warm que respira lentamente (loop 8s).
 * Montado no _layout de onboarding, persiste entre telas.
 * Desabilita breathing se useReducedMotion.
 */
export function AmbientGradient({ overlayOpacity = 0 }: AmbientGradientProps) {
  const { colors } = useTheme()
  const reduceMotion = useReducedMotion()
  const breath = useSharedValue(0.4)
  const overlay = useSharedValue(overlayOpacity)

  useEffect(() => {
    overlay.value = withTiming(overlayOpacity, {
      duration: motion.durations.slow,
    })
  }, [overlayOpacity, overlay])

  useEffect(() => {
    if (reduceMotion) {
      breath.value = 0.6
      return
    }
    breath.value = withRepeat(
      withSequence(
        withTiming(0.8, {
          duration: motion.durations.breath / 2,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(0.4, {
          duration: motion.durations.breath / 2,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      false,
    )
  }, [reduceMotion, breath])

  const breathStyle = useAnimatedStyle(() => ({ opacity: breath.value }))
  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlay.value }))

  return (
    <>
      <LinearGradient
        colors={[colors.bg, colors.bg]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[StyleSheet.absoluteFill, breathStyle]}>
        <LinearGradient
          colors={[colors.accentDim, colors.bg]}
          locations={[0, 0.7]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.black },
          overlayStyle,
        ]}
      />
    </>
  )
}
