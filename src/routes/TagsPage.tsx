import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Icon from '@mdi/react'
import { mdiTagOutline, mdiFileDocumentOutline } from '@mdi/js'

// Generate a consistent color based on tag name
const getTagColor = (
  name: string,
): { bg: string; text: string; border: string } => {
  const colors = [
    {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
    },
    {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
    },
    {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
    },
    {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-800',
    },
    {
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      text: 'text-pink-700 dark:text-pink-300',
      border: 'border-pink-200 dark:border-pink-800',
    },
    {
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      text: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-200 dark:border-cyan-800',
    },
    {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-700 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
    {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
    },
    {
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-800',
    },
    {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-200 dark:border-teal-800',
    },
    {
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      text: 'text-violet-700 dark:text-violet-300',
      border: 'border-violet-200 dark:border-violet-800',
    },
  ]

  // Simple hash function to get consistent color index
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// Get font size based on post count (for tag cloud effect)
const getTagSize = (postCount: number, maxCount: number): string => {
  if (maxCount === 0) return 'text-base'
  const ratio = postCount / maxCount
  if (ratio > 0.8) return 'text-xl font-semibold'
  if (ratio > 0.5) return 'text-lg font-medium'
  if (ratio > 0.3) return 'text-base font-medium'
  return 'text-sm'
}

const TagSkeleton = () => (
  <div className="inline-block px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse">
    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
  </div>
)

export const TagsPage = () => {
  const {
    data: tags,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tags'],
    queryFn: api.getAllTags,
  })

  const tagsWithPosts = tags?.filter((tag) => (tag.postCount ?? 0) > 0) || []
  const maxPostCount = Math.max(
    ...tagsWithPosts.map((t) => t.postCount ?? 0),
    1,
  )
  const totalPosts = tagsWithPosts.reduce(
    (sum, tag) => sum + (tag.postCount ?? 0),
    0,
  )

  // Sort tags by post count (descending), then alphabetically
  const sortedTags = [...tagsWithPosts].sort((a, b) => {
    const countDiff = (b.postCount ?? 0) - (a.postCount ?? 0)
    if (countDiff !== 0) return countDiff
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tags
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Explore {tagsWithPosts.length} tags across {totalPosts} posts
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8">
          <p className="text-red-800 dark:text-red-200">
            Failed to load tags. Please try again later.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-wrap gap-3">
          {[...Array(15)].map((_, i) => (
            <TagSkeleton key={i} />
          ))}
        </div>
      ) : tagsWithPosts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon path={mdiTagOutline} size={2} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No tags yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Tags will appear here once posts are added.
          </p>
        </div>
      ) : (
        <>
          {/* Tag Cloud */}
          <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-[#2d2d2d] p-6 mb-8">
            <div className="flex flex-wrap gap-3 items-center justify-center">
              {sortedTags.map((tag) => {
                const colors = getTagColor(tag.name)
                const sizeClass = getTagSize(tag.postCount ?? 0, maxPostCount)
                return (
                  <Link
                    key={tag.id}
                    to={`/?tag=${encodeURIComponent(tag.slug || tag.name)}`}
                    className={`group inline-flex items-center gap-1.5 px-4 py-2 rounded-full ${colors.bg} border ${colors.border} ${sizeClass} ${colors.text} transition-all duration-200 hover:shadow-md hover:scale-105`}
                  >
                    <Icon path={mdiTagOutline} size={0.6} />
                    <span>{tag.name}</span>
                    <span className="text-xs opacity-70">
                      ({tag.postCount})
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Tags List (alternative view) */}
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            All Tags
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTags.map((tag) => {
              const colors = getTagColor(tag.name)
              return (
                <Link
                  key={tag.id}
                  to={`/?tag=${encodeURIComponent(tag.slug || tag.name)}`}
                  className={`group flex items-center justify-between px-4 py-3 rounded-lg ${colors.bg} border ${colors.border} transition-all duration-200 hover:shadow-md`}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      path={mdiTagOutline}
                      size={0.8}
                      className={colors.text}
                    />
                    <span className={`font-medium ${colors.text}`}>
                      {tag.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <Icon path={mdiFileDocumentOutline} size={0.6} />
                    <span>{tag.postCount}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
