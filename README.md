# Blog Frontend

A production-ready, Medium-like blog frontend built with React, TypeScript, Tailwind CSS, and Tiptap editor.

## Features

- 📝 Rich text editor with Tiptap (headings, lists, links, code blocks, images)
- 🖼️ Direct image upload to ImageKit with drag & drop and paste support
- 🎨 Medium-inspired UI with responsive design
- 🌙 Dark mode support
- 📱 Fully responsive
- ♿ Keyboard navigation and accessibility
- 🔄 Auto-save drafts to localStorage
- 🎯 Form validation with Zod
- ⚡ Optimistic updates with TanStack Query
- 🎭 Loading skeletons and error states
- 🔍 Search and filter by tags
- 📄 Pagination support
- 🚀 SEO-friendly with meta tags

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **@tailwindcss/typography** - Prose styling
- **React Router 7** - Routing
- **TanStack Query** - Data fetching and caching
- **Tiptap** - Rich text editor
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **ImageKit** - Image hosting and CDN
- **date-fns** - Date formatting
- **DOMPurify** - XSS protection
- **React Hot Toast** - Notifications

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (Java + Spring + Maven)
- ImageKit account

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Configure environment variables:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_IMAGEKIT_PUBLIC_KEY=your_public_key
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Backend Requirements

See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for complete backend integration guide.

The frontend expects the following REST API endpoints:

### Health Check
- `GET /health` - Returns `{ "status": "OK" }`

### Posts
- `GET /api/posts?page=0&size=10&tag=javascript` - Get paginated posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### ImageKit Integration
- `GET /api/imagekit/auth` - Get ImageKit authentication params (recommended)
- `POST /api/images/upload` - Upload image via backend (fallback)

## Project Structure

```
src/
├── api.ts                    # API client and types
├── main.tsx                  # App entry point
├── App.tsx                   # App shell with routing
├── index.css                 # Global styles
├── components/
│   ├── TiptapEditor.tsx      # Rich text editor
│   ├── ImageUploader.tsx     # Image upload modal
│   ├── MetaTags.tsx          # SEO meta tags
│   └── ErrorBoundary.tsx     # Error boundary
├── routes/
│   ├── PostListPage.tsx      # Home page with post list
│   ├── PostDetailPage.tsx    # Single post view
│   └── PostFormPage.tsx      # Create/edit post form
└── ...
```

## Key Features

### Rich Text Editor
- Headings, bold, italic, lists, quotes, code blocks
- Inline images with drag & drop / paste
- Keyboard shortcuts (Cmd+B, Cmd+I, etc.)

### Image Upload
1. User drags/drops or pastes an image
2. Validates file (type, size < 10MB)
3. Shows preview and progress
4. Uploads directly to ImageKit
5. Falls back to backend if needed

### Auto-save Drafts
- Saves to localStorage every 2 seconds
- Restores drafts on page load (if < 1 hour old)

### Dark Mode
- Respects system preference
- Toggle persists to localStorage

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT
