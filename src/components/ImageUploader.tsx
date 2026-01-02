import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import ImageKit from 'imagekit-javascript'
import { api } from '../api'
import toast from 'react-hot-toast'
import Icon from '@mdi/react'
import { mdiUpload, mdiClose, mdiLoading, mdiAlert } from '@mdi/js'

type ImageUploaderProps = {
  onUploadComplete: (url: string) => void
  onClose: () => void
  /** ImageKit folder path - defaults to 'blog_post_images' for inline images */
  folder?: 'blog_post_images' | 'blogs_cover_images'
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

function createImageKitClient(): ImageKit | null {
  const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY as unknown as
    | string
    | undefined
  const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT as unknown as
    | string
    | undefined

  if (!publicKey || !publicKey.trim() || !urlEndpoint || !urlEndpoint.trim()) {
    return null
  }

  return new ImageKit({
    publicKey,
    urlEndpoint,
  })
}

export const ImageUploader = ({
  onUploadComplete,
  onClose,
  folder = 'blog_post_images',
}: ImageUploaderProps) => {
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const uploadToImageKit = async (file: File) => {
    try {
      const imagekit = createImageKitClient()
      if (!imagekit) {
        throw new Error(
          'ImageKit is not configured. Set VITE_IMAGEKIT_PUBLIC_KEY and VITE_IMAGEKIT_URL_ENDPOINT (or rely on backend upload fallback).',
        )
      }

      setUploadState('uploading')
      setProgress(10)

      // Get auth params from backend
      const authParams = await api.getImageKitAuth()
      setProgress(30)

      // Upload to ImageKit with folder path
      const result = await new Promise<{ url: string }>((resolve, reject) => {
        imagekit.upload(
          {
            file,
            fileName: file.name,
            folder: `/${folder}`,
            ...authParams,
          },
          (err: Error | null, result: any) => {
            if (err) reject(err)
            else if (result) resolve(result)
            else reject(new Error('Upload failed'))
          },
        )
      })

      setProgress(100)
      setUploadState('success')
      toast.success('Image uploaded successfully!')
      onUploadComplete(result.url)
    } catch (err) {
      console.error('ImageKit upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
      setUploadState('error')

      // Fallback to backend upload
      try {
        toast.loading('Trying alternative upload method...')
        const result = await api.uploadImageToBackend(file)
        setUploadState('success')
        toast.dismiss()
        toast.success('Image uploaded via backend!')
        onUploadComplete(result.url)
      } catch (backendErr) {
        toast.dismiss()
        toast.error('Both upload methods failed. Please try again.')
        setError('Upload failed. Please check your configuration.')
      }
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Validate file
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image must be less than 10MB')
        return
      }

      // Show preview
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)

      await uploadToImageKit(file)
    },
    [onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: false,
    disabled: uploadState === 'uploading',
  })

  const retry = () => {
    setUploadState('idle')
    setProgress(0)
    setError(null)
    setPreview(null)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upload Image</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            disabled={uploadState === 'uploading'}
          >
            <Icon path={mdiClose} size={0.9} />
          </button>
        </div>

        {uploadState === 'idle' && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Icon
              path={mdiUpload}
              size={2}
              className="mx-auto mb-4 text-gray-400"
            />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isDragActive
                ? 'Drop image here'
                : 'Drag & drop an image, or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, GIF, WEBP • Max 10MB
            </p>
          </div>
        )}

        {uploadState === 'uploading' && (
          <div className="space-y-4">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Uploading...
                </span>
                <span className="text-sm font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Icon path={mdiLoading} size={1} className="animate-spin mr-2" />
              <span className="text-sm">Please wait...</span>
            </div>
          </div>
        )}

        {uploadState === 'error' && (
          <div className="space-y-4">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg opacity-50"
              />
            )}
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <Icon
                path={mdiAlert}
                size={1}
                className="text-red-600 dark:text-red-400 shrink-0"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                  Upload Failed
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={retry}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {uploadState === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold mb-2">Upload Complete!</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Image has been inserted into your post.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
