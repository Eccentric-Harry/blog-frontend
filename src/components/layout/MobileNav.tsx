// frontend: src/components/layout/MobileNav.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  HiOutlineMagnifyingGlass,
  HiOutlineUser,
  HiArrowRightOnRectangle,
  HiArrowLeftOnRectangle,
  HiOutlineCommandLine,
} from 'react-icons/hi2'
import profileImage from '../../assets/profile.jpg'
import { VisitorCounter } from '../VisitorCounter'
import { ServerStatus } from '../ServerStatus'
import { UserStatus } from '../UserStatus'
import type { User } from '../../contexts/AuthContext'

type MobileNavProps = {
  blogTitle?: string
  avatarUrl?: string
  darkMode: boolean
  onToggleDarkMode: () => void
  isAdmin?: boolean
  onSearch?: (query: string) => void
  user: User | null
  logout: () => void
}

const navItems = [
  { label: 'home', path: '/', icon: HiOutlineHome },
  { label: 'categories', path: '/categories', icon: HiOutlineFolder },
  { label: 'tags', path: '/tags', icon: HiOutlineTag },
  { label: 'archives', path: '/archives', icon: HiOutlineArchiveBox },
  { label: 'about', path: '/about', icon: HiOutlineInformationCircle },
]

export const MobileNav = ({
  blogTitle = 'harry',
  avatarUrl = profileImage,
  darkMode,
  onToggleDarkMode,
  isAdmin = false,
  onSearch,
  user,
  logout,
}: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const closeMenu = () => setIsOpen(false)
  const closeProfileMenu = () => setIsProfileOpen(false)

  const isSearchEnabled = useMemo(
    () => typeof onSearch === 'function',
    [onSearch],
  )

  // Floating search - Apple style
  useEffect(() => {
    if (showSearch) {
      document.body.style.overflow = 'hidden'
      searchInputRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showSearch])

  // ESC key to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false)
        setSearchQuery('')
      }
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSearch])

  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeMenu()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  // Close profile menu on click outside
  useEffect(() => {
    if (!isProfileOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      const toggleBtn = document.getElementById('mobile-profile-toggle')

      if (toggleBtn && toggleBtn.contains(target)) {
        return
      }

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        closeProfileMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileOpen])

  useEffect(() => {
    if (isOpen) setIsOpen(false)
    if (isProfileOpen) setIsProfileOpen(false)
    if (showSearch) setShowSearch(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    navigate(`/?q=${encodeURIComponent(q)}&page=0`)
    setShowSearch(false)
    setSearchQuery('')
  }

  const displayAvatar = user?.avatarUrl || avatarUrl
  const displayName = user?.displayName || user?.username || blogTitle
  const displayHandle = user?.username ? `@${user.username}` : ''

  return (
    <>
      {/* Floating Search Overlay - Apple/Spotlight Style */}
      {showSearch && (
        <>
          <div
            className="floating-search-overlay animate-fade-in"
            onClick={() => {
              setShowSearch(false)
              setSearchQuery('')
            }}
          />
          <div className="floating-search-container animate-slide-up">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <HiOutlineMagnifyingGlass
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="floating-search-input"
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 rounded border border-gray-200 dark:border-neutral-700">
                    ESC
                  </kbd>
                </div>
              </div>
            </form>
            {/* Search hints */}
            <div className="mt-4 px-2 text-xs font-mono text-gray-500 dark:text-gray-500">
              <p>Type to search posts, tags, or categories...</p>
              <p className="mt-1">
                Press{' '}
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded text-gray-600 dark:text-gray-400">
                  ⌘K
                </kbd>{' '}
                anywhere to open
              </p>
            </div>
          </div>
        </>
      )}

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 h-14 relative">
          {/* Left: Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <HiOutlineBars3 size={24} />
          </button>

          {/* Center: Terminal-style Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <span className="font-mono text-lg font-bold tracking-tight text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span className="text-gray-400 dark:text-gray-600">$</span>
              ~/harry
              <span className="w-2 h-5 bg-blue-500 dark:bg-blue-400 animate-cursor" />
            </span>
          </Link>

          {/* Right: Search + Profile */}
          <div className="flex items-center gap-1">
            {isSearchEnabled && (
              <button
                type="button"
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                aria-label="Search"
              >
                <HiOutlineMagnifyingGlass size={22} />
              </button>
            )}
            {/* Profile Picture */}
            <button
              id="mobile-profile-toggle"
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-neutral-700 hover:ring-blue-500 dark:hover:ring-blue-400 active:scale-95 transition-all"
            >
              <img
                src={displayAvatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* Profile Menu - Floating Card */}
        {isProfileOpen && (
          <div
            ref={profileMenuRef}
            className="absolute top-14 right-4 w-64 bg-white dark:bg-neutral-900 rounded-xl shadow-lg dark:shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden z-50 animate-fade-in"
          >
            {/* User Info */}
            <div className="p-4 border-b border-gray-100 dark:border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-neutral-700">
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono font-bold text-gray-900 dark:text-white truncate">
                    {displayName}
                  </p>
                  {displayHandle && (
                    <p className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate">
                      {displayHandle}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  to="/about"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  view profile →
                </Link>
                <UserStatus showLabel={true} size="sm" />
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {isAdmin && (
                <Link
                  to="/create"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-mono text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  onClick={closeProfileMenu}
                >
                  <HiOutlinePencilSquare size={18} />
                  write --new
                </Link>
              )}

              <button
                onClick={onToggleDarkMode}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-mono text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
              >
                {darkMode ? (
                  <HiOutlineSun size={18} />
                ) : (
                  <HiOutlineMoon size={18} />
                )}
                {darkMode ? 'light mode' : 'dark mode'}
              </button>

              <Link
                to="/about"
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-mono text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                onClick={closeProfileMenu}
              >
                <HiOutlineUser size={18} />
                whoami
              </Link>
            </div>

            {/* Sign Out / Sign In */}
            <div className="border-t border-gray-100 dark:border-neutral-800 py-2">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      logout()
                      closeProfileMenu()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-mono text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <HiArrowRightOnRectangle size={18} />
                    logout
                  </button>
                  <div className="px-4 py-2 text-xs font-mono text-gray-400 dark:text-gray-500 text-center">
                    {user.email}
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-mono text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  onClick={closeProfileMenu}
                >
                  <HiArrowLeftOnRectangle size={18} />
                  login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-50 animate-fade-in"
            onClick={closeMenu}
          />

          {/* Drawer */}
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 z-50 overflow-y-auto animate-slide-in-left"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden ring-2 ring-blue-100 dark:ring-blue-900/50">
                  <img
                    src={avatarUrl}
                    alt={blogTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono font-bold text-gray-900 dark:text-white">
                    {blogTitle}
                  </span>
                  <UserStatus showLabel={true} className="text-xs" />
                </div>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                aria-label="Close menu"
              >
                <HiOutlineXMark size={24} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="py-4">
              <div className="px-4 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-600">
                  // navigation
                </span>
              </div>
              <ul>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  const IconComponent = item.icon
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={closeMenu}
                        className={`flex items-center gap-3 px-4 py-3 font-mono text-sm transition-colors ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-2 border-blue-500'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <IconComponent size={20} />
                        <span>/{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Actions Section */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-neutral-800">
              <div className="px-0 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-600">
                  // actions
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeMenu()
                  setShowSearch(true)
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 font-mono text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg"
              >
                <HiOutlineCommandLine size={18} />
                <span>⌘K search</span>
              </button>
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="flex items-center gap-3 w-full px-3 py-2.5 font-mono text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg"
              >
                {darkMode ? (
                  <HiOutlineSun size={18} />
                ) : (
                  <HiOutlineMoon size={18} />
                )}
                <span>{darkMode ? 'light_mode' : 'dark_mode'}</span>
              </button>
            </div>

            {/* Admin Section */}
            {isAdmin && (
              <div className="p-4 border-t border-gray-100 dark:border-neutral-800">
                <Link
                  to="/create"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-mono font-bold text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  <HiOutlinePencilSquare size={18} />$ write --new
                </Link>
              </div>
            )}

            {/* System Status */}
            <div className="px-4 py-4 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950">
              <div className="mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-600">
                  // system
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white dark:bg-neutral-800">
                <div className="flex items-center gap-3">
                  <ServerStatus showLabel={false} />
                  <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                    api
                  </span>
                </div>
                <div className="h-3 w-px bg-gray-200 dark:bg-neutral-700" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                    visitors:
                  </span>
                  <VisitorCounter className="!mt-0 text-[10px] font-mono" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
