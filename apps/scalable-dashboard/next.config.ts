import type { NextConfig } from "next";

// TODO: Uncomment the bundle analyzer once you've completed the lazy-loading tasks.
// Run: ANALYZE=true pnpm build
// Then open the generated HTML files to see your bundle composition.
// Document in the README: what are the largest chunks before and after your changes?

// import bundleAnalyzer from "@next/bundle-analyzer";
// const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfig: NextConfig = {
  // Strict mode helps catch double-render bugs in development
  reactStrictMode: true,
};

// TODO: Replace `export default nextConfig` with:
// export default withBundleAnalyzer(nextConfig);
export default nextConfig;
