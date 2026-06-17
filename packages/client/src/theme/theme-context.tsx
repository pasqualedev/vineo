import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useColorScheme } from 'react-native'
import { darkColors, lightColors, type ColorPalette } from './colors'

interface ThemeContextValue {
  colors: ColorPalette
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: darkColors,
  isDark: true,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme()
  const isDark = scheme !== 'light'

  const value = useMemo(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
    }),
    [isDark],
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
