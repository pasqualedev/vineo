import { View, Text, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Button } from '@/components/ui/button'
import { useMatchOrCreateBottle } from '@/hooks/use-match-or-create'

const confirmBottleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  winery: z.string().min(1, 'Vinícola é obrigatória'),
  grape: z.string().min(1, 'Uva é obrigatória'),
  region: z.string().min(1, 'Região é obrigatória'),
  vintage: z.coerce.number().int().min(1900).max(2100),
  price: z.string().optional(),
})

export default function ConfirmBottleScreen() {
  const { cellarId, row, col, barcode } = useLocalSearchParams<{
    cellarId: string
    row: string
    col: string
    barcode?: string
  }>()
  const { colors } = useTheme()

  const matchOrCreate = useMatchOrCreateBottle(cellarId ?? '')

  const form = useForm({
    defaultValues: {
      name: '',
      winery: '',
      grape: '',
      region: '',
      vintage: new Date().getFullYear(),
      price: '',
    },
    onSubmit: async (values) => {
      if (!cellarId || !row || !col) return

      await matchOrCreate.mutateAsync({
        barcode: barcode ?? null,
        rawOcrText: `${values.value.name} ${values.value.winery} ${values.value.region} ${values.value.vintage}`,
        cellarId,
        rowPosition: parseInt(row, 10),
        columnPosition: parseInt(col, 10),
        vintage: values.value.vintage,
      })

      router.back()
    },
  })

  const labelStyle = {
    ...type.bodyS,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  }

  const inputStyle = {
    ...type.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    color: colors.text,
    padding: spacing.md,
  }

  const errorStyle = {
    ...type.bodyS,
    color: colors.red,
    marginTop: spacing.xs,
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={{ padding: spacing.lg }}>
        <Text
          style={{
            ...type.displayM,
            color: colors.text,
            marginBottom: spacing.xs,
          }}
        >
          Confirmar Garrafa
        </Text>
        <Text
          style={{
            ...type.bodyS,
            color: colors.textSecondary,
            marginBottom: spacing.xxl,
          }}
        >
          Posição: linha {row}, coluna {col}
        </Text>

        <View style={{ gap: spacing.md }}>
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const result = confirmBottleSchema.shape.name.safeParse(value)
                return result.success ? undefined : result.error.issues[0]?.message
              },
            }}
          >
            {(field) => (
              <View>
                <Text style={labelStyle}>Nome do Vinho</Text>
                <TextInput
                  style={inputStyle}
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Ex: Almafuerte Malbec"
                  placeholderTextColor={colors.textMuted}
                />
                {field.state.meta.errors && (
                  <Text style={errorStyle}>{field.state.meta.errors.join(', ')}</Text>
                )}
              </View>
            )}
          </form.Field>

          <form.Field name="winery">
            {(field) => (
              <View>
                <Text style={labelStyle}>Vinícola</Text>
                <TextInput
                  style={inputStyle}
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Ex: Catena Zapata"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            )}
          </form.Field>

          <form.Field name="grape">
            {(field) => (
              <View>
                <Text style={labelStyle}>Uva</Text>
                <TextInput
                  style={inputStyle}
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Ex: Malbec"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            )}
          </form.Field>

          <form.Field name="region">
            {(field) => (
              <View>
                <Text style={labelStyle}>Região</Text>
                <TextInput
                  style={inputStyle}
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  placeholder="Ex: Mendoza"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            )}
          </form.Field>

          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ flex: 1 }}>
              <form.Field name="vintage">
                {(field) => (
                  <View>
                    <Text style={labelStyle}>Safra</Text>
                    <TextInput
                      style={inputStyle}
                      value={String(field.state.value)}
                      onChangeText={(v) => field.handleChange(parseInt(v, 10) || 0)}
                      keyboardType="number-pad"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                )}
              </form.Field>
            </View>

            <View style={{ flex: 1 }}>
              <form.Field name="price">
                {(field) => (
                  <View>
                    <Text style={labelStyle}>Preço (opcional)</Text>
                    <TextInput
                      style={inputStyle}
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      keyboardType="decimal-pad"
                      placeholder="R$ 0,00"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                )}
              </form.Field>
            </View>
          </View>
        </View>

        <View style={{ marginTop: spacing.xxl, gap: spacing.md }}>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                title={isSubmitting ? 'Salvando...' : 'Confirmar e Adicionar'}
                onPress={() => form.handleSubmit()}
              />
            )}
          </form.Subscribe>
          <Button title="Cancelar" variant="ghost" onPress={() => router.back()} />
        </View>
      </View>
    </SafeAreaView>
  )
}
