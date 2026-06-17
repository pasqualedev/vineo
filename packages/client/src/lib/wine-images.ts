const WINE_IMAGES = [
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600',
  'https://images.unsplash.com/photo-1578911591439-6a84af2e86ea?w=600',
  'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600',
  'https://images.unsplash.com/photo-1506377247375-5cb6f5c7fd46?w=600',
  'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600',
  'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=600',
]

export function getWineImage(seed?: string): string {
  if (!seed) return WINE_IMAGES[0]

  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }

  return WINE_IMAGES[Math.abs(hash) % WINE_IMAGES.length]
}
