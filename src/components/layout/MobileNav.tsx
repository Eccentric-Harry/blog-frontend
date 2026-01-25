// frontend: src/components/layout/MobileNav.tsx
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineHome,
  HiOutlineTag,
  HiOutlineFolder,
  HiOutlineArchiveBox,
  HiOutlineInformationCircle,
  HiOutlinePencilSquare,
  HiOutlineMoon,
  HiOutlineSun,
} from 'react-icons/hi2'
import profileImage from '../../assets/profile.jpg'
import { VisitorCounter } from '../VisitorCounter'

type MobileNavProps = {
  blogTitle?: string
  avatarUrl?: string
  darkMode: boolean
  onToggleDarkMode: () => void
  isAdmin?: boolean
}

const navItems = [
  { label: 'Home', path: '/', icon: HiOutlineHome },
  { label: 'Categories', path: '/categories', icon: HiOutlineFolder },
  { label: 'Tags', path: '/tags', icon: HiOutlineTag },
  { label: 'Archives', path: '/archives', icon: HiOutlineArchiveBox },
  { label: 'About', path: '/about', icon: HiOutlineInformationCircle },
]

export const MobileNav = ({
  blogTitle = 'My Blog',
  avatarUrl = profileImage,
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
      <header className="lg:hidden sticky top-0 z-50 border-b border-gray-200 dark:border-[#2d2d2d] bg-gray-50/95 dark:bg-[#121212]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e1e1e]"
            aria-label="Open menu"
          >
            <HiOutlineBars3 size={24} />
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
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e1e1e]"
              aria-label={
                darkMode ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              {darkMode ? (
                <HiOutlineSun size={20} />
              ) : (
                <HiOutlineMoon size={20} />
              )}
            </button>
            {isAdmin && (
              <Link
                to="/create"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e1e1e] text-blue-600 dark:text-blue-400"
                aria-label="Write new post"
              >
                <HiOutlinePencilSquare size={20} />
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
          <div className="lg:hidden fixed inset-y-0 left-0 w-72 bg-gray-50 dark:bg-[#121212] z-50 shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#2d2d2d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-[#1e1e1e] shadow-md">
                  <img
                    src={avatarUrl}
                    alt={blogTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">{blogTitle}</span>
                  <VisitorCounter className="mt-1" />
                </div>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e1e1e]"
                aria-label="Close menu"
              >
                <HiOutlineXMark size={24} />
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  const IconComponent = item.icon
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={closeMenu}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e1e1e]'
                        }`}
                      >
                        <IconComponent size={22} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Admin Section */}
            {isAdmin && (
              <div className="p-4 border-t border-gray-200 dark:border-[#2d2d2d]">
                <Link
                  to="/create"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <HiOutlinePencilSquare size={18} />
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
