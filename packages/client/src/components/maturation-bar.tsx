import { View } from 'react-native'
import { Hairline } from '@/components/ui/hairline'
import { useTheme } from '@/theme'
import type { EvolutionStatus } from '@vineo/shared'

interface MaturationBarProps {
  currentStatus: EvolutionStatus
  progress: number
}

const statusColors: Record<EvolutionStatus, 'green' | 'blue' | 'red'> = {
  EVOLVING: 'blue',
  PEAK: 'green',
  DECLINING: 'red',
}

/**
 * Linha do tempo de maturação: ——— • ——— • AGORA ——— • ———
 * Hairline com markers (motif do tempo). Cor herdada do status.
 */
export function MaturationBar({ currentStatus, progress }: MaturationBarProps) {
  const { colors } = useTheme()
  const lineColor = colors[statusColors[currentStatus]]
  const clamped = Math.min(Math.max(progress, 0), 1)
  const nowPos = Math.min(0.95, Math.max(0.05, clamped))

  return (
    <View>
      <Hairline
        color={lineColor}
        opacity={0.6}
        markers={[
          { position: 0.05 },
          { position: nowPos, label: 'AGORA' },
          { position: 0.95 },
        ]}
      />
    </View>
  )
}
