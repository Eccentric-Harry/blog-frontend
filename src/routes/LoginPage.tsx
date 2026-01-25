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
      toast.success('Welcome back!')
      navigate('/')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#151515] rounded-2xl shadow-lg border border-gray-100 dark:border-[#2a2a2a] p-8">
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username/Email */}
            <div>
              <label
                htmlFor="usernameOrEmail"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200"
              >
                Username or Email
              </label>
              <input
                id="usernameOrEmail"
                type="text"
                value={formData.usernameOrEmail}
                onChange={(e) =>
                  setFormData({ ...formData, usernameOrEmail: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-[#2f2f2f] rounded-lg bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                placeholder="Enter username or email"
                required
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2.5 pr-10 border border-gray-200 dark:border-[#2f2f2f] rounded-lg bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon path={showPassword ? mdiEyeOff : mdiEye} size={0.9} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isLoading && (
                <Icon path={mdiLoading} size={0.9} className="animate-spin" />
              )}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
