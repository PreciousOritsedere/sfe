import type { ApiErrorBody, ApiSuccess } from '@/types/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.'

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const isNotFound = (error: unknown) => error instanceof ApiError && error.status === 404

function isErrorBody(body: unknown): body is ApiErrorBody {
  if (typeof body !== 'object' || body === null || !('error' in body)) return false
  const { error } = body
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error
}

async function request<T>(path: string, init: RequestInit = {}): Promise<ApiSuccess<T>> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    })
  } catch (err) {
    // Let callers (e.g. React Query) recognise their own cancellations.
    if (init.signal?.aborted) throw err
    throw new ApiError(0, 'NETWORK_ERROR', 'Check your connection and try again.')
  }

  const body: unknown = await res.json().catch(() => null)

  if (!res.ok) {
    if (isErrorBody(body)) throw new ApiError(res.status, body.error.code, body.error.message)
    throw new ApiError(res.status, 'UNKNOWN_ERROR', FALLBACK_MESSAGE)
  }
  if (body === null) throw new ApiError(res.status, 'INVALID_RESPONSE', FALLBACK_MESSAGE)

  return body as ApiSuccess<T>
}

export const api = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, init),
  post: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'POST', body: JSON.stringify(body) }),
}
