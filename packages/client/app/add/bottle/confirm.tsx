import { View, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useForm } from '@tanstack/react-form'
import { spacing } from '@/theme/spacing'
import { useTheme } from '@/theme'
import { Hero } from '@/components/ui/hero'
import { Button } from '@/components/ui/button'
import { EditorialInput } from '@/components/ui/editorial-input'
import { useMatchOrCreateBottle } from '@/hooks/use-match-or-create'
import { useAddBottleDraft } from '@/lib/add-bottle-draft'

/**
 * Passo 4 do wizard de adição de garrafa.
 * Exibe um formulário editorial para confirmar / enriquecer os dados
 * da garrafa antes de chamar match-or-create.
 */
export default function ConfirmScreen() {
  const { colors } = useTheme()
  const { draft, reset } = useAddBottleDraft()
  const matchOrCreate = useMatchOrCreateBottle(draft.cellarId ?? '')

  const form = useForm({
    defaultValues: {
      name: '',
      winery: '',
      grape: '',
      region: '',
      vintage: String(new Date().getFullYear()),
      price: '',
    },
    onSubmit: async ({ value }) => {
      if (draft.cellarId == null || draft.row == null || draft.col == null) return
      const vintage = parseInt(value.vintage, 10) || new Date().getFullYear()
      const parsedPrice = value.price ? Number(value.price.replace(',', '.')) : null

      try {
        await matchOrCreate.mutateAsync({
          barcode: draft.barcode,
          rawOcrText:
            draft.rawOcrText ??
            `${value.name} ${value.winery} ${value.region} ${vintage}`,
          cellarId: draft.cellarId,
          rowPosition: draft.row,
          columnPosition: draft.col,
          vintage,
          name: value.name || null,
          winery: value.winery || null,
          grape: value.grape || null,
          region: value.region || null,
          price: parsedPrice !== null && Number.isFinite(parsedPrice) ? parsedPrice : null,
        })
      } catch {
        Alert.alert(
          'Não foi possível salvar',
          'Verifique sua conexão e tente novamente.',
        )
        return
      }

      reset()
      router.replace('/add/bottle/success')
    },
  })

  if (draft.cellarId == null || draft.row == null || draft.col == null) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.xxl, gap: spacing.xl }}>
        <Hero eyebrow="PASSO 4 DE 4" title="Confirme o vinho" />

        <form.Field name="name">
          {(field) => (
            <EditorialInput
              label="NOME"
              value={field.state.value}
              onChangeText={field.handleChange}
              placeholder="Ex: Almafuerte Malbec"
            />
          )}
        </form.Field>

        <form.Field name="winery">
          {(field) => (
            <EditorialInput
              label="VINÍCOLA"
              value={field.state.value}
              onChangeText={field.handleChange}
              placeholder="Ex: Catena Zapata"
            />
          )}
        </form.Field>

        <form.Field name="grape">
          {(field) => (
            <EditorialInput
              label="UVA"
              value={field.state.value}
              onChangeText={field.handleChange}
              placeholder="Ex: Malbec"
            />
          )}
        </form.Field>

        <form.Field name="region">
          {(field) => (
            <EditorialInput
              label="REGIÃO"
              value={field.state.value}
              onChangeText={field.handleChange}
              placeholder="Ex: Mendoza"
            />
          )}
        </form.Field>

        <View style={{ flexDirection: 'row', gap: spacing.xl }}>
          <View style={{ flex: 1 }}>
            <form.Field name="vintage">
              {(field) => (
                <EditorialInput
                  label="SAFRA"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  keyboardType="number-pad"
                />
              )}
            </form.Field>
          </View>
          <View style={{ flex: 1 }}>
            <form.Field name="price">
              {(field) => (
                <EditorialInput
                  label="PREÇO (OPCIONAL)"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  keyboardType="decimal-pad"
                  placeholder="R$ 0,00"
                />
              )}
            </form.Field>
          </View>
        </View>

        <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                title={isSubmitting ? 'Salvando…' : 'Confirmar e adicionar'}
                variant="hero"
                chevron
                disabled={isSubmitting}
                onPress={() => form.handleSubmit()}
              />
            )}
          </form.Subscribe>
          <Button title="Cancelar" variant="ghost" onPress={() => router.dismissAll()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
