import { View, Pressable, Text, type ColorValue } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { type, useTheme } from '@/theme'
import { HomeIcon, CellarIcon } from '@/components/tab-icons'

const FAB_SIZE = 60
const BAR_HEIGHT = 64
const ICON_SIZE = 24

const TAB_LABELS: Record<string, string> = {
  index: 'Início',
  cellar: 'Adega',
}

function PlusIcon({ color, size = 24 }: { color: ColorValue; size?: number }) {
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: (size - 2) / 2,
          height: 2,
          borderRadius: 1,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: (size - 2) / 2,
          width: 2,
          borderRadius: 1,
          backgroundColor: color,
        }}
      />
    </View>
  )
}

/**
 * Tab bar custom do Víneo: duas abas (Início / Adega) e um botão "+" central
 * circular flutuante que abre o modal de adição.
 */
export function VineoTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  function openAddMenu() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    router.push('/add-menu')
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        height: BAR_HEIGHT + insets.bottom,
        paddingBottom: insets.bottom,
        paddingTop: 8,
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index
        const tint = isFocused ? colors.accent : colors.textMuted
        const label = TAB_LABELS[route.name] ?? route.name

        function onPress() {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const Icon = route.name === 'index' ? HomeIcon : CellarIcon

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={label}
            style={{ flex: 1, alignItems: 'center', gap: 2 }}
          >
            <Icon color={tint} size={ICON_SIZE} />
            <Text style={{ ...type.label, fontSize: 11, color: tint }}>{label}</Text>
          </Pressable>
        )
      })}

      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: -FAB_SIZE / 2,
          alignItems: 'center',
        }}
      >
        <Pressable
          onPress={openAddMenu}
          accessibilityRole="button"
          accessibilityLabel="Adicionar"
          style={{
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: FAB_SIZE / 2,
            backgroundColor: colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <PlusIcon color={colors.white} size={26} />
        </Pressable>
      </View>
    </View>
  )
}
