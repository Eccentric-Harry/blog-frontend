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
  <div className="rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] p-6">
    <div className="animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3" />
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
    <div className="max-w-5xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-[#333] flex items-center justify-center">
            <Icon
              path={mdiFolderOutline}
              size={0.9}
              className="text-gray-600 dark:text-gray-400"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 ml-[52px]">
          Explore{' '}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {totalPosts}
          </span>{' '}
          posts across{' '}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {categoriesWithPosts.length}
          </span>{' '}
          categories
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-500/20 rounded-2xl p-5 mb-8 backdrop-blur-sm">
          <p className="text-red-700 dark:text-red-300 font-medium">
            Failed to load categories. Please try again later.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      ) : categoriesWithPosts.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-28 h-28 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-3xl flex items-center justify-center mx-auto mb-5">
            <Icon
              path={mdiFolderOutline}
              size={2.5}
              className="text-gray-300 dark:text-gray-600"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No categories yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Categories will appear here once posts are added.
          </p>
        </div>
      ) : (
        /* Minimal Categories Grid */
        <div className="grid gap-5 sm:grid-cols-2">
          {categoriesWithPosts.map((category) => {
            return (
              <Link
                key={category.id}
                to={`/?category=${encodeURIComponent(category.slug || category.name)}`}
                className="group rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] p-6 transition-all duration-200 ease-out hover:border-gray-200 dark:hover:border-[#3a3a3a] hover:bg-gray-50 dark:hover:bg-[#1e1e1e]"
              >
                <div className="flex items-start gap-4">
                  {/* Minimal Icon */}
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-[#333] flex items-center justify-center group-hover:border-gray-300 dark:group-hover:border-[#444] transition-colors duration-200">
                    <Icon
                      path={mdiFolderOutline}
                      size={1.2}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {category.name}
                      </h2>
                      <Icon
                        path={mdiArrowRight}
                        size={0.7}
                        className="text-gray-400 dark:text-gray-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0"
                      />
                    </div>

                    {category.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-[#252525] text-sm font-medium text-gray-600 dark:text-gray-400">
                        <Icon
                          path={mdiFileDocumentOutline}
                          size={0.6}
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
            )
          })}
        </div>
      )}
    </div>
  )
}
