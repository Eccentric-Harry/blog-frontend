import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Icon from '@mdi/react'
import { mdiFolderOutline, mdiFileDocumentOutline } from '@mdi/js'

// Category color mapping for visual variety
const categoryColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  'Web Development': {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  'Mobile Development': {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
  },
  DevOps: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
  },
  'Cloud Computing': {
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-200 dark:border-cyan-800',
  },
  'AI & Machine Learning': {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
  },
  Cybersecurity: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
  },
  Database: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  'Programming Languages': {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  'Software Architecture': {
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-200 dark:border-pink-800',
  },
  'Open Source': {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  'Tech News': {
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-800',
  },
  'Tools & Productivity': {
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-200 dark:border-teal-800',
  },
  Personal: {
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800',
  },
  'Life & Lifestyle': {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
  Career: {
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-violet-200 dark:border-violet-800',
  },
  Learning: {
    bg: 'bg-lime-50 dark:bg-lime-900/20',
    text: 'text-lime-700 dark:text-lime-300',
    border: 'border-lime-200 dark:border-lime-800',
  },
  Travel: {
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
    text: 'text-fuchsia-700 dark:text-fuchsia-300',
    border: 'border-fuchsia-200 dark:border-fuchsia-800',
  },
  'Books & Reading': {
    bg: 'bg-stone-50 dark:bg-stone-900/20',
    text: 'text-stone-700 dark:text-stone-300',
    border: 'border-stone-200 dark:border-stone-800',
  },
  Productivity: {
    bg: 'bg-slate-50 dark:bg-slate-900/20',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-800',
  },
  'Thoughts & Reflections': {
    bg: 'bg-neutral-50 dark:bg-neutral-900/20',
    text: 'text-neutral-700 dark:text-neutral-300',
    border: 'border-neutral-200 dark:border-neutral-800',
  },
  Projects: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  Tutorials: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
  },
}

const defaultColors = {
  bg: 'bg-gray-50 dark:bg-gray-800/50',
  text: 'text-gray-700 dark:text-gray-300',
  border: 'border-gray-200 dark:border-gray-700',
}

const getCategoryColors = (name: string) =>
  categoryColors[name] || defaultColors

const CategoryCardSkeleton = () => (
  <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-[#2d2d2d] p-6 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Categories
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Browse {totalPosts} posts across {categoriesWithPosts.length}{' '}
          categories
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8">
          <p className="text-red-800 dark:text-red-200">
            Failed to load categories. Please try again later.
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
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon path={mdiFolderOutline} size={2} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No categories yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Categories will appear here once posts are added.
          </p>
        </div>
      ) : (
        /* Categories Grid */
        <div className="grid gap-4 sm:grid-cols-2">
          {categoriesWithPosts.map((category) => {
            const colors = getCategoryColors(category.name)
            return (
              <Link
                key={category.id}
                to={`/?category=${encodeURIComponent(category.slug || category.name)}`}
                className={`group block ${colors.bg} rounded-xl border ${colors.border} p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon
                      path={mdiFolderOutline}
                      size={1.2}
                      className={colors.text}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2
                      className={`text-lg font-semibold ${colors.text} group-hover:underline truncate`}
                    >
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <Icon path={mdiFileDocumentOutline} size={0.7} />
                      <span>
                        {category.postCount}{' '}
                        {category.postCount === 1 ? 'post' : 'posts'}
                      </span>
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
