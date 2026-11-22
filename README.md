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
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000. For an existing clone: `git submodule update --init --recursive`.

## Add an article or lesson

Create an `.mdx` file under `content/articles/` or `content/learning/` with frontmatter fields: `title`, `description`, `date`, `category`, `tags`, `readTime`, `level`, `featured` and `published`. Set `published: false` to keep a draft out of the public site.

When you publish a new content-repository revision, update the pointer in the portfolio:

```bash
git submodule update --remote content
git add content
git commit -m "content: update learning library"
git push
```

## Routes

- `/` home · `/about` about · `/experience` training · `/projects` projects
- `/articles` articles · `/learning` learning library · `/contact` contact
- `/articles/[...slug]` and `/learning/[...slug]` MDX content pages

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to the canonical production URL in the deployment environment (for example, the eventual custom domain). The GitHub Actions workflow checks the app build and checks out the content submodule recursively.

## Before public launch

1. Replace placeholder contact email and LinkedIn URL.
2. Add a real profile photograph and project images if desired.
3. Review experience details for accuracy and confidentiality.
4. Connect the GitHub repository to a deployment platform and configure the production URL.
5. Add analytics or a contact form only with an appropriate privacy and delivery setup.

Educational content is not personal medical advice. Scientific claims should include authoritative references and be checked before publication.
