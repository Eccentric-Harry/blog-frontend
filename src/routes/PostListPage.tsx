// frontend: src/routes/PostListPage.tsx
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { PostCard, PostCardSkeleton } from '../components/PostCard'
import Icon from '@mdi/react'
import { mdiChevronLeft, mdiChevronRight, mdiMagnify } from '@mdi/js'

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon path={mdiMagnify} size={2} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold mb-2">No posts found</h3>
    <p className="text-gray-600 dark:text-gray-400">
      Check back later for new content!
    </p>
  </div>
)

export const PostListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '0', 10)
  const tag = searchParams.get('tag') || undefined
  const category = searchParams.get('category') || undefined
  const query = searchParams.get('q') || undefined

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', page, tag, category, query],
    queryFn: () => api.getPosts(page, 10, tag, category, query),
  })

  const totalPages = data?.totalPages || 0
  const posts = data?.content || []

  const handlePageChange = (newPage: number) => {
    const params: Record<string, string> = { page: String(newPage) }
    if (tag) params.tag = tag
    if (category) params.category = category
    if (query) params.q = query
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSearchParams({ page: '0' })
  }

  // Show active filters
  const hasFilters = tag || category || query

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {query
            ? 'Search Results'
            : tag
              ? `Tagged: ${tag}`
              : category
                ? `Category: ${category}`
                : 'Latest Posts'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {data?.totalElements
            ? `${data.totalElements} post${data.totalElements === 1 ? '' : 's'} found`
            : 'Thoughts, tutorials, and more'}
        </p>
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Filtering by:
          </span>
          {query && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              Search: "{query}"
            </span>
          )}
          {tag && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
              Tag: {tag}
            </span>
          )}
          {category && (
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
              Category: {category}
            </span>
          )}
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8">
          <p className="text-red-800 dark:text-red-200">
            Failed to load posts. Please try again later.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        /* Post List */
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <Icon path={mdiChevronLeft} size={1} />
          </button>

          <div className="flex items-center gap-1">
            {/* Show first page */}
            {page > 2 && (
              <>
                <button
                  type="button"
                  onClick={() => handlePageChange(0)}
                  className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  1
                </button>
                {page > 3 && <span className="px-2 text-gray-400">...</span>}
              </>
            )}

            {/* Show surrounding pages */}
            {[...Array(totalPages)].map((_, i) => {
              if (i < page - 1 || i > page + 1) return null
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePageChange(i)}
                  className={`px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    i === page
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {i + 1}
                </button>
              )
            })}

            {/* Show last page */}
            {page < totalPages - 3 && (
              <>
                {page < totalPages - 4 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
                <button
                  type="button"
                  onClick={() => handlePageChange(totalPages - 1)}
                  className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <Icon path={mdiChevronRight} size={1} />
          </button>
        </div>
      )}
    </div>
  )
}
