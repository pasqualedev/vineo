import { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView, useCameraPermissions } from 'expo-camera'
import type { BarcodeScanningResult } from 'expo-camera'
import { router, useLocalSearchParams } from 'expo-router'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Button } from '@/components/ui/button'

const BARCODE_TIMEOUT = 3000

export default function AddBottleScreen() {
  const { cellarId, row, col } = useLocalSearchParams<{
    cellarId: string
    row: string
    col: string
  }>()
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { colors } = useTheme()

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission()
    }
  }, [permission, requestPermission])

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      router.replace(`/add/ocr-fallback?cellarId=${cellarId}&row=${row}&col=${col}`)
    }, BARCODE_TIMEOUT)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [cellarId, row, col])

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (scanned) return
      setScanned(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      router.replace(
        `/add/confirm?cellarId=${cellarId}&row=${row}&col=${col}&barcode=${result.data}`,
      )
    },
    [scanned, cellarId, row, col],
  )

  const handleSkipCamera = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    router.replace(`/add/ocr-fallback?cellarId=${cellarId}&row=${row}&col=${col}`)
  }, [cellarId, row, col])

  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ ...type.body, color: colors.textSecondary }}>
          Solicitando permissão da câmera…
        </Text>
      </SafeAreaView>
    )
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl }}>
        <Text style={{ ...type.headline, color: colors.text, textAlign: 'center' }}>
          Permissão negada
        </Text>
        <Text style={{ ...type.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
          Acesse as configurações do dispositivo para permitir o uso da câmera.
        </Text>
        <Button title="Solicitar Permissão" onPress={requestPermission} variant="secondary" style={{ marginTop: spacing.xl }} />
        <Button title="Voltar" onPress={() => router.back()} variant="ghost" style={{ marginTop: spacing.sm }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'space-between', padding: spacing.lg }}>
          <View style={{ alignItems: 'center', marginTop: spacing.xxxl }}>
            <Text style={{ ...type.headline, color: colors.white }}>
              Escaneie o Código de Barras
            </Text>
            <Text style={{ ...type.bodyS, color: 'rgba(255,255,255,0.7)', marginTop: spacing.sm }}>
              Ou posicione o rótulo frontal na câmera
            </Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Button title="Pular escaneamento" onPress={handleSkipCamera} variant="secondary" />
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  )
}
