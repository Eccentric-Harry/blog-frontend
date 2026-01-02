import { useQuery } from '@tanstack/react-query'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../api'
import { PostCard, PostCardSkeleton } from '../components/PostCard'
import Icon from '@mdi/react'
import {
  mdiArchive,
  mdiChevronLeft,
  mdiChevronRight,
  mdiArrowLeft,
} from '@mdi/js'

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon path={mdiArchive} size={2} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold mb-2">No archived posts</h3>
    <p className="text-gray-600 dark:text-gray-400">
      Archived posts will appear here.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Icon path={mdiArrowLeft} size={0.8} />
      Back to Posts
    </Link>
  </div>
)

export const ArchivesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '0', 10)

  const { data, isLoading, error } = useQuery({
    queryKey: ['archived-posts', page],
    queryFn: () => api.getArchivedPosts(page, 10),
  })

  const totalPages = data?.totalPages || 0
  const posts = data?.content || []

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: String(newPage) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Icon
              path={mdiArchive}
              size={1}
              className="text-amber-600 dark:text-amber-400"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Archives
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          {data?.totalElements
            ? `${data.totalElements} archived post${data.totalElements === 1 ? '' : 's'}`
            : 'Browse archived posts'}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8">
          <p className="text-red-800 dark:text-red-200">
            Failed to load archived posts. Please try again later.
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
            <div key={post.id} className="relative">
              <div className="absolute -left-3 top-4 z-10">
                <div className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Icon path={mdiArchive} size={0.5} />
                  Archived
                </div>
              </div>
              <PostCard post={post} />
            </div>
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
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePageChange(i)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  i === page
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
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
