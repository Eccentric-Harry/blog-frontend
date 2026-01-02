import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '../api'
import { TiptapEditor } from '../components/TiptapEditor'
import { ImageUploader } from '../components/ImageUploader'
import { PREDEFINED_CATEGORIES } from '../constants/categories'
import toast from 'react-hot-toast'
import Icon from '@mdi/react'
import { mdiLoading, mdiContentSave, mdiArrowLeft } from '@mdi/js'
import { Link as RouterLink } from 'react-router-dom'

const postSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title is too long'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().max(500, 'Excerpt is too long').optional(),
  tags: z.string().optional(),
  category: z.string().optional(),
  coverImageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
})

type PostFormData = z.infer<typeof postSchema>

type PostFormPageProps = {
  mode: 'create' | 'edit'
}

export const PostFormPage = ({ mode }: PostFormPageProps) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showImageUploader, setShowImageUploader] = useState(false)
  const [showCoverImageUploader, setShowCoverImageUploader] = useState(false)
  const [content, setContent] = useState('')
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null)
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: existingPost, isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', id],
    queryFn: () => api.getPost(Number(id)),
    enabled: mode === 'edit' && !!id,
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      tags: '',
      category: '',
      coverImageUrl: '',
    },
  })

  useEffect(() => {
    if (existingPost && mode === 'edit') {
      setValue('title', existingPost.title)
      setValue('content', existingPost.content)
      setValue(
        'excerpt',
        existingPost.content.substring(0, 200).replace(/<[^>]*>/g, ''),
      )
      setValue('tags', existingPost.tags?.map((t) => t.name).join(', ') || '')
      setValue('category', existingPost.category?.name || '')
      setValue('coverImageUrl', existingPost.coverImageUrl || '')
      setContent(existingPost.content)
    }
  }, [existingPost, mode, setValue])

  const createMutation = useMutation({
    mutationFn: (data: PostFormData) => {
      const payload: any = {
        title: data.title,
        content: data.content,
        excerpt:
          data.excerpt ||
          data.content
            .replace(/<[^>]*>/g, '')
            .substring(0, 200)
            .trim() ||
          undefined,
        published: true, // Mark as published when creating
      }

      const tags = data.tags
        ?.split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      if (tags && tags.length > 0) {
        payload.tags = tags
      }

      if (data.category && data.category.trim()) {
        payload.categoryName = data.category.trim()
      }

      if (data.coverImageUrl && data.coverImageUrl.trim()) {
        payload.coverImageUrl = data.coverImageUrl.trim()
      }

      return api.createPost(payload)
    },
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post published successfully!')
      navigate(`/posts/${post.id}`)
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to publish post')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: PostFormData) => {
      const payload: any = {
        title: data.title,
        content: data.content,
        excerpt:
          data.excerpt ||
          data.content
            .replace(/<[^>]*>/g, '')
            .substring(0, 200)
            .trim() ||
          undefined,
        published: true, // Mark as published when updating
      }

      const tags = data.tags
        ?.split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      if (tags && tags.length > 0) {
        payload.tags = tags
      }

      if (data.category && data.category.trim()) {
        payload.categoryName = data.category.trim()
      }

      if (data.coverImageUrl && data.coverImageUrl.trim()) {
        payload.coverImageUrl = data.coverImageUrl.trim()
      }

      return api.updatePost(Number(id), payload)
    },
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['post', id] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post updated successfully!')
      navigate(`/posts/${post.id}`)
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update post')
    },
  })

  const triggerAutoSave = () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      // Save draft to localStorage
      const draft = {
        title: watch('title'),
        content,
        excerpt: watch('excerpt'),
        tags: watch('tags'),
        coverImageUrl: watch('coverImageUrl'),
        timestamp: Date.now(),
      }
      localStorage.setItem(
        `draft-${mode}-${id || 'new'}`,
        JSON.stringify(draft),
      )
    }, 2000)
  }

  useEffect(() => {
    // Load draft from localStorage
    const draftKey = `draft-${mode}-${id || 'new'}`
    const savedDraft = localStorage.getItem(draftKey)
    if (savedDraft && mode === 'create') {
      const draft = JSON.parse(savedDraft)
      const ageInMinutes = (Date.now() - draft.timestamp) / 1000 / 60
      if (ageInMinutes < 60) {
        const restore = confirm(
          'Found an unsaved draft. Would you like to restore it?',
        )
        if (restore) {
          setValue('title', draft.title)
          setValue('content', draft.content)
          setValue('excerpt', draft.excerpt)
          setValue('tags', draft.tags)
          setValue('coverImageUrl', draft.coverImageUrl)
          setContent(draft.content)
          toast.success('Draft restored')
        } else {
          localStorage.removeItem(draftKey)
        }
      }
    }
  }, [mode, id, setValue])

  const onSubmit = (data: PostFormData) => {
    // Ensure content is up to date
    const currentContent = content || ''
    const submitData = { ...data, content: currentContent }

    if (mode === 'create') {
      createMutation.mutate(submitData)
    } else {
      updateMutation.mutate(submitData)
    }
  }

  const handleImageUploadComplete = (url: string) => {
    setPendingImageUrl(url)
    setShowImageUploader(false)
    toast.success('Image inserted!')
  }

  const handleCoverImageUploadComplete = (url: string) => {
    setValue('coverImageUrl', url)
    setShowCoverImageUploader(false)
    toast.success('Cover image uploaded!')
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  if (isLoadingPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {mode === 'create' ? 'Create New Post' : 'Edit Post'}
        </h1>
        <RouterLink
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <Icon path={mdiArrowLeft} size={0.8} />
          Cancel
        </RouterLink>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            placeholder="Enter an engaging title..."
            className="w-full px-4 py-3 text-2xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Cover Image */}
        <div>
          <label
            htmlFor="coverImageUrl"
            className="block text-sm font-medium mb-2"
          >
            Cover Image (optional)
          </label>
          <div className="flex gap-2">
            <input
              id="coverImageUrl"
              type="text"
              {...register('coverImageUrl')}
              placeholder="https://example.com/image.jpg or upload below"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowCoverImageUploader(true)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors whitespace-nowrap"
            >
              Upload Cover
            </button>
          </div>
          {errors.coverImageUrl && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.coverImageUrl.message}
            </p>
          )}
          {watch('coverImageUrl') && (
            <img
              src={watch('coverImageUrl')}
              alt="Cover preview"
              className="mt-4 w-full max-h-64 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <input type="hidden" {...register('content')} />
          <TiptapEditor
            content={content}
            onChange={(html) => {
              setContent(html)
              setValue('content', html)
              triggerAutoSave()
            }}
            onImageInsert={() => setShowImageUploader(true)}
            placeholder="Write your story... (Drag & drop or paste images)"
            pendingImageUrl={pendingImageUrl}
            onImageInserted={() => setPendingImageUrl(null)}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
            Excerpt (optional)
          </label>
          <textarea
            id="excerpt"
            {...register('excerpt')}
            placeholder="Brief summary for post listings..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.excerpt && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.excerpt.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category (optional)
          </label>
          <select
            id="category"
            {...register('category')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Select a Category --</option>
            {PREDEFINED_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            type="text"
            {...register('tags')}
            placeholder="javascript, react, tutorial"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Auto-save indicator */}
        {isDirty && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ✓ Draft auto-saved to browser storage
          </p>
        )}

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Icon
              path={isSubmitting ? mdiLoading : mdiContentSave}
              size={0.9}
              className={isSubmitting ? 'animate-spin' : ''}
            />
            {isSubmitting
              ? mode === 'create'
                ? 'Publishing...'
                : 'Updating...'
              : mode === 'create'
                ? 'Publish Post'
                : 'Update Post'}
          </button>
        </div>
      </form>

      {/* Inline image uploader modal (for editor) */}
      {showImageUploader && (
        <ImageUploader
          onUploadComplete={handleImageUploadComplete}
          onClose={() => setShowImageUploader(false)}
          folder="blog_post_images"
        />
      )}

      {/* Cover image uploader modal */}
      {showCoverImageUploader && (
        <ImageUploader
          onUploadComplete={handleCoverImageUploadComplete}
          onClose={() => setShowCoverImageUploader(false)}
          folder="blogs_cover_images"
        />
      )}
    </div>
  )
}
