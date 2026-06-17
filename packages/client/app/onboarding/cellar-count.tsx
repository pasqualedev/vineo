import { useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { spacing } from '@/theme/spacing'
import { useTheme } from '@/theme'
import { Button } from '@/components/ui/button'
import { Hero } from '@/components/ui/hero'
import { Counter } from '@/components/ui/counter'
import { Hairline } from '@/components/ui/hairline'

const MAX = 10
const MIN = 1

export default function CellarCountScreen() {
  const [count, setCount] = useState(1)
  const { colors } = useTheme()

  function handleNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
    router.push(`/onboarding/cellar-setup?index=0&total=${count}`)
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
        <View style={{ paddingTop: spacing.xxxl, gap: spacing.huge }}>
          <Hero
            eyebrow="PASSO 1 DE 2"
            title="Quantas adegas você tem?"
            subtitle="Vamos configurar cada uma."
            titleVariant="displayM"
          />

          <View style={{ alignItems: 'center', gap: spacing.lg }}>
            <Counter
              value={count}
              min={MIN}
              max={MAX}
              onChange={setCount}
              variant="hero"
              hint
            />
            <Hairline width={80} color={colors.accent} opacity={0.5} />
          </View>
        </View>

        <View style={{ paddingBottom: spacing.xxxl, alignItems: 'center' }}>
          <Button title="Continuar" variant="hero" chevron onPress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  )
}
