# Harsh Mishra — Pharmaceutical Sciences Portfolio

A premium, editorial-style personal website for a pharmacy student. Built with Next.js, TypeScript and a separate MDX content repository.

## Run locally

```bash
git clone --recurse-submodules https://github.com/milesmoraliis759/portfolio.git
cd portfolio
npm install
npm run dev
```

## Content publishing automation

The `content` directory is a Git submodule pointing to https://github.com/milesmoraliis759/content.

When a content PR is merged to `main`, a workflow in the content repository opens a content-bump PR here. Review and merge that PR to update the site and trigger Vercel deployment.

## Contact

- Email: mishraharsh759@gmail.com
- LinkedIn: https://www.linkedin.com/in/harshmishra759/
