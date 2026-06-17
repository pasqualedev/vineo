import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, ApiError } from '@/lib/api-client'
import { getStoredUserId, storeUserId, clearUser } from '@/lib/user-storage'
import type { UserResponse } from '@vineo/shared'

interface UserContextValue {
  userId: string | null
  isLoading: boolean
  initUser: () => Promise<UserResponse>
}

const UserContext = createContext<UserContextValue>({
  userId: null,
  isLoading: true,
  initUser: async () => { throw new Error('UserProvider not mounted') },
})

/**
 * Provides the current userId (persisted in AsyncStorage) and a way to (re)init it
 * via the API. On mount, validates the stored id against the backend: if the user
 * no longer exists (e.g. DB reset), clears local storage so the app falls back
 * to onboarding.
 */
export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        const stored = await getStoredUserId()
        if (!stored) return

        try {
          await api<UserResponse>(`/users/${stored}`)
          if (!cancelled) setUserId(stored)
        } catch (err) {
          if (err instanceof ApiError && err.status === 404) {
            await clearUser()
          } else if (!cancelled) {
            setUserId(stored)
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [])

  async function initUser() {
    const user = await api<UserResponse>('/users/init', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    await storeUserId(user.id)
    setUserId(user.id)
    return user
  }

  return (
    <UserContext.Provider value={{ userId, isLoading, initUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserId() {
  return useContext(UserContext)
}
