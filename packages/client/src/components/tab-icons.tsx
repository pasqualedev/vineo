import { View, type ColorValue } from 'react-native'

interface IconProps {
  color: ColorValue
  size: number
}

export function HomeIcon({ color, size }: IconProps) {
  const w = size * 0.75
  const h = size * 0.6
  const roofH = size * 0.35

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: w,
          height: h,
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: 2,
          marginTop: roofH * 0.6,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: 0,
          height: 0,
          borderLeftWidth: w * 0.6,
          borderRightWidth: w * 0.6,
          borderBottomWidth: roofH,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
    </View>
  )
}

export function CellarIcon({ color, size }: IconProps) {
  const bodyW = size * 0.4
  const bodyH = size * 0.5
  const neckW = size * 0.18
  const neckH = size * 0.2
  const capH = size * 0.06

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: capH * 1.8,
          height: capH,
          backgroundColor: color,
          borderTopLeftRadius: 1,
          borderTopRightRadius: 1,
          marginBottom: -1,
        }}
      />
      <View
        style={{
          width: neckW,
          height: neckH,
          borderWidth: 1.5,
          borderColor: color,
          borderBottomWidth: 0,
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
        }}
      />
      <View
        style={{
          width: bodyW,
          height: bodyH,
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: 3,
          marginTop: -1,
        }}
      />
    </View>
  )
}
