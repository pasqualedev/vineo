import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api-client'
import { getStoredUserId, storeUserId } from '@/lib/user-storage'
import type { UserResponse } from '@vineo/shared'

export function useInitUser() {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getStoredUserId()
      .then((stored) => {
        if (stored) {
          setUserId(stored)
        }
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  const initUser = useCallback(async () => {
    const user = await api<UserResponse>('/users/init', {
      method: 'POST',
    })
    await storeUserId(user.id)
    setUserId(user.id)
    return user
  }, [])

  return { userId, isLoading, initUser }
}
