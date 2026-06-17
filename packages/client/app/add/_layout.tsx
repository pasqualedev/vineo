import { Stack } from 'expo-router'
import { AddBottleDraftProvider } from '@/lib/add-bottle-draft'

export default function AddLayout() {
  return (
    <AddBottleDraftProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AddBottleDraftProvider>
  )
}
