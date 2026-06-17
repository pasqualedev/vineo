import { View, Text, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Card } from '@/components/ui/card'
import { WineIllustration } from '@/components/ui/wine-illustration'

const BOTTLE_IMG = require('../assets/bottle.png')
const CELLAR_IMG = require('../assets/cellar.png')

interface ChoiceProps {
  readonly image: number
  readonly title: string
  readonly subtitle: string
  readonly onPress: () => void
}

function Choice({ image, title, subtitle, onPress }: ChoiceProps) {
  const { colors } = useTheme()
  return (
    <Card interactive onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
        <WineIllustration source={image} size={72} />
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text style={{ ...type.headline, color: colors.text }}>{title}</Text>
          <Text style={{ ...type.bodyS, color: colors.textSecondary }}>{subtitle}</Text>
        </View>
      </View>
    </Card>
  )
}

export default function AddMenuScreen() {
  const { colors } = useTheme()

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <Pressable
        accessibilityLabel="Fechar"
        onPress={() => router.back()}
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
      />
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{
          backgroundColor: colors.bg,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: spacing.xxl,
          paddingTop: spacing.xxl,
          paddingBottom: spacing.huge,
          gap: spacing.lg,
        }}
      >
        <Text style={{ ...type.label, color: colors.textMuted, textAlign: 'center' }}>
          O QUE VOCÊ QUER ADICIONAR?
        </Text>
        <Choice
          image={BOTTLE_IMG}
          title="Adicionar garrafa"
          subtitle="Escaneie ou registre um vinho"
          onPress={() => router.replace('/add/bottle/cellar')}
        />
        <Choice
          image={CELLAR_IMG}
          title="Adicionar adega"
          subtitle="Crie um novo espaço de guarda"
          onPress={() => router.replace('/add/cellar/setup')}
        />
      </Animated.View>
    </View>
  )
}
