import { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Button } from '@/components/ui/button'
import { Hero } from '@/components/ui/hero'
import { Counter } from '@/components/ui/counter'
import { EditorialInput } from '@/components/ui/editorial-input'
import { Hairline } from '@/components/ui/hairline'
import { useUserId } from '@/lib/user-context'
import { useCreateCellar } from '@/hooks/use-cellars'

const MIN = 2
const MAX = 20
const MAX_DOTS = 80

export default function CellarSetupScreen() {
  const params = useLocalSearchParams()
  const index = parseInt(typeof params.index === 'string' ? params.index : '0', 10)
  const total = parseInt(typeof params.total === 'string' ? params.total : '1', 10)
  const names = typeof params.names === 'string' ? JSON.parse(params.names) : []

  const [name, setName] = useState<string>(names[index] || `Adega ${index + 1}`)
  const [rows, setRows] = useState(6)
  const [cols, setCols] = useState(4)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { colors } = useTheme()
  const { userId, initUser } = useUserId()
  const createCellar = useCreateCellar()

  const titleCopy = index === 0 ? 'Como devemos chamá-la?' : 'E esta?'
  const totalDots = Math.min(rows * cols, MAX_DOTS)

  async function handleNext() {
    setIsSubmitting(true)
    try {
      let currentUserId = userId
      if (!currentUserId) {
        const user = await initUser()
        currentUserId = user.id
      }
      await createCellar.mutateAsync({
        name,
        rows,
        columns: cols,
        userId: currentUserId,
      })
      const updatedNames = [...names]
      updatedNames[index] = name
      if (index + 1 < total) {
        router.replace(
          `/onboarding/cellar-setup?index=${index + 1}&total=${total}&names=${JSON.stringify(updatedNames)}`,
        )
      } else {
        router.replace('/onboarding/complete')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
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
          <Hero
            eyebrow={`ADEGA ${index + 1} DE ${total}`}
            title={titleCopy}
            titleVariant="displayM"
          />

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
                <Counter
                  value={rows}
                  min={MIN}
                  max={MAX}
                  onChange={setRows}
                  variant="compact"
                />
              </View>
              <View style={{ alignItems: 'center', gap: spacing.sm }}>
                <Text style={{ ...type.label, color: colors.textMuted }}>COLUNAS</Text>
                <Counter
                  value={cols}
                  min={MIN}
                  max={MAX}
                  onChange={setCols}
                  variant="compact"
                />
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
            title={
              isSubmitting
                ? 'Salvando…'
                : index + 1 < total
                  ? 'Próxima adega'
                  : 'Finalizar'
            }
            variant="hero"
            chevron
            disabled={isSubmitting}
            onPress={handleNext}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
