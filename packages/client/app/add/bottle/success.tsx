import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { spacing } from '@/theme/spacing'
import { useTheme } from '@/theme'
import { Hero } from '@/components/ui/hero'
import { Button } from '@/components/ui/button'
import { WineIllustration } from '@/components/ui/wine-illustration'

/** Imagem de taça usada na tela de sucesso. */
const CUP_IMG = require('../../../assets/cup.png')

/**
 * Tela de confirmação exibida após a adição bem-sucedida de uma garrafa.
 * Apresenta ilustração, mensagem de sucesso e ação para retornar à adega.
 */
export default function SuccessScreen() {
  const { colors } = useTheme()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <View
        style={{
          flex: 1,
          padding: spacing.xxl,
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.xxl,
        }}
      >
        <WineIllustration source={CUP_IMG} size={160} />
        <Hero
          title="Garrafa adicionada"
          subtitle="Saúde! Ela já está na sua adega."
          style={{ alignItems: 'center' }}
        />
        <Button title="Voltar à adega" variant="hero" chevron onPress={() => router.dismissAll()} />
      </View>
    </SafeAreaView>
  )
}
