import { useEffect } from 'react'

const DEFAULT_TITLE = 'Harry'

type MetaTagsProps = {
  title?: string
  description?: string
  imageUrl?: string
  url?: string
}

export const MetaTags = ({
  title,
  description,
  imageUrl,
  url,
}: MetaTagsProps) => {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = `${title} | ${DEFAULT_TITLE}`
    }

    // Update meta tags
    const metaTags = [
      {
        name: 'description',
        content: description || 'A personal blog about technology and ideas',
      },
      { property: 'og:title', content: title || DEFAULT_TITLE },
      {
        property: 'og:description',
        content: description || 'A personal blog about technology and ideas',
      },
      { property: 'og:image', content: imageUrl || '/og-image.jpg' },
      { property: 'og:url', content: url || window.location.href },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title || DEFAULT_TITLE },
      {
        name: 'twitter:description',
        content: description || 'A personal blog about technology and ideas',
      },
      { name: 'twitter:image', content: imageUrl || '/og-image.jpg' },
    ]

    metaTags.forEach(({ name, property, content }) => {
      const selector = name
        ? `meta[name="${name}"]`
        : `meta[property="${property}"]`
      let element = document.querySelector(selector)

      if (!element) {
        element = document.createElement('meta')
        if (name) element.setAttribute('name', name)
        if (property) element.setAttribute('property', property)
        document.head.appendChild(element)
      }

      element.setAttribute('content', content)
    })

    // Cleanup - reset title when component unmounts
    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [title, description, imageUrl, url])

  return null
}
