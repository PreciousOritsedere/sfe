import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApiError } from '@/lib/api/client'
import { getMe } from '@/lib/api/endpoints'
import type { User } from '@/types/api'
import { UserMenu } from './UserMenu'

vi.mock('@/lib/api/endpoints', () => ({ getMe: vi.fn() }))

const user: User = {
  id: 'usr_1',
  firstName: 'Amara',
  lastName: 'Okafor',
  email: 'amara@example.com',
  avatarUrl: null,
  tier: 'verified',
  wallets: [],
}

function renderMenu() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <UserMenu />
    </QueryClientProvider>
  )
  return userEvent.setup()
}

beforeEach(() => {
  vi.mocked(getMe).mockReset()
})

describe('UserMenu', () => {
  it('shows the user once their profile loads', async () => {
    vi.mocked(getMe).mockResolvedValue({ data: user })
    const userEvents = renderMenu()

    await userEvents.click(await screen.findByRole('button', { name: 'Account menu, Amara' }))

    expect(screen.getByText('Amara Okafor')).toBeInTheDocument()
    expect(screen.getByText('Verified account')).toBeInTheDocument()
  })

  it('stays usable and explains when the profile fails to load', async () => {
    vi.mocked(getMe).mockRejectedValue(new ApiError(500, 'INTERNAL_ERROR', 'Boom'))
    const userEvents = renderMenu()

    await userEvents.click(screen.getByRole('button', { name: 'Account menu' }))

    expect(await screen.findByText('Couldn’t load your profile.')).toBeInTheDocument()
  })
})
