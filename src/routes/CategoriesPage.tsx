import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Icon from '@mdi/react'
import {
  mdiFolderOutline,
  mdiFileDocumentOutline,
  mdiArrowRight,
} from '@mdi/js'

const CategoryCardSkeleton = () => (
  <div className="rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 p-4">
    <div className="animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-neutral-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-2/3" />
          <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-1/3" />
        </div>
      </div>
    </div>
  </div>
)

export const CategoriesPage = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getAllCategories,
  })

  const categoriesWithPosts =
    categories?.filter((cat) => (cat.postCount ?? 0) > 0) || []
  const totalPosts = categoriesWithPosts.reduce(
    (sum, cat) => sum + (cat.postCount ?? 0),
    0,
  )

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
            <Icon
              path={mdiFolderOutline}
              size={1}
              className="text-blue-600 dark:text-blue-400"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 ml-[52px]">
          {totalPosts} posts in {categoriesWithPosts.length} categories
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-700 dark:text-red-400 text-sm">
            Failed to load categories. Please try again.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      ) : categoriesWithPosts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Icon
              path={mdiFolderOutline}
              size={1.5}
              className="text-gray-400 dark:text-gray-600"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No categories yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Categories will appear when posts are created
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {categoriesWithPosts.map((category) => (
            <Link
              key={category.id}
              to={`/?category=${encodeURIComponent(category.slug || category.name)}`}
              className="group rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 p-4 transition-all hover:border-blue-200 dark:hover:border-blue-800 hover:bg-white dark:hover:bg-neutral-800"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <Icon
                    path={mdiFolderOutline}
                    size={1}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                      {category.name}
                    </h2>
                    <Icon
                      path={mdiArrowRight}
                      size={0.5}
                      className="text-gray-400 dark:text-gray-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0"
                    />
                  </div>

                  {category.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-neutral-800 text-xs font-medium text-gray-600 dark:text-gray-400">
                      <Icon
                        path={mdiFileDocumentOutline}
                        size={0.5}
                        className="shrink-0"
                      />
                      <span>
                        {category.postCount}{' '}
                        {category.postCount === 1 ? 'post' : 'posts'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
