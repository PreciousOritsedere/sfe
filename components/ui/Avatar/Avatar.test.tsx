import { render, screen } from '@testing-library/react'
import { Avatar, getInitials } from './Avatar'

describe('getInitials', () => {
  it('uses the first letter of the first two words', () => {
    expect(getInitials('Kwame Mensah')).toBe('KM')
    expect(getInitials('Ada Okafor')).toBe('AO')
  })

  it('treats hyphenated names as separate words', () => {
    expect(getInitials('Okonkwo-Adeyemi Logistics & Haulage International Ltd')).toBe('OA')
  })

  it('handles single words, extra spaces and lowercase', () => {
    expect(getInitials('netflix')).toBe('N')
    expect(getInitials('  zainab   bello ')).toBe('ZB')
    expect(getInitials('')).toBe('')
  })
})

describe('Avatar', () => {
  it('renders the image when there is one', () => {
    render(<Avatar src="/avatar.svg" alt="Amara Test" name="Amara Test" />)

    expect(screen.getByRole('img', { name: 'Amara Test' })).toHaveAttribute('src', '/avatar.svg')
  })

  it('falls back to initials when there is no image', () => {
    render(<Avatar src={null} alt="Kwame Mensah" name="Kwame Mensah" />)

    expect(screen.getByRole('img', { name: 'Kwame Mensah' })).toHaveTextContent('KM')
  })

  it('is hidden from assistive tech when decorative', () => {
    const { container } = render(<Avatar src={null} alt="" name="Kwame Mensah" />)

    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })
})
