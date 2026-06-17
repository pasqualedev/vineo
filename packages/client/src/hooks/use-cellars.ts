import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { CellarResponse, CreateCellarInput } from '@vineo/shared'

export function useCellars(userId?: string | null) {
  return useQuery({
    queryKey: ['cellars', userId],
    queryFn: () => {
      const params = userId ? `?userId=${userId}` : ''
      return api<CellarResponse[]>(`/cellars${params}`)
    },
    enabled: !!userId,
  })
}

export function useCellar(id: string) {
  return useQuery({
    queryKey: ['cellars', id],
    queryFn: () => api<CellarResponse>(`/cellars/${id}`),
    enabled: !!id,
  })
}

export function useCreateCellar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCellarInput) =>
      api<CellarResponse>('/cellars', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cellars'] })
    },
  })
}
