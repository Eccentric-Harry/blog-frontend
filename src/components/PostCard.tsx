// frontend: src/components/PostCard.tsx
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import Icon from '@mdi/react'
import {
  mdiCalendarOutline,
  mdiFolderOutline,
  mdiClockOutline,
  mdiArchive,
} from '@mdi/js'
import type { PostSummary } from '../api'

type PostCardProps = {
  post: PostSummary
  showArchivedBadge?: boolean
}

/**
 * PostCard component matching the design:
 * - White/pale rounded container with subtle shadow
 * - Left area: title, excerpt, metadata (date, category)
 * - Right area: thumbnail image
 */
export const PostCard = ({
  post,
  showArchivedBadge = false,
}: PostCardProps) => {
  // Generate ImageKit thumbnail transform URL if coverImageUrl exists
  const thumbnailUrl = post.coverImageUrl
    ? post.coverImageUrl.includes('ik.imagekit.io')
      ? `${post.coverImageUrl}?tr=w-400,h-280,fo-auto,q-80`
      : post.coverImageUrl
    : null

  const isArchived = showArchivedBadge && post.archived

  return (
    <article className="group relative bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-[#2d2d2d] transition-all duration-300 overflow-hidden">
      {/* Archived Badge */}
      {isArchived && (
        <div className="absolute left-4 top-4 z-10">
          <div className="bg-amber-500 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Icon path={mdiArchive} size={0.5} />
            <span>Archived</span>
          </div>
        </div>
      )}
      <Link
        to={`/posts/${post.id}`}
        className="flex flex-col sm:flex-row min-h-[180px]"
      >
        {/* Text Content - Left Side */}
        <div
          className={`flex-1 p-5 sm:p-6 flex flex-col order-2 sm:order-1 ${isArchived ? 'pt-12 sm:pt-12' : ''}`}
        >
          {/* Title */}
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4 flex-grow">
              {post.excerpt}
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mt-auto">
            {/* Date */}
            {post.createdAt && (
              <div className="flex items-center gap-1.5">
                <Icon path={mdiCalendarOutline} size={0.6} />
                <time dateTime={post.createdAt}>
                  {format(new Date(post.createdAt), 'MMM d, yyyy')}
                </time>
              </div>
            )}

            {/* Category */}
            {post.categoryName && (
              <div className="flex items-center gap-1.5">
                <Icon path={mdiFolderOutline} size={0.6} />
                <span>{post.categoryName}</span>
              </div>
            )}

            {/* Read time */}
            {post.readTime && post.readTime > 0 && (
              <div className="hidden sm:flex items-center gap-1.5">
                <Icon path={mdiClockOutline} size={0.6} />
                <span>{post.readTime} min</span>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail - Right Side */}
        {thumbnailUrl && (
          <div className="w-full sm:w-44 md:w-52 lg:w-60 flex-shrink-0 order-1 sm:order-2">
            <div className="aspect-video sm:aspect-auto sm:h-full relative overflow-hidden bg-gray-100 dark:bg-[#2d2d2d]">
              <img
                src={thumbnailUrl}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        )}
      </Link>
    </article>
  )
}

/**
 * Skeleton loader for PostCard
 */
export const PostCardSkeleton = () => (
  <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-[#2d2d2d] overflow-hidden animate-pulse">
    <div className="flex flex-col sm:flex-row min-h-[180px]">
      {/* Text Content Skeleton */}
      <div className="flex-1 p-5 sm:p-6 order-2 sm:order-1">
        <div className="h-6 bg-gray-200 dark:bg-[#2d2d2d] rounded w-3/4 mb-4" />
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-[#2d2d2d] rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-[#2d2d2d] rounded w-5/6" />
        </div>
        <div className="flex gap-4 mt-auto">
          <div className="h-3 bg-gray-200 dark:bg-[#2d2d2d] rounded w-20" />
          <div className="h-3 bg-gray-200 dark:bg-[#2d2d2d] rounded w-16" />
        </div>
      </div>
      {/* Thumbnail Skeleton */}
      <div className="w-full sm:w-44 md:w-52 lg:w-60 flex-shrink-0 order-1 sm:order-2">
        <div className="aspect-video sm:aspect-auto sm:h-full bg-gray-200 dark:bg-[#2d2d2d]" />
      </div>
    </div>
  </div>
)
