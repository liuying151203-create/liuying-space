import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

const base = process.env.BASE_PATH ?? '/';
const site = process.env.SITE_URL ?? 'https://example.com';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    mdx(),
    tailwind(),
    sitemap(),
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark-default',
    },
  },
});