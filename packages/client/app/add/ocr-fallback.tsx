import { useState } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView } from 'expo-camera'
import { router, useLocalSearchParams } from 'expo-router'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Button } from '@/components/ui/button'

export default function OcrFallbackScreen() {
  const { cellarId, row, col } = useLocalSearchParams<{
    cellarId: string
    row: string
    col: string
  }>()
  const [captured, setCaptured] = useState(false)
  const { colors } = useTheme()

  function handleCapture() {
    setCaptured(true)
    router.replace(`/add/confirm?cellarId=${cellarId}&row=${row}&col=${col}`)
  }

  function handleManualEntry() {
    router.replace(`/add/confirm?cellarId=${cellarId}&row=${row}&col=${col}`)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <CameraView style={{ flex: 1 }} facing="back">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'space-between', padding: spacing.lg }}>
          <View style={{ alignItems: 'center', marginTop: spacing.xxxl }}>
            <Text style={{ ...type.headline, color: colors.white }}>
              Capture o Rótulo
            </Text>
            <Text style={{ ...type.bodyS, color: 'rgba(255,255,255,0.7)', marginTop: spacing.sm }}>
              Enquadre o rótulo frontal do vinho
            </Text>
          </View>

          <View style={{ gap: spacing.md, alignItems: 'center' }}>
            <Button
              title={captured ? 'Foto capturada!' : 'Capturar Foto'}
              onPress={handleCapture}
            />
            <Button title="Inserir manualmente" onPress={handleManualEntry} variant="ghost" />
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  )
}
