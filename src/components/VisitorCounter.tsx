// frontend: src/components/VisitorCounter.tsx
import { useEffect, useState, useRef } from 'react'
import { HiOutlineEye } from 'react-icons/hi2'
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
        // Check if we've already tracked this session
        const alreadyTracked = sessionStorage.getItem(SESSION_KEY)

        let response: VisitorCountResponse

        if (!alreadyTracked && !hasTracked.current) {
          // Track new visitor
          hasTracked.current = true
          response = await api.trackVisitor()
          sessionStorage.setItem(SESSION_KEY, 'true')
        } else {
          // Just fetch the count
          response = await api.getVisitorCount()
        }

        setVisitorCount(response.totalVisitors)
      } catch (error) {
        console.error('Failed to fetch visitor count:', error)
        // Fallback: try to just get the count
        try {
          const response = await api.getVisitorCount()
          setVisitorCount(response.totalVisitors)
        } catch {
          // Silent fail - don't show error to user
        }
      } finally {
        setLoading(false)
      }
    }

    trackAndFetchVisitorCount()
  }, [])

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  if (loading) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-400 text-sm ${className}`}
      >
        <HiOutlineEye size={16} className="animate-pulse" />
        <span className="animate-pulse">...</span>
      </div>
    )
  }

  if (visitorCount === null) {
    return null
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30 text-sm ${className}`}
      title="Total site visitors"
    >
      <HiOutlineEye size={16} className="text-blue-600 dark:text-blue-400" />
      <span className="font-medium text-blue-700 dark:text-blue-300">
        {formatNumber(visitorCount)}
      </span>
      <span className="text-gray-500 dark:text-gray-400 text-xs">visitors</span>
    </div>
  )
}
