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
