import { View } from 'react-native'
import { Stack } from 'expo-router'
import { AmbientGradient } from '@/components/ui/ambient-gradient'
import { useTheme } from '@/theme'

export default function OnboardingLayout() {
  const { colors } = useTheme()

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AmbientGradient />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
          animationDuration: 550,
        }}
      />
    </View>
  )
}
