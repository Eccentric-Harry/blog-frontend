import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Icon from '@mdi/react'
import { mdiTagOutline, mdiPound } from '@mdi/js'

// Pre-generate skeleton widths at module load time
const TAG_SKELETON_WIDTHS = [78, 95, 112, 68, 103, 85, 120, 72, 90, 108, 65, 98]

// Get tag emphasis based on post count (minimal styling)
const getTagEmphasis = (
  postCount: number,
  maxCount: number,
): { size: string; weight: string } => {
  if (maxCount === 0) return { size: 'text-sm', weight: 'font-medium' }
  const ratio = postCount / maxCount
  if (ratio > 0.7) return { size: 'text-base', weight: 'font-semibold' }
  if (ratio > 0.4) return { size: 'text-sm', weight: 'font-medium' }
  return { size: 'text-sm', weight: 'font-normal' }
}

const TagCloudSkeleton = () => (
  <div className="flex flex-wrap gap-3 justify-center">
    {TAG_SKELETON_WIDTHS.map((width, i) => (
      <div
        key={i}
        className="h-10 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse"
        style={{ width: `${width}px` }}
      />
    ))}
  </div>
)

const TagListSkeleton = () => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {[...Array(9)].map((_, i) => (
      <div
        key={i}
        className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800/50 animate-pulse"
      />
    ))}
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

  // Sort tags by post count (descending), then alphabetically
  const sortedTags = [...tagsWithPosts].sort((a, b) => {
    const countDiff = (b.postCount ?? 0) - (a.postCount ?? 0)
    if (countDiff !== 0) return countDiff
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-[#333] flex items-center justify-center">
            <Icon
              path={mdiTagOutline}
              size={0.9}
              className="text-gray-600 dark:text-gray-400"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tags
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 ml-[52px]">
          Browse content by tag
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-500/20 rounded-2xl p-5 mb-8 backdrop-blur-sm">
          <p className="text-red-700 dark:text-red-300 font-medium">
            Failed to load tags. Please try again later.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-10">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#2a2a2a] p-8">
            <TagCloudSkeleton />
          </div>
          <div>
            <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-5 animate-pulse" />
            <TagListSkeleton />
          </div>
        </div>
      ) : tagsWithPosts.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-28 h-28 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-3xl flex items-center justify-center mx-auto mb-5">
            <Icon
              path={mdiTagOutline}
              size={2.5}
              className="text-gray-300 dark:text-gray-600"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No tags yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Tags will appear here once posts are added.
          </p>
        </div>
      ) : (
        <>
          {/* Tag Cloud */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-[#1a1a1a] dark:to-[#141414] border border-gray-200/80 dark:border-[#2a2a2a] p-10 shadow-sm">
            {/* Subtle background pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative flex flex-wrap gap-4 items-center justify-center">
              {sortedTags.map((tag) => {
                const emphasis = getTagEmphasis(
                  tag.postCount ?? 0,
                  maxPostCount,
                )
                return (
                  <Link
                    key={tag.id}
                    to={`/?tag=${encodeURIComponent(tag.slug || tag.name)}`}
                    className={`group relative inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] ${emphasis.size} ${emphasis.weight} text-gray-700 dark:text-gray-300 shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5 hover:bg-gray-50 dark:hover:bg-[#252525] hover:border-gray-300 dark:hover:border-[#444]`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon
                        path={mdiPound}
                        size={0.55}
                        className="text-gray-400 dark:text-gray-500 shrink-0 transition-colors group-hover:text-gray-500 dark:group-hover:text-gray-400"
                      />
                      <span className="transition-colors group-hover:text-gray-900 dark:group-hover:text-white">
                        {tag.name}
                      </span>
                    </span>
                    <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-gray-100 dark:bg-[#2a2a2a] text-xs font-semibold text-gray-500 dark:text-gray-400 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-[#333]">
                      {tag.postCount}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
