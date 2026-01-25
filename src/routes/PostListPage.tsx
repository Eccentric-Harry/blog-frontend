// frontend: src/routes/PostListPage.tsx
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../api'
import { PostCard, PostCardSkeleton } from '../components/PostCard'
import Icon from '@mdi/react'
import { mdiChevronLeft, mdiChevronRight, mdiMagnify } from '@mdi/js'

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center mx-auto mb-4">
      <Icon
        path={mdiMagnify}
        size={1.5}
        className="text-gray-400 dark:text-gray-600"
      />
    </div>
    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
      No posts found
    </h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm">
      Check back later for new content
    </p>
  </div>
)

type TabType = 'latest' | 'featured'

export const PostListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabType>('latest')
  const page = parseInt(searchParams.get('page') || '0', 10)
  const tag = searchParams.get('tag') || undefined
  const category = searchParams.get('category') || undefined
  const query = searchParams.get('q') || undefined

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', page, tag, category, query, activeTab],
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

  const hasFilters = tag || category || query

  return (
    <div>
      {/* Tab Navigation */}
      {!hasFilters && (
        <div className="flex items-center gap-6 mb-6 border-b border-gray-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveTab('latest')}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === 'latest'
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Latest
            {activeTab === 'latest' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('featured')}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === 'featured'
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Featured
            {activeTab === 'featured' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        </div>
      )}

      {/* Filter Header */}
      {hasFilters && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {query
                ? `Search: "${query}"`
                : tag
                  ? `#${tag}`
                  : category || 'Posts'}
            </h1>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {data?.totalElements
              ? `${data.totalElements} result${data.totalElements === 1 ? '' : 's'} found`
              : 'Searching...'}
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-700 dark:text-red-400 text-sm">
            Failed to load posts. Please try again.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div>
          {[...Array(4)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              showArchivedBadge={!!tag || !!category}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Icon path={mdiChevronLeft} size={0.7} />
            Previous
          </button>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            {page + 1} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <Icon path={mdiChevronRight} size={0.7} />
          </button>
        </div>
      )}
    </div>
  )
}
