# Tab Bar Central "+" e Fluxos de Adição — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a tab bar padrão do Víneo por uma custom com botão "+" central flutuante que abre um modal de escolha (garrafa/adega), e reescrever a adição de garrafas e adegas como wizards passo-a-passo no estilo onboarding.

**Architecture:** Tab bar custom via prop `tabBar` do `<Tabs>`. Modal de escolha como rota raiz `transparentModal` sobre as tabs. Wizard de garrafa num Stack (`app/add/`) com estado compartilhado via `AddBottleDraftContext`. Lógica pura de slots/seleção extraída para `@vineo/shared` com testes vitest.

**Tech Stack:** Expo SDK 56, expo-router, React Native, react-native-reanimated 4.3, expo-haptics, @tanstack/react-query, @tanstack/react-form, zod, vitest (no pacote shared).

**Spec:** `docs/superpowers/specs/2026-06-17-tab-bar-and-add-flows-design.md`

---

## File Structure

**Novos**
```
packages/shared/src/lib/slots.ts                       lógica pura (slots + seleção de adega)
packages/shared/src/lib/slots.test.ts                  testes vitest
packages/client/src/lib/add-bottle-draft.tsx           context do rascunho da garrafa
packages/client/src/components/ui/wine-illustration.tsx  ilustração em container claro
packages/client/src/components/navigation/vineo-tab-bar.tsx  tab bar custom + FAB
packages/client/app/add-menu.tsx                       modal de escolha (raiz, transparentModal)
packages/client/app/add/_layout.tsx                    Stack + AddBottleDraftProvider
packages/client/app/add/bottle/cellar.tsx              passo 1 — selecionar adega
packages/client/app/add/bottle/capture.tsx             passo 2 — câmera
packages/client/app/add/bottle/slot.tsx                passo 3 — selecionar slot
packages/client/app/add/bottle/confirm.tsx             passo 4 — confirmar dados
packages/client/app/add/bottle/success.tsx             tela de sucesso (cup.png)
packages/client/app/add/cellar/setup.tsx               wizard de adega
```

**Modificados**
```
packages/shared/src/index.ts                           exportar slots
packages/client/app/_layout.tsx                        registrar add-menu como transparentModal
packages/client/app/(tabs)/_layout.tsx                 usar VineoTabBar
packages/client/src/components/cellar-grid.tsx         prop onSelectEmpty + rewire entry
```

**Removidos (migrados)**
```
packages/client/app/add/index.tsx
packages/client/app/add/ocr-fallback.tsx
packages/client/app/add/confirm.tsx
```

> Nota: o client **não tem runner de testes**. Tasks de componente RN são
> verificadas por `typecheck` + `lint` + execução manual (skill `run`). Apenas
> o CHUNK 1 (lógica pura no shared) usa TDD com vitest.

---

## CHUNK 1 — Lógica pura (shared + vitest, TDD)

### Task 1.1: Funções de slots e seleção de adega

**Files:**
- Create: `packages/shared/src/lib/slots.ts`
- Test: `packages/shared/src/lib/slots.test.ts`
- Modify: `packages/shared/src/index.ts`

- [ ] **Step 1: Escrever o teste que falha**

`packages/shared/src/lib/slots.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import {
  isSlotOccupied,
  findFirstAvailableSlot,
  countAvailableSlots,
  resolveSoleCellarId,
} from './slots'

const occupants = [
  { rowPosition: 0, columnPosition: 0 },
  { rowPosition: 0, columnPosition: 1 },
  { rowPosition: 1, columnPosition: 0 },
]

describe('isSlotOccupied', () => {
  it('true quando há garrafa na posição', () => {
    expect(isSlotOccupied(occupants, 0, 0)).toBe(true)
  })
  it('false quando a posição está livre', () => {
    expect(isSlotOccupied(occupants, 1, 1)).toBe(false)
  })
})

describe('findFirstAvailableSlot', () => {
  it('retorna o primeiro slot livre em ordem row-major', () => {
    expect(findFirstAvailableSlot(2, 2, occupants)).toEqual({ row: 1, column: 1 })
  })
  it('retorna null quando a grade está cheia', () => {
    const full = [
      { rowPosition: 0, columnPosition: 0 },
      { rowPosition: 0, columnPosition: 1 },
      { rowPosition: 1, columnPosition: 0 },
      { rowPosition: 1, columnPosition: 1 },
    ]
    expect(findFirstAvailableSlot(2, 2, full)).toBeNull()
  })
})

describe('countAvailableSlots', () => {
  it('conta os slots livres', () => {
    expect(countAvailableSlots(2, 2, occupants)).toBe(1)
  })
  it('grade vazia conta tudo', () => {
    expect(countAvailableSlots(3, 4, [])).toBe(12)
  })
})

describe('resolveSoleCellarId', () => {
  it('retorna o id quando há exatamente uma adega', () => {
    expect(resolveSoleCellarId([{ id: 'abc' }])).toBe('abc')
  })
  it('retorna null com zero adegas', () => {
    expect(resolveSoleCellarId([])).toBeNull()
  })
  it('retorna null com múltiplas adegas', () => {
    expect(resolveSoleCellarId([{ id: 'a' }, { id: 'b' }])).toBeNull()
  })
})
```

- [ ] **Step 2: Rodar o teste e confirmar a falha**

Run: `npm run test --workspace=@vineo/shared`
Expected: FAIL — `Cannot find module './slots'`.

- [ ] **Step 3: Implementar `slots.ts`**

`packages/shared/src/lib/slots.ts`:
```ts
/** Mínimo necessário para localizar uma garrafa numa grade de adega. */
export interface SlotOccupant {
  readonly rowPosition: number
  readonly columnPosition: number
}

export interface SlotPosition {
  readonly row: number
  readonly column: number
}

/** Indica se a posição (row, column) já está ocupada por uma garrafa. */
export function isSlotOccupied(
  occupants: readonly SlotOccupant[],
  row: number,
  column: number,
): boolean {
  return occupants.some(
    (occupant) => occupant.rowPosition === row && occupant.columnPosition === column,
  )
}

/** Primeiro slot livre em ordem row-major, ou null se a grade estiver cheia. */
export function findFirstAvailableSlot(
  rows: number,
  columns: number,
  occupants: readonly SlotOccupant[],
): SlotPosition | null {
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (!isSlotOccupied(occupants, row, column)) {
        return { row, column }
      }
    }
  }
  return null
}

/** Quantidade de slots livres na grade. */
export function countAvailableSlots(
  rows: number,
  columns: number,
  occupants: readonly SlotOccupant[],
): number {
  let available = 0
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (!isSlotOccupied(occupants, row, column)) {
        available += 1
      }
    }
  }
  return available
}

/**
 * Retorna o id da única adega quando houver exatamente uma (para auto-pular o
 * passo de seleção), ou null caso contrário.
 */
export function resolveSoleCellarId(
  cellars: readonly { readonly id: string }[],
): string | null {
  return cellars.length === 1 ? cellars[0].id : null
}
```

- [ ] **Step 4: Exportar do índice do pacote**

Em `packages/shared/src/index.ts`, adicionar ao final:
```ts
export * from './lib/slots'
```

- [ ] **Step 5: Rodar os testes e confirmar que passam**

Run: `npm run test --workspace=@vineo/shared`
Expected: PASS (todos os describes verdes).

- [ ] **Step 6: Commit**

```bash
git add packages/shared/src/lib/slots.ts packages/shared/src/lib/slots.test.ts packages/shared/src/index.ts
git commit -m "feat(shared): lógica pura de slots e seleção de adega

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## CHUNK 2 — Estado e primitives

### Task 2.1: `AddBottleDraftContext`

**Files:**
- Create: `packages/client/src/lib/add-bottle-draft.tsx`

- [ ] **Step 1: Criar o context**

`packages/client/src/lib/add-bottle-draft.tsx`:
```tsx
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/** Rascunho da garrafa em construção ao longo do wizard de adição. */
export interface AddBottleDraft {
  readonly cellarId: string | null
  readonly barcode: string | null
  readonly rawOcrText: string | null
  readonly row: number | null
  readonly col: number | null
}

const EMPTY_DRAFT: AddBottleDraft = {
  cellarId: null,
  barcode: null,
  rawOcrText: null,
  row: null,
  col: null,
}

interface AddBottleDraftContextValue {
  readonly draft: AddBottleDraft
  readonly update: (patch: Partial<AddBottleDraft>) => void
  readonly reset: () => void
}

const AddBottleDraftContext = createContext<AddBottleDraftContextValue | null>(null)

/**
 * Provider do rascunho da garrafa. Deve envolver as telas do wizard
 * (`app/add/_layout.tsx`).
 */
export function AddBottleDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<AddBottleDraft>(EMPTY_DRAFT)

  const update = useCallback((patch: Partial<AddBottleDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }))
  }, [])

  const reset = useCallback(() => setDraft(EMPTY_DRAFT), [])

  const value = useMemo(() => ({ draft, update, reset }), [draft, update, reset])

  return (
    <AddBottleDraftContext.Provider value={value}>
      {children}
    </AddBottleDraftContext.Provider>
  )
}

/** Acessa o rascunho da garrafa. Lança se usado fora do provider. */
export function useAddBottleDraft(): AddBottleDraftContextValue {
  const context = useContext(AddBottleDraftContext)
  if (!context) {
    throw new Error('useAddBottleDraft deve ser usado dentro de AddBottleDraftProvider')
  }
  return context
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros novos.

- [ ] **Step 3: Commit**

```bash
git add packages/client/src/lib/add-bottle-draft.tsx
git commit -m "feat(client): context do rascunho da garrafa

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2.2: `WineIllustration`

**Files:**
- Create: `packages/client/src/components/ui/wine-illustration.tsx`

- [ ] **Step 1: Criar o componente**

`packages/client/src/components/ui/wine-illustration.tsx`:
```tsx
import {
  View,
  Image,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

interface WineIllustrationProps {
  readonly source: ImageSourcePropType
  readonly size: number
  readonly style?: StyleProp<ViewStyle>
}

/**
 * Exibe uma ilustração (assets de fundo claro) dentro de um container claro
 * arredondado, para parecer intencional sobre o tema escuro do app.
 */
export function WineIllustration({ source, size, style }: WineIllustrationProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: 16,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Image
        source={source}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros novos.

- [ ] **Step 3: Commit**

```bash
git add packages/client/src/components/ui/wine-illustration.tsx
git commit -m "feat(client): componente WineIllustration

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## CHUNK 3 — Tab bar custom

### Task 3.1: `VineoTabBar`

**Files:**
- Create: `packages/client/src/components/navigation/vineo-tab-bar.tsx`

- [ ] **Step 1: Criar o componente**

`packages/client/src/components/navigation/vineo-tab-bar.tsx`:
```tsx
import { View, Pressable, Text, type ColorValue } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { type, useTheme } from '@/theme'
import { HomeIcon, CellarIcon } from '@/components/tab-icons'

const FAB_SIZE = 60
const BAR_HEIGHT = 64
const ICON_SIZE = 24

const TAB_LABELS: Record<string, string> = {
  index: 'Início',
  cellar: 'Adega',
}

function PlusIcon({ color, size = 24 }: { color: ColorValue; size?: number }) {
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: (size - 2) / 2,
          height: 2,
          borderRadius: 1,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: (size - 2) / 2,
          width: 2,
          borderRadius: 1,
          backgroundColor: color,
        }}
      />
    </View>
  )
}

/**
 * Tab bar custom do Víneo: duas abas (Início / Adega) e um botão "+" central
 * circular flutuante que abre o modal de adição.
 */
export function VineoTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  function openAddMenu() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    router.push('/add-menu')
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        height: BAR_HEIGHT + insets.bottom,
        paddingBottom: insets.bottom,
        paddingTop: 8,
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index
        const tint = isFocused ? colors.accent : colors.textMuted
        const label = TAB_LABELS[route.name] ?? route.name

        function onPress() {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const Icon = route.name === 'index' ? HomeIcon : CellarIcon

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={label}
            style={{ flex: 1, alignItems: 'center', gap: 2 }}
          >
            <Icon color={tint} size={ICON_SIZE} />
            <Text style={{ ...type.label, fontSize: 11, color: tint }}>{label}</Text>
          </Pressable>
        )
      })}

      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: -FAB_SIZE / 2,
          alignItems: 'center',
        }}
      >
        <Pressable
          onPress={openAddMenu}
          accessibilityRole="button"
          accessibilityLabel="Adicionar"
          style={{
            width: FAB_SIZE,
            height: FAB_SIZE,
            borderRadius: FAB_SIZE / 2,
            backgroundColor: colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <PlusIcon color={colors.white} size={26} />
        </Pressable>
      </View>
    </View>
  )
}
```

- [ ] **Step 2: Verificar import de `BottomTabBarProps`**

Run: `node -e "require.resolve('@react-navigation/bottom-tabs')" && echo OK`
Expected: imprime `OK` (é dependência transitiva do expo-router). Se falhar, trocar o tipo por uma interface inline `{ state: any; navigation: any }` **não** é aceitável — em vez disso adicionar a dependência: `npm install --workspace=@vineo/mobile @react-navigation/bottom-tabs`.

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros novos.

- [ ] **Step 4: Commit**

```bash
git add packages/client/src/components/navigation/vineo-tab-bar.tsx
git commit -m "feat(client): tab bar custom com botão + central

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3.2: Ligar a `VineoTabBar` no layout das tabs

**Files:**
- Modify: `packages/client/app/(tabs)/_layout.tsx`

- [ ] **Step 1: Substituir o conteúdo do arquivo**

`packages/client/app/(tabs)/_layout.tsx`:
```tsx
import { Tabs } from 'expo-router'
import { VineoTabBar } from '@/components/navigation/vineo-tab-bar'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <VineoTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="cellar" options={{ title: 'Adega' }} />
    </Tabs>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros novos.

- [ ] **Step 3: Verificação visual**

Run: `npm run dev` (ou skill `run`) e abrir o app.
Expected: tab bar mostra Início / Adega com o "+" circular elevado no centro;
tocar no "+" dispara haptic e abre `/add-menu` (próximo chunk; por ora pode 404
até a rota existir — confirmar apenas o visual da barra e o haptic).

- [ ] **Step 4: Commit**

```bash
git add packages/client/app/(tabs)/_layout.tsx
git commit -m "feat(client): usar VineoTabBar no layout das tabs

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## CHUNK 4 — Modal de escolha

### Task 4.1: Registrar `add-menu` como transparentModal na raiz

**Files:**
- Modify: `packages/client/app/_layout.tsx`

- [ ] **Step 1: Importar `Stack.Screen` e declarar a rota**

Em `packages/client/app/_layout.tsx`, substituir o bloco do `<Stack ... />` dentro de `RootLayoutInner` por:
```tsx
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen
          name="add-menu"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            headerShown: false,
          }}
        />
      </Stack>
```
(As demais rotas continuam sendo descobertas automaticamente pelo expo-router.)

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros novos.

- [ ] **Step 3: Commit**

```bash
git add packages/client/app/_layout.tsx
git commit -m "feat(client): registrar add-menu como modal transparente

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4.2: Tela do modal de escolha

**Files:**
- Create: `packages/client/app/add-menu.tsx`

- [ ] **Step 1: Criar a tela**

`packages/client/app/add-menu.tsx`:
```tsx
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Card } from '@/components/ui/card'
import { WineIllustration } from '@/components/ui/wine-illustration'

const BOTTLE_IMG = require('../assets/bottle.png')
const CELLAR_IMG = require('../assets/cellar.png')

interface ChoiceProps {
  readonly image: number
  readonly title: string
  readonly subtitle: string
  readonly onPress: () => void
}

function Choice({ image, title, subtitle, onPress }: ChoiceProps) {
  const { colors } = useTheme()
  return (
    <Card interactive onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
        <WineIllustration source={image} size={72} />
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text style={{ ...type.headline, color: colors.text }}>{title}</Text>
          <Text style={{ ...type.bodyS, color: colors.textSecondary }}>{subtitle}</Text>
        </View>
      </View>
    </Card>
  )
}

export default function AddMenuScreen() {
  const { colors } = useTheme()

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <Pressable
        accessibilityLabel="Fechar"
        onPress={() => router.back()}
        style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
      />
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{
          backgroundColor: colors.bg,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: spacing.xxl,
          paddingTop: spacing.xxl,
          paddingBottom: spacing.huge,
          gap: spacing.lg,
        }}
      >
        <Text style={{ ...type.label, color: colors.textMuted, textAlign: 'center' }}>
          O QUE VOCÊ QUER ADICIONAR?
        </Text>
        <Choice
          image={BOTTLE_IMG}
          title="Adicionar garrafa"
          subtitle="Escaneie ou registre um vinho"
          onPress={() => router.replace('/add/bottle/cellar')}
        />
        <Choice
          image={CELLAR_IMG}
          title="Adicionar adega"
          subtitle="Crie um novo espaço de guarda"
          onPress={() => router.replace('/add/cellar/setup')}
        />
      </Animated.View>
    </View>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros novos. (Se `require` de PNG acusar tipo, confirmar que
`expo-env.d.ts`/metro types cobrem imagens — já usado em `wine-images.ts`.)

- [ ] **Step 3: Verificação visual**

Run: skill `run`. Tocar no "+" → sobe o modal com os dois cards ilustrados;
tocar fora fecha; cada card navega (telas ainda serão criadas nos próximos chunks).

- [ ] **Step 4: Commit**

```bash
git add packages/client/app/add-menu.tsx
git commit -m "feat(client): modal de escolha garrafa/adega

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## CHUNK 5 — Stack do wizard + passo 1 (adega)

### Task 5.1: Layout do Stack de adição

**Files:**
- Create: `packages/client/app/add/_layout.tsx`

- [ ] **Step 1: Criar o layout**

`packages/client/app/add/_layout.tsx`:
```tsx
import { Stack } from 'expo-router'
import { AddBottleDraftProvider } from '@/lib/add-bottle-draft'

export default function AddLayout() {
  return (
    <AddBottleDraftProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AddBottleDraftProvider>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros novos.

- [ ] **Step 3: Commit**

```bash
git add packages/client/app/add/_layout.tsx
git commit -m "feat(client): stack do wizard de adição com draft provider

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5.2: Passo 1 — selecionar adega

**Files:**
- Create: `packages/client/app/add/bottle/cellar.tsx`

- [ ] **Step 1: Criar a tela**

`packages/client/app/add/bottle/cellar.tsx`:
```tsx
import { useEffect } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { resolveSoleCellarId } from '@vineo/shared'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Hero } from '@/components/ui/hero'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUserId } from '@/lib/user-context'
import { useCellars } from '@/hooks/use-cellars'
import { useAddBottleDraft } from '@/lib/add-bottle-draft'

export default function SelectCellarScreen() {
  const { colors } = useTheme()
  const { userId } = useUserId()
  const { data: cellars, isLoading } = useCellars(userId)
  const { update } = useAddBottleDraft()

  const soleCellarId = cellars ? resolveSoleCellarId(cellars) : null

  useEffect(() => {
    if (soleCellarId) {
      update({ cellarId: soleCellarId })
      router.replace('/add/bottle/capture')
    }
  }, [soleCellarId, update])

  function select(cellarId: string) {
    update({ cellarId })
    router.push('/add/bottle/capture')
  }

  if (isLoading || soleCellarId) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    )
  }

  if (!cellars || cellars.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, padding: spacing.xxl, justifyContent: 'center', gap: spacing.xl }}>
          <Hero
            eyebrow="NENHUMA ADEGA"
            title="Crie uma adega primeiro"
            subtitle="Você precisa de um espaço de guarda antes de adicionar garrafas."
          />
          <Button
            title="Criar adega"
            variant="hero"
            chevron
            onPress={() => router.replace('/add/cellar/setup')}
          />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.xxl, gap: spacing.xxl }}>
        <Hero eyebrow="PASSO 1 DE 4" title="Em qual adega?" />
        <View style={{ gap: spacing.md }}>
          {cellars.map((cellar) => (
            <Card key={cellar.id} interactive onPress={() => select(cellar.id)}>
              <Text style={{ ...type.headline, color: colors.text }}>{cellar.name}</Text>
              <Text style={{ ...type.bodyS, color: colors.textSecondary }}>
                {cellar.rows} × {cellar.columns} posições
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros novos.

- [ ] **Step 3: Verificação visual**

Run: skill `run`. Modal → "Adicionar garrafa". Com 1 adega: pula direto pra
câmera (próxima task). Com 2+: mostra a lista. Sem adegas: estado vazio.

- [ ] **Step 4: Commit**

```bash
git add packages/client/app/add/bottle/cellar.tsx
git commit -m "feat(client): passo 1 do wizard — selecionar adega

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## CHUNK 6 — Passos 2 e 3 (câmera, slot)

### Task 6.1: Passo 2 — câmera (migra index.tsx + ocr-fallback.tsx)

**Files:**
- Create: `packages/client/app/add/bottle/capture.tsx`

- [ ] **Step 1: Criar a tela**

`packages/client/app/add/bottle/capture.tsx`:
```tsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView, useCameraPermissions } from 'expo-camera'
import type { BarcodeScanningResult } from 'expo-camera'
import { router, useLocalSearchParams } from 'expo-router'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Button } from '@/components/ui/button'
import { useAddBottleDraft, type AddBottleDraft } from '@/lib/add-bottle-draft'

const BARCODE_TIMEOUT = 3000

export default function CaptureScreen() {
  const params = useLocalSearchParams<{ cellarId?: string; row?: string; col?: string }>()
  const { draft, update } = useAddBottleDraft()
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [labelMode, setLabelMode] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { colors } = useTheme()

  // Hidrata o draft quando a câmera é aberta a partir de um slot do grid.
  useEffect(() => {
    const patch: Partial<AddBottleDraft> = {}
    if (params.cellarId) patch.cellarId = params.cellarId
    if (params.row != null) patch.row = parseInt(params.row, 10)
    if (params.col != null) patch.col = parseInt(params.col, 10)
    if (Object.keys(patch).length > 0) update(patch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const slotKnown = draft.row != null || params.row != null

  useEffect(() => {
    if (!permission?.granted) requestPermission()
  }, [permission, requestPermission])

  // Sem leitura de barcode em 3s → cai pro modo "capturar rótulo".
  useEffect(() => {
    timeoutRef.current = setTimeout(() => setLabelMode(true), BARCODE_TIMEOUT)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const goNext = useCallback(() => {
    router.replace(slotKnown ? '/add/bottle/confirm' : '/add/bottle/slot')
  }, [slotKnown])

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (scanned) return
      setScanned(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      update({ barcode: result.data, rawOcrText: null })
      goNext()
    },
    [scanned, update, goNext],
  )

  function handleManual() {
    update({ barcode: null, rawOcrText: null })
    goNext()
  }

  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ ...type.body, color: colors.textSecondary }}>Solicitando permissão da câmera…</Text>
      </SafeAreaView>
    )
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl }}>
        <Text style={{ ...type.headline, color: colors.text, textAlign: 'center' }}>Permissão negada</Text>
        <Text style={{ ...type.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
          Acesse as configurações do dispositivo para permitir o uso da câmera.
        </Text>
        <Button title="Solicitar permissão" onPress={requestPermission} variant="secondary" style={{ marginTop: spacing.xl }} />
        <Button title="Inserir manualmente" onPress={handleManual} variant="ghost" style={{ marginTop: spacing.sm }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'space-between', padding: spacing.lg }}>
          <View style={{ alignItems: 'center', marginTop: spacing.xxxl }}>
            <Text style={{ ...type.headline, color: colors.white }}>
              {labelMode ? 'Capture o rótulo' : 'Escaneie o código de barras'}
            </Text>
            <Text style={{ ...type.bodyS, color: 'rgba(255,255,255,0.7)', marginTop: spacing.sm }}>
              {labelMode ? 'Enquadre o rótulo frontal do vinho' : 'Ou aguarde para capturar o rótulo'}
            </Text>
          </View>
          <View style={{ gap: spacing.md, alignItems: 'center' }}>
            <Button title="Inserir manualmente" onPress={handleManual} variant="secondary" />
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros novos.

- [ ] **Step 3: Commit**

```bash
git add packages/client/app/add/bottle/capture.tsx
git commit -m "feat(client): passo 2 do wizard — câmera/scan

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6.2: `CellarGrid` em modo seleção

**Files:**
- Modify: `packages/client/src/components/cellar-grid.tsx`

- [ ] **Step 1: Adicionar a prop `onSelectEmpty`**

Em `packages/client/src/components/cellar-grid.tsx`, alterar a interface e o handler:
```tsx
interface CellarGridProps {
  cellarId: string
  rows: number
  columns: number
  bottles: BottleResponse[]
  /** Quando fornecido, tocar num slot vazio chama isto em vez de navegar pro /add. */
  onSelectEmpty?: (row: number, column: number) => void
}

export function CellarGrid({ cellarId, rows, columns, bottles, onSelectEmpty }: CellarGridProps) {
```
E substituir `handleCellPress`:
```tsx
  function handleCellPress(row: number, column: number, bottle?: BottleResponse) {
    if (bottle) {
      router.push(`/bottle/${bottle.id}`)
      return
    }
    if (onSelectEmpty) {
      onSelectEmpty(row, column)
      return
    }
    router.push(`/add/bottle/capture?cellarId=${cellarId}&row=${row}&col=${column}`)
  }
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros novos.

- [ ] **Step 3: Commit**

```bash
git add packages/client/src/components/cellar-grid.tsx
git commit -m "feat(client): modo seleção no CellarGrid + rewire pro novo wizard

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6.3: Passo 3 — selecionar slot

**Files:**
- Create: `packages/client/app/add/bottle/slot.tsx`

- [ ] **Step 1: Criar a tela**

`packages/client/app/add/bottle/slot.tsx`:
```tsx
import { View, Text, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { countAvailableSlots } from '@vineo/shared'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Hero } from '@/components/ui/hero'
import { CellarGrid } from '@/components/cellar-grid'
import { useCellar } from '@/hooks/use-cellars'
import { useCellarBottles } from '@/hooks/use-bottles'
import { useAddBottleDraft } from '@/lib/add-bottle-draft'

export default function SelectSlotScreen() {
  const { colors } = useTheme()
  const { draft, update } = useAddBottleDraft()
  const cellarId = draft.cellarId ?? ''
  const { data: cellar, isLoading: loadingCellar } = useCellar(cellarId)
  const { data: bottles, isLoading: loadingBottles } = useCellarBottles(cellarId)

  function selectSlot(row: number, column: number) {
    update({ row, col: column })
    router.replace('/add/bottle/confirm')
  }

  if (loadingCellar || loadingBottles || !cellar) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    )
  }

  const available = countAvailableSlots(cellar.rows, cellar.columns, bottles ?? [])

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View style={{ padding: spacing.xxl, gap: spacing.sm }}>
        <Hero eyebrow="PASSO 3 DE 4" title="Onde guardar?" />
      </View>
      {available === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl }}>
          <Text style={{ ...type.body, color: colors.textSecondary, textAlign: 'center' }}>
            Esta adega está cheia. Escolha outra adega ou consuma uma garrafa antes.
          </Text>
        </View>
      ) : (
        <CellarGrid
          cellarId={cellarId}
          rows={cellar.rows}
          columns={cellar.columns}
          bottles={bottles ?? []}
          onSelectEmpty={selectSlot}
        />
      )}
    </SafeAreaView>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros novos.

- [ ] **Step 3: Commit**

```bash
git add packages/client/app/add/bottle/slot.tsx
git commit -m "feat(client): passo 3 do wizard — selecionar slot

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## CHUNK 7 — Passo 4 (confirmar) + sucesso

### Task 7.1: Passo 4 — confirmar dados (migra confirm.tsx)

**Files:**
- Create: `packages/client/app/add/bottle/confirm.tsx`

- [ ] **Step 1: Criar a tela (form editorial)**

`packages/client/app/add/bottle/confirm.tsx`:
```tsx
import { View, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useForm } from '@tanstack/react-form'
import { spacing } from '@/theme/spacing'
import { useTheme } from '@/theme'
import { Hero } from '@/components/ui/hero'
import { Button } from '@/components/ui/button'
import { EditorialInput } from '@/components/ui/editorial-input'
import { useMatchOrCreateBottle } from '@/hooks/use-match-or-create'
import { useAddBottleDraft } from '@/lib/add-bottle-draft'

export default function ConfirmScreen() {
  const { colors } = useTheme()
  const { draft, reset } = useAddBottleDraft()
  const matchOrCreate = useMatchOrCreateBottle(draft.cellarId ?? '')

  const form = useForm({
    defaultValues: {
      name: '',
      winery: '',
      grape: '',
      region: '',
      vintage: String(new Date().getFullYear()),
      price: '',
    },
    onSubmit: async ({ value }) => {
      if (draft.cellarId == null || draft.row == null || draft.col == null) return
      const vintage = parseInt(value.vintage, 10) || new Date().getFullYear()
      const parsedPrice = value.price ? Number(value.price.replace(',', '.')) : null

      await matchOrCreate.mutateAsync({
        barcode: draft.barcode,
        rawOcrText:
          draft.rawOcrText ??
          `${value.name} ${value.winery} ${value.region} ${vintage}`,
        cellarId: draft.cellarId,
        rowPosition: draft.row,
        columnPosition: draft.col,
        vintage,
        name: value.name || null,
        winery: value.winery || null,
        grape: value.grape || null,
        region: value.region || null,
        price: parsedPrice !== null && Number.isFinite(parsedPrice) ? parsedPrice : null,
      })

      reset()
      router.replace('/add/bottle/success')
    },
  })

  if (!draft.cellarId) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.xxl, gap: spacing.xl }}>
        <Hero eyebrow="PASSO 4 DE 4" title="Confirme o vinho" />

        <form.Field name="name">
          {(field) => (
            <EditorialInput
              label="NOME"
              value={field.state.value}
              onChangeText={field.handleChange}
              placeholder="Ex: Almafuerte Malbec"
            />
          )}
        </form.Field>

        <form.Field name="winery">
          {(field) => (
            <EditorialInput
              label="VINÍCOLA"
              value={field.state.value}
              onChangeText={field.handleChange}
              placeholder="Ex: Catena Zapata"
            />
          )}
        </form.Field>

        <form.Field name="grape">
          {(field) => (
            <EditorialInput
              label="UVA"
              value={field.state.value}
              onChangeText={field.handleChange}
              placeholder="Ex: Malbec"
            />
          )}
        </form.Field>

        <form.Field name="region">
          {(field) => (
            <EditorialInput
              label="REGIÃO"
              value={field.state.value}
              onChangeText={field.handleChange}
              placeholder="Ex: Mendoza"
            />
          )}
        </form.Field>

        <View style={{ flexDirection: 'row', gap: spacing.xl }}>
          <View style={{ flex: 1 }}>
            <form.Field name="vintage">
              {(field) => (
                <EditorialInput
                  label="SAFRA"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  keyboardType="number-pad"
                />
              )}
            </form.Field>
          </View>
          <View style={{ flex: 1 }}>
            <form.Field name="price">
              {(field) => (
                <EditorialInput
                  label="PREÇO (OPCIONAL)"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  keyboardType="decimal-pad"
                  placeholder="R$ 0,00"
                />
              )}
            </form.Field>
          </View>
        </View>

        <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                title={isSubmitting ? 'Salvando…' : 'Confirmar e adicionar'}
                variant="hero"
                chevron
                disabled={isSubmitting}
                onPress={() => form.handleSubmit()}
              />
            )}
          </form.Subscribe>
          <Button title="Cancelar" variant="ghost" onPress={() => router.dismissAll()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros novos.

- [ ] **Step 3: Commit**

```bash
git add packages/client/app/add/bottle/confirm.tsx
git commit -m "feat(client): passo 4 do wizard — confirmar dados (form editorial)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7.2: Tela de sucesso

**Files:**
- Create: `packages/client/app/add/bottle/success.tsx`

- [ ] **Step 1: Criar a tela**

`packages/client/app/add/bottle/success.tsx`:
```tsx
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { spacing } from '@/theme/spacing'
import { Hero } from '@/components/ui/hero'
import { Button } from '@/components/ui/button'
import { WineIllustration } from '@/components/ui/wine-illustration'

const CUP_IMG = require('../../../assets/cup.png')

export default function SuccessScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, padding: spacing.xxl, alignItems: 'center', justifyContent: 'center', gap: spacing.xxl }}>
        <WineIllustration source={CUP_IMG} size={160} />
        <Hero
          title="Garrafa adicionada"
          subtitle="Saúde! Ela já está na sua adega."
          style={{ alignItems: 'center' }}
        />
        <Button title="Voltar à adega" variant="hero" chevron onPress={() => router.dismissAll()} />
      </View>
    </SafeAreaView>
  )
}
```

> Nota: `require('../../../assets/cup.png')` parte de `app/add/bottle/` até
> `assets/` (três níveis acima). Confirmar o caminho no typecheck/execução.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros novos.

- [ ] **Step 3: Verificação do fluxo completo de garrafa**

Run: skill `run`. "+" → garrafa → adega → câmera (ou manual) → slot → confirmar
→ tela de sucesso → "Voltar à adega" fecha o fluxo e a nova garrafa aparece no grid.

- [ ] **Step 4: Commit**

```bash
git add packages/client/app/add/bottle/success.tsx
git commit -m "feat(client): tela de sucesso pós-adição de garrafa

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## CHUNK 8 — Wizard de adega

### Task 8.1: Criar adega (`cellar/setup.tsx`)

**Files:**
- Create: `packages/client/app/add/cellar/setup.tsx`

- [ ] **Step 1: Criar a tela**

`packages/client/app/add/cellar/setup.tsx`:
```tsx
import { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { spacing } from '@/theme/spacing'
import { type, useTheme } from '@/theme'
import { Hero } from '@/components/ui/hero'
import { Button } from '@/components/ui/button'
import { Counter } from '@/components/ui/counter'
import { EditorialInput } from '@/components/ui/editorial-input'
import { Hairline } from '@/components/ui/hairline'
import { useUserId } from '@/lib/user-context'
import { useCreateCellar } from '@/hooks/use-cellars'

const MIN = 2
const MAX = 20
const MAX_DOTS = 80

export default function CreateCellarScreen() {
  const [name, setName] = useState('Adega Principal')
  const [rows, setRows] = useState(6)
  const [cols, setCols] = useState(4)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { colors } = useTheme()
  const { userId, initUser } = useUserId()
  const createCellar = useCreateCellar()

  const totalDots = Math.min(rows * cols, MAX_DOTS)

  async function handleCreate() {
    setIsSubmitting(true)
    try {
      let currentUserId = userId
      if (!currentUserId) {
        const user = await initUser()
        currentUserId = user.id
      }
      await createCellar.mutateAsync({ name, rows, columns: cols, userId: currentUserId })
      router.dismissAll()
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
          <Hero eyebrow="NOVA ADEGA" title="Como devemos chamá-la?" titleVariant="displayM" />

          <EditorialInput label="NOME" value={name} onChangeText={setName} placeholder="Adega Principal" />

          <View style={{ gap: spacing.lg }}>
            <Text style={{ ...type.label, color: colors.textMuted }}>DIMENSÕES</Text>
            <Hairline />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: spacing.md }}>
              <View style={{ alignItems: 'center', gap: spacing.sm }}>
                <Text style={{ ...type.label, color: colors.textMuted }}>FILEIRAS</Text>
                <Counter value={rows} min={MIN} max={MAX} onChange={setRows} variant="compact" />
              </View>
              <View style={{ alignItems: 'center', gap: spacing.sm }}>
                <Text style={{ ...type.label, color: colors.textMuted }}>COLUNAS</Text>
                <Counter value={cols} min={MIN} max={MAX} onChange={setCols} variant="compact" />
              </View>
            </View>
          </View>

          <View style={{ alignItems: 'center', gap: spacing.md }}>
            <View style={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 240 }}>
              {Array.from({ length: totalDots }).map((_, i) => (
                <View key={i} style={{ width: 6, height: 6, borderRadius: 1.5, backgroundColor: colors.accent, opacity: 0.3 }} />
              ))}
            </View>
            <Text style={{ ...type.bodyS, color: colors.textMuted }}>{rows} × {cols} posições</Text>
          </View>
        </View>

        <View style={{ paddingTop: spacing.xxxl, alignItems: 'center' }}>
          <Button
            title={isSubmitting ? 'Salvando…' : 'Criar adega'}
            variant="hero"
            chevron
            disabled={isSubmitting}
            onPress={handleCreate}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros novos.

- [ ] **Step 3: Verificação visual**

Run: skill `run`. "+" → adega → preenche nome/dimensões → "Criar adega" → volta
às tabs e a nova adega aparece na tab Adega.

- [ ] **Step 4: Commit**

```bash
git add packages/client/app/add/cellar/setup.tsx
git commit -m "feat(client): wizard de criação de adega

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## CHUNK 9 — Limpeza e validação final

### Task 9.1: Remover telas antigas migradas

**Files:**
- Delete: `packages/client/app/add/index.tsx`
- Delete: `packages/client/app/add/ocr-fallback.tsx`
- Delete: `packages/client/app/add/confirm.tsx`

- [ ] **Step 1: Conferir que nada referencia as rotas antigas**

Run: `cd packages/client && grep -rn "add/ocr-fallback\|add/confirm\|push(\`/add?\|push('/add?" app/ src/`
Expected: nenhuma ocorrência (o `cellar-grid` já aponta para `/add/bottle/capture`).
Se aparecer alguma, corrigir antes de deletar.

- [ ] **Step 2: Deletar os arquivos**

Run:
```bash
git rm packages/client/app/add/index.tsx packages/client/app/add/ocr-fallback.tsx packages/client/app/add/confirm.tsx
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck --workspace=@vineo/mobile`
Expected: sem erros (nenhum import órfão).

- [ ] **Step 4: Commit**

```bash
git commit -m "refactor(client): remover telas antigas do fluxo /add migradas

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 9.2: Validação final do monorepo

- [ ] **Step 1: Lint + typecheck + testes**

Run:
```bash
npm run lint --workspace=@vineo/mobile
npm run typecheck --workspace=@vineo/mobile
npm run test --workspace=@vineo/shared
```
Expected: tudo verde.

- [ ] **Step 2: Smoke test manual completo**

Run: `npm run dev` (ou skill `run`). Verificar, em iOS e Android:
1. Tab bar com "+" central elevado; abas Início/Adega navegam.
2. "+" → modal sobe com cards de garrafa e adega; toque fora fecha.
3. Fluxo garrafa: (1 adega) pula seleção; (2+ adegas) lista; câmera → slot → confirmar → sucesso → garrafa no grid.
4. Tocar num slot vazio do grid leva direto à câmera com slot pré-selecionado (pula seleção de adega e de slot, vai pro confirmar após scan).
5. Fluxo adega: cria e aparece na lista.

- [ ] **Step 3: Commit (se houver ajustes do smoke test)**

```bash
git add -A
git commit -m "fix(client): ajustes do smoke test dos fluxos de adição

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review (preenchido pelo autor do plano)

- **Cobertura do spec:** tab bar custom (3.x), modal (4.x), wizard garrafa
  adega→câmera→slot→confirmar (5.2, 6.x, 7.1), sucesso com cup.png (7.2),
  wizard adega (8.1), reuso do CellarGrid (6.2), lógica pura testável (1.1),
  remoção das telas antigas (9.1). ✔
- **Edge cases do spec:** sem adegas (5.2 estado vazio), adega cheia (6.3),
  permissão negada (6.1), cancelar (dismissAll em confirm/sucesso). ✔
- **Consistência de tipos:** `AddBottleDraft` (`cellarId/barcode/rawOcrText/row/col`)
  usado igual em capture/slot/confirm; `update`/`reset` idênticos ao provider;
  `useCellarBottles` (nome real do hook) usado em 6.3; `CellarResponse.rows/columns`
  consistente; `resolveSoleCellarId/countAvailableSlots` batem com 1.1.
