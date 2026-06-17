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
} from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { type, motion, useTheme } from '@/theme'
import { Button } from '@/components/ui/button'
import { VMonogram } from '@/components/ui/v-monogram'
import { Hairline } from '@/components/ui/hairline'

export default function CompleteScreen() {
  const { colors } = useTheme()

  function handleEnter() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {})
    router.replace('/(tabs)')
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.xxl,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg }}>
          <VMonogram size={56} weight="light" animate="reveal" delay={400} />
          <Hairline
            width={140}
            color={colors.accent}
            opacity={0.5}
            animate="grow"
            delay={600}
            style={{ alignItems: 'center' }}
          />

          <DelayedFade delay={1000}>
            <Text
              style={{
                ...type.displayM,
                color: colors.text,
                textAlign: 'center',
                marginTop: spacing.xl,
              }}
            >
              Sua adega está pronta.
            </Text>
          </DelayedFade>

          <DelayedFade delay={1300}>
            <Text
              style={{
                ...type.body,
                color: colors.textSecondary,
                textAlign: 'center',
              }}
            >
              Bem-vindo ao Víneo.
            </Text>
          </DelayedFade>
        </View>

        <DelayedFade delay={1800}>
          <View style={{ paddingBottom: spacing.xxxl, alignItems: 'center' }}>
            <Button title="Entrar" variant="hero" chevron onPress={handleEnter} />
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
