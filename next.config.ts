/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other configurations...

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kppkmbwxeixzbcxsccvw.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**', // This allows all paths from images.unsplash.com
      },
    ],
  },
};

module.exports = nextConfig;