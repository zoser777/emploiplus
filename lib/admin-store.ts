import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Mot de passe admin — configurable via variable d'environnement
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'emploiplus2024'

interface AdminState {
  isAdminAuthenticated: boolean
  adminLogin: (password: string) => boolean
  adminLogout: () => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminLogin: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAdminAuthenticated: true })
          return true
        }
        return false
      },
      adminLogout: () => set({ isAdminAuthenticated: false }),
    }),
    {
      name: 'emploi-plus-admin-storage',
      partialize: (state) => ({
        isAdminAuthenticated: state.isAdminAuthenticated,
      }),
    }
  )
)
