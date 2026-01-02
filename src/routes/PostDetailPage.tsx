import { useQuery } from '@tanstack/react-query'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { format } from 'date-fns'
import { MetaTags } from '../components/MetaTags'
import Icon from '@mdi/react'
import { mdiArrowLeft, mdiPencil, mdiDelete, mdiLoading } from '@mdi/js'
import { useState } from 'react'
import toast from 'react-hot-toast'
import DOMPurify from 'dompurify'
import { useAuth } from '../contexts/AuthContext'

export const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['post', id],
    queryFn: () => api.getPost(Number(id)),
    enabled: !!id,
  })

  const handleDelete = async () => {
    if (
      !post ||
      !confirm(
        'Are you sure you want to delete this post? This action cannot be undone.',
      )
    ) {
      return
    }

    setIsDeleting(true)
    try {
      await api.deletePost(post.id)
      toast.success('Post deleted successfully')
      navigate('/')
    } catch (err) {
      toast.error('Failed to delete post')
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="aspect-2/1 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
            Post Not Found
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icon path={mdiArrowLeft} size={0.8} />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const sanitizedContent = DOMPurify.sanitize(post.content)

  return (
    <>
      <MetaTags
        title={post.title}
        description={post.content.substring(0, 160).replace(/<[^>]*>/g, '')}
        imageUrl={post.coverImageUrl}
      />

      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Back button and actions */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <Icon path={mdiArrowLeft} size={0.8} />
            Back
          </Link>
          {isAdmin && (
            <div className="flex gap-2">
              <Link
                to={`/edit/${post.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Icon path={mdiPencil} size={0.7} />
                Edit
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Icon
                  path={isDeleting ? mdiLoading : mdiDelete}
                  size={0.7}
                  className={isDeleting ? 'animate-spin' : ''}
                />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Link
                key={typeof tag === 'string' ? tag : tag.id}
                to={`/?tag=${typeof tag === 'string' ? tag : tag.slug || tag.name}`}
                className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400 transition-colors"
              >
                {typeof tag === 'string' ? tag : tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          {post.author && <span className="font-medium">{post.author}</span>}
          {post.createdAt && (
            <time dateTime={post.createdAt}>
              {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
            </time>
          )}
          {post.updatedAt && post.updatedAt !== post.createdAt && (
            <span className="text-sm">
              (Updated {format(new Date(post.updatedAt), 'MMM dd, yyyy')})
            </span>
          )}
        </div>

        {/* Cover image */}
        {post.coverImageUrl && (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full rounded-lg mb-8 shadow-lg"
          />
        )}

        {/* Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-lg prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-code:text-pink-600 dark:prose-code:text-pink-400"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Icon path={mdiArrowLeft} size={0.8} />
            Read more posts
          </Link>
        </div>
      </article>
    </>
  )
}
