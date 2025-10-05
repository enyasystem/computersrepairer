/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // allow external images from Supabase (storage.googleapis.com or your project's custom domain)
    remotePatterns: [
      // Example: allow public assets delivered via the Supabase storage CDN
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
  // allow images loaded from images.unsplash.com (full-resolution Unsplash URLs)
  { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }
    ]
  },
}

export default nextConfig
