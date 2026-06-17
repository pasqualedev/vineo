# Regras do Projeto

## 1. Reanimated vs NativeWind

Por usarmos `react-native-reanimated` como motor de animações, fica proibido o uso de NativeWind (ou qualquer biblioteca Tailwind para React Native). Todo estilo deve ser definido via `StyleSheet.create()` nativo com tema centralizado em `src/theme/`, garantindo compatibilidade total com `useAnimatedStyle`.

## 2. Babel Config e Reanimated Plugin

Não adicionar `react-native-reanimated/plugin` manualmente no `babel.config.js`. O `babel-preset-expo` (Expo SDK 54+) gerencia automaticamente o plugin do Reanimated. Adicioná-lo manualmente causa o erro: `TypeError: Cannot read property 'experiment' of undefined`.

Regra: `babel.config.js` deve conter apenas `presets: ['babel-preset-expo']` + `babel-plugin-module-resolver` para resolver o alias `@/`. Nada mais de plugins, a menos que haja necessidade explícita e testada.

## 3. Path Alias `@/` — Configuração Dupla

O alias `@/` (mapeando para `./src`) funciona em duas camadas:
- **TypeScript**: configurado em `tsconfig.json` via `paths` + `baseUrl`
- **Metro/Babel**: configurado em `babel.config.js` via `babel-plugin-module-resolver`

Ambos são obrigatórios. Sem o plugin do babel, o Metro não resolve `@/` e o app quebra em runtime com `Error: Cannot find module '@/...'`.

## 4. Metro Config — Package Exports

Em projetos Expo SDK 55+ com Hermes + New Architecture, adicionar `config.resolver.unstable_enablePackageExports = false` no `metro.config.js`. Sem isso, ocorre `[runtime not ready]: TypeError: Cannot read property 'X' of undefined` durante a inicialização, causado por resolução incorreta de pacotes com `exports` no package.json.
