import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './client'

const MAX_RETRIES = 1

/** Retry network and server errors once; a 4xx (e.g. 404) won't change on retry. */
export function shouldRetry(failureCount: number, error: unknown) {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
  return failureCount < MAX_RETRIES
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: shouldRetry, staleTime: 30_000 },
    },
  })
}
