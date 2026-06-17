import { Children, isValidElement, useEffect } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated'
import { motion } from '@/theme'

interface StaggerGroupProps {
  children: React.ReactNode
  delay?: number
  stagger?: number
  enabled?: boolean
}

/**
 * Entrada fade+slide-up sequencial nos filhos diretos.
 */
export function StaggerGroup({
  children,
  delay = 0,
  stagger = motion.stagger.default,
  enabled = true,
}: StaggerGroupProps) {
  const items = Children.toArray(children).filter(isValidElement)
  return (
    <>
      {items.map((child, i) => (
        <StaggerItem key={i} delay={delay + i * stagger} enabled={enabled}>
          {child}
        </StaggerItem>
      ))}
    </>
  )
}

function StaggerItem({
  children,
  delay,
  enabled,
}: {
  children: React.ReactNode
  delay: number
  enabled: boolean
}) {
  const progress = useSharedValue(enabled ? 0 : 1)

  useEffect(() => {
    if (enabled) {
      progress.value = withDelay(
        delay,
        withTiming(1, {
          duration: motion.durations.base,
          easing: motion.easings.outExpo,
        }),
      )
    }
  }, [delay, enabled, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: interpolate(progress.value, [0, 1], [6, 0]) }],
  }))

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}
