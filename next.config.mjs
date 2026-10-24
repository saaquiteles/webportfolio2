const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // An unset or empty env var must mean "no prefix at all", so '' becomes undefined.
  basePath,
  assetPrefix: basePath,
  // Explicit root: Next otherwise guesses it from the nearest lockfile, which can be a parent folder.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
