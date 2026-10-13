import { ApiError } from './client'
import { shouldRetry } from './queryClient'

describe('shouldRetry', () => {
  it('retries server and network errors once', () => {
    const serverError = new ApiError(500, 'INTERNAL_ERROR', 'Boom')
    const networkError = new ApiError(0, 'NETWORK_ERROR', 'Offline')

    expect(shouldRetry(0, serverError)).toBe(true)
    expect(shouldRetry(1, serverError)).toBe(false)
    expect(shouldRetry(0, networkError)).toBe(true)
  })

  it('never retries client errors', () => {
    expect(shouldRetry(0, new ApiError(404, 'NOT_FOUND', 'Not found'))).toBe(false)
    expect(shouldRetry(0, new ApiError(400, 'BAD_REQUEST', 'Bad request'))).toBe(false)
  })
})
