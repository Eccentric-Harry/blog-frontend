// frontend: src/components/layout/LeftSidebar.tsx
import { Link, useLocation } from 'react-router-dom'
import {
  HiOutlineHome,
  HiOutlineTag,
  HiOutlineFolder,
  HiOutlineArchiveBox,
  HiOutlineInformationCircle,
  HiOutlinePencilSquare,
  HiOutlineMoon,
  HiOutlineSun,
} from 'react-icons/hi2'
import { BsTwitterX, BsGithub, BsLinkedin } from 'react-icons/bs'
import profileImage from '../../assets/profile.jpg'

type NavItem = {
  label: string
  path: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/', icon: HiOutlineHome },
  { label: 'Categories', path: '/categories', icon: HiOutlineFolder },
  { label: 'Tags', path: '/tags', icon: HiOutlineTag },
  { label: 'Archives', path: '/archives', icon: HiOutlineArchiveBox },
  { label: 'About', path: '/about', icon: HiOutlineInformationCircle },
]

type SocialLink = {
  label: string
  url: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const socialLinks: SocialLink[] = [
  {
    label: 'X',
    url: 'https://x.com',
    icon: BsTwitterX,
  },
  {
    label: 'GitHub',
    url: 'https://github.com',
    icon: BsGithub,
  },
  {
    label: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: BsLinkedin,
  },
]

type LeftSidebarProps = {
  blogTitle?: string
  blogSubtitle?: string
  avatarUrl?: string
  darkMode?: boolean
  onToggleDarkMode?: () => void
  isAdmin?: boolean
}

export const LeftSidebar = ({
  blogTitle = 'My Blog',
  blogSubtitle = 'Personal blog',
  avatarUrl = profileImage,
  darkMode = false,
  onToggleDarkMode,
  isAdmin = false,
}: LeftSidebarProps) => {
  const location = useLocation()

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0 border-r border-gray-200 dark:border-[#2d2d2d] bg-gray-50 dark:bg-[#121212] p-6">
      {/* Avatar & Title */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-white dark:ring-[#1e1e1e] shadow-lg">
          <img
            src={avatarUrl}
            alt={blogTitle}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center">
          {blogTitle}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {blogSubtitle}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const IconComponent = item.icon
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e1e1e]'
                  }`}
                >
                  <IconComponent size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Social Links */}
      <div className="pt-6 border-t border-gray-200 dark:border-[#2d2d2d]">
        {/* Admin Write Button */}
        {isAdmin && (
          <Link
            to="/create"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <HiOutlinePencilSquare size={18} />
            Write New Post
          </Link>
        )}

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {socialLinks.map((link) => {
            const IconComponent = link.icon
            return (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={
                  link.url.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="p-2.5 rounded-full bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2d2d2d] hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                title={link.label}
              >
                <IconComponent size={20} />
              </a>
            )
          })}
        </div>

        {/* Dark Mode Toggle */}
        {onToggleDarkMode && (
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="flex items-center justify-center gap-2 w-full mt-4 px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e1e1e] transition-colors text-gray-600 dark:text-gray-400"
          >
            {darkMode ? (
              <HiOutlineSun size={18} />
            ) : (
              <HiOutlineMoon size={18} />
            )}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        )}
      </div>
    </aside>
  )
}
