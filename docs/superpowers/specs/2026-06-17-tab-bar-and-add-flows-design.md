# Tab Bar Central "+" e Fluxos de Adição — Design

**Data:** 2026-06-17
**Status:** Aprovado (brainstorming) — aguardando revisão do spec

## Objetivo

Melhorias pós-onboarding no app Víneo. Substituir a tab bar padrão por uma
tab bar custom com um botão "+" central, circular e flutuante (inspirado no
botão de Pix do Mercado Pago). O "+" abre um modal de escolha com duas opções
ilustradas — **adicionar garrafa** ou **adicionar adega** — e cada uma leva a
um wizard passo-a-passo no estilo do onboarding (uma tela por etapa).

## Contexto do código existente

- Tab bar atual: [(tabs)/_layout.tsx](../../../packages/client/app/(tabs)/_layout.tsx)
  usa `<Tabs>` do expo-router com duas abas (`index` = Início, `cellar` = Adega).
- Fluxo de adição atual: disparado ao tocar num slot vazio do grid
  ([cellar-grid.tsx:41](../../../packages/client/src/components/cellar-grid.tsx#L41)),
  que faz `router.push('/add?cellarId=…&row=…&col=…')`. As telas em `app/add/`
  são: `index.tsx` (câmera/barcode), `ocr-fallback.tsx`, `confirm.tsx` (form denso).
- Tokens de design já existem: [colors.ts](../../../packages/client/src/theme/colors.ts)
  (paleta vinho/champagne, accent `#A03B4A` no dark), [motion.ts](../../../packages/client/src/theme/motion.ts).
- Primitives já existem: `Hero`, `EditorialInput`, `Counter`, `Hairline`,
  `Card` (com variante interactive), `Button` (variante hero), `AmbientGradient`.
- Hooks: `useCellars`, `useCreateCellar`, `useBottles`, `useMatchOrCreateBottle`.
- `expo-haptics`, `expo-linear-gradient`, `react-native-gesture-handler` e
  `react-native-reanimated` estão instalados.
- Ícones de tab são feitos com `View` puro (sem SVG) — ver [tab-icons.tsx](../../../packages/client/src/components/tab-icons.tsx).
- **O client não tem runner de testes configurado.** O pacote `packages/shared`
  usa **vitest**.

> Nota de identidade visual: este projeto tem design system próprio (paleta
> vinho/champagne). Os tokens do projeto têm precedência sobre as diretrizes
> genéricas de UI (zinc/indigo) do CLAUDE.md global.

## Abordagem escolhida

**Tab bar totalmente custom** via prop `tabBar` do `<Tabs>`. Foi escolhida sobre
(B) terceira `Tabs.Screen` fantasma e (C) FAB sobreposto, por ser a única que
entrega o visual flutuante integrado com controle total de recorte, elevação,
haptics e animação, mantendo tudo num componente focado.

## Componentes e fluxos

### 1. `VineoTabBar` (tab bar custom)

- Arquivo novo: `packages/client/src/components/navigation/vineo-tab-bar.tsx`.
- Recebe `BottomTabBarProps` de `@react-navigation/bottom-tabs`.
- Layout: barra com `colors.surface`, hairline no topo (`colors.border`, 1px),
  altura ~64px + `useSafeAreaInsets().bottom`. **Início** à esquerda, **Adega**
  à direita, com vão central reservado para o botão.
- **Botão central ("+")**: círculo de ~60px com `colors.accent`, elevado acima
  da barra via `translateY` negativo, sombra de elevação **sutil** (sem glow —
  respeita a regra do design system). Ícone "+" desenhado com `View` (duas barras
  cruzadas), na cor `colors.white`.
- Interação: ao tocar, dispara `Haptics.impactAsync(Medium)` e abre o modal de
  escolha via `router.push('/add/menu')`. **Não é uma rota de tab.**
- Acessibilidade: botão central com `accessibilityRole="button"` e
  `accessibilityLabel="Adicionar"`; abas mantêm `accessibilityRole="tab"`,
  rótulos e tints atuais (`colors.accent` ativo / `colors.textMuted` inativo).

### 2. Modal de escolha (`app/add/menu.tsx`)

- Rota com `presentation: 'transparentModal'`. Backdrop escurecido; toque fora
  fecha (`router.back()`). Entrada slide-up + fade usando tokens de `motion.ts`
  (`durations.base`, `easings.outExpo`).
- Dois **cards grandes empilhados** (mobile-first), usando `Card` interactive.
  Cada card tem:
  - **Área de imagem reservada** (placeholder com borda hairline + label
    discreta "imagem") — o usuário criará as ilustrações depois e as colocará
    em `packages/client/assets/illustrations/`. Um componente
    `IllustrationPlaceholder` renderiza o placeholder enquanto o asset não existe.
  - Rótulo: "Adicionar garrafa" / "Adicionar adega".
- Ações: garrafa → `router.replace('/add/bottle/cellar')`; adega →
  `router.replace('/add/cellar/setup')`.

### 3. Estado compartilhado do wizard de garrafa

- `AddBottleDraftContext` criado em `app/add/_layout.tsx` (Stack do fluxo).
- Mantém um rascunho **`readonly`** com: `cellarId`, `barcode`, campos OCR
  (`rawOcrText`, e campos pré-preenchidos `name/winery/grape/region/vintage`),
  `row`, `col`. Evita arrastar muitos params na URL e centraliza tipos.
- Interface explícita (sem `any`), com setters tipados por etapa.

### 4. Wizard "Adicionar garrafa" (adega → câmera → slot → confirmar)

- **`bottle/cellar.tsx`** — Hero "Em qual adega?". Lista de adegas (`useCellars`)
  como cards selecionáveis. **Se houver exatamente uma adega, auto-seleciona e
  pula** direto para a câmera. Se não houver nenhuma adega, mostra estado vazio
  com atalho para `/add/cellar/setup`.
- **`bottle/capture.tsx`** — câmera, reaproveitando a lógica de barcode +
  timeout + fallback de OCR do `app/add/index.tsx` atual. Ao escanear/capturar/
  inserir manualmente, grava `barcode`/`rawOcrText` no draft e vai para o slot.
  Reusa o tratamento de permissão negada existente.
- **`bottle/slot.tsx`** — Hero "Onde guardar?". Reusa `CellarGrid` em **modo
  seleção**: adiciona-se prop opcional `onSelectEmpty?(row, col)` ao componente
  (mantendo o comportamento de navegação atual quando a prop não é passada).
  Mostra slots ocupados via `useBottles(cellarId)`. Grava `row`/`col` no draft.
  Adega cheia → mensagem de estado vazio.
- **`bottle/confirm.tsx`** — formulário **editorial** (migra o form denso do
  `confirm.tsx` atual para `EditorialInput`, estilo onboarding), pré-preenchido
  com dados de OCR quando houver. Submit → `useMatchOrCreateBottle` (mesma
  chamada `match-or-create` de hoje) → **tela de sucesso curta** → navega para
  a adega (`/(tabs)/cellar`).

### 5. Wizard "Adicionar adega" (`cellar/setup.tsx`)

- Reusa o layout do onboarding [cellar-setup.tsx](../../../packages/client/app/onboarding/cellar-setup.tsx):
  Hero "Nova adega" + `EditorialInput` (nome) + dois `Counter` (fileiras/colunas)
  + preview de pontos. **Uma única tela** (consistente com o onboarding).
- Submit → `useCreateCellar` → navega para a nova adega.

### 6. Estrutura de rotas final

```
app/add/
  _layout.tsx          Stack (headerShown: false) + AddBottleDraftProvider
  menu.tsx             modal de escolha (transparentModal)
  bottle/cellar.tsx    passo 1 — selecionar adega
  bottle/capture.tsx   passo 2 — câmera (migra index.tsx atual)
  bottle/slot.tsx      passo 3 — selecionar slot
  bottle/confirm.tsx   passo 4 — confirmar dados (migra confirm.tsx atual)
  cellar/setup.tsx     wizard de adega
```

- O `cellar-grid` continua disparando a adição ao tocar num slot vazio, agora
  apontando para o novo fluxo (`/add/bottle/...`) com o slot já pré-preenchido
  no draft (pula direto para a câmera, já que adega+slot são conhecidos).
- Os arquivos antigos `app/add/index.tsx`, `ocr-fallback.tsx` e `confirm.tsx`
  são migrados/substituídos pelas novas telas.

### 7. Decisões resolvidas (defaults aprovados)

- **(a) Tela de sucesso após confirmar garrafa:** sim — tela curta consistente
  com `onboarding/complete`.
- **(b) Wizard de adega:** uma tela só (igual ao onboarding).

### 8. Casos de borda

- Sem adegas no fluxo de garrafa → estado vazio que redireciona para criar adega.
- Adega cheia (sem slots livres) → mensagem no passo de slot.
- Permissão de câmera negada → reusa o tratamento atual.
- Cancelar em qualquer passo → fecha o Stack e volta às tabs.

### 9. Testes

- O client **não tem runner de testes**. Não será criado setup de teste de
  componente RN sem combinar com o usuário.
- Lógica pura é extraída para funções testáveis e coberta com **vitest** (padrão
  de `packages/shared`):
  - "pular passo de adega quando houver exatamente uma" (seleção/derivação).
  - cálculo de slots livres a partir da lista de garrafas + dimensões da adega.
- Verificação visual/manual via skill `run` (iOS/Android), além de `typecheck`
  e `lint` (`tsc --noEmit`, `expo lint`).

## Arquivos afetados

**Novos**
```
packages/client/src/components/navigation/vineo-tab-bar.tsx
packages/client/src/components/ui/illustration-placeholder.tsx
packages/client/app/add/_layout.tsx
packages/client/app/add/menu.tsx
packages/client/app/add/bottle/cellar.tsx
packages/client/app/add/bottle/capture.tsx
packages/client/app/add/bottle/slot.tsx
packages/client/app/add/bottle/confirm.tsx
packages/client/app/add/cellar/setup.tsx
packages/client/src/lib/add-bottle-draft.tsx          (context + tipos)
packages/shared/src/lib/slots.ts                       (lógica pura testável)
packages/shared/src/lib/slots.test.ts
```

**Modificados**
```
packages/client/app/(tabs)/_layout.tsx                 (usar VineoTabBar)
packages/client/src/components/cellar-grid.tsx         (prop onSelectEmpty)
```

**Removidos (migrados)**
```
packages/client/app/add/index.tsx
packages/client/app/add/ocr-fallback.tsx
packages/client/app/add/confirm.tsx
```
