# Quick Start Guide

## 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env
```

Required environment variables:
- `VITE_API_BASE_URL` - Your Spring Boot backend URL (e.g., http://localhost:8080)
- `VITE_IMAGEKIT_PUBLIC_KEY` - Your ImageKit public key
- `VITE_IMAGEKIT_URL_ENDPOINT` - Your ImageKit URL endpoint

## 2. Install Dependencies

Dependencies are already installed, but if needed:

```bash
npm install
```

## 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:5173

## 4. Test the App

### View Posts
1. Navigate to http://localhost:5173
2. You should see the post list page (empty initially)

### Create a Post
1. Click "Write" button in header
2. Enter title, content using the rich editor
3. Try drag & drop an image into the editor
4. Add tags (comma-separated)
5. Click "Publish Post"

### Edit a Post
1. Open any post
2. Click "Edit" button
3. Make changes
4. Click "Update Post"

### Dark Mode
1. Click the moon/sun icon in header
2. Toggle between light and dark themes

## 5. Backend Setup

Make sure your Spring Boot backend implements:

### Required Endpoints
```
GET  /health
GET  /api/posts?page=0&size=10&tag=javascript
GET  /api/posts/:id
POST /api/posts
PUT  /api/posts/:id
DELETE /api/posts/:id
GET  /api/imagekit/auth  (recommended for direct uploads)
POST /api/images/upload  (fallback option)
```

See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for complete implementation details.

## 6. ImageKit Setup

1. Sign up at https://imagekit.io (free tier available)
2. Go to Developer Options → API Keys
3. Copy:
   - Public Key → Add to `.env` as `VITE_IMAGEKIT_PUBLIC_KEY`
   - Private Key → Add to backend `application.properties`
   - URL Endpoint → Add to both `.env` and backend

## Common Issues

### CORS Errors
Backend must allow your frontend origin:
```java
@CrossOrigin(origins = "http://localhost:5173")
```

### Images Not Uploading
- Check ImageKit keys are correct
- Verify backend `/api/imagekit/auth` endpoint is working
- Check browser console for detailed errors

### Posts Not Loading
- Verify backend is running on correct port
- Check `VITE_API_BASE_URL` in `.env`
- Ensure CORS is properly configured

### Dark Mode Not Persisting
- Check browser localStorage is enabled
- Clear browser cache and reload

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint
```

## Features to Test

- ✅ Create/edit/delete posts
- ✅ Rich text formatting (bold, italic, headings, lists)
- ✅ Image upload (drag & drop, paste)
- ✅ Tag-based filtering
- ✅ Pagination
- ✅ Dark mode toggle
- ✅ Auto-save drafts
- ✅ Responsive design (try on mobile)
- ✅ Error states
- ✅ Loading skeletons

## Next Steps

1. Configure your backend with ImageKit credentials
2. Test image upload flow end-to-end
3. Customize branding (logo, colors, fonts)
4. Add analytics if needed
5. Deploy to production (Vercel, Netlify, etc.)

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

Environment variables must be set in hosting platform dashboard.

### Backend
Ensure production URLs are updated in frontend `.env` and CORS configuration.

## Support

For backend integration help, see [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
