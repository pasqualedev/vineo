import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { BottleResponse, MoveBottleInput } from '@vineo/shared'

export function useCellarBottles(cellarId: string) {
  return useQuery({
    queryKey: ['cellars', cellarId, 'bottles'],
    queryFn: () => api<BottleResponse[]>(`/cellars/${cellarId}/bottles`),
    enabled: !!cellarId,
  })
}

export function useMoveBottle(cellarId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      bottleId,
      data,
    }: {
      bottleId: string
      data: MoveBottleInput
    }) =>
      api<BottleResponse>(`/bottles/${bottleId}/move`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onMutate: async ({ bottleId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['cellars', cellarId, 'bottles'] })
      const previous = queryClient.getQueryData<BottleResponse[]>([
        'cellars',
        cellarId,
        'bottles',
      ])

      if (previous) {
        queryClient.setQueryData<BottleResponse[]>(
          ['cellars', cellarId, 'bottles'],
          previous.map((b) =>
            b.id === bottleId
              ? { ...b, rowPosition: data.rowPosition, columnPosition: data.columnPosition }
              : b,
          ),
        )
      }

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['cellars', cellarId, 'bottles'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cellars', cellarId, 'bottles'] })
    },
  })
}

export function useUpdateBottleStatus(cellarId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      bottleId,
      status,
    }: {
      bottleId: string
      status: string
    }) =>
      api<BottleResponse>(`/bottles/${bottleId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cellars', cellarId, 'bottles'] })
    },
  })
}
