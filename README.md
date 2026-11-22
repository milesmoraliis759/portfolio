# Harsh Mishra — Portfolio & Learning Hub

A personal portfolio built with **Next.js App Router**, TypeScript and a separate MDX content repository.

The site takes inspiration from [Abhinandan Mishra](https://www.abhinandanmishra.in/), adapted for pharmaceutical sciences, industry learning and pharmacy education.

## Architecture
- **Portfolio app:** Next.js site, profile, experience, projects, contact, articles and learning routes.
- **Content repository:** [milesmoraliis759/content](https://github.com/milesmoraliis759/content), connected at `content/` as a Git submodule.
- **MDX:** articles and lessons are authored as Markdown + optional JSX with YAML frontmatter.

## Start locally
Requirements: Node.js 20.9+.
```bash
git clone --recurse-submodules https://github.com/milesmoraliis759/portfolio.git
cd portfolio
npm install
npm run dev
```
Open http://localhost:3000. For an existing clone: `git submodule update --init --recursive`.

## Add an article or lesson
Create an `.mdx` file under `content/articles/` or `content/learning/` with frontmatter fields: `title`, `description`, `date`, `category`, `tags`, `readTime`, `level`, `featured` and `published`. Set `published: false` to keep a draft out of the public site.

## Routes
- `/` home · `/about` about · `/experience` training · `/projects` projects
- `/articles` articles · `/learning` learning library · `/contact` contact
- `/articles/[...slug]` and `/learning/[...slug]` MDX content pages

## Before public launch
1. Replace placeholder contact email and LinkedIn URL.
2. Add a real profile photograph and project images if desired.
3. Review experience details for accuracy and confidentiality.
4. Configure deployment so the content submodule is available at build time.
5. Add analytics or a contact form only with an appropriate privacy and delivery setup.

Educational content is not personal medical advice. Scientific claims should include authoritative references and be checked before publication.
