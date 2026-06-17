import { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView, useCameraPermissions } from 'expo-camera'
import type { BarcodeScanningResult } from 'expo-camera'
import { router, useLocalSearchParams } from 'expo-router'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Button } from '@/components/ui/button'
import { useAddBottleDraft, type AddBottleDraft } from '@/lib/add-bottle-draft'

const BARCODE_TIMEOUT = 3000

export default function CaptureScreen() {
  const params = useLocalSearchParams<{ cellarId?: string; row?: string; col?: string }>()
  const { draft, update } = useAddBottleDraft()
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [labelMode, setLabelMode] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { colors } = useTheme()

  // Hidrata o draft quando a câmera é aberta a partir de um slot do grid.
  useEffect(() => {
    const patch: Partial<AddBottleDraft> = {}
    if (params.cellarId) patch.cellarId = params.cellarId
    if (params.row != null) patch.row = parseInt(params.row, 10)
    if (params.col != null) patch.col = parseInt(params.col, 10)
    if (Object.keys(patch).length > 0) update(patch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const slotKnown = draft.row != null || params.row != null

  useEffect(() => {
    if (!permission?.granted) requestPermission()
  }, [permission, requestPermission])

  // Sem leitura de barcode em 3s → cai pro modo "capturar rótulo".
  useEffect(() => {
    timeoutRef.current = setTimeout(() => setLabelMode(true), BARCODE_TIMEOUT)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const goNext = useCallback(() => {
    router.replace(slotKnown ? '/add/bottle/confirm' : '/add/bottle/slot')
  }, [slotKnown])

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (scanned) return
      setScanned(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      update({ barcode: result.data, rawOcrText: null })
      goNext()
    },
    [scanned, update, goNext],
  )

  function handleManual() {
    update({ barcode: null, rawOcrText: null })
    goNext()
  }

  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ ...type.body, color: colors.textSecondary }}>Solicitando permissão da câmera…</Text>
      </SafeAreaView>
    )
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl }}>
        <Text style={{ ...type.headline, color: colors.text, textAlign: 'center' }}>Permissão negada</Text>
        <Text style={{ ...type.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
          Acesse as configurações do dispositivo para permitir o uso da câmera.
        </Text>
        <Button title="Solicitar permissão" onPress={requestPermission} variant="secondary" style={{ marginTop: spacing.xl }} />
        <Button title="Inserir manualmente" onPress={handleManual} variant="ghost" style={{ marginTop: spacing.sm }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'space-between', padding: spacing.lg }}>
          <View style={{ alignItems: 'center', marginTop: spacing.xxxl }}>
            <Text style={{ ...type.headline, color: colors.white }}>
              {labelMode ? 'Capture o rótulo' : 'Escaneie o código de barras'}
            </Text>
            <Text style={{ ...type.bodyS, color: 'rgba(255,255,255,0.7)', marginTop: spacing.sm }}>
              {labelMode ? 'Enquadre o rótulo frontal do vinho' : 'Ou aguarde para capturar o rótulo'}
            </Text>
          </View>
          <View style={{ gap: spacing.md, alignItems: 'center' }}>
            <Button title="Inserir manualmente" onPress={handleManual} variant="secondary" />
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  )
}
