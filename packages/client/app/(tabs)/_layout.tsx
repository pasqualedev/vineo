import { Tabs } from 'expo-router'
import { useTheme } from '@/theme'
import { HomeIcon, CellarIcon } from '@/components/tab-icons'

export default function TabLayout() {
  const { colors } = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 56,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: 'PublicSans_400Regular',
          fontSize: 11,
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          gap: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cellar"
        options={{
          title: 'Adega',
          tabBarLabel: 'Adega',
          tabBarIcon: ({ color, size }) => <CellarIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
