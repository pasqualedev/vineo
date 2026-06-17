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

