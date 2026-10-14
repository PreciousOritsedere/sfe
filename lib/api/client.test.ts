import { api, ApiError } from './client'

const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterAll(() => {
  vi.unstubAllGlobals()
})

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

async function getError(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise
  } catch (err) {
    return err
  }
  throw new Error('Expected the request to fail')
}

describe('api client', () => {
  it('returns the body of a successful response', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: { id: 'txn_1' } }))

    await expect(api.get('/transactions/txn_1')).resolves.toEqual({ data: { id: 'txn_1' } })
  })

  it('throws an ApiError with the code and message from an error body', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { code: 'NOT_FOUND', message: 'Transaction txn_x not found' } }, 404)
    )

    const err = await getError(api.get('/transactions/txn_x'))

    expect(err).toBeInstanceOf(ApiError)
    expect(err).toMatchObject({ status: 404, code: 'NOT_FOUND', message: 'Transaction txn_x not found' })
  })

  it('throws an ApiError with a fallback message when the error body is not JSON', async () => {
    fetchMock.mockResolvedValue(new Response('Bad gateway', { status: 502 }))

    const err = await getError(api.get('/me'))

    expect(err).toMatchObject({ status: 502, code: 'UNKNOWN_ERROR' })
  })

  it('throws a network ApiError when the request cannot be made', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    const err = await getError(api.get('/me'))

    expect(err).toMatchObject({ status: 0, code: 'NETWORK_ERROR' })
  })

  it('rethrows aborts untouched so callers can tell cancellations apart', async () => {
    const controller = new AbortController()
    controller.abort()
    const abortError = new DOMException('Aborted', 'AbortError')
    fetchMock.mockRejectedValue(abortError)

    const err = await getError(api.get('/transactions', { signal: controller.signal }))

    expect(err).toBe(abortError)
  })
})
