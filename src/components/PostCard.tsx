// frontend: src/components/PostCard.tsx
import { Link } from 'react-router-dom'
import { format, formatDistanceToNow, differenceInDays } from 'date-fns'
import Icon from '@mdi/react'
import { mdiArchive } from '@mdi/js'
import type { PostSummary } from '../api'
import profileImage from '../assets/profile.jpg'

// Pure function to format date - moved outside component
const formatPostDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const daysDiff = differenceInDays(new Date(), date)
  if (daysDiff < 7) {
    return formatDistanceToNow(date, { addSuffix: false }) + ' ago'
  }
  return format(date, 'MMM d')
}

type PostCardProps = {
  post: PostSummary
  showArchivedBadge?: boolean
}

export const PostCard = ({
  post,
  showArchivedBadge = false,
}: PostCardProps) => {
  const thumbnailUrl = post.coverImageUrl
    ? post.coverImageUrl.includes('ik.imagekit.io')
      ? `${post.coverImageUrl}?tr=w-300,h-200,fo-auto,q-80`
      : post.coverImageUrl
    : null

  const isArchived = showArchivedBadge && post.archived

  return (
    <article className="group py-4 px-3 -mx-3 border-b border-gray-100 dark:border-neutral-800 last:border-b-0 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
      {/* Author Row */}
      <div className="flex items-center gap-2 mb-2">
        <img
          src={profileImage}
          alt={post.author || 'Author'}
          className="w-5 h-5 rounded ring-1 ring-gray-200 dark:ring-neutral-700"
        />
        <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
          {post.author || 'harry'}
        </span>
        {isArchived && (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">
            <Icon path={mdiArchive} size={0.4} />
            archived
          </span>
        )}
      </div>

      {/* Content Row */}
      <Link to={`/posts/${post.id}`} className="flex gap-4">
        {/* Text Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 leading-snug mb-1 line-clamp-2 transition-colors font-serif">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p
              className={`text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-2 ${
                thumbnailUrl ? 'hidden sm:block' : ''
              }`}
            >
              {post.excerpt}
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 dark:text-gray-500">
            {post.createdAt && (
              <time dateTime={post.createdAt}>
                {formatPostDate(post.createdAt)}
              </time>
            )}

            {post.readTime && post.readTime > 0 && (
              <>
                <span>·</span>
                <span>{post.readTime} min</span>
              </>
            )}

            {post.categoryName && (
              <>
                <span>·</span>
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 rounded">
                  {post.categoryName}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Thumbnail */}
        {thumbnailUrl && (
          <div className="flex-shrink-0 w-28 h-16 sm:w-32 sm:h-20 overflow-hidden rounded-lg">
            <img
              src={thumbnailUrl}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </Link>
    </article>
  )
}

export const PostCardSkeleton = () => (
  <div className="py-4 border-b border-gray-100 dark:border-neutral-800 animate-pulse">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-5 h-5 rounded bg-gray-200 dark:bg-neutral-800" />
      <div className="h-3 w-16 bg-gray-200 dark:bg-neutral-800 rounded" />
    </div>
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 dark:bg-neutral-800 rounded w-4/5 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-3/5 mb-3" />
        <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-full mb-2 hidden sm:block" />
        <div className="flex gap-2">
          <div className="h-3 w-10 bg-gray-200 dark:bg-neutral-800 rounded" />
          <div className="h-3 w-12 bg-gray-200 dark:bg-neutral-800 rounded" />
        </div>
      </div>
      <div className="flex-shrink-0 w-28 h-16 sm:w-32 sm:h-20 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
    </div>
  </div>
)
