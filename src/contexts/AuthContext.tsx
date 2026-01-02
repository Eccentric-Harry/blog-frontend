// frontend: src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { api } from '../api'

// Types
export type User = {
  id: number
  username: string
  email: string
  displayName?: string
  avatarUrl?: string
  role: 'USER' | 'ADMIN'
}

export type AuthState = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
}

export type AuthContextType = AuthState & {
  login: (usernameOrEmail: string, password: string) => Promise<void>
  register: (
    username: string,
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

// Constants
const TOKEN_KEY = 'blog_access_token'

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = user !== null
  const isAdmin = user?.role === 'ADMIN'

  // Get token from localStorage
  const getToken = () => localStorage.getItem(TOKEN_KEY)

  // Save token to localStorage
  const saveToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)

  // Remove token from localStorage
  const removeToken = () => localStorage.removeItem(TOKEN_KEY)

  // Fetch current user from API
  const refreshUser = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const response = await api.getCurrentUser()
      if (response.user) {
        setUser(response.user as User)
      }
    } catch {
      // Token expired or invalid
      removeToken()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Login
  const login = async (usernameOrEmail: string, password: string) => {
    const response = await api.login(usernameOrEmail, password)
    if (response.accessToken) {
      saveToken(response.accessToken)
    }
    if (response.user) {
      setUser(response.user as User)
    }
  }

  // Register
  const register = async (
    username: string,
    email: string,
    password: string,
    displayName?: string,
  ) => {
    const response = await api.register(username, email, password, displayName)
    if (response.accessToken) {
      saveToken(response.accessToken)
    }
    if (response.user) {
      setUser(response.user as User)
    }
  }

  // Logout
  const logout = () => {
    removeToken()
    setUser(null)
  }

  // Check authentication on mount
  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
