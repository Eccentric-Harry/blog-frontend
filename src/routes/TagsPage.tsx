import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Icon from '@mdi/react'
import { mdiTagOutline, mdiPound } from '@mdi/js'

const TAG_SKELETON_WIDTHS = [78, 95, 112, 68, 103, 85, 120, 72, 90, 108, 65, 98]

const getTagEmphasis = (
  postCount: number,
  maxCount: number,
): { size: string; weight: string } => {
  if (maxCount === 0) return { size: 'text-xs', weight: 'font-medium' }
  const ratio = postCount / maxCount
  if (ratio > 0.7) return { size: 'text-sm', weight: 'font-semibold' }
  if (ratio > 0.4) return { size: 'text-xs', weight: 'font-medium' }
  return { size: 'text-xs', weight: 'font-normal' }
}

const TagCloudSkeleton = () => (
  <div className="flex flex-wrap gap-2">
    {TAG_SKELETON_WIDTHS.map((width, i) => (
      <div
        key={i}
        className="h-8 rounded-full bg-gray-100 dark:bg-neutral-800 animate-pulse"
        style={{ width: `${width}px` }}
      />
    ))}
  </div>
)

const TagListSkeleton = () => (
  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
    {[...Array(9)].map((_, i) => (
      <div
        key={i}
        className="h-12 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
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

  const sortedTags = [...tagsWithPosts].sort((a, b) => {
    const countDiff = (b.postCount ?? 0) - (a.postCount ?? 0)
    if (countDiff !== 0) return countDiff
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
            <Icon
              path={mdiTagOutline}
              size={1}
              className="text-blue-600 dark:text-blue-400"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tags
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 ml-[52px]">
          Browse content by tag
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-700 dark:text-red-400 text-sm">
            Failed to load tags. Please try again.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-8">
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-600 mb-4 uppercase tracking-wider">
              Popular
            </p>
            <TagCloudSkeleton />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-600 mb-4 uppercase tracking-wider">
              All Tags
            </p>
            <TagListSkeleton />
          </div>
        </div>
      ) : sortedTags.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Icon
              path={mdiTagOutline}
              size={1.5}
              className="text-gray-400 dark:text-gray-600"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No tags yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Tags will appear when posts are created
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Tag Cloud */}
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-600 mb-4 uppercase tracking-wider">
              Popular
            </p>
            <div className="flex flex-wrap gap-2">
              {sortedTags.slice(0, 15).map((tag) => {
                const { size, weight } = getTagEmphasis(
                  tag.postCount ?? 0,
                  maxPostCount,
                )
                return (
                  <Link
                    key={tag.id}
                    to={`/?tag=${encodeURIComponent(tag.slug || tag.name)}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all ${size} ${weight} text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400`}
                  >
                    <Icon path={mdiPound} size={0.45} className="opacity-50" />
                    {tag.name}
                    <span className="text-gray-400 dark:text-gray-500 text-[10px]">
                      {tag.postCount}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* All Tags List */}
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-600 mb-4 uppercase tracking-wider">
              All Tags ({sortedTags.length})
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {sortedTags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/?tag=${encodeURIComponent(tag.slug || tag.name)}`}
                  className="group flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-white dark:hover:bg-neutral-800 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      path={mdiPound}
                      size={0.55}
                      className="text-gray-400 dark:text-gray-600 group-hover:text-blue-500 transition-colors"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tag.name}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400">
                    {tag.postCount}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
