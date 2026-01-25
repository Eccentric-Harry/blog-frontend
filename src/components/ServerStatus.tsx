// frontend: src/components/ServerStatus.tsx
import { useEffect, useState } from 'react'
import { api } from '../api'

type ServerStatusProps = {
  className?: string
  showLabel?: boolean
}

export const ServerStatus = ({
  className = '',
  showLabel = true,
}: ServerStatusProps) => {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>(
    'checking',
  )

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.getHealth()
        setStatus('online')
      } catch {
        setStatus('offline')
      }
    }

    // Initial check
    checkHealth()

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000)

    return () => clearInterval(interval)
  }, [])

  const statusConfig = {
    online: {
      color: 'bg-green-500',
      glow: 'status-glow',
      text: 'Online',
      textColor: 'text-green-600 dark:text-green-400',
    },
    offline: {
      color: 'bg-red-500',
      glow: '',
      text: 'Offline',
      textColor: 'text-red-600 dark:text-red-400',
    },
    checking: {
      color: 'bg-yellow-500',
      glow: '',
      text: 'Checking...',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
  }

  const config = statusConfig[status]

  return (
    <span className={`flex items-center gap-1.5 ${className}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.color} ${status === 'online' ? 'animate-pulse' : ''} ${config.glow}`}
      />
      {showLabel && (
        <span className={`text-[10px] ${config.textColor}`}>{config.text}</span>
      )}
    </span>
  )
}
