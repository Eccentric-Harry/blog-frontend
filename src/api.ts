// frontend: src/api.ts
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(
  /\/$/,
  '',
)

// ============ Types ============

export type Tag = {
  id: number
  name: string
  slug: string
  postCount?: number
}

export type Category = {
  id: number
  name: string
  slug: string
  description?: string
  postCount?: number
}

export type PostSummary = {
  id: number
  title: string
  excerpt: string
  slug?: string
  author?: string
  tags?: string[]
  categoryName?: string
  categorySlug?: string
  createdAt?: string
  updatedAt?: string
  coverImageUrl?: string
  readTime?: number
  archived?: boolean
}

export type Post = {
  id: number
  title: string
  content: string
  excerpt?: string
  slug?: string
  author?: string
  tags?: Tag[]
  category?: Category
  createdAt?: string
  updatedAt?: string
  coverImageUrl?: string
  readTime?: number
  published?: boolean
  archived?: boolean
}

export type PagedResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number // page number
  first: boolean
  last: boolean
}

export type ImageKitAuthParams = {
  signature: string
  token: string
  expire: number
}

export type ImageUploadResponse = {
  url: string
  fileId: string
  name: string
  size: number
  fileType: string
}

export type ApiError = {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
  details?: string[]
}

export type AuthResponse = {
  accessToken?: string
  tokenType?: string
  expiresIn?: number
  user?: {
    id: number
    username: string
    email: string
    displayName?: string
    avatarUrl?: string
    role: string
  }
}

// ============ Auth Token Helper ============
const TOKEN_KEY = 'blog_access_token'

function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

// ============ Request Helper ============

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers as HeadersInit | undefined)

  // Add auth token if available
  const token = getAuthToken()
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  // Only set JSON Content-Type if request has a string body (i.e. JSON string)
  if (options.body && typeof options.body === 'string') {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!res.ok) {
    let errorData: ApiError | null = null
    try {
      errorData = await res.json()
    } catch {
      // Not JSON error
    }

    const message =
      errorData?.message || `API request failed with status ${res.status}`
    const error = new Error(message) as Error & { apiError?: ApiError }
    error.apiError = errorData || undefined
    throw error
  }

  if (res.status === 204) {
    return undefined as unknown as T
  }

  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return (await res.json()) as T
  }

  const text = await res.text()
  return text as unknown as T
}

// ============ API Client ============

export const api = {
  // Health check
  getHealth: () => request<{ status: string }>('/health'),

  // ============ Auth ============

  /**
   * Login with username/email and password
   */
  login: (usernameOrEmail: string, password: string) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password }),
    }),

  /**
   * Register a new user
   */
  register: (
    username: string,
    email: string,
    password: string,
    displayName?: string,
  ) =>
    request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, displayName }),
    }),

  /**
   * Get current authenticated user
   */
  getCurrentUser: () => request<AuthResponse>('/api/auth/me'),

  // ============ Posts ============

  /**
   * Get paginated list of published posts with optional filters.
   */
  getPosts: (
    page = 0,
    size = 10,
    tag?: string,
    category?: string,
    query?: string,
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    })
    if (tag) params.append('tag', tag)
    if (category) params.append('category', category)
    if (query) params.append('q', query)

    return request<PagedResponse<PostSummary>>(
      `/api/posts?${params.toString()}`,
    )
  },

  /**
   * Get recently updated posts.
   */
  getRecentPosts: (limit = 5) =>
    request<PostSummary[]>(`/api/posts/recent?limit=${limit}`),

  /**
   * Get a single post by ID.
   */
  getPost: (id: number) => request<Post>(`/api/posts/${id}`),

  /**
   * Get a single post by slug.
   */
  getPostBySlug: (slug: string) => request<Post>(`/api/posts/slug/${slug}`),

  /**
   * Create a new post.
   */
  createPost: (payload: {
    title: string
    content: string
    excerpt?: string
    author?: string
    tags?: string[]
    categoryName?: string
    coverImageUrl?: string
    published?: boolean
  }) =>
    request<Post>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Update an existing post.
   */
  updatePost: (
    id: number,
    payload: {
      title?: string
      content?: string
      excerpt?: string
      author?: string
      tags?: string[]
      categoryName?: string
      coverImageUrl?: string
      published?: boolean
    },
  ) =>
    request<Post>(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  /**
   * Delete a post.
   */
  deletePost: (id: number) =>
    request<void>(`/api/posts/${id}`, {
      method: 'DELETE',
    }),

  /**
   * Get archived posts with pagination.
   */
  getArchivedPosts: (page = 0, size = 10) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    })
    return request<PagedResponse<PostSummary>>(
      `/api/posts/archived?${params.toString()}`,
    )
  },

  /**
   * Archive a post.
   */
  archivePost: (id: number) =>
    request<Post>(`/api/posts/${id}/archive`, {
      method: 'POST',
    }),

  /**
   * Unarchive a post.
   */
  unarchivePost: (id: number) =>
    request<Post>(`/api/posts/${id}/unarchive`, {
      method: 'POST',
    }),

  /**
   * Get all categories with post counts.
   */
  getAllCategories: () => request<Category[]>('/api/posts/categories/all'),

  /**
   * Get all tags with post counts.
   */
  getAllTags: () => request<Tag[]>('/api/posts/tags/all'),

  // ============ Tags ============

  /**
   * Get all tags with published posts.
   */
  getTags: () => request<Tag[]>('/api/tags'),

  /**
   * Get trending tags.
   */
  getTrendingTags: (limit = 10) =>
    request<Tag[]>(`/api/tags/trending?limit=${limit}`),

  // ============ Categories ============

  /**
   * Get all categories with published posts.
   */
  getCategories: () => request<Category[]>('/api/categories'),

  // ============ Images ============

  /**
   * Get ImageKit authentication params for direct upload.
   */
  getImageKitAuth: () => request<ImageKitAuthParams>('/api/imagekit/auth'),

  /**
   * Upload image via backend proxy.
   */
  uploadImageToBackend: async (file: File, postId?: number) => {
    const formData = new FormData()
    formData.append('file', file)
    if (postId) formData.append('postId', String(postId))

    const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Image upload failed: ${errorText}`)
    }

    return (await response.json()) as ImageUploadResponse
  },
}
