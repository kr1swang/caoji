import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: { position: 'bottom-right' },
  transpilePackages: ['@caoji/types']
}

export default nextConfig
