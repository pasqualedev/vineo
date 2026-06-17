import { useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { type, useTheme } from '@/theme'
import { useUserId } from '@/lib/user-context'
import { useCellars } from '@/hooks/use-cellars'

export default function IndexScreen() {
  const { colors } = useTheme()
  const { userId, isLoading: userLoading } = useUserId()
  const { data: cellars, isLoading: cellarsLoading } = useCellars(userId)

  useEffect(() => {
    if (userLoading) return

    if (!userId) {
      router.replace('/onboarding/welcome')
      return
    }

    if (cellarsLoading) return

    if (cellars && cellars.length > 0) {
      router.replace('/(tabs)')
    } else {
      router.replace('/onboarding/cellar-count')
    }
  }, [userId, userLoading, cellars, cellarsLoading])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator size="small" color={colors.accent} />
      <Text
        style={{
          ...type.label,
          color: colors.textSecondary,
          marginTop: 16,
        }}
      >
        VÍNEO
      </Text>
    </View>
  )
}
