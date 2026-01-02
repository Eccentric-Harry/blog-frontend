import { Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { PostListPage } from './routes/PostListPage'
import { PostDetailPage } from './routes/PostDetailPage'
import { PostFormPage } from './routes/PostFormPage'
import { LoginPage } from './routes/LoginPage'
import { CategoriesPage } from './routes/CategoriesPage'
import { TagsPage } from './routes/TagsPage'
import { ArchivesPage } from './routes/ArchivesPage'
import { MainLayout } from './components/layout/MainLayout'
import { AuthProvider, useAuth } from './contexts/AuthContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

/**
 * About page placeholder
 */

const AboutPage = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">About</h1>
    <p className="text-gray-600 dark:text-gray-400">
      Welcome to my personal blog.
    </p>
  </div>
)

/**
 * Protected route that requires admin role
 */
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function AppContent() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<PostListPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/create"
          element={
            <AdminRoute>
              <PostFormPage mode="create" />
            </AdminRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <AdminRoute>
              <PostFormPage mode="edit" />
            </AdminRoute>
          }
        />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/archives" element={<ArchivesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 4000,
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}
