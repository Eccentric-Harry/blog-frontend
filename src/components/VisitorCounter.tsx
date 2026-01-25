// frontend: src/components/VisitorCounter.tsx
import { useEffect, useState, useRef } from 'react'
import { api } from '../api'
import type { VisitorCountResponse } from '../api'

const SESSION_KEY = 'blog_visitor_tracked'

type VisitorCounterProps = {
  className?: string
}

export const VisitorCounter = ({ className = '' }: VisitorCounterProps) => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const hasTracked = useRef(false)

  useEffect(() => {
    const trackAndFetchVisitorCount = async () => {
      try {
        const alreadyTracked = sessionStorage.getItem(SESSION_KEY)
        let response: VisitorCountResponse

        if (!alreadyTracked && !hasTracked.current) {
          hasTracked.current = true
          response = await api.trackVisitor()
          sessionStorage.setItem(SESSION_KEY, 'true')
        } else {
          response = await api.getVisitorCount()
        }

        setVisitorCount(response.totalVisitors)
      } catch (error) {
        console.error('Failed to fetch visitor count:', error)
        try {
          const response = await api.getVisitorCount()
          setVisitorCount(response.totalVisitors)
        } catch {
          // Silent fail
        }
      } finally {
        setLoading(false)
      }
    }

    trackAndFetchVisitorCount()
  }, [])

  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  if (loading) {
    return (
      <span
        className={`font-mono text-gray-400 dark:text-gray-500 ${className}`}
      >
        ...
      </span>
    )
  }

  if (visitorCount === null) {
    return null
  }

  return (
    <span
      className={`font-mono font-medium text-blue-600 dark:text-blue-400 ${className}`}
      title="Total site visitors"
    >
      {formatNumber(visitorCount)}
    </span>
  )
}
