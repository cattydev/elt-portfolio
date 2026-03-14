import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  )
  return match ? match[1] : null
}

export function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match ? match[1] : null
}

export function getEmbedUrl(url: string): string | null {
  const ytId = getYouTubeId(url)
  if (ytId) return `https://www.youtube.com/embed/${ytId}`
  const vimeoId = getVimeoId(url)
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`
  return null
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}
