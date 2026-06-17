import { useEffect } from 'react'
import { View, Text } from 'react-native'
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
import { Button } from '@/components/ui/button'
import { VMonogram } from '@/components/ui/v-monogram'
import { Hairline } from '@/components/ui/hairline'

export default function WelcomeScreen() {
  const { colors } = useTheme()
  const ineoProgress = useSharedValue(0)

  useEffect(() => {
    ineoProgress.value = withDelay(
      900,
      withTiming(1, {
        duration: motion.durations.base,
        easing: motion.easings.outExpo,
      }),
    )
  }, [ineoProgress])

  const ineoStyle = useAnimatedStyle(() => ({
    opacity: ineoProgress.value,
    transform: [{ translateY: interpolate(ineoProgress.value, [0, 1], [8, 0]) }],
  }))

  function handleStart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
    router.push('/onboarding/intent')
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: spacing.xxl, justifyContent: 'space-between' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <VMonogram size={96} weight="light" animate="reveal" delay={200} />
            <Animated.Text
              style={[
                {
                  ...type.monumental,
                  color: colors.text,
                },
                ineoStyle,
              ]}
            >
              íneo
            </Animated.Text>
          </View>

          <Hairline
            width={180}
            color={colors.accent}
            opacity={0.5}
            animate="grow"
            delay={1500}
            style={{ alignItems: 'center' }}
          />

          <DelayedFade delay={1700}>
            <Text style={{ ...type.label, color: colors.textMuted }}>EST. 2026</Text>
          </DelayedFade>

          <DelayedFade delay={1900}>
            <Text
              style={{
                ...type.title,
                color: colors.textSecondary,
                textAlign: 'center',
                fontFamily: type.body.fontFamily,
                fontWeight: '400',
              }}
            >
              Onde o tempo se torna sabor.
            </Text>
          </DelayedFade>
        </View>

        <DelayedFade delay={2400}>
          <View style={{ paddingBottom: spacing.xxxl, alignItems: 'center' }}>
            <Button title="Começar" variant="hero" chevron onPress={handleStart} />
          </View>
        </DelayedFade>
      </View>
    </SafeAreaView>
  )
}

function DelayedFade({ delay, children }: { delay: number; children: React.ReactNode }) {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: motion.durations.base,
        easing: motion.easings.outExpo,
      }),
    )
  }, [delay, progress])

  const style = useAnimatedStyle(() => ({ opacity: progress.value }))
  return <Animated.View style={style}>{children}</Animated.View>
}
