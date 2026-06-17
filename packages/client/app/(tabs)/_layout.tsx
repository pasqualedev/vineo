import { Tabs } from 'expo-router'
import { VineoTabBar } from '@/components/navigation/vineo-tab-bar'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <VineoTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="cellar" options={{ title: 'Adega' }} />
    </Tabs>
  )
}
