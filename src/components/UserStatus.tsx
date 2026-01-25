// frontend: src/components/UserStatus.tsx
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

export type StatusType = 'online' | 'busy' | 'away' | 'dnd' | 'offline'

type StatusConfig = {
  label: string
  color: string
  glowClass: string
  bgClass: string
  textClass: string
}

const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
  online: {
    label: 'online',
    color: 'bg-green-500',
    glowClass: 'status-glow',
    bgClass: 'bg-green-50 dark:bg-green-900/20',
    textClass: 'text-green-700 dark:text-green-400',
  },
  busy: {
    label: 'busy',
    color: 'bg-red-500',
    glowClass: '',
    bgClass: 'bg-red-50 dark:bg-red-900/20',
    textClass: 'text-red-700 dark:text-red-400',
  },
  away: {
    label: 'away',
    color: 'bg-yellow-500',
    glowClass: '',
    bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
    textClass: 'text-yellow-700 dark:text-yellow-400',
  },
  dnd: {
    label: 'do not disturb',
    color: 'bg-purple-500',
    glowClass: '',
    bgClass: 'bg-purple-50 dark:bg-purple-900/20',
    textClass: 'text-purple-700 dark:text-purple-400',
  },
  offline: {
    label: 'offline',
    color: 'bg-gray-400',
    glowClass: '',
    bgClass: 'bg-gray-50 dark:bg-gray-900/20',
    textClass: 'text-gray-600 dark:text-gray-400',
  },
}

const STATUS_STORAGE_KEY = 'user_status'

// Get initial status from localStorage (runs once during module load)
const getInitialStatus = (): StatusType => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STATUS_STORAGE_KEY) as StatusType
    if (saved && STATUS_CONFIG[saved]) {
      return saved
    }
  }
  return 'online'
}

type UserStatusProps = {
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md'
}

export const UserStatus = ({
  className = '',
  showLabel = true,
  size = 'sm',
}: UserStatusProps) => {
  const { isAdmin } = useAuth()
  const [status, setStatus] = useState<StatusType>(getInitialStatus)
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showDropdown])

  const handleStatusChange = (newStatus: StatusType) => {
    setStatus(newStatus)
    localStorage.setItem(STATUS_STORAGE_KEY, newStatus)
    setShowDropdown(false)
  }

  const config = STATUS_CONFIG[status]
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => isAdmin && setShowDropdown(!showDropdown)}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bgClass} ${isAdmin ? 'cursor-pointer hover:opacity-90 active:scale-95 transition-all' : 'cursor-default'}`}
        disabled={!isAdmin}
        title={isAdmin ? 'Click to change status' : undefined}
      >
        <span
          className={`${dotSize} rounded-full ${config.color} ${status === 'online' ? 'animate-pulse' : ''} ${config.glowClass}`}
        />
        {showLabel && (
          <span
            className={`text-[10px] font-mono font-medium ${config.textClass}`}
          >
            {config.label}
          </span>
        )}
        {isAdmin && (
          <svg
            className={`w-2.5 h-2.5 ml-0.5 transition-transform ${showDropdown ? 'rotate-180' : ''} ${config.textClass}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {/* Admin Status Dropdown */}
      {isAdmin && showDropdown && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700 overflow-hidden z-[100] animate-fade-in">
          <div className="px-3 py-2 bg-gray-50 dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-700">
            <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              // set status
            </span>
          </div>
          <div className="py-1 max-h-60 overflow-y-auto">
            {(Object.keys(STATUS_CONFIG) as StatusType[]).map((statusKey) => {
              const statusConfig = STATUS_CONFIG[statusKey]
              const isSelected = status === statusKey
              return (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() => handleStatusChange(statusKey)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${statusConfig.color} ${statusKey === 'online' ? 'animate-pulse' : ''}`}
                  />
                  <span
                    className={`font-mono text-xs ${isSelected ? 'text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {statusConfig.label}
                  </span>
                  {isSelected && (
                    <span className="ml-auto text-blue-500 text-xs">✓</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
