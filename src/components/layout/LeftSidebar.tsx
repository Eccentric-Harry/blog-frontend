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
import { BsTwitterX, BsGithub, BsLinkedin, BsMedium } from 'react-icons/bs'
import profileImage from '../../assets/profile.jpg'
import { VisitorCounter } from '../VisitorCounter'
import { ServerStatus } from '../ServerStatus'
import { UserStatus } from '../UserStatus'

type NavItem = {
  label: string
  path: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const navItems: NavItem[] = [
  { label: 'home', path: '/', icon: HiOutlineHome },
  { label: 'categories', path: '/categories', icon: HiOutlineFolder },
  { label: 'tags', path: '/tags', icon: HiOutlineTag },
  { label: 'archives', path: '/archives', icon: HiOutlineArchiveBox },
  { label: 'about', path: '/about', icon: HiOutlineInformationCircle },
]

type SocialLink = {
  label: string
  url: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const socialLinks: SocialLink[] = [
  { label: 'X', url: 'https://x.com/harrrybuilds', icon: BsTwitterX },
  {
    label: 'GitHub',
    url: 'https://github.com/Eccentric-Harry',
    icon: BsGithub,
  },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/', icon: BsLinkedin },
  { label: 'Medium', url: 'https://eccentricharry.medium.com', icon: BsMedium },
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
  blogTitle = 'harry',
  blogSubtitle = 'developer',
  avatarUrl = profileImage,
  darkMode = false,
  onToggleDarkMode,
  isAdmin = false,
}: LeftSidebarProps) => {
  const location = useLocation()

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0 border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#121212] p-5">
      {/* Avatar & Title */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-xl overflow-hidden mb-3 ring-2 ring-blue-100 dark:ring-blue-900/50">
          <img
            src={avatarUrl}
            alt={blogTitle}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-lg font-mono font-bold text-gray-900 dark:text-white text-center flex items-center gap-1">
          <span className="text-gray-400 dark:text-gray-600">$</span>
          {blogTitle}
          <span className="w-2 h-4 bg-blue-500 dark:bg-blue-400 animate-cursor" />
        </h1>
        <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
          {blogSubtitle}
        </p>
        <UserStatus className="mt-2" showLabel={true} />
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-600">
            // navigation
          </span>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const IconComponent = item.icon
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-2 border-blue-500'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <IconComponent size={18} />
                  <span>/{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Admin Write Button */}
        {isAdmin && (
          <div className="mt-4">
            <Link
              to="/create"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-mono font-bold text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <HiOutlinePencilSquare size={16} />$ write --new
            </Link>
          </div>
        )}
      </nav>

      {/* Actions */}
      <div className="py-3 border-t border-gray-200 dark:border-neutral-800">
        <div className="mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-600">
            // actions
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg font-mono text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {darkMode ? <HiOutlineSun size={18} /> : <HiOutlineMoon size={18} />}
          <span>{darkMode ? 'light_mode' : 'dark_mode'}</span>
        </button>
      </div>

      {/* Social Links */}
      <div className="py-3 border-t border-gray-200 dark:border-neutral-800">
        <div className="mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-600">
            // connect
          </span>
        </div>
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => {
            const IconComponent = link.icon
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label={link.label}
              >
                <IconComponent size={16} />
              </a>
            )
          })}
        </div>
      </div>

      {/* System Status */}
      <div className="pt-3 border-t border-gray-200 dark:border-neutral-800">
        <div className="mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-600">
            // system
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-neutral-800/50">
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
            <VisitorCounter className="text-[10px] font-mono" />
          </div>
        </div>
      </div>
    </aside>
  )
}
