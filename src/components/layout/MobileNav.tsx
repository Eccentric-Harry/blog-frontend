// frontend: src/components/layout/MobileNav.tsx
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from '@mdi/react'
import {
  mdiMenu,
  mdiClose,
  mdiHome,
  mdiTagMultiple,
  mdiFolderMultiple,
  mdiArchive,
  mdiInformationOutline,
  mdiPencil,
  mdiWeatherNight,
  mdiWeatherSunny,
} from '@mdi/js'

type MobileNavProps = {
  blogTitle?: string
  avatarUrl?: string
  darkMode: boolean
  onToggleDarkMode: () => void
  isAdmin?: boolean
}

const navItems = [
  { label: 'Home', path: '/', icon: mdiHome },
  { label: 'Categories', path: '/categories', icon: mdiFolderMultiple },
  { label: 'Tags', path: '/tags', icon: mdiTagMultiple },
  { label: 'Archives', path: '/archives', icon: mdiArchive },
  { label: 'About', path: '/about', icon: mdiInformationOutline },
]

export const MobileNav = ({
  blogTitle = 'My Blog',
  avatarUrl = 'https://api.dicebear.com/7.x/avataaars/svg?seed=blog',
  darkMode,
  onToggleDarkMode,
  isAdmin = false,
}: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open menu"
          >
            <Icon path={mdiMenu} size={1} />
          </button>

          {/* Title */}
          <Link to="/" className="font-bold text-lg">
            {blogTitle}
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={
                darkMode ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              <Icon
                path={darkMode ? mdiWeatherSunny : mdiWeatherNight}
                size={0.9}
              />
            </button>
            {isAdmin && (
              <Link
                to="/create"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 dark:text-blue-400"
                aria-label="Write new post"
              >
                <Icon path={mdiPencil} size={0.9} />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-50"
            onClick={closeMenu}
          />

          {/* Drawer */}
          <div className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 z-50 shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl}
                  alt={blogTitle}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-bold">{blogTitle}</span>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close menu"
              >
                <Icon path={mdiClose} size={1} />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="p-4">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={closeMenu}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <Icon path={item.icon} size={1} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Admin Section */}
            {isAdmin && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <Link
                  to="/create"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Icon path={mdiPencil} size={0.9} />
                  Write New Post
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
