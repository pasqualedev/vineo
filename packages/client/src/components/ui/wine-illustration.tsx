import {
  View,
  Image,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

interface WineIllustrationProps {
  readonly source: ImageSourcePropType
  readonly size: number
  readonly style?: StyleProp<ViewStyle>
}

/**
 * Exibe uma ilustração (assets de fundo claro) dentro de um container claro
 * arredondado, para parecer intencional sobre o tema escuro do app.
 */
export function WineIllustration({ source, size, style }: WineIllustrationProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: 16,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Image
        source={source}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  )
}
