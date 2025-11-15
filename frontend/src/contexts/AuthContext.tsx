import { createContext, useContext, useState, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../api/client'
import { clearStoredToken, getStoredToken, persistToken } from '../lib/auth'
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/api'

interface AuthContextValue {
  token: string | null
  user: User | null
  login: (values: LoginPayload) => Promise<AuthResponse>
  register: (values: RegisterPayload) => Promise<User>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(() => getStoredToken())

  const meQuery = useQuery<User>({
    ...api.meQuery(),
    enabled: Boolean(token)
  })

  const loginMutation = useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: api.login,
    onSuccess: async (data) => {
      persistToken(data.access_token)
      setToken(data.access_token)
      await queryClient.invalidateQueries({ queryKey: ['me'] })
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })

  const registerMutation = useMutation<User, Error, RegisterPayload>({ mutationFn: api.register })

  const logout = () => {
    clearStoredToken()
    setToken(null)
    queryClient.removeQueries({ queryKey: ['me'] })
    queryClient.removeQueries({ queryKey: ['cart'] })
    queryClient.removeQueries({ queryKey: ['orders'] })
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user: meQuery.data ?? null,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout,
        isLoading: meQuery.isLoading,
        isAuthenticated: Boolean(token && meQuery.data)
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
