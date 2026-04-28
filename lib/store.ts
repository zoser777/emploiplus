import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  city: string
  type: 'candidat' | 'entreprise'
}

interface Application {
  id: string
  jobId: string | number
  jobTitle: string
  company: string
  date: string
  status: 'En cours' | 'Entretien' | 'Accepte' | 'Refuse'
}

interface FormationRegistration {
  id: string
  formationId: string | number
  formationTitle: string
  date: string
  status: 'En attente' | 'Confirmee'
}

// Universal job type that works with both static (number id) and API (string id) jobs
export interface AnyJob {
  id: string | number
  title: string
  company: string
  sector: string
  city: string
  type: string
  exp: string
  salary: string
  date: string
  logo: string
  color: string
  desc: string
  tags: string[]
  isActive?: boolean
}

interface AppState {
  user: User | null
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => void

  savedJobs: Array<string | number>
  toggleSaveJob: (jobId: string | number) => void
  isJobSaved: (jobId: string | number) => boolean

  applications: Application[]
  addApplication: (jobId: string | number, jobTitle: string, company: string) => void

  formationRegistrations: FormationRegistration[]
  addFormationRegistration: (formationId: string | number, formationTitle: string) => void

  newsletterEmail: string | null
  subscribeNewsletter: (email: string) => void

  authModalOpen: boolean
  authModalTab: 'login' | 'register'
  setAuthModalOpen: (open: boolean, tab?: 'login' | 'register') => void

  applyModalOpen: boolean
  applyModalJob: AnyJob | null
  setApplyModalOpen: (open: boolean, job?: AnyJob) => void

  formationModalOpen: boolean
  formationModalId: string | number | null
  setFormationModalOpen: (open: boolean, formationId?: string | number) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false, applications: [], savedJobs: [] }),

      savedJobs: [],
      toggleSaveJob: (jobId) => set((state) => {
        const id = String(jobId)
        const exists = state.savedJobs.some(j => String(j) === id)
        return {
          savedJobs: exists
            ? state.savedJobs.filter(j => String(j) !== id)
            : [...state.savedJobs, jobId]
        }
      }),
      isJobSaved: (jobId) => {
        const id = String(jobId)
        return get().savedJobs.some(j => String(j) === id)
      },

      applications: [],
      addApplication: (jobId, jobTitle, company) => set((state) => ({
        applications: [
          {
            id: `app-${Date.now()}`,
            jobId,
            jobTitle,
            company,
            date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: 'En cours',
          },
          ...state.applications,
        ],
      })),

      formationRegistrations: [],
      addFormationRegistration: (formationId, formationTitle) => set((state) => ({
        formationRegistrations: [
          {
            id: `form-${Date.now()}`,
            formationId,
            formationTitle,
            date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: 'En attente',
          },
          ...state.formationRegistrations,
        ],
      })),

      newsletterEmail: null,
      subscribeNewsletter: (email) => set({ newsletterEmail: email }),

      authModalOpen: false,
      authModalTab: 'login',
      setAuthModalOpen: (open, tab = 'login') => set({ authModalOpen: open, authModalTab: tab }),

      applyModalOpen: false,
      applyModalJob: null,
      setApplyModalOpen: (open, job) => set({ applyModalOpen: open, applyModalJob: job ?? null }),

      formationModalOpen: false,
      formationModalId: null,
      setFormationModalOpen: (open, formationId) => set({ formationModalOpen: open, formationModalId: formationId ?? null }),
    }),
    {
      name: 'emploi-plus-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        savedJobs: state.savedJobs,
        applications: state.applications,
        formationRegistrations: state.formationRegistrations,
        newsletterEmail: state.newsletterEmail,
      }),
    }
  )
)
