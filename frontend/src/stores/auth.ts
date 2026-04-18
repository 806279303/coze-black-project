import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  role: 'admin' | 'operator' | 'anchor' | 'editor'
  realName: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      
      login: async (username: string, password: string) => {
        // 简化版：实际应该调用后端API
        if (username && password) {
          set({
            isAuthenticated: true,
            user: {
              id: '1',
              username,
              role: 'admin',
              realName: '大V',
            },
            token: 'demo-token',
          })
          return true
        }
        return false
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
