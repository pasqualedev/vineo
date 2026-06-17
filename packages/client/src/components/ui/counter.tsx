import { View, Text, Pressable } from 'react-native'
import * as Haptics from 'expo-haptics'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { type, motion, useTheme } from '@/theme'

interface CounterProps {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  variant?: 'hero' | 'compact'
  hint?: boolean
}

const STEP_PX = 40

/**
 * Counter gestural — swipe horizontal (40px = 1 unidade).
 * Tap nos chevrons laterais também funciona (visível só se hint=true).
 * Hero: número em type.monumental (96pt). Compact: type.displayXl (56pt).
 */
export function Counter({
  value,
  min,
  max,
  onChange,
  variant = 'hero',
  hint = false,
}: CounterProps) {
  const { colors } = useTheme()
  const dragAccum = useSharedValue(0)
  const numberOpacity = useSharedValue(1)
  const numberTy = useSharedValue(0)

  const fireHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
  }

  const applyDelta = (delta: number) => {
    if (delta === 0) return
    const next = Math.max(min, Math.min(max, value + delta))
    if (next === value) return

    numberOpacity.value = withSequence(
      withTiming(0, { duration: motion.durations.fast, easing: motion.easings.outExpo }),
      withTiming(1, { duration: motion.durations.base - 100, easing: motion.easings.outExpo }),
    )
    numberTy.value = withSequence(
      withTiming(-12, { duration: motion.durations.fast, easing: motion.easings.outExpo }),
      withTiming(12, { duration: 0 }),
      withTiming(0, { duration: motion.durations.base - 100, easing: motion.easings.outExpo }),
    )

    fireHaptic()
    onChange(next)
  }

  const pan = Gesture.Pan()
    .onChange((e) => {
      'worklet'
      dragAccum.value += e.changeX
      const steps = Math.trunc(dragAccum.value / STEP_PX)
      if (steps !== 0) {
        dragAccum.value -= steps * STEP_PX
        runOnJS(applyDelta)(steps)
      }
    })
    .onEnd(() => {
      'worklet'
      dragAccum.value = 0
    })

  const numberStyle = useAnimatedStyle(() => ({
    opacity: numberOpacity.value,
    transform: [{ translateY: numberTy.value }],
  }))

  const numberToken = variant === 'hero' ? type.monumental : type.displayXl

  return (
    <View style={{ alignItems: 'center', gap: spacing.md }}>
      <GestureDetector gesture={pan}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
          {hint && (
            <Pressable
              onPress={() => applyDelta(-1)}
              accessibilityLabel="Diminuir"
              hitSlop={20}
            >
              <Text style={{ ...type.title, color: colors.textMuted, opacity: 0.4 }}>
                ‹
              </Text>
            </Pressable>
          )}
          <Animated.View style={numberStyle}>
            <Text
              style={{
                ...numberToken,
                color: colors.text,
                minWidth: variant === 'hero' ? 100 : 70,
                textAlign: 'center',
              }}
              accessibilityLiveRegion="polite"
            >
              {value}
            </Text>
          </Animated.View>
          {hint && (
            <Pressable
              onPress={() => applyDelta(1)}
              accessibilityLabel="Aumentar"
              hitSlop={20}
            >
              <Text style={{ ...type.title, color: colors.textMuted, opacity: 0.4 }}>
                ›
              </Text>
            </Pressable>
          )}
        </View>
      </GestureDetector>
    </View>
  )
}
