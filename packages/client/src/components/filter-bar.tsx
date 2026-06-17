import { Pressable, ScrollView, Text } from 'react-native'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'

type FilterOption = string | null

interface FilterBarProps {
  options: string[]
  selected: FilterOption
  onSelect: (option: FilterOption) => void
}

export function FilterBar({ options, selected, onSelect }: FilterBarProps) {
  const { colors } = useTheme()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
        paddingVertical: spacing.sm,
      }}
    >
      <Pressable
        onPress={() => onSelect(null)}
        style={({ pressed }) => ({
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: 8,
          backgroundColor: selected === null ? colors.accent : colors.surface,
          borderWidth: 1,
          borderColor: selected === null ? colors.accent : colors.border,
          opacity: pressed ? 0.8 : 1,
        })}
        accessibilityLabel="Filtrar todos"
        accessibilityRole="button"
      >
        <Text
          style={{
            color: selected === null ? colors.white : colors.textSecondary,
            fontSize: type.bodyS.fontSize,
            fontFamily: type.bodyS.fontFamily,
          }}
        >
          Todos
        </Text>
      </Pressable>

      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onSelect(option)}
          style={({ pressed }) => ({
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: 8,
            backgroundColor: selected === option ? colors.accent : colors.surface,
            borderWidth: 1,
            borderColor: selected === option ? colors.accent : colors.border,
            opacity: pressed ? 0.8 : 1,
          })}
          accessibilityLabel={`Filtrar por ${option}`}
          accessibilityRole="button"
        >
          <Text
            style={{
              color: selected === option ? colors.white : colors.textSecondary,
              fontSize: type.bodyS.fontSize,
              fontFamily: type.bodyS.fontFamily,
            }}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}
