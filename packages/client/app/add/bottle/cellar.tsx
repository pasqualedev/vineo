import { useEffect } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { resolveSoleCellarId } from '@vineo/shared'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Hero } from '@/components/ui/hero'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUserId } from '@/lib/user-context'
import { useCellars } from '@/hooks/use-cellars'
import { useAddBottleDraft } from '@/lib/add-bottle-draft'

export default function SelectCellarScreen() {
  const { colors } = useTheme()
  const { userId } = useUserId()
  const { data: cellars, isLoading } = useCellars(userId)
  const { update } = useAddBottleDraft()

  const soleCellarId = cellars ? resolveSoleCellarId(cellars) : null

  useEffect(() => {
    if (soleCellarId) {
      update({ cellarId: soleCellarId })
      router.replace('/add/bottle/capture')
    }
  }, [soleCellarId, update])

  function select(cellarId: string) {
    update({ cellarId })
    router.push('/add/bottle/capture')
  }

  if (isLoading || soleCellarId) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    )
  }

  if (!cellars || cellars.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, padding: spacing.xxl, justifyContent: 'center', gap: spacing.xl }}>
          <Hero
            eyebrow="NENHUMA ADEGA"
            title="Crie uma adega primeiro"
            subtitle="Você precisa de um espaço de guarda antes de adicionar garrafas."
          />
          <Button
            title="Criar adega"
            variant="hero"
            chevron
            onPress={() => router.replace('/add/cellar/setup')}
          />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.xxl, gap: spacing.xxl }}>
        <Hero eyebrow="PASSO 1 DE 4" title="Em qual adega?" />
        <View style={{ gap: spacing.md }}>
          {cellars.map((cellar) => (
            <Card key={cellar.id} interactive onPress={() => select(cellar.id)}>
              <Text style={{ ...type.headline, color: colors.text }}>{cellar.name}</Text>
              <Text style={{ ...type.bodyS, color: colors.textSecondary }}>
                {cellar.rows} × {cellar.columns} posições
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
