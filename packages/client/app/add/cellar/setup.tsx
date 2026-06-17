import { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Hero } from '@/components/ui/hero'
import { Button } from '@/components/ui/button'
import { Counter } from '@/components/ui/counter'
import { EditorialInput } from '@/components/ui/editorial-input'
import { Hairline } from '@/components/ui/hairline'
import { useUserId } from '@/lib/user-context'
import { useCreateCellar } from '@/hooks/use-cellars'

/** Mínimo de fileiras/colunas permitidas. */
const MIN = 2
/** Máximo de fileiras/colunas permitidas. */
const MAX = 20
/** Quantidade máxima de pontos exibidos na preview da grade. */
const MAX_DOTS = 80

/**
 * Wizard de criação de adega.
 * Permite ao utilizador nomear a adega e definir as dimensões (fileiras × colunas).
 * Persiste via `useCreateCellar` e redireciona ao concluir.
 */
export default function CreateCellarScreen() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>()
  const [name, setName] = useState('Adega Principal')
  const [rows, setRows] = useState(6)
  const [cols, setCols] = useState(4)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { colors } = useTheme()
  const { userId, initUser } = useUserId()
  const createCellar = useCreateCellar()

  const totalDots = Math.min(rows * cols, MAX_DOTS)

  /**
   * Cria a adega: garante que existe um userId (inicializa se necessário),
   * chama a mutation e navega de volta ao concluir.
   */
  async function handleCreate() {
    setIsSubmitting(true)
    try {
      let currentUserId = userId
      if (!currentUserId) {
        const user = await initUser()
        currentUserId = user.id
      }
      await createCellar.mutateAsync({ name, rows, columns: cols, userId: currentUserId })
      if (returnTo) {
        router.replace(returnTo as Parameters<typeof router.replace>[0])
      } else {
        router.dismissAll()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: spacing.xxl,
          paddingTop: spacing.xxl,
          paddingBottom: spacing.xxxl,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ gap: spacing.xxxl }}>
          <Hero eyebrow="NOVA ADEGA" title="Como devemos chamá-la?" titleVariant="displayM" />

          <EditorialInput
            label="NOME"
            value={name}
            onChangeText={setName}
            placeholder="Adega Principal"
          />

          <View style={{ gap: spacing.lg }}>
            <Text style={{ ...type.label, color: colors.textMuted }}>DIMENSÕES</Text>
            <Hairline />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingTop: spacing.md,
              }}
            >
              <View style={{ alignItems: 'center', gap: spacing.sm }}>
                <Text style={{ ...type.label, color: colors.textMuted }}>FILEIRAS</Text>
                <Counter value={rows} min={MIN} max={MAX} onChange={setRows} variant="compact" />
              </View>
              <View style={{ alignItems: 'center', gap: spacing.sm }}>
                <Text style={{ ...type.label, color: colors.textMuted }}>COLUNAS</Text>
                <Counter value={cols} min={MIN} max={MAX} onChange={setCols} variant="compact" />
              </View>
            </View>
          </View>

          <View style={{ alignItems: 'center', gap: spacing.md }}>
            <View
              style={{
                flexDirection: 'row',
                gap: 3,
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: 240,
              }}
            >
              {Array.from({ length: totalDots }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 1.5,
                    backgroundColor: colors.accent,
                    opacity: 0.3,
                  }}
                />
              ))}
            </View>
            <Text style={{ ...type.bodyS, color: colors.textMuted }}>
              {rows} × {cols} posições
            </Text>
          </View>
        </View>

        <View style={{ paddingTop: spacing.xxxl, alignItems: 'center' }}>
          <Button
            title={isSubmitting ? 'Salvando…' : 'Criar adega'}
            variant="hero"
            chevron
            disabled={isSubmitting}
            onPress={handleCreate}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
