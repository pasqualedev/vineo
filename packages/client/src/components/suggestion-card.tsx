import { View, Text, Image, Dimensions } from 'react-native'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import type { BottleResponse } from '@vineo/shared'
import { getWineImage } from '@/lib/wine-images'

const SCREEN_WIDTH = Dimensions.get('window').width

interface SuggestionCardProps {
  bottle: BottleResponse
}

const STATUS_LABELS: Record<string, string> = {
  peak: 'No auge para degustar',
  evolving: 'Ainda em evolução',
  declining: 'Consumir em breve',
  past: 'No declínio',
}

export function SuggestionCard({ bottle }: SuggestionCardProps) {
  const { colors } = useTheme()
  const wineName = bottle.wine?.name ?? 'Vinho sem nome'
  const imageUrl = getWineImage(wineName)
  const winery = bottle.wine?.winery ?? ''
  const status = bottle.evolution?.currentStatus ?? 'EVOLVING'
  const statusLabel = STATUS_LABELS[status.toLowerCase()] ?? 'Aguardando'

  return (
    <View
      style={{
        width: SCREEN_WIDTH - spacing.lg * 2,
        height: 280,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        alignSelf: 'center',
      }}
    >
      <Image
        source={{ uri: imageUrl }}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        aria-label={`Imagem de sugestão: ${wineName}`}
      />

      <View
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
        }}
      />

      <View style={{ flex: 1, justifyContent: 'flex-end', padding: spacing.lg }}>
        <Text
          style={{
            ...type.label,
            color: colors.accent,
            marginBottom: spacing.xs,
          }}
        >
          SUGESTÃO DO DIA
        </Text>

        <Text
          style={{ ...type.headline, color: '#FFFFFF' }}
          numberOfLines={1}
        >
          {wineName}
        </Text>

        {winery ? (
          <Text
            style={{
              ...type.body,
              color: 'rgba(255,255,255,0.8)',
              marginTop: spacing.xs,
            }}
          >
            {winery} {bottle.vintage ? `• ${bottle.vintage}` : ''}
          </Text>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: spacing.md,
            gap: spacing.sm,
          }}
        >
          <StatusBadge status={status} />
          <Text style={{ ...type.bodyS, color: 'rgba(255,255,255,0.9)' }}>
            {statusLabel}
          </Text>
        </View>
      </View>
    </View>
  )
}

function StatusBadge({ status }: { status: string }) {
  const dotColors: Record<string, string> = {
    EVOLVING: '#22C55E',
    PEAK: '#6366F1',
    DECLINING: '#F59E0B',
  }

  return (
    <View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: dotColors[status] ?? '#6B7280',
      }}
    />
  )
}
