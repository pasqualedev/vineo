# Víneo Visual Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reformular a identidade visual do app Víneo (antes CaveFlow) e reescrever o onboarding como experiência cinemática, seguindo o spec `docs/superpowers/specs/2026-06-16-vineo-visual-identity-design.md`.

**Architecture:** Cinco chunks sequenciais — (1) tokens de design, (2) primitives UI, (3) onboarding, (4) app principal herda tokens, (5) polimento. Mudanças isoladas em arquivos focados; preferência por componentes pequenos com responsabilidade única; motion via Reanimated 4 com tokens centralizados em `theme/motion.ts`.

**Tech Stack:** Expo SDK 56, expo-router, React Native, react-native-reanimated 4.3, react-native-gesture-handler 2.31, @expo-google-fonts (Fraunces, Inter), expo-haptics, expo-linear-gradient, react-native-svg.

**Repo status:** Repositório git **não está inicializado**. Os passos "Commit" deste plano são checkpoints lógicos. Quando o usuário rodar `git init` no fim, esses pontos viram os primeiros commits naturais. Por enquanto, anote o ponto e siga.

---

## File Structure

### Arquivos novos
```
packages/client/src/theme/motion.ts                          (tokens motion)
packages/client/src/components/ui/v-monogram.tsx             (motif primário)
packages/client/src/components/ui/hairline.tsx               (motif secundário)
packages/client/src/components/ui/editorial-input.tsx        (input editorial)
packages/client/src/components/ui/counter.tsx                (counter gestual)
packages/client/src/components/ui/hero.tsx                   (wrapper header tela)
packages/client/src/components/ui/ambient-gradient.tsx       (gradient respirando)
packages/client/src/components/ui/stagger-group.tsx          (utility stagger)
packages/client/app/onboarding/intent.tsx                    (tela 2 onboarding)
packages/client/app/onboarding/complete.tsx                  (tela 5 onboarding)
packages/client/app/dev/showcase.tsx                         (showcase descartável)
```

### Arquivos modificados
```
packages/client/package.json                                 (deps fontes)
packages/client/app/_layout.tsx                              (load fontes novas)
packages/client/app/onboarding/_layout.tsx                   (AmbientGradient)
packages/client/app/onboarding/welcome.tsx                   (reescrever)
packages/client/app/onboarding/cellar-count.tsx              (reescrever)
packages/client/app/onboarding/cellar-setup.tsx              (reescrever)
packages/client/app/(tabs)/index.tsx                         (Hero, tokens)
packages/client/app/(tabs)/cellar.tsx                        (Hero, tokens)
packages/client/app/(tabs)/_layout.tsx                       (tab styling)
packages/client/app/add/index.tsx                            (tokens)
packages/client/app/add/confirm.tsx                          (tokens)
packages/client/app/add/ocr-fallback.tsx                     (tokens)
packages/client/app/bottle/[id].tsx                          (tokens, vintage)
packages/client/src/theme/colors.ts                          (palette nova)
packages/client/src/theme/typography.ts                      (escala nova)
packages/client/src/theme/spacing.ts                         (adicionar xxxxl)
packages/client/src/theme/index.ts                           (exports)
packages/client/src/components/ui/button.tsx                 (4 variantes)
packages/client/src/components/ui/card.tsx                   (parchment, interactive)
packages/client/src/components/ui/badge.tsx                  (outline, label)
packages/client/src/components/maturation-bar.tsx            (hairline + markers)
packages/client/src/components/bottle-cell.tsx               (tokens, vintage)
packages/client/src/components/cellar-grid.tsx               (tokens)
packages/client/src/components/recent-bottles.tsx            (tokens)
packages/client/src/components/suggestion-card.tsx           (tokens)
packages/client/src/components/alert-card.tsx                (tokens)
packages/client/src/components/filter-bar.tsx               (tokens)
packages/client/src/components/tab-icons.tsx                 (refino)
packages/client/app.json                                     (splash, icon)
```

### Arquivos removidos (final)
```
packages/client/app/dev/showcase.tsx                         (após chunk 2)
```

---

## CHUNK 1 — Foundation Tokens

### Task 1.1: Instalar fontes Fraunces e Inter

**Files:**
- Modify: `packages/client/package.json`

- [ ] **Step 1: Instalar pacotes via npm (workspace)**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm install --workspace=@vineo/mobile @expo-google-fonts/fraunces @expo-google-fonts/inter
```

Expected: pacotes adicionados em `packages/client/package.json` sem warnings de peer deps.

- [ ] **Step 2: Confirmar que Fraunces variável está disponível**

Run:
```bash
ls /Users/enzoarruda/Documents/projects/vineo/node_modules/@expo-google-fonts/fraunces/
```

Expected: lista contém arquivos como `Fraunces_300Light.ttf`, `Fraunces_400Regular.ttf`. Se contiver `Fraunces_300Light_Soft50.ttf` ou similar, a versão com axe SOFT está disponível. Anote qual versão temos.

- [ ] **Step 3: Confirmar Inter disponível**

Run:
```bash
ls /Users/enzoarruda/Documents/projects/vineo/node_modules/@expo-google-fonts/inter/
```

Expected: arquivos como `Inter_400Regular.ttf`, `Inter_500Medium.ttf`, `Inter_600SemiBold.ttf`.

- [ ] **Step 4: Commit checkpoint**

Mensagem: `chore: add fraunces and inter font packages`

---

### Task 1.2: Atualizar paleta de cores

**Files:**
- Modify: `packages/client/src/theme/colors.ts`

- [ ] **Step 1: Substituir conteúdo de `colors.ts`**

Substituir todo o arquivo `packages/client/src/theme/colors.ts` por:

```ts
export interface ColorPalette {
  bg: string
  surface: string
  surfaceAlt: string
  parchment: string
  border: string
  borderLight: string
  text: string
  textSecondary: string
  textMuted: string
  accent: string
  accentDim: string
  champagne: string
  champagneDim: string
  red: string
  redDim: string
  green: string
  greenDim: string
  amber: string
  amberDim: string
  blue: string
  blueDim: string
  white: string
  black: string
}

export const lightColors: ColorPalette = {
  bg: '#FAF9F6',
  surface: '#F5F4F1',
  surfaceAlt: '#EEEDEA',
  parchment: '#F0EBE0',
  border: '#E4E2DD',
  borderLight: '#D4D2CD',
  text: '#1C1A17',
  textSecondary: '#7A7670',
  textMuted: '#ACAAA5',
  accent: '#7A202F',
  accentDim: '#FDF2F4',
  champagne: '#B8860B',
  champagneDim: '#FEF9E7',
  red: '#C42626',
  redDim: '#FEE2E2',
  green: '#168A3F',
  greenDim: '#DCFCE7',
  amber: '#C26A06',
  amberDim: '#FEF3C7',
  blue: '#2156D1',
  blueDim: '#DBEAFE',
  white: '#FFFFFF',
  black: '#000000',
}

export const darkColors: ColorPalette = {
  bg: '#141210',
  surface: '#1E1B19',
  surfaceAlt: '#2A2622',
  parchment: '#F0EBE0',
  border: '#3A3734',
  borderLight: '#4A4744',
  text: '#EDE8E3',
  textSecondary: '#8A847E',
  textMuted: '#625D58',
  accent: '#A03B4A',
  accentDim: '#3D1018',
  champagne: '#C9A961',
  champagneDim: '#4A3508',
  red: '#D63B3B',
  redDim: '#7F1D1D',
  green: '#1FB154',
  greenDim: '#14532D',
  amber: '#D88B08',
  amberDim: '#713F12',
  blue: '#3573D8',
  blueDim: '#1E3A5F',
  white: '#FFFFFF',
  black: '#000000',
}
```

- [ ] **Step 2: Rodar typecheck**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck --workspace=@vineo/mobile
```

Expected: Pode falhar com erros do tipo `Property 'gold' does not exist` em outros arquivos que ainda usam `gold`. Anote a lista de arquivos — vamos consertar em tasks subsequentes. Erros sobre `parchment` ou `champagne` em outros arquivos são **inesperados** (são tokens novos).

- [ ] **Step 3: Buscar e listar usos de `gold` no client**

Run:
```bash
grep -rn "colors\.gold\|gold:" /Users/enzoarruda/Documents/projects/vineo/packages/client/src /Users/enzoarruda/Documents/projects/vineo/packages/client/app
```

Expected: lista de arquivos que precisam migrar de `gold` → `champagne`. Pode estar vazia.

- [ ] **Step 4: Renomear `gold` → `champagne` nos arquivos listados**

Para cada arquivo da Step 3, fazer:
- `colors.gold` → `colors.champagne`
- `colors.goldDim` → `colors.champagneDim`

- [ ] **Step 5: Rodar typecheck novamente**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck --workspace=@vineo/mobile
```

Expected: 0 erros relacionados à paleta.

- [ ] **Step 6: Commit checkpoint**

Mensagem: `feat(theme): update color palette to quiet-luxury + wine-native tokens`

---

### Task 1.3: Reescrever escala tipográfica

**Files:**
- Modify: `packages/client/src/theme/typography.ts`

- [ ] **Step 1: Substituir conteúdo de `typography.ts`**

Substituir todo o arquivo por:

```ts
import { Platform } from 'react-native'

const FRAUNCES = Platform.select({
  ios: 'Fraunces',
  android: 'Fraunces_400Regular',
  default: 'Fraunces',
})

const FRAUNCES_LIGHT = Platform.select({
  ios: 'Fraunces',
  android: 'Fraunces_300Light',
  default: 'Fraunces',
})

const INTER = Platform.select({
  ios: 'Inter',
  android: 'Inter_400Regular',
  default: 'Inter',
})

const INTER_MEDIUM = Platform.select({
  ios: 'Inter',
  android: 'Inter_500Medium',
  default: 'Inter',
})

const INTER_SEMIBOLD = Platform.select({
  ios: 'Inter',
  android: 'Inter_600SemiBold',
  default: 'Inter',
})

export type TypeRole =
  | 'monumental'
  | 'displayXl'
  | 'displayL'
  | 'displayM'
  | 'headline'
  | 'title'
  | 'body'
  | 'bodyS'
  | 'label'

export interface TypeToken {
  fontFamily: string
  fontSize: number
  lineHeight: number
  letterSpacing: number
  fontWeight: '300' | '400' | '500' | '600' | '700'
  textTransform?: 'uppercase'
}

export const type: Record<TypeRole, TypeToken> = {
  monumental: {
    fontFamily: FRAUNCES_LIGHT,
    fontSize: 96,
    lineHeight: 100,
    letterSpacing: -3,
    fontWeight: '300',
  },
  displayXl: {
    fontFamily: FRAUNCES_LIGHT,
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -1.2,
    fontWeight: '300',
  },
  displayL: {
    fontFamily: FRAUNCES_LIGHT,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.8,
    fontWeight: '300',
  },
  displayM: {
    fontFamily: FRAUNCES,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.3,
    fontWeight: '400',
  },
  headline: {
    fontFamily: FRAUNCES,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
    fontWeight: '400',
  },
  title: {
    fontFamily: INTER_SEMIBOLD,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: 0,
    fontWeight: '600',
  },
  body: {
    fontFamily: INTER,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
    fontWeight: '400',
  },
  bodyS: {
    fontFamily: INTER,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
    fontWeight: '400',
  },
  label: {
    fontFamily: INTER_MEDIUM,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.88,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
}

// Backwards-compat shim — REMOVER em chunk 5 após migrar todos usos.
export const typography = {
  fontFamily: INTER,
  fontFamilyBold: INTER_SEMIBOLD,
  sizes: {
    h1: 28,
    h2: 22,
    body: 15,
    caption: 13,
    small: 11,
    tiny: 11,
  },
  lineHeight: {
    h1: 34,
    h2: 28,
    body: 22,
    caption: 18,
    small: 14,
    tiny: 14,
  },
  weights: {
    regular: '400' as const,
    bold: '600' as const,
  },
} as const
```

> O shim mantém o app compilando enquanto migramos cada arquivo no chunk 4. Removido no chunk 5.

- [ ] **Step 2: Rodar typecheck**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck --workspace=@vineo/mobile
```

Expected: 0 erros.

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(theme): add fraunces+inter type scale with monumental token`

---

### Task 1.4: Criar tokens de motion

**Files:**
- Create: `packages/client/src/theme/motion.ts`
- Modify: `packages/client/src/theme/index.ts`

- [ ] **Step 1: Criar `motion.ts`**

Criar `packages/client/src/theme/motion.ts` com:

```ts
import { Easing } from 'react-native-reanimated'

export const motion = {
  durations: {
    instant: 100,
    fast: 200,
    base: 350,
    slow: 550,
    narrative: 750,
    breath: 8000,
  },
  easings: {
    outExpo: Easing.bezier(0.22, 1, 0.36, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    ease: Easing.bezier(0.4, 0, 0.2, 1),
  },
  stagger: {
    default: 60,
    slow: 80,
    fast: 40,
  },
} as const

export type MotionDuration = keyof typeof motion.durations
export type MotionEasing = keyof typeof motion.easings
```

- [ ] **Step 2: Exportar `motion` no `theme/index.ts`**

Modificar `packages/client/src/theme/index.ts`:

```ts
export { lightColors, darkColors } from './colors'
export type { ColorPalette } from './colors'
export { spacing } from './spacing'
export { typography, type } from './typography'
export type { TypeRole, TypeToken } from './typography'
export { motion } from './motion'
export type { MotionDuration, MotionEasing } from './motion'
export { ThemeProvider, useTheme } from './theme-context'
```

- [ ] **Step 3: Rodar typecheck**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck --workspace=@vineo/mobile
```

Expected: 0 erros.

- [ ] **Step 4: Commit checkpoint**

Mensagem: `feat(theme): add motion tokens (durations, easings, stagger)`

---

### Task 1.5: Expandir spacing

**Files:**
- Modify: `packages/client/src/theme/spacing.ts`

- [ ] **Step 1: Atualizar `spacing.ts`**

Substituir conteúdo por:

```ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  xxxxl: 80,
} as const
```

- [ ] **Step 2: Typecheck**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck --workspace=@vineo/mobile
```

Expected: 0 erros.

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(theme): add xxxxl=80 spacing for hero verticals`

---

### Task 1.6: Carregar fontes novas no root layout

**Files:**
- Modify: `packages/client/app/_layout.tsx`

- [ ] **Step 1: Substituir imports e useFonts**

Substituir as linhas 8–11 de `packages/client/app/_layout.tsx`:

```tsx
import {
  useFonts,
  Fraunces_300Light,
  Fraunces_400Regular,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces'
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter'
```

Substituir as linhas 35–38 (objeto passado para `useFonts`):

```tsx
const [fontsLoaded, fontError] = useFonts({
  Fraunces_300Light,
  Fraunces_400Regular,
  Fraunces_600SemiBold,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
})
```

> No iOS, o nome PostScript "Fraunces" e "Inter" resolvem automaticamente. No Android usamos os nomes específicos por peso (já configurado em `typography.ts`).

- [ ] **Step 2: Rodar o app**

Run em terminal separado:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run dev:mobile
```

Abrir no simulador iOS (tecla `i`). Esperado: app carrega sem crash, splash screen escondida normalmente.

- [ ] **Step 3: Verificar fontes carregadas visualmente**

Em qualquer tela do app, confirmar que o texto está renderizando. Texto em Inter terá aparência ligeiramente diferente do Public Sans (mais geométrico). Não estranhe — vamos refinar nos próximos chunks.

- [ ] **Step 4: Commit checkpoint**

Mensagem: `feat(client): load Fraunces and Inter fonts at root`

---

### Task 1.7: Validação final do Chunk 1

- [ ] **Step 1: Lint + typecheck**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck && npm run lint
```

Expected: 0 erros.

- [ ] **Step 2: App roda em iOS e Android**

Confirmar que `npm run dev:mobile` + tecla `i` (iOS) e `a` (Android) abrem o app sem crash.

> **CHECKPOINT DE REVIEW.** Antes de seguir pro chunk 2, mostrar progresso ao usuário. Aceita continuar? Quer ajustar algum token?

---

## CHUNK 2 — Componentes UI base

### Task 2.1: Refatorar `Button` com 4 variantes

**Files:**
- Modify: `packages/client/src/components/ui/button.tsx`

- [ ] **Step 1: Substituir conteúdo de `button.tsx`**

Substituir todo o arquivo por:

```tsx
import { useEffect } from 'react'
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { type, motion } from '@/theme'
import { useTheme } from '@/theme'

const AnimatedView = Animated.createAnimatedComponent(View)

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'hero'

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string
  variant?: ButtonVariant
  style?: StyleProp<ViewStyle>
  chevron?: boolean
}

/**
 * Botão base do app Víneo, 4 variantes.
 * - primary: oxblood fill, texto branco
 * - secondary: outline 1px, texto primário
 * - ghost: só texto, opcional chevron
 * - hero: texto + underline 1px animado no press, sem caixa
 */
export function Button({
  title,
  variant = 'primary',
  style,
  chevron = false,
  ...props
}: ButtonProps) {
  const { colors } = useTheme()
  const pressed = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    if (variant === 'hero') {
      return { opacity: interpolate(pressed.value, [0, 1], [1, 0.6]) }
    }
    return {
      opacity: interpolate(pressed.value, [0, 1], [1, 0.85]),
      transform: [
        { scale: interpolate(pressed.value, [0, 1], [1, 0.98]) },
      ],
    }
  })

  const underlineStyle = useAnimatedStyle(() => ({
    width: `${interpolate(pressed.value, [0, 1], [40, 100])}%`,
  }))

  if (variant === 'hero') {
    return (
      <Pressable
        onPressIn={() => {
          pressed.value = withTiming(1, { duration: motion.durations.fast })
        }}
        onPressOut={() => {
          pressed.value = withTiming(0, { duration: motion.durations.fast })
        }}
        accessibilityRole="button"
        accessibilityLabel={title}
        {...props}
      >
        <AnimatedView style={[{ alignItems: 'center' }, animatedStyle, style]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Text
              style={{
                ...type.title,
                color: colors.text,
              }}
            >
              {title}
            </Text>
            {chevron && (
              <Text style={{ ...type.title, color: colors.text }}>›</Text>
            )}
          </View>
          <View style={{ height: 8 }} />
          <Animated.View
            style={[
              {
                height: 1,
                backgroundColor: colors.text,
                opacity: 0.6,
              },
              underlineStyle,
            ]}
          />
        </AnimatedView>
      </Pressable>
    )
  }

  const variantViewStyle: Record<Exclude<ButtonVariant, 'hero'>, ViewStyle> = {
    primary: { backgroundColor: colors.accent },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    ghost: { backgroundColor: 'transparent' },
  }

  const textColor: Record<Exclude<ButtonVariant, 'hero'>, string> = {
    primary: colors.white,
    secondary: colors.text,
    ghost: colors.text,
  }

  return (
    <Pressable
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: motion.durations.fast })
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: motion.durations.fast })
      }}
      accessibilityRole="button"
      accessibilityLabel={title}
      {...props}
    >
      <AnimatedView
        style={[
          {
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          },
          variantViewStyle[variant],
          animatedStyle,
          style,
        ]}
      >
        <Text
          style={{
            ...type.title,
            color: textColor[variant],
            letterSpacing: 0.6,
          }}
        >
          {title}
        </Text>
      </AnimatedView>
    </Pressable>
  )
}
```

- [ ] **Step 2: Typecheck**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck --workspace=@vineo/mobile
```

Expected: 0 erros.

- [ ] **Step 3: Verificar visual em qualquer tela existente que use Button**

Rodar app, ir no onboarding (welcome screen). O botão "Começar" agora tem nova tipografia e radius 10. Confirmar que renderiza sem crash.

- [ ] **Step 4: Commit checkpoint**

Mensagem: `feat(ui): refactor Button with 4 variants + motion press`

---

### Task 2.2: Refatorar `Card` com variante parchment

**Files:**
- Modify: `packages/client/src/components/ui/card.tsx`

- [ ] **Step 1: Substituir conteúdo**

```tsx
import type { ReactNode } from 'react'
import { Pressable, View, type ViewStyle, type StyleProp } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { motion, useTheme } from '@/theme'

type CardVariant = 'surface' | 'parchment'

interface CardProps {
  children: ReactNode
  variant?: CardVariant
  interactive?: boolean
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

/**
 * Container base do app. Variantes:
 * - surface (default): fundo escuro com border sutil
 * - parchment: fundo cream, texto invertido (momentos premium)
 *
 * Se interactive=true, ativa motion press (scale 0.99 + opacity).
 */
export function Card({
  children,
  variant = 'surface',
  interactive = false,
  onPress,
  style,
}: CardProps) {
  const { colors } = useTheme()
  const pressed = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pressed.value, [0, 1], [1, 0.95]),
    transform: [{ scale: interpolate(pressed.value, [0, 1], [1, 0.99]) }],
  }))

  const bg = variant === 'parchment' ? colors.parchment : colors.surface
  const borderColor = variant === 'parchment' ? 'transparent' : colors.border

  const inner = (
    <Animated.View
      style={[
        {
          backgroundColor: bg,
          borderWidth: variant === 'parchment' ? 0 : 1,
          borderColor,
          borderRadius: 12,
          padding: spacing.lg,
          opacity: variant === 'parchment' ? 1 : 0.95,
        },
        interactive ? animatedStyle : null,
        style,
      ]}
    >
      {children}
    </Animated.View>
  )

  if (!interactive || !onPress) {
    return <View>{inner}</View>
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: motion.durations.fast })
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: motion.durations.fast })
      }}
    >
      {inner}
    </Pressable>
  )
}
```

- [ ] **Step 2: Typecheck e visual**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck --workspace=@vineo/mobile
```

Confirmar app não crasha em telas que usam Card (home, cellar).

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(ui): Card adds parchment variant + interactive prop`

---

### Task 2.3: Refatorar `Badge` para outline + label style

**Files:**
- Modify: `packages/client/src/components/ui/badge.tsx`

- [ ] **Step 1: Substituir conteúdo**

```tsx
import { View, Text } from 'react-native'
import { type, useTheme } from '@/theme'

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

/**
 * Badge estilo outline 1px + label uppercase.
 * Usado para estado (success/warning/error/info) ou neutro (neutral).
 */
export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const { colors } = useTheme()

  const color: Record<BadgeVariant, string> = {
    success: colors.green,
    warning: colors.amber,
    error: colors.red,
    info: colors.blue,
    neutral: colors.textSecondary,
  }[variant] && (() => {
    const map: Record<BadgeVariant, string> = {
      success: colors.green,
      warning: colors.amber,
      error: colors.red,
      info: colors.blue,
      neutral: colors.textSecondary,
    }
    return map
  })() ? {
    success: colors.green,
    warning: colors.amber,
    error: colors.red,
    info: colors.blue,
    neutral: colors.textSecondary,
  }[variant] : colors.textSecondary

  const resolved: Record<BadgeVariant, string> = {
    success: colors.green,
    warning: colors.amber,
    error: colors.red,
    info: colors.blue,
    neutral: colors.textSecondary,
  }

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: resolved[variant],
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          ...type.label,
          color: resolved[variant],
        }}
      >
        {label}
      </Text>
    </View>
  )
}
```

> **Nota:** o bloco `[variant] && (() => {...})()` acima está errado — limpar para esta versão final:

Versão final correta a usar:

```tsx
import { View, Text } from 'react-native'
import { type, useTheme } from '@/theme'

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

/**
 * Badge estilo outline 1px + label uppercase.
 */
export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const { colors } = useTheme()

  const color: Record<BadgeVariant, string> = {
    success: colors.green,
    warning: colors.amber,
    error: colors.red,
    info: colors.blue,
    neutral: colors.textSecondary,
  }

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: color[variant],
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ ...type.label, color: color[variant] }}>{label}</Text>
    </View>
  )
}
```

Use **esta segunda versão**. Ignore a primeira que tem erro proposital de exemplo.

- [ ] **Step 2: Typecheck**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck --workspace=@vineo/mobile
```

Expected: 0 erros.

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(ui): Badge outline+label style with neutral variant`

---

### Task 2.4: Criar `VMonogram`

**Files:**
- Create: `packages/client/src/components/ui/v-monogram.tsx`

- [ ] **Step 1: Instalar react-native-svg se faltar**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm list react-native-svg --workspace=@vineo/mobile
```

Se não instalado:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npx expo install react-native-svg --workspace=@vineo/mobile
```

- [ ] **Step 2: Criar componente**

Criar `packages/client/src/components/ui/v-monogram.tsx`:

```tsx
import { useEffect } from 'react'
import { Text, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated'
import { type, motion, useTheme } from '@/theme'

interface VMonogramProps {
  size?: number
  color?: string
  weight?: 'light' | 'regular'
  animate?: 'reveal' | 'fade' | 'none'
  delay?: number
}

/**
 * V Monograma — brand mark do Víneo, usando glyph V de Fraunces.
 * - reveal: fade-in suave (proxy de stroke-reveal — implementação SVG path
 *   pode vir depois sem mudar API).
 * - fade: fade-in simples
 * - none: imediato
 */
export function VMonogram({
  size = 56,
  color,
  weight = 'light',
  animate = 'none',
  delay = 0,
}: VMonogramProps) {
  const { colors } = useTheme()
  const opacity = useSharedValue(animate === 'none' ? 1 : 0)

  useEffect(() => {
    if (animate === 'reveal') {
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: motion.durations.narrative + 150,
          easing: motion.easings.outExpo,
        }),
      )
    } else if (animate === 'fade') {
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: motion.durations.base,
          easing: motion.easings.outExpo,
        }),
      )
    } else {
      opacity.value = 1
    }
  }, [animate, delay, opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  const familyToken = weight === 'light' ? type.monumental : type.displayM

  return (
    <Animated.View style={animatedStyle}>
      <Text
        accessibilityLabel="Víneo"
        style={{
          fontFamily: familyToken.fontFamily,
          fontSize: size,
          lineHeight: size * 1.05,
          letterSpacing: size * -0.03,
          color: color ?? colors.text,
        }}
      >
        V
      </Text>
    </Animated.View>
  )
}
```

> Implementação inicial usa fade-in como proxy do stroke-reveal — a API `animate="reveal"` permite trocar pra SVG path animado depois sem quebrar consumidores.

- [ ] **Step 3: Typecheck**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck --workspace=@vineo/mobile
```

Expected: 0 erros.

- [ ] **Step 4: Commit checkpoint**

Mensagem: `feat(ui): add VMonogram brand mark component`

---

### Task 2.5: Criar `Hairline`

**Files:**
- Create: `packages/client/src/components/ui/hairline.tsx`

- [ ] **Step 1: Criar componente**

```tsx
import { useEffect } from 'react'
import { View, Text, type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated'
import { type, motion, useTheme } from '@/theme'

interface Marker {
  position: number // 0..1
  label?: string
}

interface HairlineProps {
  width?: number | 'full'
  color?: string
  opacity?: number
  markers?: Marker[]
  animate?: 'grow' | 'none'
  delay?: number
  style?: StyleProp<ViewStyle>
}

/**
 * Hairline 1px com markers opcionais.
 * Motif secundário (eixo do tempo).
 */
export function Hairline({
  width = 'full',
  color,
  opacity = 1,
  markers = [],
  animate = 'none',
  delay = 0,
  style,
}: HairlineProps) {
  const { colors } = useTheme()
  const lineColor = color ?? colors.border
  const progress = useSharedValue(animate === 'none' ? 1 : 0)

  useEffect(() => {
    if (animate === 'grow') {
      progress.value = withDelay(
        delay,
        withTiming(1, {
          duration: motion.durations.narrative + 450,
          easing: motion.easings.outExpo,
        }),
      )
    } else {
      progress.value = 1
    }
  }, [animate, delay, progress])

  const lineStyle = useAnimatedStyle(() => ({
    width: typeof width === 'number'
      ? interpolate(progress.value, [0, 1], [0, width])
      : `${interpolate(progress.value, [0, 1], [0, 100])}%`,
  }))

  return (
    <View
      style={[
        { width: width === 'full' ? '100%' : width, alignItems: 'flex-start' },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            height: 1,
            backgroundColor: lineColor,
            opacity,
          },
          lineStyle,
        ]}
      />
      {markers.length > 0 && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
          }}
        >
          {markers.map((m, i) => (
            <MarkerDot
              key={i}
              position={m.position}
              label={m.label}
              color={colors.accent}
              delay={delay + 300 + i * motion.stagger.default}
              show={animate === 'none'}
            />
          ))}
        </View>
      )}
    </View>
  )
}

function MarkerDot({
  position,
  label,
  color,
  delay,
  show,
}: {
  position: number
  label?: string
  color: string
  delay: number
  show: boolean
}) {
  const opacity = useSharedValue(show ? 1 : 0)
  const { colors } = useTheme()

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: motion.durations.base,
        easing: motion.easings.outExpo,
      }),
    )
  }, [delay, opacity])

  const dotStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: `${position * 100}%`,
          top: -1.5,
          alignItems: 'center',
          transform: [{ translateX: -2 }],
        },
        dotStyle,
      ]}
    >
      <View
        style={{
          width: 4,
          height: 4,
          backgroundColor: color,
          borderRadius: 2,
        }}
      />
      {label && (
        <Text
          style={{
            ...type.label,
            color: colors.textMuted,
            marginTop: 6,
          }}
        >
          {label}
        </Text>
      )}
    </Animated.View>
  )
}
```

- [ ] **Step 2: Typecheck**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck --workspace=@vineo/mobile
```

Expected: 0 erros.

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(ui): add Hairline with optional markers + grow animation`

---

### Task 2.6: Criar `Hero`

**Files:**
- Create: `packages/client/src/components/ui/hero.tsx`

- [ ] **Step 1: Criar componente**

```tsx
import { useEffect } from 'react'
import { View, Text, type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { type, motion, useTheme } from '@/theme'

interface HeroProps {
  eyebrow?: string
  title: string
  subtitle?: string
  titleVariant?: 'displayM' | 'displayL'
  style?: StyleProp<ViewStyle>
  animateIn?: boolean
}

/**
 * Header vertical-stacked com stagger automático na entrada.
 * Slots: eyebrow → title → subtitle (60ms stagger).
 */
export function Hero({
  eyebrow,
  title,
  subtitle,
  titleVariant = 'displayM',
  style,
  animateIn = true,
}: HeroProps) {
  const { colors } = useTheme()

  return (
    <View style={[{ gap: spacing.sm }, style]}>
      {eyebrow && (
        <Slot delay={0} animateIn={animateIn}>
          <Text style={{ ...type.label, color: colors.textMuted }}>
            {eyebrow}
          </Text>
        </Slot>
      )}
      <Slot delay={animateIn && eyebrow ? motion.stagger.default : 0} animateIn={animateIn}>
        <Text style={{ ...type[titleVariant], color: colors.text }}>
          {title}
        </Text>
      </Slot>
      {subtitle && (
        <Slot
          delay={
            animateIn
              ? (eyebrow ? 1 : 0) * motion.stagger.default + motion.stagger.default
              : 0
          }
          animateIn={animateIn}
        >
          <Text
            style={{
              ...type.body,
              color: colors.textSecondary,
            }}
          >
            {subtitle}
          </Text>
        </Slot>
      )}
    </View>
  )
}

function Slot({
  children,
  delay,
  animateIn,
}: {
  children: React.ReactNode
  delay: number
  animateIn: boolean
}) {
  const progress = useSharedValue(animateIn ? 0 : 1)

  useEffect(() => {
    if (animateIn) {
      progress.value = withDelay(
        delay,
        withTiming(1, {
          duration: motion.durations.base,
          easing: motion.easings.outExpo,
        }),
      )
    }
  }, [animateIn, delay, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: interpolate(progress.value, [0, 1], [6, 0]) }],
  }))

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}
```

- [ ] **Step 2: Typecheck**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck --workspace=@vineo/mobile
```

Expected: 0 erros.

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(ui): add Hero with eyebrow/title/subtitle stagger`

---

### Task 2.7: Criar `EditorialInput`

**Files:**
- Create: `packages/client/src/components/ui/editorial-input.tsx`

- [ ] **Step 1: Criar componente**

```tsx
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
 * Input editorial: sem caixa, label uppercase acima, texto em Fraunces 22pt,
 * underline 1px que vira 2px accent no focus.
 */
export function EditorialInput({
  label,
  containerStyle,
  ...inputProps
}: EditorialInputProps) {
  const { colors } = useTheme()
  const [focused, setFocused] = useState(false)
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
```

- [ ] **Step 2: Typecheck**

Expected: 0 erros.

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(ui): add EditorialInput with animated underline focus`

---

### Task 2.8: Criar `Counter` com gesture handler

**Files:**
- Create: `packages/client/src/components/ui/counter.tsx`

- [ ] **Step 1: Criar componente**

```tsx
import { useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import * as Haptics from 'expo-haptics'
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
  interpolate,
} from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { type, motion, useTheme } from '@/theme'

interface CounterProps {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  variant?: 'hero' | 'compact'
  hint?: boolean
}

const STEP_PX = 40

/**
 * Counter gestural — swipe horizontal pra ajustar (40px = 1 unidade).
 * Tap nos chevrons laterais também funciona (visibles só se hint=true).
 *
 * Hero: número em type.monumental (96pt).
 * Compact: número em type.displayXl (56pt).
 */
export function Counter({
  value,
  min,
  max,
  onChange,
  variant = 'hero',
  hint = false,
}: CounterProps) {
  const { colors } = useTheme()
  const dragAccum = useSharedValue(0)
  const numberOpacity = useSharedValue(1)
  const numberTy = useSharedValue(0)

  const fireHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
  }

  const applyDelta = (delta: number) => {
    if (delta === 0) return
    const next = Math.max(min, Math.min(max, value + delta))
    if (next === value) return

    // out animation
    numberOpacity.value = withSequence(
      withTiming(0, { duration: motion.durations.fast, easing: motion.easings.outExpo }),
      withTiming(1, { duration: motion.durations.base - 100, easing: motion.easings.outExpo }),
    )
    numberTy.value = withSequence(
      withTiming(-12, { duration: motion.durations.fast, easing: motion.easings.outExpo }),
      withTiming(12, { duration: 0 }),
      withTiming(0, { duration: motion.durations.base - 100, easing: motion.easings.outExpo }),
    )

    fireHaptic()
    onChange(next)
  }

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      'worklet'
      dragAccum.value += e.changeX
      const steps = Math.trunc(dragAccum.value / STEP_PX)
      if (steps !== 0) {
        dragAccum.value -= steps * STEP_PX
        runOnJS(applyDelta)(steps)
      }
    })
    .onEnd(() => {
      'worklet'
      dragAccum.value = 0
    })

  const numberStyle = useAnimatedStyle(() => ({
    opacity: numberOpacity.value,
    transform: [{ translateY: numberTy.value }],
  }))

  const numberToken = variant === 'hero' ? type.monumental : type.displayXl

  return (
    <View style={{ alignItems: 'center', gap: spacing.md }}>
      <GestureDetector gesture={pan}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
          {hint && (
            <Pressable
              onPress={() => applyDelta(-1)}
              accessibilityLabel="Diminuir"
              hitSlop={20}
            >
              <Text
                style={{
                  ...type.title,
                  color: colors.textMuted,
                  opacity: 0.4,
                }}
              >
                ‹
              </Text>
            </Pressable>
          )}
          <Animated.View style={numberStyle}>
            <Text
              style={{
                ...numberToken,
                color: colors.text,
                minWidth: variant === 'hero' ? 100 : 70,
                textAlign: 'center',
              }}
              accessibilityLiveRegion="polite"
            >
              {value}
            </Text>
          </Animated.View>
          {hint && (
            <Pressable
              onPress={() => applyDelta(1)}
              accessibilityLabel="Aumentar"
              hitSlop={20}
            >
              <Text
                style={{
                  ...type.title,
                  color: colors.textMuted,
                  opacity: 0.4,
                }}
              >
                ›
              </Text>
            </Pressable>
          )}
        </View>
      </GestureDetector>
    </View>
  )
}
```

- [ ] **Step 2: Typecheck**

Expected: 0 erros.

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(ui): add gestural Counter with haptic feedback`

---

### Task 2.9: Criar `AmbientGradient`

**Files:**
- Create: `packages/client/src/components/ui/ambient-gradient.tsx`

- [ ] **Step 1: Confirmar expo-linear-gradient instalado**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm list expo-linear-gradient --workspace=@vineo/mobile
```

Se não instalado:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npx expo install expo-linear-gradient --workspace=@vineo/mobile
```

- [ ] **Step 2: Criar componente**

```tsx
import { useEffect } from 'react'
import { StyleSheet, useReducedMotion } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated'
import { motion, useTheme } from '@/theme'

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient)

interface AmbientGradientProps {
  overlayOpacity?: number
}

/**
 * Background gradient warm que respira lentamente (loop 8s).
 * Pensado pra ficar montado no `_layout` de onboarding persistindo entre telas.
 * Desabilita breathing se useReducedMotion.
 */
export function AmbientGradient({ overlayOpacity = 0 }: AmbientGradientProps) {
  const { colors } = useTheme()
  const reduceMotion = useReducedMotion()
  const breath = useSharedValue(0.4)
  const overlay = useSharedValue(overlayOpacity)

  useEffect(() => {
    overlay.value = withTiming(overlayOpacity, {
      duration: motion.durations.slow,
    })
  }, [overlayOpacity, overlay])

  useEffect(() => {
    if (reduceMotion) {
      breath.value = 0.6
      return
    }
    breath.value = withRepeat(
      withSequence(
        withTiming(0.8, {
          duration: motion.durations.breath / 2,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(0.4, {
          duration: motion.durations.breath / 2,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      false,
    )
  }, [reduceMotion, breath])

  const breathStyle = useAnimatedStyle(() => ({
    opacity: breath.value,
  }))

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlay.value,
  }))

  return (
    <>
      <LinearGradient
        colors={[colors.bg, colors.bg]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[StyleSheet.absoluteFill, breathStyle]}>
        <LinearGradient
          colors={[colors.accentDim, colors.bg]}
          locations={[0, 0.7]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.black },
          overlayStyle,
        ]}
      />
    </>
  )
}
```

- [ ] **Step 3: Typecheck**

Expected: 0 erros.

- [ ] **Step 4: Commit checkpoint**

Mensagem: `feat(ui): add AmbientGradient breathing background`

---

### Task 2.10: Criar `StaggerGroup`

**Files:**
- Create: `packages/client/src/components/ui/stagger-group.tsx`

- [ ] **Step 1: Criar componente**

```tsx
import { Children, cloneElement, isValidElement, useEffect } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated'
import { motion } from '@/theme'

interface StaggerGroupProps {
  children: React.ReactNode
  delay?: number
  stagger?: number
  enabled?: boolean
}

/**
 * Aplica entrada fade+slide-up sequencial nos filhos diretos.
 * delay = ms antes do primeiro filho entrar.
 * stagger = ms entre cada filho. Default 60.
 */
export function StaggerGroup({
  children,
  delay = 0,
  stagger = motion.stagger.default,
  enabled = true,
}: StaggerGroupProps) {
  const items = Children.toArray(children).filter(isValidElement)
  return (
    <>
      {items.map((child, i) => (
        <StaggerItem
          key={i}
          delay={delay + i * stagger}
          enabled={enabled}
        >
          {child}
        </StaggerItem>
      ))}
    </>
  )
}

function StaggerItem({
  children,
  delay,
  enabled,
}: {
  children: React.ReactNode
  delay: number
  enabled: boolean
}) {
  const progress = useSharedValue(enabled ? 0 : 1)

  useEffect(() => {
    if (enabled) {
      progress.value = withDelay(
        delay,
        withTiming(1, {
          duration: motion.durations.base,
          easing: motion.easings.outExpo,
        }),
      )
    }
  }, [delay, enabled, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: interpolate(progress.value, [0, 1], [6, 0]) }],
  }))

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}
```

- [ ] **Step 2: Typecheck**

Expected: 0 erros.

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(ui): add StaggerGroup utility wrapper`

---

### Task 2.11: Showcase descartável `/dev/showcase`

**Files:**
- Create: `packages/client/app/dev/showcase.tsx`

- [ ] **Step 1: Criar tela showcase**

```tsx
import { ScrollView, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Hairline } from '@/components/ui/hairline'
import { VMonogram } from '@/components/ui/v-monogram'
import { Hero } from '@/components/ui/hero'
import { EditorialInput } from '@/components/ui/editorial-input'
import { useState } from 'react'
import { Counter } from '@/components/ui/counter'

export default function Showcase() {
  const { colors } = useTheme()
  const [name, setName] = useState('')
  const [count, setCount] = useState(1)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.xxl, gap: spacing.xxxl }}>
        <Text style={{ ...type.label, color: colors.textMuted }}>SHOWCASE</Text>

        <View style={{ gap: spacing.md }}>
          <Text style={{ ...type.label, color: colors.textMuted }}>V MONOGRAM</Text>
          <View style={{ flexDirection: 'row', gap: spacing.xxl, alignItems: 'flex-end' }}>
            <VMonogram size={96} weight="light" />
            <VMonogram size={56} weight="light" />
            <VMonogram size={24} weight="regular" color={colors.textSecondary} />
          </View>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={{ ...type.label, color: colors.textMuted }}>HAIRLINE</Text>
          <Hairline />
          <Hairline width={120} color={colors.accent} opacity={0.5} />
          <Hairline
            markers={[
              { position: 0.2, label: 'MIN' },
              { position: 0.6, label: 'AGORA' },
              { position: 0.9, label: 'PICO' },
            ]}
          />
        </View>

        <View style={{ gap: spacing.md }}>
          <Hero
            eyebrow="EXEMPLO"
            title="Como devemos chamá-la?"
            subtitle="Sem caixa, com underline animado."
          />
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={{ ...type.label, color: colors.textMuted }}>EDITORIAL INPUT</Text>
          <EditorialInput
            label="NOME DA ADEGA"
            value={name}
            onChangeText={setName}
            placeholder="Ex: Adega Principal"
          />
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={{ ...type.label, color: colors.textMuted }}>COUNTER (HERO)</Text>
          <Counter value={count} min={1} max={10} onChange={setCount} variant="hero" hint />
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={{ ...type.label, color: colors.textMuted }}>BUTTONS</Text>
          <Button title="Continuar" variant="primary" />
          <Button title="Cancelar" variant="secondary" />
          <Button title="Pular" variant="ghost" />
          <Button title="Começar" variant="hero" chevron />
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={{ ...type.label, color: colors.textMuted }}>CARDS</Text>
          <Card>
            <Text style={{ ...type.title, color: colors.text }}>Surface card</Text>
            <Text style={{ ...type.body, color: colors.textSecondary }}>
              Cartão padrão escuro.
            </Text>
          </Card>
          <Card variant="parchment">
            <Text style={{ ...type.title, color: '#1C1A17' }}>Parchment</Text>
            <Text style={{ ...type.body, color: '#7A7670' }}>
              Momento premium.
            </Text>
          </Card>
          <Card interactive onPress={() => {}}>
            <Text style={{ ...type.title, color: colors.text }}>Interactive</Text>
          </Card>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={{ ...type.label, color: colors.textMuted }}>BADGES</Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
            <Badge label="Success" variant="success" />
            <Badge label="Warning" variant="warning" />
            <Badge label="Error" variant="error" />
            <Badge label="Info" variant="info" />
            <Badge label="Neutral" variant="neutral" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
```

- [ ] **Step 2: Abrir showcase no simulador**

Rodar app, navegar manualmente para `/dev/showcase` (digitar URL no dev menu ou usar Linking).

Validar visualmente:
- V monogram em 3 tamanhos sem distorção
- Hairlines renderizam, com markers e labels
- Hero stagger entra suave
- EditorialInput: digitar; underline gross + cor accent no focus
- Counter: arrastar horizontal funciona; chevrons funcionam; haptic dispara em device físico
- Buttons: 4 variantes; hero tem underline sem caixa
- Cards: 3 variantes; interactive responde ao press
- Badges: 5 variantes outline

- [ ] **Step 3: Anotar bugs / ajustes necessários**

Se algo está estranho, abrir o arquivo do componente e ajustar. Anotar mudanças.

- [ ] **Step 4: Commit checkpoint**

Mensagem: `chore(dev): add temporary UI showcase screen`

> **CHECKPOINT DE REVIEW.** Mostrar showcase ao usuário, validar visualmente. Continuar pro chunk 3 quando aprovado.

---

## CHUNK 3 — Onboarding Storyboard A

### Task 3.1: Inserir `AmbientGradient` no `_layout` de onboarding

**Files:**
- Modify: `packages/client/app/onboarding/_layout.tsx`

- [ ] **Step 1: Substituir conteúdo**

```tsx
import { View } from 'react-native'
import { Stack } from 'expo-router'
import { AmbientGradient } from '@/components/ui/ambient-gradient'
import { useTheme } from '@/theme'

export default function OnboardingLayout() {
  const { colors } = useTheme()

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AmbientGradient />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
          animationDuration: 550,
        }}
      />
    </View>
  )
}
```

> Mudamos `slide_from_right` → `fade` (cross-dissolve nativo). A exceção do slide entre setups vai dentro da própria tela 4 (não no layout).

- [ ] **Step 2: Confirmar app roda e fundo escuro respira**

Iniciar `npm run dev:mobile`, abrir onboarding. Confirmar gradient warm pulsando suavemente.

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(onboarding): persistent ambient gradient + cross-dissolve layout`

---

### Task 3.2: Reescrever `welcome.tsx` (Tela 1)

**Files:**
- Modify: `packages/client/app/onboarding/welcome.tsx`

- [ ] **Step 1: Substituir conteúdo**

```tsx
import { useEffect } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  interpolate,
} from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { type, motion, useTheme } from '@/theme'
import { Button } from '@/components/ui/button'
import { VMonogram } from '@/components/ui/v-monogram'
import { Hairline } from '@/components/ui/hairline'

export default function WelcomeScreen() {
  const { colors } = useTheme()
  const ineoProgress = useSharedValue(0)

  useEffect(() => {
    ineoProgress.value = withDelay(
      900,
      withTiming(1, {
        duration: motion.durations.base,
        easing: motion.easings.outExpo,
      }),
    )
  }, [ineoProgress])

  const ineoStyle = useAnimatedStyle(() => ({
    opacity: ineoProgress.value,
    transform: [{ translateY: interpolate(ineoProgress.value, [0, 1], [8, 0]) }],
  }))

  function handleStart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
    router.push('/onboarding/intent')
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: spacing.xxl, justifyContent: 'space-between' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <VMonogram size={96} weight="light" animate="reveal" delay={200} />
            <Animated.Text
              style={[
                {
                  ...type.monumental,
                  color: colors.text,
                },
                ineoStyle,
              ]}
            >
              íneo
            </Animated.Text>
          </View>

          <Hairline
            width={180}
            color={colors.accent}
            opacity={0.5}
            animate="grow"
            delay={1500}
            style={{ alignItems: 'center' }}
          />

          <DelayedFade delay={1700}>
            <Text style={{ ...type.label, color: colors.textMuted }}>EST. 2026</Text>
          </DelayedFade>

          <DelayedFade delay={1900}>
            <Text
              style={{
                ...type.title,
                color: colors.textSecondary,
                textAlign: 'center',
                fontFamily: type.body.fontFamily,
                fontWeight: '400',
              }}
            >
              Onde o tempo se torna sabor.
            </Text>
          </DelayedFade>
        </View>

        <DelayedFade delay={2400}>
          <View style={{ paddingBottom: spacing.xxxl, alignItems: 'center' }}>
            <Button title="Começar" variant="hero" chevron onPress={handleStart} />
          </View>
        </DelayedFade>
      </View>
    </SafeAreaView>
  )
}

function DelayedFade({ delay, children }: { delay: number; children: React.ReactNode }) {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: motion.durations.base,
        easing: motion.easings.outExpo,
      }),
    )
  }, [delay, progress])

  const style = useAnimatedStyle(() => ({ opacity: progress.value }))
  return <Animated.View style={style}>{children}</Animated.View>
}
```

- [ ] **Step 2: Visual check**

Rodar app, abrir onboarding. Esperado:
- V aparece via fade (proxy do stroke-reveal)
- "íneo" aparece à direita após ~900ms
- Hairline accent cresce sob wordmark
- Eyebrow + subtitle aparecem em sequência
- Botão hero "Começar" + chevron por último

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(onboarding): rewrite welcome with V reveal + staged copy`

---

### Task 3.3: Criar tela `intent` (Tela 2)

**Files:**
- Create: `packages/client/app/onboarding/intent.tsx`

- [ ] **Step 1: Criar tela**

```tsx
import { useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  interpolate,
} from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { type, motion, useTheme } from '@/theme'
import { Hairline } from '@/components/ui/hairline'

export default function IntentScreen() {
  const { colors } = useTheme()

  function handleAdvance() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
    router.push('/onboarding/cellar-count')
  }

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={handleAdvance}
      accessibilityRole="button"
      accessibilityLabel="Continuar"
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing.xxl,
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1, justifyContent: 'center', gap: spacing.xxl }}>
            <Reveal delay={0}>
              <Text style={{ ...type.displayM, color: colors.text }}>
                Toda garrafa carrega
              </Text>
            </Reveal>
            <Reveal delay={motion.stagger.slow}>
              <Text style={{ ...type.displayL, color: colors.text }}>
                um momento.
              </Text>
            </Reveal>
            <Reveal delay={motion.stagger.slow * 2}>
              <Hairline width={40} color={colors.accent} opacity={0.4} />
            </Reveal>
            <Reveal delay={motion.stagger.slow * 3}>
              <View>
                <Text style={{ ...type.body, color: colors.textSecondary }}>
                  Vamos te ajudar a
                </Text>
                <Text style={{ ...type.body, color: colors.textSecondary }}>
                  não perdê-lo.
                </Text>
              </View>
            </Reveal>
          </View>

          <Reveal delay={motion.stagger.slow * 5}>
            <View style={{ paddingBottom: spacing.xxxl, alignItems: 'center' }}>
              <Text
                style={{
                  ...type.label,
                  color: colors.textMuted,
                  opacity: 0.5,
                }}
              >
                TOQUE EM QUALQUER LUGAR
              </Text>
            </View>
          </Reveal>
        </View>
      </SafeAreaView>
    </Pressable>
  )
}

function Reveal({ delay, children }: { delay: number; children: React.ReactNode }) {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: motion.durations.base + 50,
        easing: motion.easings.outExpo,
      }),
    )
  }, [delay, progress])

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: interpolate(progress.value, [0, 1], [6, 0]) }],
  }))

  return <Animated.View style={style}>{children}</Animated.View>
}
```

- [ ] **Step 2: Visual check**

Confirmar tela carrega via tap em "Começar" da welcome. Stagger entrada de 4 reveals. Tap em qualquer lugar avança.

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(onboarding): add intent screen — poetic interstitial`

---

### Task 3.4: Reescrever `cellar-count.tsx` (Tela 3)

**Files:**
- Modify: `packages/client/app/onboarding/cellar-count.tsx`

- [ ] **Step 1: Substituir conteúdo**

```tsx
import { useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { spacing } from '@/theme/spacing'
import { useTheme } from '@/theme'
import { Button } from '@/components/ui/button'
import { Hero } from '@/components/ui/hero'
import { Counter } from '@/components/ui/counter'
import { Hairline } from '@/components/ui/hairline'

const MAX = 10
const MIN = 1

export default function CellarCountScreen() {
  const [count, setCount] = useState(1)
  const { colors } = useTheme()

  function handleNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
    router.push(`/onboarding/cellar-setup?index=0&total=${count}`)
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.xxl,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ paddingTop: spacing.xxxl, gap: spacing.huge }}>
          <Hero
            eyebrow="PASSO 1 DE 2"
            title="Quantas adegas você tem?"
            subtitle="Vamos configurar cada uma."
            titleVariant="displayM"
          />

          <View style={{ alignItems: 'center', gap: spacing.lg }}>
            <Counter
              value={count}
              min={MIN}
              max={MAX}
              onChange={setCount}
              variant="hero"
              hint
            />
            <Hairline width={80} color={colors.accent} opacity={0.5} />
          </View>
        </View>

        <View style={{ paddingBottom: spacing.xxxl, alignItems: 'center' }}>
          <Button title="Continuar" variant="hero" chevron onPress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  )
}
```

- [ ] **Step 2: Visual check**

Iniciar onboarding completo. Na tela 3, confirmar:
- Hero stagger entra
- Counter aceita swipe horizontal e tap nos chevrons
- Haptic dispara (em device)
- Hairline accent sob o número
- Botão hero "Continuar"

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(onboarding): rewrite cellar-count with gestural Counter + Hero`

---

### Task 3.5: Reescrever `cellar-setup.tsx` (Tela 4)

**Files:**
- Modify: `packages/client/app/onboarding/cellar-setup.tsx`

- [ ] **Step 1: Substituir conteúdo**

```tsx
import { useMemo, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Button } from '@/components/ui/button'
import { Hero } from '@/components/ui/hero'
import { Counter } from '@/components/ui/counter'
import { EditorialInput } from '@/components/ui/editorial-input'
import { Hairline } from '@/components/ui/hairline'
import { useUserId } from '@/lib/user-context'
import { useCreateCellar } from '@/hooks/use-cellars'

const MIN = 2
const MAX = 20
const MAX_DOTS = 80

export default function CellarSetupScreen() {
  const params = useLocalSearchParams()
  const index = parseInt(typeof params.index === 'string' ? params.index : '0', 10)
  const total = parseInt(typeof params.total === 'string' ? params.total : '1', 10)
  const names = typeof params.names === 'string' ? JSON.parse(params.names) : []

  const [name, setName] = useState<string>(names[index] || `Adega ${index + 1}`)
  const [rows, setRows] = useState(6)
  const [cols, setCols] = useState(4)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { colors } = useTheme()
  const { userId, initUser } = useUserId()
  const createCellar = useCreateCellar()

  const titleCopy = index === 0 ? 'Como devemos chamá-la?' : 'E esta?'
  const totalDots = Math.min(rows * cols, MAX_DOTS)

  async function handleNext() {
    setIsSubmitting(true)
    try {
      let currentUserId = userId
      if (!currentUserId) {
        const user = await initUser()
        currentUserId = user.id
      }
      await createCellar.mutateAsync({
        name,
        rows,
        columns: cols,
        userId: currentUserId,
      })
      const updatedNames = [...names]
      updatedNames[index] = name
      if (index + 1 < total) {
        router.replace(
          `/onboarding/cellar-setup?index=${index + 1}&total=${total}&names=${JSON.stringify(updatedNames)}`,
        )
      } else {
        router.replace('/onboarding/complete')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: spacing.xxl,
          paddingTop: spacing.xxl,
          paddingBottom: spacing.xxxl,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ gap: spacing.xxxl }}>
          <Hero
            eyebrow={`ADEGA ${index + 1} DE ${total}`}
            title={titleCopy}
            titleVariant="displayM"
          />

          <EditorialInput
            label="NOME"
            value={name}
            onChangeText={setName}
            placeholder="Adega Principal"
          />

          <View style={{ gap: spacing.lg }}>
            <Text style={{ ...type.label, color: colors.textMuted }}>DIMENSÕES</Text>
            <Hairline />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingTop: spacing.md,
              }}
            >
              <View style={{ alignItems: 'center', gap: spacing.sm }}>
                <Text style={{ ...type.label, color: colors.textMuted }}>FILEIRAS</Text>
                <Counter
                  value={rows}
                  min={MIN}
                  max={MAX}
                  onChange={setRows}
                  variant="compact"
                />
              </View>
              <View style={{ alignItems: 'center', gap: spacing.sm }}>
                <Text style={{ ...type.label, color: colors.textMuted }}>COLUNAS</Text>
                <Counter
                  value={cols}
                  min={MIN}
                  max={MAX}
                  onChange={setCols}
                  variant="compact"
                />
              </View>
            </View>
          </View>

          <View style={{ alignItems: 'center', gap: spacing.md }}>
            <View
              style={{
                flexDirection: 'row',
                gap: 3,
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: 240,
              }}
            >
              {Array.from({ length: totalDots }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 1.5,
                    backgroundColor: colors.accent,
                    opacity: 0.3,
                  }}
                />
              ))}
            </View>
            <Text style={{ ...type.bodyS, color: colors.textMuted }}>
              {rows} × {cols} posições
            </Text>
          </View>
        </View>

        <View style={{ paddingTop: spacing.xxxl, alignItems: 'center' }}>
          <Button
            title={
              isSubmitting
                ? 'Salvando…'
                : index + 1 < total
                  ? 'Próxima adega'
                  : 'Finalizar'
            }
            variant="hero"
            chevron
            disabled={isSubmitting}
            onPress={handleNext}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
```

> **Nota:** o slide horizontal entre setups (mencionado no spec) usa `router.replace` + `animation: 'fade'` herdado do layout. Implementação fiel ao slide horizontal entre re-entradas da mesma rota é mais complexa (precisa de animação custom no layout) — fica para refino se o usuário quiser. Por enquanto, cross-fade é a transição padrão.

- [ ] **Step 2: Visual check completo**

Rodar onboarding inteiro: welcome → intent → cellar-count (escolher 2 ou 3) → cellar-setup × N. Confirmar:
- Hero entra com stagger
- Editorial input sem caixa, underline anima
- Dois counters compactos
- Preview de dots com accent
- Botão hero atualiza copy entre adegas
- Última adega navega pra `/onboarding/complete`

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(onboarding): rewrite cellar-setup with EditorialInput + Counters + preview`

---

### Task 3.6: Criar tela `complete` (Tela 5)

**Files:**
- Create: `packages/client/app/onboarding/complete.tsx`

- [ ] **Step 1: Criar tela**

```tsx
import { useEffect } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { type, motion, useTheme } from '@/theme'
import { Button } from '@/components/ui/button'
import { VMonogram } from '@/components/ui/v-monogram'
import { Hairline } from '@/components/ui/hairline'

export default function CompleteScreen() {
  const { colors } = useTheme()

  function handleEnter() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {})
    router.replace('/(tabs)')
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.xxl,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg }}>
          <VMonogram size={56} weight="light" animate="reveal" delay={400} />
          <Hairline
            width={140}
            color={colors.accent}
            opacity={0.5}
            animate="grow"
            delay={600}
            style={{ alignItems: 'center' }}
          />

          <DelayedFade delay={1000}>
            <Text
              style={{
                ...type.displayM,
                color: colors.text,
                textAlign: 'center',
                marginTop: spacing.xl,
              }}
            >
              Sua adega está pronta.
            </Text>
          </DelayedFade>

          <DelayedFade delay={1300}>
            <Text
              style={{
                ...type.body,
                color: colors.textSecondary,
                textAlign: 'center',
              }}
            >
              Bem-vindo ao Víneo.
            </Text>
          </DelayedFade>
        </View>

        <DelayedFade delay={1800}>
          <View style={{ paddingBottom: spacing.xxxl, alignItems: 'center' }}>
            <Button title="Entrar" variant="hero" chevron onPress={handleEnter} />
          </View>
        </DelayedFade>
      </View>
    </SafeAreaView>
  )
}

function DelayedFade({ delay, children }: { delay: number; children: React.ReactNode }) {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: motion.durations.base,
        easing: motion.easings.outExpo,
      }),
    )
  }, [delay, progress])

  const style = useAnimatedStyle(() => ({ opacity: progress.value }))
  return <Animated.View style={style}>{children}</Animated.View>
}
```

- [ ] **Step 2: Visual check**

Rodar onboarding inteiro até final. Confirmar tela complete + tap "Entrar" navega pra tabs.

- [ ] **Step 3: Commit checkpoint**

Mensagem: `feat(onboarding): add complete screen with V monogram reveal`

---

### Task 3.7: Renomear "CaveFlow" → "Víneo" no app

- [ ] **Step 1: Buscar todas as ocorrências**

Run:
```bash
grep -rn "CaveFlow" /Users/enzoarruda/Documents/projects/vineo/packages/client /Users/enzoarruda/Documents/projects/vineo/packages/api /Users/enzoarruda/Documents/projects/vineo/packages/shared
```

- [ ] **Step 2: Substituir cada ocorrência por "Víneo"**

Para cada arquivo listado, editar a string `CaveFlow` → `Víneo`.

- [ ] **Step 3: Verificar `app.json`**

Run:
```bash
grep -n "name\|displayName\|slug" /Users/enzoarruda/Documents/projects/vineo/packages/client/app.json
```

Se `name` for "CaveFlow", trocar para "Víneo". Cuidado com `slug` (URL/identifier — pode quebrar Expo se mudar abruptamente, deixar como está por enquanto).

- [ ] **Step 4: Commit checkpoint**

Mensagem: `chore: rename CaveFlow to Víneo throughout app strings`

---

### Task 3.8: Validação final do Chunk 3

- [ ] **Step 1: Rodar app, fazer onboarding completo em device físico iOS**

Validar:
- 60fps em todas as animações
- Haptics em interações (counter, CTAs)
- Cross-dissolve entre telas (sem flash)
- Gradient respira de fundo persistindo entre telas
- "Víneo" em todos os textos

- [ ] **Step 2: Idem em Android**

Confirmar visual idêntico, sem regressões.

- [ ] **Step 3: Lint + typecheck**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck && npm run lint
```

Expected: 0 erros.

> **CHECKPOINT DE REVIEW.** Mostrar onboarding completo ao usuário. Aprovado? Seguir pro chunk 4.

---

## CHUNK 4 — App principal herda tokens

### Task 4.1: Refatorar `maturation-bar.tsx` para Hairline + markers

**Files:**
- Modify: `packages/client/src/components/maturation-bar.tsx`

- [ ] **Step 1: Ler arquivo atual**

Run:
```bash
cat /Users/enzoarruda/Documents/projects/vineo/packages/client/src/components/maturation-bar.tsx
```

Anote as props que ele recebe e a lógica de cálculo de progresso.

- [ ] **Step 2: Substituir implementação**

Reescrever usando `Hairline` com markers. Mantenha as mesmas props públicas pra não quebrar consumidores.

Esqueleto:

```tsx
import { View, Text } from 'react-native'
import { Hairline } from '@/components/ui/hairline'
import { type, useTheme } from '@/theme'

interface MaturationBarProps {
  guardMin: number
  guardMax: number
  ageYears: number
}

/**
 * Linha do tempo de maturação: ——— • min ——— • agora ——— • pico ———
 */
export function MaturationBar({ guardMin, guardMax, ageYears }: MaturationBarProps) {
  const { colors } = useTheme()
  const minPos = 0.1
  const nowPos = Math.min(0.9, Math.max(0.1, ageYears / Math.max(guardMax, 1)))
  const peakPos = 0.9

  return (
    <View style={{ gap: 4 }}>
      <Hairline
        markers={[
          { position: minPos, label: `${guardMin}A` },
          { position: nowPos, label: 'AGORA' },
          { position: peakPos, label: `${guardMax}A` },
        ]}
        color={colors.border}
        opacity={0.8}
      />
    </View>
  )
}
```

> Adapte o cálculo de posições à lógica original do componente. Se as posições atuais usam outra fórmula, manter aquela.

- [ ] **Step 3: Visual check**

Rodar app, ir em cellar ou bottle detail, ver maturation bar. Validar que markers aparecem na posição correta.

- [ ] **Step 4: Commit checkpoint**

Mensagem: `feat(ui): maturation-bar redesigned with Hairline + markers`

---

### Task 4.2: Atualizar componentes domínio para nova escala tipográfica

**Files:**
- Modify: `packages/client/src/components/bottle-cell.tsx`
- Modify: `packages/client/src/components/cellar-grid.tsx`
- Modify: `packages/client/src/components/recent-bottles.tsx`
- Modify: `packages/client/src/components/suggestion-card.tsx`
- Modify: `packages/client/src/components/alert-card.tsx`
- Modify: `packages/client/src/components/filter-bar.tsx`

- [ ] **Step 1: Buscar usos do shim `typography.sizes.X`**

Run:
```bash
grep -rn "typography\.sizes\|typography\.fontFamily\|typography\.lineHeight" /Users/enzoarruda/Documents/projects/vineo/packages/client/src/components /Users/enzoarruda/Documents/projects/vineo/packages/client/app
```

- [ ] **Step 2: Para cada arquivo listado, migrar para `type`**

Padrão de migração:

```tsx
// Antes:
{
  fontSize: typography.sizes.h1,
  fontFamily: typography.fontFamilyBold,
  lineHeight: typography.lineHeight.h1,
}

// Depois:
{ ...type.displayM, color: colors.text }
```

Mapeamento:
- `sizes.h1` → `type.displayM` (28pt Fraunces)
- `sizes.h2` → `type.headline` (22pt Fraunces)
- `sizes.body` → `type.body` (15pt Inter)
- `sizes.caption` → `type.bodyS` (13pt Inter)
- `sizes.small` ou `sizes.tiny` → `type.label` (11pt Inter Medium uppercase) — **com cautela**: só usar se contexto for realmente "label uppercase". Para texto normal pequeno, use `type.bodyS`.

Aplicar em: `bottle-cell.tsx`, `cellar-grid.tsx`, `recent-bottles.tsx`, `suggestion-card.tsx`, `alert-card.tsx`, `filter-bar.tsx`.

- [ ] **Step 3: Typecheck após cada arquivo**

Run após cada migração:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck --workspace=@vineo/mobile
```

Expected: 0 erros.

- [ ] **Step 4: Visual check**

Rodar app, navegar tabs principais (home, cellar, etc.). Confirmar texto agora em Fraunces (display) e Inter (body), sem layout quebrado.

- [ ] **Step 5: Commit checkpoint**

Mensagem: `refactor(components): migrate domain components to type scale`

---

### Task 4.3: Aplicar `Hero` nos headers das tabs

**Files:**
- Modify: `packages/client/app/(tabs)/index.tsx`
- Modify: `packages/client/app/(tabs)/cellar.tsx`

- [ ] **Step 1: Ler `(tabs)/index.tsx`**

Run:
```bash
cat /Users/enzoarruda/Documents/projects/vineo/packages/client/app/\(tabs\)/index.tsx
```

Identificar onde o título da tela aparece. Substituir o bloco Text manual pelo `Hero`.

Exemplo:

```tsx
// Antes:
<Text style={{ ...type.displayM, color: colors.text }}>Minha adega</Text>
<Text style={{ ...type.body, color: colors.textSecondary }}>Visão geral</Text>

// Depois:
<Hero
  eyebrow="BOA TARDE"
  title="Sua adega"
  subtitle="3 garrafas no ponto"
  titleVariant="displayM"
/>
```

Adaptar copy ao conteúdo atual da tela.

- [ ] **Step 2: Idem `(tabs)/cellar.tsx`**

Mesma migração.

- [ ] **Step 3: Visual check + commit**

Mensagem: `feat(tabs): apply Hero component to tab screen headers`

---

### Task 4.4: Vintage display com hairline+marker em bottle-cell e bottle/[id]

**Files:**
- Modify: `packages/client/src/components/bottle-cell.tsx`
- Modify: `packages/client/app/bottle/[id].tsx`

- [ ] **Step 1: Identificar onde vintage aparece**

Run:
```bash
grep -n "vintage\|safra\|year" /Users/enzoarruda/Documents/projects/vineo/packages/client/src/components/bottle-cell.tsx /Users/enzoarruda/Documents/projects/vineo/packages/client/app/bottle/\[id\].tsx
```

- [ ] **Step 2: Substituir display por padrão hairline+marker**

Exemplo:

```tsx
// Antes:
<Text>{vintage}</Text>

// Depois:
<View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
  <Hairline width={20} color={colors.border} />
  <Text style={{ ...type.label, color: colors.textSecondary }}>
    {vintage}
  </Text>
  <Hairline width={20} color={colors.border} />
</View>
```

> Hairlines de 20px funcionam mesmo abaixo do limite "80px" do spec quando flanqueiam o número/label sob esse padrão visual específico. Se ficar ruim na prática, voltar pra apenas label.

- [ ] **Step 3: Visual check + commit**

Mensagem: `feat: vintage displayed with hairline markers (motif)`

---

### Task 4.5: Empty states com V monogram

**Files:**
- Buscar todos empty states e atualizar.

- [ ] **Step 1: Buscar empty states existentes**

Run:
```bash
grep -rn "no.*bottle\|nenhuma\|nenhum\|empty" /Users/enzoarruda/Documents/projects/vineo/packages/client/app /Users/enzoarruda/Documents/projects/vineo/packages/client/src --include="*.tsx"
```

Identificar telas/componentes que renderizam estado vazio.

- [ ] **Step 2: Para cada empty state, adicionar `VMonogram` acima do copy**

Padrão:

```tsx
import { VMonogram } from '@/components/ui/v-monogram'

<View style={{ alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.huge }}>
  <VMonogram size={64} color={colors.textMuted} weight="regular" />
  <Text style={{ ...type.body, color: colors.textSecondary, textAlign: 'center' }}>
    Sua adega está aguardando a primeira garrafa.
  </Text>
</View>
```

Aplicar opacity 0.15 no V monogram via prop `color={hexComOpacityComputada}` ou via wrapping `<View style={{ opacity: 0.15 }}>`.

- [ ] **Step 3: Visual check + commit**

Mensagem: `feat: empty states show V monogram brand mark`

---

### Task 4.6: Validação final do Chunk 4

- [ ] **Step 1: Walkthrough manual de toda a navegação principal**

iOS + Android. Confirmar:
- Home, cellar, add, bottle detail
- Tipografia consistente (Fraunces em displays, Inter em body)
- Cards com nova paleta
- Vintage com hairline
- Empty states com V monogram

- [ ] **Step 2: Lint + typecheck**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck && npm run lint
```

Expected: 0 erros.

> **CHECKPOINT DE REVIEW.** Mostrar app principal pro user.

---

## CHUNK 5 — Polimento

### Task 5.1: Remover showcase de `/dev/`

**Files:**
- Delete: `packages/client/app/dev/showcase.tsx`

- [ ] **Step 1: Remover arquivo**

Run:
```bash
rm /Users/enzoarruda/Documents/projects/vineo/packages/client/app/dev/showcase.tsx
rmdir /Users/enzoarruda/Documents/projects/vineo/packages/client/app/dev 2>/dev/null
```

- [ ] **Step 2: Typecheck**

Expected: 0 erros.

- [ ] **Step 3: Commit checkpoint**

Mensagem: `chore: remove temporary UI showcase`

---

### Task 5.2: Splash screen + app icon

**Files:**
- Modify: `packages/client/app.json`
- Possivelmente adicionar: `packages/client/assets/splash-icon.png`, `packages/client/assets/icon.png`

- [ ] **Step 1: Ler `app.json` atual**

Run:
```bash
cat /Users/enzoarruda/Documents/projects/vineo/packages/client/app.json
```

- [ ] **Step 2: Atualizar splash + icon**

Por enquanto, manter assets atuais mas atualizar configuração:
- `splash.backgroundColor`: `#141210` (novo bg)
- `splash.image`: gerar nova arte com V Fraunces em `#EDE8E3` sobre `#141210` (fora de escopo deste chunk — anotar TODO ao usuário pra gerar arte via Figma/Sketch e substituir).
- `icon`: idem (TODO ao usuário).

Editar valores no app.json conforme acima.

- [ ] **Step 3: Commit checkpoint**

Mensagem: `chore(app): update splash background to match new palette`

> Após chunk completo, avisar usuário pra gerar splash.png e icon.png finais.

---

### Task 5.3: Remover Public Sans e shim de typography

**Files:**
- Modify: `packages/client/package.json`
- Modify: `packages/client/src/theme/typography.ts`

- [ ] **Step 1: Confirmar 0 usos do shim**

Run:
```bash
grep -rn "typography\.sizes\|typography\.fontFamily\|typography\.lineHeight\|typography\.weights" /Users/enzoarruda/Documents/projects/vineo/packages/client
```

Expected: 0 resultados. Se ainda houver, migrar primeiro.

- [ ] **Step 2: Remover bloco de shim no `typography.ts`**

Editar `packages/client/src/theme/typography.ts` e remover o bloco `export const typography = ...` (deixar só `type` e tokens novos).

- [ ] **Step 3: Remover Public Sans do package.json**

Editar `packages/client/package.json`, remover `@expo-google-fonts/public-sans` da seção `dependencies`.

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm install
```

- [ ] **Step 4: Typecheck**

Expected: 0 erros.

- [ ] **Step 5: App roda sem crash**

Iniciar app, ir em algumas telas. Confirmar texto renderiza normal (Inter + Fraunces ainda carregam).

- [ ] **Step 6: Commit checkpoint**

Mensagem: `chore: remove Public Sans + typography shim`

---

### Task 5.4: Acessibilidade — labels e contraste

**Files:**
- Modify: `packages/client/src/components/ui/v-monogram.tsx`
- Modify: `packages/client/src/components/ui/hairline.tsx`

- [ ] **Step 1: VMonogram já tem accessibilityLabel="Víneo"**

Confirmar lendo o componente (foi adicionado em task 2.4). Se faltar, adicionar.

- [ ] **Step 2: Hairlines decorativas devem ser ocultas de leitores de tela**

Editar `Hairline` para aceitar prop `decorative?: boolean` (default true para hairlines sem markers, false para hairlines com markers que carregam info).

```tsx
// Em Hairline:
interface HairlineProps {
  // ...
  decorative?: boolean
}

// E no View externo:
<View
  importantForAccessibility={decorative ? 'no-hide-descendants' : 'auto'}
  accessibilityElementsHidden={decorative}
  // ...
>
```

Default `decorative = markers.length === 0`.

- [ ] **Step 3: Validar contraste WCAG AA**

Usar uma ferramenta online (Stark, contrast-ratio.com) ou calcular:
- `accent` (`#A03B4A`) sobre `bg` (`#141210`): ratio?
- `textSecondary` (`#8A847E`) sobre `bg`: ratio?
- `text` (`#EDE8E3`) sobre `bg`: ratio?

Expected:
- `text` sobre `bg`: ≥ 7:1 (AAA)
- `textSecondary` sobre `bg`: ≥ 4.5:1 (AA)
- `accent` para uso em texto pequeno: precisa ≥ 4.5:1. Se falhar, registrar como restrição de uso (só usar accent em UI decorativa, não em texto body).

Anotar resultados.

- [ ] **Step 4: Commit checkpoint**

Mensagem: `feat(a11y): hide decorative hairlines + label V monogram`

---

### Task 5.5: Validação final do plano

- [ ] **Step 1: Walkthrough end-to-end**

Apagar dados do app, rodar instalação limpa. Passar por onboarding completo + uso normal do app. Confirmar:
- Splash → onboarding 5 telas → home → adicionar garrafa → ver garrafa → ver cellar
- Nenhum crash
- Animações suaves em 60fps (dev tools)
- Haptics funcionam em device físico

- [ ] **Step 2: Lint + typecheck final**

Run:
```bash
cd /Users/enzoarruda/Documents/projects/vineo && npm run typecheck && npm run lint
```

Expected: 0 erros.

- [ ] **Step 3: Commit checkpoint final**

Mensagem: `chore: complete vineo visual identity refresh`

> **ENTREGA FINAL.** Avisar o usuário que o trabalho está pronto. Próximos passos sugeridos: rodar `git init` no root, fazer primeiro commit consolidado ou separar por chunks; gerar splash.png e icon.png finais com V Fraunces.

---

## Self-Review

### Spec coverage
- ✅ Foundation tokens (paleta, tipografia, motion, spacing) — chunk 1
- ✅ Componentes refatorados (Button, Card, Badge) — tasks 2.1–2.3
- ✅ Primitives novos (VMonogram, Hairline, EditorialInput, Counter, Hero, AmbientGradient, StaggerGroup) — tasks 2.4–2.10
- ✅ Onboarding 5 telas (welcome, intent, cellar-count, cellar-setup, complete) — chunk 3
- ✅ Motif V + Hairline aplicados — chunks 3 e 4
- ✅ App principal herda tokens — chunk 4
- ✅ Polimento (splash, ícone, a11y, remover legacy) — chunk 5
- ⚠️ Slide horizontal entre cellar-setup (uma rota re-entrada) — implementado como cross-fade simples no chunk 3 com nota; refino opcional posterior. Aceitável: cross-fade ainda é coerente com o resto.
- ⚠️ Asset final de splash + icon (PNG com V Fraunces) — anotado como TODO ao usuário no chunk 5 (geração de arte fora de escopo de código).

### Type/name consistency
- `motion.durations.X`, `motion.easings.X`, `motion.stagger.X` — usados consistentemente.
- `type.monumental`, `type.displayXl/L/M`, `type.headline`, `type.title`, `type.body`, `type.bodyS`, `type.label` — consistentes.
- Tokens de cor: `parchment`, `champagne`/`champagneDim` — renomeados com check de uso em chunk 1.
- `VMonogram` prop `animate` valores: `'reveal' | 'fade' | 'none'` — consistente em welcome e complete.
- `Hairline` prop `animate` valores: `'grow' | 'none'` — consistente.

### Placeholder scan
Nenhum "TBD" ou "implement later" no plano. Steps de migração genérica em chunk 4 (task 4.2) listam padrão claro com mapeamento.

### Gap conhecido / aceito
- Não há setup Jest/Vitest. Validações são via simulador. Aceitável dado escopo visual e ausência de logica testável significativa.

---
