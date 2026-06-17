<div align="center">

# 🍷 Víneo

**Sua adega pessoal, com a elegância que ela merece.**

Um app mobile para gestão de adega doméstica — catalogue garrafas por posição,
acompanhe a janela de maturação de cada vinho e saiba exatamente quando abrir a próxima.

*Quiet luxury* encontra *wine-native*. Discreto, contemplativo, sensorial.

[![Expo SDK](https://img.shields.io/badge/Expo-SDK_56-000020?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![Fastify](https://img.shields.io/badge/Fastify-5-000000?logo=fastify&logoColor=white)](https://fastify.dev)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![Postgres](https://img.shields.io/badge/Postgres-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.9-EF4444?logo=turborepo&logoColor=white)](https://turbo.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

</div>

---

## ✨ O que é o Víneo

O Víneo transforma a sua adega física em um inventário inteligente. Cada garrafa
mora em uma posição (linha × coluna) de uma adega configurável, e o app calcula
automaticamente em que fase de maturação ela está — **em evolução**, **no auge**
ou **em declínio** — com base na uva e na safra.

Adicionar uma garrafa é rápido: aponte a câmera para o rótulo (OCR) ou leia o
código de barras, confirme os dados e pronto. O onboarding foi desenhado como uma
experiência sensorial, não um formulário.

### Destaques

- 🗂️ **Adega em grade** — visualize suas garrafas exatamente como elas estão dispostas fisicamente.
- 🍇 **Janela de maturação** — `EVOLVING → PEAK → DECLINING` calculada por uva + safra a partir de uma matriz de guarda enológica.
- 📷 **Adicionar por rótulo ou código de barras** — OCR com *fuzzy matching* (trigram) contra a base de referências de vinhos.
- 🔄 **Reorganização fluida** — mova garrafas entre posições com *optimistic updates*.
- 🌗 **Tema claro & escuro** — paleta editorial *wine-native* (bordô, champanhe, pergaminho).
- 🎬 **Motion narrativo** — animações elegantes com Reanimated onde realmente importam.

---

## 🏛️ Arquitetura

Monorepo gerenciado por **Turborepo** + workspaces npm, com três pacotes:

```
vineo/
├── packages/
│   ├── api/        →  Fastify 5 + Prisma 7 (Postgres)   ·  @vineo/api
│   ├── client/     →  Expo Router (React Native)        ·  @vineo/mobile
│   └── shared/     →  Schemas Zod + tipos + regras      ·  @vineo/shared
├── compose.yml     →  Postgres 16 (Docker)
└── scripts/dev.sh  →  sobe DB + API + mobile com 1 comando
```

O pacote **`@vineo/shared`** é a fonte única de verdade: os schemas Zod definem
tanto a **validação** (runtime) quanto os **tipos** (compile-time, via `z.infer`),
consumidos pela API e pelo client. A matriz de guarda (`GUARD_MATRIX`) e o cálculo
de maturação também vivem aqui, garantindo que back e front falem a mesma língua.

```
┌──────────────┐      HTTP/JSON      ┌──────────────┐      Prisma      ┌────────────┐
│  Expo client │ ──────────────────► │  Fastify API │ ───────────────► │  Postgres  │
│ TanStack Q.  │ ◄────────────────── │   + Zod      │ ◄─────────────── │            │
└──────────────┘                     └──────────────┘                  └────────────┘
        ▲                                    ▲
        └────────────  @vineo/shared  ───────┘
              (schemas Zod · tipos · regras de maturação)
```

---

## 🧰 Stack

| Camada | Tecnologias |
|---|---|
| **Mobile** | Expo SDK 56, expo-router, React 19, Reanimated 4, Gesture Handler, TanStack Query & Form |
| **API** | Fastify 5, Prisma 7 (driver adapter `@prisma/adapter-pg`), Zod 4 |
| **Dados** | PostgreSQL 16 + extensão `pg_trgm` (busca *fuzzy*) |
| **Compartilhado** | Zod 4 (schemas + tipos), regras de maturação |
| **Tooling** | Turborepo, TypeScript 6, ESLint, tsx, Docker Compose |

> 📐 Convenções importantes do projeto estão em **[RULES.md](RULES.md)** — leia antes de mexer em
> `babel.config.js`, `metro.config.js` ou no alias `@/`.

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** ≥ 20 e **npm** 10
- **Docker** (para o Postgres local)
- **Expo Go** no celular, ou um simulador iOS / emulador Android

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
# API
cp packages/api/.env.example packages/api/.env
```

No client, ajuste o IP da sua máquina na rede local (necessário para o app no
celular alcançar a API):

```bash
# packages/client/.env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000/api
```

### 3. Subir tudo com um comando

```bash
npm run dev
```

Esse script ([scripts/dev.sh](scripts/dev.sh)) sobe o Postgres no Docker,
sincroniza o schema do Prisma (`db push`) e inicia **API + mobile** em paralelo.

Prefere rodar separado?

```bash
npm run db:up       # sobe só o Postgres
npm run dev:api     # só a API   (http://localhost:3000)
npm run dev:mobile  # só o Expo
```

---

## 📜 Scripts úteis

| Comando | Descrição |
|---|---|
| `npm run dev` | Sobe DB + API + mobile (fluxo completo) |
| `npm run dev:api` / `dev:mobile` | Inicia um pacote isolado |
| `npm run db:up` / `db:down` / `db:logs` | Controla o Postgres no Docker |
| `npm run db:push` | Sincroniza o schema Prisma com o banco |
| `npm run db:reset` | Recria o banco do zero e re-sincroniza |
| `npm run lint` | Lint em todos os pacotes (Turbo) |
| `npm run typecheck` | Type-check em todos os pacotes (Turbo) |

---

## 🔌 API

Base: `http://localhost:3000/api`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/users/init` | Cria um usuário (MVP, sem auth) |
| `GET` | `/users/:id` | Busca usuário |
| `POST` | `/cellars` | Cria uma adega |
| `GET` | `/cellars?userId=` | Lista adegas do usuário |
| `GET` | `/cellars/:id` | Detalhe da adega (com garrafas) |
| `GET` | `/cellars/:id/bottles` | Lista garrafas da adega |
| `POST` | `/bottles/match-or-create` | Casa OCR/código de barras ou cria referência + garrafa |
| `PATCH` | `/bottles/:id/move` | Move garrafa de posição |
| `PATCH` | `/bottles/:id/status` | Atualiza status (`STORED` / `CONSUMED` / `GIFTED`) |

### Modelo de maturação

A janela de consumo é derivada de uma matriz de guarda por uva
([packages/shared/src/constants/maturation.ts](packages/shared/src/constants/maturation.ts)):

```ts
startDrinkingYear = safra + guarda.min
maxDrinkingYear   = safra + guarda.max

ano atual <  startDrinkingYear  →  EVOLVING   (ainda evoluindo)
ano atual <= maxDrinkingYear    →  PEAK       (no auge)
caso contrário                  →  DECLINING  (em declínio)
```

---

## 📁 Estrutura do client

```
packages/client/
├── app/                    # rotas (expo-router, file-based)
│   ├── (tabs)/             # home + adega
│   ├── add/                # fluxo de adicionar garrafa (câmera, OCR, confirmar)
│   ├── onboarding/         # experiência de entrada
│   └── bottle/[id].tsx     # detalhe da garrafa
└── src/
    ├── components/         # UI (ui/) + componentes de domínio
    ├── hooks/              # TanStack Query (bottles, cellars, user)
    ├── lib/                # api-client, query-client, contexto de usuário
    └── theme/              # tokens: cores, tipografia, espaçamento, motion
```

---

## 🎨 Identidade visual

Direção estética: **quiet luxury** (Aesop, The Row) com sotaque **wine-native**
(Penfolds, châteaux). Paleta editorial em dois temas, tipografia *Fraunces*
(display) + *Inter* (texto). Detalhes completos no
[spec de identidade visual](docs/superpowers/specs/2026-06-16-vineo-visual-identity-design.md).

| Token | Dark | Light |
|---|---|---|
| `bg` | `#141210` | `#FAF9F6` |
| `accent` (bordô) | `#A03B4A` | `#7A202F` |
| `champagne` | `#C9A961` | `#B8860B` |

---

## 🤝 Contribuindo

1. Crie uma branch a partir de `main`.
2. Rode `npm run lint && npm run typecheck` antes de abrir o PR.
3. Toda nova feature deve vir acompanhada de testes (Vitest/Jest).

---

<div align="center">
<sub>Feito com 🍷 — <strong>Víneo</strong></sub>
</div>
