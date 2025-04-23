import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

const nextConfig = {
  output: 'export',    // Static site generation
  images: {
    unoptimized: true, // Required for static export
  },
  basePath: process.env.NODE_ENV === 'production' ? '/bettermadetech' : '',
  trailingSlash: true, // Recommended for GitHub Pages
  reactStrictMode: true,
};

export default withNextra(nextConfig);