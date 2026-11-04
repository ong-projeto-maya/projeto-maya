/**
 * Component tests for the Donor Login page.
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import DoadorLoginPage from '../app/doador/login/page'

// ---- Next.js mocks ----
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => <img {...props} />,
}))

// ---- hook mock ----
const mockLogin = vi.fn()
let mockDoador: Record<string, string> | null = null

vi.mock('@/hooks/useDoador', () => ({
  useDoador: () => ({
    doador: mockDoador,
    isLoading: false,
    login: mockLogin,
  }),
}))

describe('DoadorLoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDoador = null
  })

  it('renders email and password fields', () => {
    render(<DoadorLoginPage />)
    expect(screen.getByRole('textbox', { name: /email/i })).toBeDefined()
    // password input is type=password, not a textbox role
    expect(document.querySelector('input[type="password"]')).not.toBeNull()
  })

  it('shows validation error when submitting with empty fields', async () => {
    const { container } = render(<DoadorLoginPage />)
    // fireEvent.click on a submit button is blocked by the browser's native required
    // validation in jsdom — use fireEvent.submit on the form to bypass it.
    const form = container.querySelector('form')!
    await act(async () => { fireEvent.submit(form) })
    expect(screen.getByText(/preencha todos os campos/i)).toBeDefined()
    expect(mockLogin).not.toHaveBeenCalled()
  })

  // useDoador's login() resolves to null on success, or to the message to show
  // the donor. It is not a boolean: a truthy value means the login FAILED.
  it('calls login() with email and password on submit', async () => {
    mockLogin.mockResolvedValue(null)
    render(<DoadorLoginPage />)

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'donor@test.com' },
    })
    fireEvent.change(document.querySelector('input[type="password"]')!, {
      target: { value: 'pass123' },
    })
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /entrar/i })) })

    expect(mockLogin).toHaveBeenCalledWith('donor@test.com', 'pass123')
  })

  it('redirects to dashboard on successful login', async () => {
    mockLogin.mockResolvedValue(null)
    render(<DoadorLoginPage />)

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'donor@test.com' },
    })
    fireEvent.change(document.querySelector('input[type="password"]')!, {
      target: { value: 'pass123' },
    })
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /entrar/i })) })

    expect(mockPush).toHaveBeenCalledWith('/doador/dashboard')
  })

  it('shows the message login() returned on a failed attempt', async () => {
    mockLogin.mockResolvedValue('Email ou senha inválidos')
    render(<DoadorLoginPage />)

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'donor@test.com' },
    })
    fireEvent.change(document.querySelector('input[type="password"]')!, {
      target: { value: 'wrongpass' },
    })
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /entrar/i })) })

    expect(screen.getByText(/email ou senha inválidos/i)).toBeDefined()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('redirects to dashboard when doador is already logged in', async () => {
    mockDoador = { id: 'u1', name: 'Test', email: 'donor@test.com' }
    render(<DoadorLoginPage />)
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/doador/dashboard'))
  })
})
