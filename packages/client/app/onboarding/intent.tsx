import { useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  interpolate,
} from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { type, motion, useTheme } from '@/theme'
import { Hairline } from '@/components/ui/hairline'

export default function IntentScreen() {
  const { colors } = useTheme()

  function handleAdvance() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
    router.push('/onboarding/cellar-count')
  }

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={handleAdvance}
      accessibilityRole="button"
      accessibilityLabel="Continuar"
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing.xxl,
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1, justifyContent: 'center', gap: spacing.xxl }}>
            <Reveal delay={0}>
              <Text style={{ ...type.displayM, color: colors.text }}>
                Toda garrafa carrega
              </Text>
            </Reveal>
            <Reveal delay={motion.stagger.slow}>
              <Text style={{ ...type.displayL, color: colors.text }}>
                um momento.
              </Text>
            </Reveal>
            <Reveal delay={motion.stagger.slow * 2}>
              <Hairline width={40} color={colors.accent} opacity={0.4} />
            </Reveal>
            <Reveal delay={motion.stagger.slow * 3}>
              <View>
                <Text style={{ ...type.body, color: colors.textSecondary }}>
                  Vamos te ajudar a
                </Text>
                <Text style={{ ...type.body, color: colors.textSecondary }}>
                  não perdê-lo.
                </Text>
              </View>
            </Reveal>
          </View>

          <Reveal delay={motion.stagger.slow * 5}>
            <View style={{ paddingBottom: spacing.xxxl, alignItems: 'center' }}>
              <Text
                style={{
                  ...type.label,
                  color: colors.textMuted,
                  opacity: 0.5,
                }}
              >
                TOQUE EM QUALQUER LUGAR
              </Text>
            </View>
          </Reveal>
        </View>
      </SafeAreaView>
    </Pressable>
  )
}

function Reveal({ delay, children }: { delay: number; children: React.ReactNode }) {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: motion.durations.base + 50,
        easing: motion.easings.outExpo,
      }),
    )
  }, [delay, progress])

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: interpolate(progress.value, [0, 1], [6, 0]) }],
  }))

  return <Animated.View style={style}>{children}</Animated.View>
}
