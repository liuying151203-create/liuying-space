# Liuying Space

An Astro-based personal blog and portfolio with TypeScript, Tailwind CSS, Markdown, and MDX.

## What is included

- Home, About, Projects, Blog, and Docs pages
- Data-driven profile, project, timeline, and navigation content
- Astro Content Collections for blog and docs
- GitHub Pages workflow scaffold
- SEO baseline with canonical links, Open Graph metadata, sitemap, and robots.txt

## Project structure

- `src/data/`: profile, projects, navigation, skills, timeline data
- `src/content/blog/`: blog posts in Markdown or MDX
- `src/content/docs/`: tutorials and documentation content
- `src/components/`: reusable UI components
- `src/layouts/`: page shells and content layouts
- `src/pages/`: routes for each page and content detail view

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Start the dev server with `npm run dev`.

## Add a blog post

Create a new `.md` or `.mdx` file in `src/content/blog/` with frontmatter like this:

```md
---
title: My New Post
description: Short summary of the article.
pubDate: 2026-06-01
tags:
  - astro
  - writing
category: Notes
draft: false
featured: false
---
```

The post will automatically appear in the blog list and generate its own detail page.

## Add a docs page

Create a new `.md` or `.mdx` file in `src/content/docs/` with `series` and `order` fields if the entry belongs to a multi-part tutorial series.

## Update site data

- Edit `src/data/profile.ts` for personal info and social links
- Edit `src/data/projects.ts` for project cards
- Edit `src/data/navigation.ts` for top navigation
- Edit `src/data/skills.ts` and `src/data/timeline.ts` for About page content

## Deploy to GitHub Pages

1. Push the repository to GitHub.
2. Make sure the default branch is `main`.
3. Enable GitHub Pages using the Actions workflow in `.github/workflows/deploy.yml`.
4. Set `SITE_URL` and `BASE_PATH` if you need custom deployment values.

For a repository named `liuying-space`, the workflow already prepares the correct GitHub Pages base path.