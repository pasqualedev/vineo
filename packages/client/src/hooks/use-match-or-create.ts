import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { MatchOrCreateInput, BottleResponse } from '@vineo/shared'

export function useMatchOrCreateBottle(cellarId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MatchOrCreateInput) =>
      api<BottleResponse>('/bottles/match-or-create', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cellars', cellarId, 'bottles'] })
    },
  })
}
