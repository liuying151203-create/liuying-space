# Astro 个人博客 / 作品集网站结构设计与实施规划

## 1. 项目目标

这是一个面向 GitHub Pages 部署的静态个人网站，兼顾个人主页、作品集、博客、教程/文档与外部链接集合。项目优先复用成熟开源工具，减少重复造轮子，同时保留一部分页面和组件的自定义空间，方便后续学习与个性化迭代。

## 2. 技术选型

- 框架：Astro
- 语言：TypeScript
- 样式：Tailwind CSS
- 内容管理：Astro Content Collections
- 内容格式：Markdown / MDX
- 部署目标：GitHub Pages
- 可选扩展：Pagefind 站内搜索、Giscus 评论

## 3. 设计原则

- 静态优先，减少运行时复杂度
- 内容数据化，配置与内容分离
- 组件职责清晰，便于复用与扩展
- 页面结构模块化，方便后续新增专题页
- UI 保持现代、简洁、有设计感，但不过度堆叠动画
- 移动端优先，保证响应式与可读性

## 4. 推荐项目结构

```text
src/
  components/
    common/
      Footer.astro
      Layout.astro
      Navbar.astro
      SectionHeader.astro
      Tag.astro
    home/
      Hero.astro
    blog/
      BlogCard.astro
    projects/
      ProjectCard.astro
    shared/
      Timeline.astro
      ThemeToggle.astro
  content/
    blog/
    docs/
    config.ts
  data/
    navigation.ts
    profile.ts
    projects.ts
    socials.ts
    skills.ts
    timeline.ts
  layouts/
    BaseLayout.astro
    BlogPostLayout.astro
    DocsLayout.astro
  pages/
    index.astro
    about.astro
    projects.astro
    blog/
      index.astro
      [...slug].astro
    docs/
      index.astro
      [...slug].astro
  styles/
    global.css
  utils/
    seo.ts
    slug.ts
    format.ts
public/
  images/
    avatar/
    projects/
    blog/
    docs/
  favicon.svg
  robots.txt
  og/
astro.config.mjs
tsconfig.json
tailwind.config.mjs
postcss.config.mjs
package.json
.github/
  workflows/
    deploy.yml
```

## 5. 目录职责说明

### `src/data`
存放网站的结构化数据，优先把可变内容从组件中抽离出来。

建议拆分为：

- `profile.ts`：姓名、身份描述、简介、联系方式、社交链接、头像信息
- `projects.ts`：项目列表、技术栈、状态、链接、封面图
- `navigation.ts`：顶部导航与页脚导航
- `skills.ts`：技能栈分类
- `timeline.ts`：学习与工作经历时间线

### `src/content`
使用 Astro Content Collections 管理文章与教程。

- `content/blog`：博客文章，适合输出观点、记录和更新
- `content/docs`：教程、学习笔记、系列文档，适合章节化内容
- `config.ts`：内容 schema、字段校验、slug 规则

### `src/components`
按功能分层组织，避免所有组件堆在一个目录中。

- `common`：全站通用组件
- `home`：首页专用组件
- `blog`：博客相关组件
- `projects`：项目展示组件
- `shared`：跨页面可复用但不属于“通用壳”的组件

### `src/layouts`
集中处理页面壳层、SEO、文章排版与文档排版。

- `BaseLayout.astro`：页面基础结构、`<head>`、导航、页脚
- `BlogPostLayout.astro`：博客正文排版、目录预留、阅读体验
- `DocsLayout.astro`：文档/教程布局、侧边栏预留、章节导航预留

### `src/pages`
只负责路由入口与组合页面组件，不放复杂业务逻辑。

- `/`：首页
- `/about`：关于页
- `/projects`：项目页
- `/blog`：博客列表页
- `/blog/[slug]`：博客详情页
- `/docs`：教程/文档列表页
- `/docs/[slug]`：教程/文档详情页

### `public`
放静态资源和图片素材，便于直接引用。

## 6. 页面信息架构

### 首页 `/`
目标是快速建立个人印象与入口分发。

内容建议：

- Hero：姓名、身份、简介、主按钮
- 社交链接入口
- 精选项目
- 最新博客
- 个人能力摘要或重点领域
- 可选：简短的时间线摘要

### 关于页 `/about`
目标是完整展示个人信息与背景。

内容建议：

- 个人介绍
- 技能栈
- 学习/工作经历时间线
- 联系方式
- 可选：当前关注方向、工具栈、兴趣标签

### 项目页 `/projects`
目标是以卡片列表展示项目成果。

字段建议：

- 名称
- 描述
- 技术栈
- 状态
- GitHub 链接
- Demo 链接
- 封面图
- 标签

后续支持：按标签筛选、按状态筛选、按技术栈筛选。

### 博客页 `/blog`
目标是展示可持续更新的文章流。

字段建议：

- 标题
- 摘要
- 日期
- 标签
- 分类
- 封面图（可选）

详情页要求：

- 排版清晰
- 代码块高亮
- TOC 目录预留
- 合理的阅读宽度与行高

### 教程/文档页 `/docs`
目标是承载系列教程、学习笔记、规范文档等更结构化的内容。

建议与博客区分：

- 博客偏“文章流”
- 文档偏“系列/章节/主题导航”

后续可预留：

- 左侧目录栏
- 章节导航
- 同系列文章聚合页

## 7. 组件设计

### 必做组件

- `Layout`：统一结构、SEO、导航栏、页脚
- `Navbar`：首页、关于、项目、博客、教程链接
- `Footer`：版权、社交链接
- `Hero`：首页主视觉
- `ProjectCard`：项目卡片
- `BlogCard`：博客卡片
- `Tag`：标签展示
- `Timeline`：经历时间线
- `SectionHeader`：分区标题

### 预留组件

- `ThemeToggle`：暗色/亮色模式切换入口，先保留结构
- `TableOfContents`：文章目录
- `SidebarNav`：文档侧边栏导航
- `SearchButton`：Pagefind 搜索入口
- `CommentEmbed`：Giscus 评论挂载点

## 8. 内容模型建议

### `profile`
适合存放：

- 姓名
- 职业/身份描述
- 简介
- 头像
- 主要按钮
- 联系方式
- 社交链接

### `projects`
适合存放：

- title
- description
- tags
- status
- techStack
- githubUrl
- demoUrl
- coverImage
- featured
- order

### `blog` / `docs`
建议 schema 包含：

- title
- description
- publishDate
- updateDate
- tags
- category
- draft
- coverImage
- series（可选）

## 9. SEO 与部署规划

### SEO

- 每页可配置 title / description / og image
- 统一 canonical
- 基础 Open Graph / Twitter Card
- 自动 sitemap
- robots.txt

### GitHub Pages

- 使用 GitHub Actions 自动构建与部署
- 使用 Astro 静态导出
- 后续根据仓库名配置 base path
- 静态资源统一走 `public/`

## 10. 分阶段实施路线

### 第 1 阶段：项目骨架

- 初始化 Astro + TypeScript
- 安装 Tailwind CSS
- 建立目录结构
- 配置基础全局样式
- 准备布局组件

### 第 2 阶段：数据与首页

- 建立 `src/data` 结构
- 实现首页 Hero、精选项目、最新博客入口
- 完成 Navbar / Footer / Layout

### 第 3 阶段：内容系统

- 配置 Content Collections
- 实现博客列表与详情页
- 实现教程/文档列表与详情页
- 补充 TOC 与排版样式

### 第 4 阶段：页面完善

- 完成 About 页
- 完成 Projects 页
- 加入筛选与更丰富的卡片展示

### 第 5 阶段：工程化

- SEO、sitemap、robots
- GitHub Pages Actions
- 基础 lint / typecheck / build 校验

### 第 6 阶段：可选增强

- Pagefind 搜索
- Giscus 评论
- 暗色/亮色主题切换
- 图片优化与文章封面策略

## 11. 当前执行策略

接下来会优先完成这些事情：

1. 初始化 Astro + TypeScript 项目
2. 安装 Tailwind CSS
3. 写入基础目录与配置
4. 建立 Layout / Navbar / Footer / Hero 的最小可运行版本
5. 配置 Content Collections 的基础 schema
6. 增加 GitHub Pages 部署骨架

## 12. 预期后续新增内容的方式

- 新增博客：在 `src/content/blog/` 下新增 Markdown 或 MDX 文件
- 新增教程：在 `src/content/docs/` 下新增 Markdown 或 MDX 文件
- 新增项目：在 `src/data/projects.ts` 中追加条目
- 新增社交链接：在 `src/data/profile.ts` 中调整配置
- 新增导航：在 `src/data/navigation.ts` 中修改路由列表

## 13. 备注

该规划会在实际实现过程中逐步微调，但核心原则是：内容数据化、布局组件化、内容与表现分离、静态部署优先。
