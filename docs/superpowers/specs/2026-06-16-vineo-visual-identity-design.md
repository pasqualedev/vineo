# Víneo — Identidade Visual e Onboarding "Wow"

**Data:** 2026-06-16
**Status:** Spec aprovado, aguardando review final do usuário antes do plano de implementação.

---

## 1. Contexto e Objetivos

O projeto, antes chamado **CaveFlow**, passa a se chamar **Víneo** — um app mobile para gestão de adega pessoal, voltado a um público de alto nível social. O produto já está funcional ("mais ou menos"), mas a UI/UX atual é genérica e não comunica o posicionamento desejado.

Esta fase de trabalho redefine a identidade visual e reformula o onboarding como uma experiência sensorial. Backend e novas features ficam para depois.

**Direção estética:** *Quiet luxury* dominante (Aesop, The Row, Vacheron Constantin) com sotaque *wine-native* (Penfolds, châteaux). Discreto, contemplativo, com motion narrativo onde importa.

**Override de regras globais:** O CLAUDE.md global do usuário restringe animações a opacity/hover ("no scale transforms, no dramatic animations"). Para o projeto Víneo, esta restrição é explicitamente sobrescrita — animações elegantes são parte do produto.

---

## 2. Stack confirmado

- Expo SDK 56, expo-router (file-based)
- React 19.2.3, react-native-reanimated 4.3.1, react-native-gesture-handler 2.31.1, react-native-worklets 0.8.3
- TanStack Query + Form, Zod
- Monorepo turbo (packages/api, packages/client, packages/shared)

---

## 3. Foundation Tokens

### 3.1 Paleta

**Dark theme (primário do app):**

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#141210` | Background principal |
| `surface` | `#1E1B19` | Cards, list backgrounds |
| `surfaceAlt` | `#2A2622` | Elevated surfaces |
| `parchment` | `#F0EBE0` | Cards "premium", momentos editoriais (inverte texto pra `#1C1A17`) |
| `border` | `#3A3734` | Bordas padrão (aplicadas com opacity 0.6 em uso) |
| `borderLight` | `#4A4744` | Bordas de destaque |
| `text` | `#EDE8E3` | Texto primário |
| `textSecondary` | `#8A847E` | Texto secundário |
| `textMuted` | `#625D58` | Texto desbotado, hints |
| `accent` (oxblood) | `#A03B4A` | Acento de marca |
| `accentDim` | `#3D1018` | Acento desbotado, backgrounds suaves de accent |
| `champagne` | `#C9A961` | Acento brass refinado (renomeado de `gold`) |
| `champagneDim` | `#4A3508` | Champagne desbotado |

**Semantic colors (red/green/amber/blue):** mantêm hexes atuais dessaturados em ~15%. Uso restrito a alertas, sucesso, erro e info — não decorativos.

**Light theme:** mantemos atual nesta fase. Refino posterior.

### 3.2 Tipografia

Substituir Public Sans por **Fraunces (display, variable) + Inter (UI body)**, ambas via `@expo-google-fonts`.

**Escala:**

| Token | Size / Line | Família | Peso | Letter-spacing |
|---|---|---|---|---|
| `monumental` | 96 / 100 | Fraunces | Light (300) | -0.03em |
| `display-xl` | 56 / 60 | Fraunces | Light (300) | -0.02em |
| `display-l` | 40 / 44 | Fraunces | Light (300) | -0.02em |
| `display-m` | 28 / 34 | Fraunces | Regular (400) | -0.01em |
| `headline` | 22 / 28 | Fraunces | Regular (400) | 0 |
| `title` | 17 / 22 | Inter | SemiBold (600) | 0 |
| `body` | 15 / 22 | Inter | Regular (400) | 0 |
| `body-s` | 13 / 18 | Inter | Regular (400) | 0 |
| `label` | 11 / 14 | Inter | Medium (500) | +0.08em UPPERCASE |

`monumental` é uso restrito: V monogram em onboarding Tela 1 e Counter hero em Tela 3. Não usar em outras superfícies.

Fraunces variável: usar `SOFT 50` em uso display (warmth), `SOFT 0` em UI. Axe `opsz` deixa o sistema decidir conforme tamanho.

**Risco:** confirmar no chunk 1 se `@expo-google-fonts/fraunces` expõe os axes. Fallback: importar Fraunces Light, Regular e Bold como fontes estáticas separadas.

### 3.3 Motion tokens

```ts
durations: {
  instant: 100,    // haptic-paired micro
  fast: 200,       // hover/press feedback
  base: 350,       // UI transitions, modals
  slow: 550,       // screen transitions
  narrative: 750,  // hero reveals, onboarding moments
  breath: 8000,    // ambient loops (gradient breathing)
}

easings: {
  outExpo: cubic-bezier(0.22, 1, 0.36, 1),    // default UI
  inOut: cubic-bezier(0.65, 0, 0.35, 1),      // transitions
  ease: cubic-bezier(0.4, 0, 0.2, 1),         // subtle
}

principles:
  - Stagger padrão entre elementos sequenciais: 60ms
  - Sem bounce, sem spring com overshoot
  - Haptic light pareado com qualquer motion >350ms disparado pelo usuário
  - Respeitar useReducedMotion: desabilitar AmbientGradient breath, encurtar durações pela metade
```

### 3.4 Spacing

Validar `theme/spacing.ts` no chunk 1. Adicionar se faltarem: `xs=4`, `xxxxl=80`.

---

## 4. Componentes

### 4.1 Existentes (refatorar)

**`Button`** — 4 variantes:
- `primary`: oxblood fill, texto branco
- `secondary`: outline 1px, texto primário
- `ghost`: só texto + chevron opcional
- `hero` (novo): só texto + underline 1px que cresce no press, sem caixa. Tipografia Inter Medium 17pt.

Demais variantes usam Inter SemiBold 15pt, letter-spacing +0.04em. Press feedback: opacity 0.85 em 100ms + scale 0.98 em 200ms (`outExpo`). Radius 10. Sem haptic no press (reservado para ações terminais).

**`Card`** — adiciona variante `parchment` (bg `#F0EBE0`, texto invertido). Border 1px com opacity 0.6 no uso. Prop `interactive` ativa motion press (scale 0.99 + brightness sutil em 200ms). Radius 12 (mantido).

**`Badge`** — estilo outline 1px, sem fill. Tipo `label` (uppercase Inter Medium 11pt, letter-spacing +0.08em).

### 4.2 Novos primitives

**`VMonogram`** — glyph V de Fraunces como brand mark.
- Props: `size: number`, `color?: string`, `weight?: 'light' | 'regular'`, `animate?: 'reveal' | 'fade'`
- `animate="reveal"`: stroke-dasharray reveal via SVG path, 900ms `outExpo`.

**`Hairline`** — linha 1px com marcadores opcionais (motif do tempo).
- Props: `width: 'full' | number`, `markers?: Array<{ position: 0..1, label?: string }>`, `animate?: 'grow'`
- `animate="grow"`: cresce da esquerda em 1.2s, markers aparecem com stagger 60ms.

**`EditorialInput`** — input estilo editorial.
- Sem container box. Label flutua acima em label 11pt uppercase.
- Underline 1px (`border`) → 2px (`accent`) no focus, 250ms.
- Texto digitado: Fraunces Regular 22pt.

**`Counter`** — substitui `-/+` atual.
- Número gigante centralizado: `monumental` 96pt (versão hero) ou `display-xl` 56pt (versão compacta).
- Swipe horizontal pra ajustar (`react-native-gesture-handler`, ~40px = 1 unidade).
- Tap em chevrons minúsculos 16px laterais (hint só na primeira interação, depois ocultos).
- Transição entre números: slide-up + fade-out (200ms), entra de baixo + fade-in (250ms), `outExpo`.
- Haptic light em cada mudança.

**`Hero`** — wrapper de cabeçalho vertical-stacked.
- Slots: `eyebrow?` (label uppercase), `title` (display-m ou display-l Fraunces), `subtitle?` (body Inter).
- Stagger automático na entrada: 60ms por slot.

**`AmbientGradient`** — background gradient warm que respira.
- Gradient `accentDim` → `bg`, opacity da camada superior anima 0.4 ↔ 0.8 em loop 8s (`sine in-out`).
- Renderizado uma vez no `_layout` de onboarding, persiste entre telas (sem reset).
- Desabilita breath se `useReducedMotion()`.

**`StaggerGroup`** — utility wrapper que aplica delay incremental em filhos.
- Props: `delay?: number`, `stagger?: number` (default 60).

---

## 5. Onboarding Storyboard A — telas detalhadas

Fluxo: **welcome → intent → cellar-count → cellar-setup (× N) → complete → (tabs)**

### Tela 1 — Abertura (`/onboarding/welcome`)

`AmbientGradient` ativa aqui e persiste até a Tela 5.

| Tempo | Evento |
|---|---|
| t=0 | View monta, conteúdo invisível |
| t=200ms | V monogram (`monumental` 96pt, `text`) inicia stroke-reveal — 900ms `outExpo` |
| t=900ms | "íneo" entra letter-by-letter à direita do V — 5 letras × stagger 50ms × fade+slide-up 8px (350ms cada) |
| t=1500ms | Hairline 1px cresce sob o wordmark (60% width centralizada) — 400ms `outExpo`, cor `accent` opacity 0.5 |
| t=1700ms | Eyebrow "EST. 2026" (label 11pt, `textMuted`) — fade-in 300ms |
| t=1900ms | Subtitle "Onde o tempo se torna sabor." (Inter Regular 17pt) — fade-in 400ms |
| t=2400ms | Botão hero "Começar" + chevron — fade-in 350ms |

Tap "Começar": haptic light + cross-dissolve 550ms → Tela 2.

### Tela 2 — Intenção (`/onboarding/intent` — nova)

Tipografia full-screen, sem CTA visível.

```
"Toda garrafa carrega"       display-m 28pt Fraunces Regular
"um momento."                display-l 40pt Fraunces Light

[gap 32px]

[Hairline 40px centralizada, opacity 0.4]

[gap 24px]

"Vamos te ajudar a"          body 15pt Inter Regular, textSecondary
"não perdê-lo."              body 15pt Inter Regular, textSecondary

[rodapé]
"TOQUE EM QUALQUER LUGAR"    label 11pt, textMuted, opacity 0.5
```

Stagger 80ms entre cada elemento na entrada (fade+slide-up 6px, 400ms cada).

Tap qualquer área: haptic light + cross-dissolve 550ms → Tela 3. AmbientGradient overlay opacity 0 → 0.15 durante transição.

### Tela 3 — Contagem (`/onboarding/cellar-count`)

**Hero:**
- eyebrow: "PASSO 1 DE 2"
- title: "Quantas adegas você tem?" (display-m)
- subtitle: "Vamos configurar cada uma." (body)

**`Counter` (hero variant):**
- Número 96pt Fraunces Light centralizado
- Hint: chevrons 16px laterais opacity 0.4 (somem após 1ª interação)
- Swipe horizontal principal, tap nos chevrons secundário
- Hairline 80px abaixo, `accent` opacity 0.5, flash sutil 0.5→1→0.5 em 300ms a cada mudança
- Caption "N adega(s)" body-s `textMuted`, cross-fade na mudança

Botão hero "Continuar" + chevron no rodapé.

### Tela 4 — Setup por adega (`/onboarding/cellar-setup`)

Repete N vezes (uma por adega), transição entre setups é slide horizontal.

**Hero:**
- eyebrow: "ADEGA N DE M" (cross-fade ao trocar adega)
- title: variável por adega
  - 1ª: "Como devemos chamá-la?"
  - 2ª+: "E esta?"

**Nome:** `EditorialInput` — label uppercase 11pt acima, sem caixa, texto Fraunces Regular 22pt, underline 1px → 2px accent no focus (250ms).

**Dimensões:** Hairline + label "DIMENSÕES" + dois `Counter` compactos lado a lado (fileiras / colunas, 56pt). Sem hint de chevron.

**Preview da grid:** sem caixa, sem label "Preview". Dots em `accent` opacity 0.3. Shimmer reveal ao mudar dimensões: novos dots entram com stagger diagonal 8ms (top-left → bottom-right), 200ms cada. Caption "rows × cols" abaixo em body-s `textMuted`.

**Botão hero:** "Próxima adega →" ou "Finalizar" na última.

**Transição entre setups (index → index+1):** conteúdo desliza horizontalmente 100% para a esquerda (450ms `inOut`). Novo setup entra da direita simultaneamente. Eyebrow troca com cross-fade sincronizado no meio (300ms).

### Tela 5 — Revelação (`/onboarding/complete` — nova)

| Tempo | Evento |
|---|---|
| t=0 | Tela 4 sai com fade-out 400ms. AmbientGradient overlay 0.15 → 0.3 em 600ms |
| t=400ms | V monogram (`display-xl` 56pt) centralizado + hairline crescendo — 600ms total |
| t=1000ms | "Sua adega está pronta." (display-m Fraunces) + "Bem-vindo ao Víneo." (body 15pt, `textSecondary`) |
| t=1800ms | Botão hero "Entrar" |

Tap "Entrar": haptic medium + fade-to-black 350ms → fade-from-black 350ms na home `/(tabs)`. AmbientGradient desmonta no fim.

### Princípios de motion do onboarding

- Mínimo 1.5s do mount até CTA disponível em telas com CTA.
- Stagger ubíquo: 60–80ms entre elementos sequenciais.
- Cross-dissolve entre telas, exceto Tela 4 → Tela 4 (slide horizontal pra reforçar "próxima").
- Haptic só em ações terminais (CTA) ou mudanças de valor (counter).
- AmbientGradient único persistindo em todas as 5 telas, sem reset.

---

## 6. Sistema do Motif

### 6.1 V Monograma (primário)

Brand mark, aparição rara e intencional.

**Aparece em:**
- App icon, splash screen
- Onboarding telas 1 e 5
- Header de telas premium (settings, perfil) — 18pt `textSecondary` à esquerda do título
- Estados vazios — 64pt opacity 0.15 centralizado acima do copy

**Não aparece em:**
- Tabs e headers do `(tabs)` principal
- Cards, list items, qualquer elemento frequente
- Botões

**Regra de ouro:** mais que 3 V por sessão fora de onboarding/settings = uso demais.

### 6.2 Hairline + Vintage marker (secundário)

Linguagem visual do conceito de tempo. Frequente mas sempre sutil.

**Variantes:**
1. **Pura** — linha 1px `border` ou `accent` opacity 0.5
2. **Com markers** — pontos `•` (4×4px) ou tracinho `|` (6×1px) em `accent`, label opcional em label 11pt uppercase
3. **Animada** — `animate="grow"` 800–1200ms `outExpo`, markers com stagger 60ms

**Aparece em:**
- Sob qualquer `Hero` (40–60% width)
- Maturation bar redesenhada (substitui componente atual): guardMin, guardMax, "agora"
- Vintage display: `——— • 2018 ———`
- Empty timeline (onboarding 5, dashboards)
- Separadores entre seções (dashboard, settings)
- Footer de cards "interativos" (indicação sutil de expansível)
- Acima do copy em estados vazios

**Não aparece em:**
- Dentro de inputs
- Sobre fundos com gradiente em movimento
- Containers menores que 80px

**Animação na entrada de telas:**
- Telas wow (onboarding, bottle detail): `grow` na entrada
- Telas funcionais (tabs, settings): estático

### 6.3 Relação entre os dois

- V = brand (quem você é)
- Hairline = produto (o que faz: tempo → maturação → sabor)
- Nunca aparecem juntos no mesmo viewport, exceto onboarding telas 1 e 5 (hairline imediatamente sob o V como assinatura visual)

---

## 7. Ordem de implementação

5 chunks sequenciais.

### Chunk 1 — Foundation tokens (~1 dia)
- Atualizar `theme/colors.ts` (novos hexes, `parchment`, semantic dessaturados, renomear `gold` → `champagne`)
- Reescrever `theme/typography.ts` (nova escala completa)
- Instalar `@expo-google-fonts/fraunces` e `@expo-google-fonts/inter`
- Carregar fontes via `useFonts` no `_layout.tsx` root
- Criar `theme/motion.ts` (durations, easings, principles)
- Validar/expandir `theme/spacing.ts` (`xs=4`, `xxxxl=80`)

**Verificação:** app builda, fontes carregam.

### Chunk 2 — Componentes UI base (~2 dias)
- Refatorar `Button`, `Card`, `Badge`
- Criar `VMonogram`, `Hairline`, `EditorialInput`, `Counter`, `Hero`, `AmbientGradient`, `StaggerGroup`

**Verificação:** tela `/dev/showcase` descartável com todas as variantes, validação visual em device, depois remover.

### Chunk 3 — Onboarding storyboard A (~3 dias)
- Adicionar `AmbientGradient` em `app/onboarding/_layout.tsx`
- Reescrever `welcome.tsx`, `cellar-count.tsx`, `cellar-setup.tsx`
- Criar `intent.tsx` e `complete.tsx`
- Atualizar navegação: welcome → intent → cellar-count → cellar-setup × N → complete → (tabs)
- Substituir todas as strings "CaveFlow" por "Víneo"
- PoC do cross-dissolve com expo-router cedo no chunk

**Verificação:** onboarding completo em device físico iOS + Android, 60fps validado, haptics confirmados.

### Chunk 4 — App principal herda tokens (~2 dias)
Atualizar componentes domínio:
- `maturation-bar.tsx` → versão hairline + markers
- `bottle-cell.tsx`, `cellar-grid.tsx`, `recent-bottles.tsx`, `suggestion-card.tsx`, `alert-card.tsx`, `filter-bar.tsx` → nova escala tipográfica, `Hero` onde fizer sentido, vintage com hairline+marker, empty states com V opacity 0.15
- `tab-icons.tsx` → refinar pra alinhar com Inter
- Headers das tabs aplicam `Hero`

**Verificação:** screenshot antes/depois por tela. Funcionalidade (TanStack Query, formulários) intacta.

### Chunk 5 — Polimento (~1 dia)
- Splash screen com V + hairline
- App icon (V Fraunces sobre `bg`)
- Status bar style por tela (light no onboarding, default em tabs)
- A11y: `accessibilityLabel` no V, hairlines decorativas com `accessibilityElementsHidden`, validar contraste WCAG AA do oxblood novo sobre bg novo
- Remover Public Sans do `package.json` e do `Platform.select` legado

**Verificação:** ferramentas de a11y, build de produção em device.

### Caminho crítico

```
Chunk 1 → Chunk 2 → Chunk 3 → Chunk 5
                  ↘ Chunk 4 ↗
```

Total estimado: **~9 dias solo**.

---

## 8. Riscos e mitigações

1. **Fraunces variable axes em RN.** Confirmar no chunk 1 que `@expo-google-fonts/fraunces` expõe `opsz` e `SOFT`. Fallback: 3 pesos estáticos (Light, Regular, Bold).
2. **Reanimated 4 + worklets 0.8 APIs.** Validar syntax atualizado no chunk 2.
3. **`AmbientGradient` performance/bateria.** Mitigar com `useReducedMotion` desabilitando loop.
4. **Cross-dissolve com expo-router.** Não nativo. PoC cedo no chunk 3 com `Reanimated.View` no `_layout` e listener de router pra animar manualmente.
5. **Contraste WCAG.** Oxblood novo (`#A03B4A`) sobre bg novo (`#141210`) precisa ser checado pra texto. Para uso em backgrounds e accents puramente decorativos, ok.

---

## 9. O que NÃO está nesta fase

- Backend, schemas, API
- Light theme refino
- Onboarding com vídeo de fundo / asset de imagem fotográfica
- Internacionalização (copy em inglês)
- Testes automatizados de UI (visual regression)
- Light/dark theme switcher refinado

Tudo isso pode vir depois, fora desta entrega.
