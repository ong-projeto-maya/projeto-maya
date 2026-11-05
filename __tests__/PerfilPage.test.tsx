/**
 * Component tests for the Donor Perfil (profile) page.
 *
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PerfilPage from '../app/doador/perfil/page'

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

// ---- Supabase mock (for password change and delete-account flows) ----
const mockUpdateUser = vi.fn()
const mockGetUser = vi.fn()
const mockGetSession = vi.fn()
vi.mock('@/lib/supabase', () => ({
  createClient: () => ({
    auth: {
      updateUser: mockUpdateUser,
      getUser: mockGetUser,
      getSession: mockGetSession,
    },
  }),
}))

// ---- hook mock ----
const mockUpdateProfile = vi.fn()
const mockLogout = vi.fn()

interface MockDoador {
  id: string
  name: string
  email: string
  phone?: string
  cpf?: string
  totalDonated: number
  donationCount: number
  firstDonation: string
  level: 'bronze'
  donations: never[]
}

let mockDoador: MockDoador | null = null
let mockIsLoading = false

vi.mock('@/hooks/useDoador', () => ({
  useDoador: () => ({
    doador: mockDoador,
    isLoading: mockIsLoading,
    updateProfile: mockUpdateProfile,
    logout: mockLogout,
  }),
}))

const baseDoador: MockDoador = {
  id: 'u1',
  name: 'Ana Lima',
  email: 'ana@test.com',
  phone: '11999999999',
  cpf: undefined,
  totalDonated: 100,
  donationCount: 2,
  firstDonation: '2024-01-01',
  level: 'bronze',
  donations: [],
}

describe('PerfilPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDoador = null
    mockIsLoading = false
  })

  it('redirects to login when doador is null and not loading', async () => {
    mockDoador = null
    mockIsLoading = false
    render(<PerfilPage />)
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/doador/login'))
  })

  it('shows loading spinner when isLoading=true', () => {
    mockIsLoading = true
    render(<PerfilPage />)
    expect(document.querySelector('.animate-spin')).not.toBeNull()
  })

  it('renders profile form with doador data', () => {
    mockDoador = baseDoador
    render(<PerfilPage />)
    const nameInput = document.querySelector('input[value="Ana Lima"]') as HTMLInputElement
    expect(nameInput).not.toBeNull()
    expect(nameInput.value).toBe('Ana Lima')
  })

  it('calls updateProfile with the current form values on save', async () => {
    mockUpdateProfile.mockResolvedValue(undefined)
    mockDoador = { ...baseDoador, name: 'Novo Nome', phone: '11912345678' }
    render(<PerfilPage />)

    // Wait for useEffect to populate form fields from doador
    await act(async () => {})

    // Click the save button; the form should pass the current state values
    const saveBtn = screen.getByRole('button', { name: /salvar/i })
    await act(async () => { fireEvent.click(saveBtn) })

    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Novo Nome', phone: '11912345678' })
    )
  })

  it('shows success message after profile saved', async () => {
    mockUpdateProfile.mockResolvedValue(undefined)
    mockDoador = baseDoador
    render(<PerfilPage />)

    const saveBtn = screen.getByRole('button', { name: /salvar/i })
    await act(async () => { fireEvent.click(saveBtn) })

    await waitFor(() =>
      expect(screen.getByText(/atualizado com sucesso/i)).toBeDefined()
    )
  })

  it('shows error message when updateProfile throws', async () => {
    mockUpdateProfile.mockRejectedValue(new Error('DB error'))
    mockDoador = baseDoador
    render(<PerfilPage />)

    const saveBtn = screen.getByRole('button', { name: /salvar/i })
    await act(async () => { fireEvent.click(saveBtn) })

    await waitFor(() =>
      expect(screen.getByText(/erro ao atualizar perfil/i)).toBeDefined()
    )
  })
})
