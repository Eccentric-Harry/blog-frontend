// frontend: src/components/layout/RightSidebar.tsx
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import Icon from '@mdi/react'
import { mdiMagnify, mdiClockOutline, mdiTagOutline } from '@mdi/js'
import { useState } from 'react'
import { format } from 'date-fns'

type RightSidebarProps = {
  onSearch?: (query: string) => void
}

export const RightSidebar = ({ onSearch }: RightSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: recentPosts } = useQuery({
    queryKey: ['recentPosts'],
    queryFn: () => api.getRecentPosts(5),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const { data: trendingTags } = useQuery({
    queryKey: ['trendingTags'],
    queryFn: () => api.getTrendingTags(15),
    staleTime: 1000 * 60 * 5,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim())
    }
  }

  return (
    <aside className="w-72 flex-shrink-0 hidden xl:block h-screen sticky top-0 overflow-y-auto p-6 border-l border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#121212]">
      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Icon
            path={mdiMagnify}
            size={0.9}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2.5 text-sm font-mono border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
        </div>
      </form>

      {/* Recently Updated */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 text-xs font-mono font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
          <Icon path={mdiClockOutline} size={0.65} />
          // recent
        </h3>
        {recentPosts && recentPosts.length > 0 ? (
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link to={`/posts/${post.id}`} className="group block">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors">
                    {post.title}
                  </h4>
                  {post.updatedAt && (
                    <time className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5 block">
                      {format(new Date(post.updatedAt), 'MMM d, yyyy')}
                    </time>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
            No recent posts
          </p>
        )}
      </div>

      {/* Trending Tags */}
      <div>
        <h3 className="flex items-center gap-2 text-xs font-mono font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
          <Icon path={mdiTagOutline} size={0.65} />
          // trending
        </h3>
        {trendingTags && trendingTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <Link
                key={tag.id}
                to={`/?tag=${tag.slug}`}
                className="inline-flex items-center px-3 py-1.5 text-xs font-mono rounded-full border border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {tag.name}
                {tag.postCount !== undefined && tag.postCount > 0 && (
                  <span className="ml-1.5 text-gray-400 dark:text-gray-500">
                    ({tag.postCount})
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
            No tags yet
          </p>
        )}
      </div>
    </aside>
  )
}
