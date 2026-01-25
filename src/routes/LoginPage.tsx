// frontend: src/routes/LoginPage.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import Icon from '@mdi/react'
import { mdiLoading, mdiEye, mdiEyeOff } from '@mdi/js'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  })

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/', { replace: true })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData.usernameOrEmail, formData.password)
      toast.success('Access granted!')
      navigate('/')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Authentication failed'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-8 shadow-sm">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-neutral-800">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-2 text-xs font-mono text-gray-400 dark:text-gray-600">
              login@harry.dev
            </span>
          </div>

          <h1 className="text-xl font-mono font-bold text-center mb-2 text-gray-900 dark:text-white">
            $ sudo login
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6 text-xs font-mono">
            authenticate to access admin
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username/Email */}
            <div>
              <label
                htmlFor="usernameOrEmail"
                className="block text-xs font-mono mb-2 text-gray-500 dark:text-gray-400"
              >
                user:
              </label>
              <input
                id="usernameOrEmail"
                type="text"
                value={formData.usernameOrEmail}
                onChange={(e) =>
                  setFormData({ ...formData, usernameOrEmail: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white font-mono placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="username or email"
                required
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono mb-2 text-gray-500 dark:text-gray-400"
              >
                password:
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-10 border border-gray-200 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white font-mono placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon path={showPassword ? mdiEyeOff : mdiEye} size={0.8} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-mono font-bold hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && (
                <Icon path={mdiLoading} size={0.8} className="animate-spin" />
              )}
              {isLoading ? 'authenticating...' : '$ execute'}
            </button>
          </form>
        </div>

        {/* Back to home */}
        <p className="text-center mt-6">
          <Link
            to="/"
            className="text-xs font-mono text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            ← cd ~
          </Link>
        </p>
      </div>
    </div>
  )
}
