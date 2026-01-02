// frontend: src/components/layout/MainLayout.tsx
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LeftSidebar } from './LeftSidebar'
import { RightSidebar } from './RightSidebar'
import { MobileNav } from './MobileNav'
import { useAuth } from '../../contexts/AuthContext'

type MainLayoutProps = {
  children: React.ReactNode
  showRightSidebar?: boolean
}

export const MainLayout = ({
  children,
  showRightSidebar = true,
}: MainLayoutProps) => {
  const [, setSearchParams] = useSearchParams()
  const { isAdmin } = useAuth()
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved
      ? JSON.parse(saved)
      : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const handleSearch = (query: string) => {
    setSearchParams({ q: query, page: '0' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-gray-100">
      {/* Mobile Navigation */}
      <MobileNav
        blogTitle="Harry"
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        isAdmin={isAdmin}
      />

      {/* Desktop Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <LeftSidebar
          blogTitle="Harry"
          blogSubtitle="Personal blog"
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          isAdmin={isAdmin}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 py-8 lg:px-8 lg:py-10">
          <div className="max-w-3xl mx-auto">{children}</div>
        </main>

        {/* Right Sidebar */}
        {showRightSidebar && <RightSidebar onSearch={handleSearch} />}
      </div>
    </div>
  )
}
