import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isLocalStorageAvailable(): boolean {
  return typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function'
}

export function scrollToHash({
  hash,
}: {
  hash: string
  offset?: number
  container?: HTMLElement
}) {
  if (typeof window === 'undefined') {
    return
  }

  const element = document.querySelector(
    hash
      .replace(/([{}])/g, '\\$1'),
  )

  if (!element) {
    return
  }

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
  })

  window.location.hash = hash
}
