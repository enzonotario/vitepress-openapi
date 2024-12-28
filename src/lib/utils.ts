import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollIntoOperationByOperationId({
  hash,
  offset = 0,
  container,
}: {
  hash: string
  offset?: number
  container?: HTMLElement
}) {
  if (!import.meta.env.SSR) {
    const element = document.querySelector(
      hash
        // . escape { and } characters
        .replace(/([{}])/g, '\\$1'),
    )

    if (!element) {
      return
    }

    container = container || document.body

    container.scrollTo({
      behavior: 'smooth',
      top:
          element.getBoundingClientRect().top
          - document.body.getBoundingClientRect().top
          - offset,
    })

    window.location.hash = hash
  }
}
