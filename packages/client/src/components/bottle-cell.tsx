import React from 'react'
import { Pressable, View, Text, useColorScheme } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { type, useTheme } from '@/theme'
import { rackColors } from '@/theme/rack-colors'
import type { BottleResponse } from '@vineo/shared'

interface BottleCellProps {
  bottle?: BottleResponse
  isEmpty: boolean
  onPress: () => void
  onLongPress?: () => void
  cellWidth: number
}

const grapeColors: Record<string, string> = {
  Tinto: '#8B0000',
  Branco: '#D4A574',
  Espumante: '#FBBF24',
}

function getGrapeCategory(grape: string): string {
  const reds = ['Cabernet Sauvignon', 'Nebbiolo', 'Malbec', 'Syrah', 'Merlot', 'Pinot Noir', 'Sangiovese', 'Tempranillo']
  const whites = ['Chardonnay', 'Sauvignon Blanc', 'White']

  if (reds.some((r) => grape.includes(r))) return 'Tinto'
  if (whites.some((w) => grape.includes(w))) return 'Branco'
  return 'Tinto'
}

export function BottleCell({ bottle, isEmpty, onPress, onLongPress, cellWidth }: BottleCellProps) {
  const scheme = useColorScheme() ?? 'dark'
  const rack = rackColors[scheme === 'dark' ? 'dark' : 'light']
  const { colors } = useTheme()

  const cellHeight = cellWidth * 0.85

  function renderCompartment(children: React.ReactNode) {
    return (
      <View
        style={{
          width: cellWidth,
          height: cellHeight,
          borderRadius: 4,
          backgroundColor: rack.compartmentBg,
          borderWidth: 1,
          borderColor: rack.compartmentBorder,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: cellHeight * 0.15,
            backgroundColor: rack.compartmentShadow,
          }}
        />

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: rack.compartmentFloor,
          }}
        />

        {children}
      </View>
    )
  }

  if (isEmpty) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
        accessibilityLabel="Adicionar garrafa"
        accessibilityRole="button"
      >
        {renderCompartment(
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{
                color: rack.emptySymbol,
                fontSize: cellWidth * 0.25,
                lineHeight: cellWidth * 0.3,
                fontFamily: type.body.fontFamily,
              }}
            >
              +
            </Text>
          </View>,
        )}
      </Pressable>
    )
  }

  if (!bottle) return null

  const grapeCategory = getGrapeCategory(bottle.wine.grape)
  const dotColor = grapeColors[grapeCategory] || colors.accent
  const vintage = bottle.vintage
  const bottlePadding = Math.max(4, cellWidth * 0.06)
  const bottleBodyHeight = cellHeight * 0.45
  const neckHeight = cellHeight * 0.2
  const capHeight = cellHeight * 0.12
  const bottleBodyWidth = cellWidth - bottlePadding * 2

  return (
    <Animated.View entering={FadeIn.duration(200)}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
        })}
        accessibilityLabel={`${bottle.wine.name} ${bottle.vintage}`}
        accessibilityRole="button"
      >
        {renderCompartment(
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: neckHeight * 0.6,
                  height: neckHeight,
                  backgroundColor: dotColor,
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                  opacity: 0.9,
                }}
              />

              <View
                style={{
                  width: neckHeight * 0.8,
                  height: capHeight,
                  backgroundColor: dotColor,
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                  marginBottom: -1,
                  opacity: 0.95,
                }}
              />

              <View
                style={{
                  width: bottleBodyWidth,
                  height: bottleBodyHeight,
                  backgroundColor: dotColor,
                  borderRadius: 4,
                  opacity: 0.85,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: Math.min(cellWidth * 0.12, 12),
                    fontFamily: type.label.fontFamily,
                    fontWeight: type.label.fontWeight,
                    letterSpacing: 0.5,
                    textShadowColor: 'rgba(0,0,0,0.3)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 1,
                  }}
                >
                  {vintage}
                </Text>
              </View>
            </View>
          </View>,
        )}
      </Pressable>
    </Animated.View>
  )
}
