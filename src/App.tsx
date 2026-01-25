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
 * About page
 */
import { BsTwitterX, BsGithub, BsLinkedin, BsMedium } from 'react-icons/bs'
import profileImage from './assets/profile.jpg'

const socialLinks = [
  {
    label: 'X (Twitter)',
    url: 'https://x.com/harrrybuilds',
    icon: BsTwitterX,
    username: '@harrrybuilds',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/Eccentric-Harry',
    icon: BsGithub,
    username: 'Eccentric-Harry',
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/',
    icon: BsLinkedin,
    username: 'Eccentric-Harry',
  },
  {
    label: 'Medium',
    url: 'https://eccentricharry.medium.com',
    icon: BsMedium,
    username: '@eccentricharry',
  },
]

const AboutPage = () => (
  <div className="max-w-2xl">
    {/* Profile Section */}
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
      <img
        src={profileImage}
        alt="Harry"
        className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700 shadow-lg"
      />
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Hey, I'm Harry! 👋
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Software Developer | System Design Enthusiast
        </p>
      </div>
    </div>

    {/* About Content */}
    <div className="prose dark:prose-invert max-w-none mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        About Me
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        Welcome to my corner of the internet! I'm just getting started in the
        tech world, and I'm absolutely loving the journey. This blog is where I
        document everything I learn, share my experiences, and write about
        topics that fascinate me.
      </p>
      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        I'm deeply fascinated by system design and how systems scale to handle
        millions of users. There's something magical about understanding how
        large-scale distributed systems work under the hood, from databases and
        caching to load balancing and microservices. I spend a lot of my time
        diving into these concepts and building projects to apply what I learn.
      </p>
      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        When I'm not coding, you can find me reading engineering blogs,
        exploring new technologies, or geeking out over architecture diagrams. I
        believe in learning in public, so expect to see my wins, struggles, and
        everything in between documented here.
      </p>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        Feel free to reach out if you want to collaborate, discuss tech, or just
        want to chat!
      </p>
    </div>

    {/* Social Links */}
    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Connect With Me
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {socialLinks.map((link) => {
          const IconComponent = link.icon
          return (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] hover:bg-gray-200 dark:hover:bg-[#2d2d2d] transition-colors group"
            >
              <div className="p-2 rounded-full bg-gray-200 dark:bg-[#2d2d2d] group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-colors">
                <IconComponent
                  size={24}
                  className="text-gray-700 dark:text-gray-300"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {link.label}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {link.username}
                </p>
              </div>
            </a>
          )
        })}
      </div>
    </div>
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
