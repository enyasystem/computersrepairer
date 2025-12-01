/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Vercel Blob storage
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com', pathname: '/**' },
      // Supabase storage (legacy, kept for compatibility)
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      // Unsplash
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }
    ]
  },
}

export default nextConfig
