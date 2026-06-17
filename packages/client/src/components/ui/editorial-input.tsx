import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { type, motion, useTheme } from '@/theme'

interface EditorialInputProps extends Omit<TextInputProps, 'style'> {
  label: string
  containerStyle?: StyleProp<ViewStyle>
}

/**
 * Input editorial: sem caixa, label uppercase acima, texto Fraunces 22pt,
 * underline 1px → 2px accent no focus.
 */
export function EditorialInput({
  label,
  containerStyle,
  ...inputProps
}: EditorialInputProps) {
  const { colors } = useTheme()
  const [, setFocused] = useState(false)
  const focusProgress = useSharedValue(0)

  const handleFocus: TextInputProps['onFocus'] = (e) => {
    setFocused(true)
    focusProgress.value = withTiming(1, {
      duration: motion.durations.base - 100,
      easing: motion.easings.outExpo,
    })
    inputProps.onFocus?.(e)
  }

  const handleBlur: TextInputProps['onBlur'] = (e) => {
    setFocused(false)
    focusProgress.value = withTiming(0, {
      duration: motion.durations.base - 100,
      easing: motion.easings.outExpo,
    })
    inputProps.onBlur?.(e)
  }

  const underlineStyle = useAnimatedStyle(() => ({
    height: interpolate(focusProgress.value, [0, 1], [1, 2]),
    backgroundColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [colors.border, colors.accent],
    ),
  }))

  return (
    <View style={containerStyle}>
      <Text
        style={{
          ...type.label,
          color: colors.textMuted,
          marginBottom: spacing.sm,
        }}
      >
        {label}
      </Text>
      <TextInput
        {...inputProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={colors.textMuted}
        style={{
          fontFamily: type.headline.fontFamily,
          fontSize: type.headline.fontSize,
          lineHeight: type.headline.lineHeight,
          color: colors.text,
          paddingVertical: spacing.sm,
          paddingHorizontal: 0,
        }}
      />
      <Animated.View style={underlineStyle} />
    </View>
  )
}
