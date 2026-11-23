# Harsh Mishra — Pharmaceutical Sciences Portfolio

A premium, editorial-style personal website for a pharmacy student. Built with Next.js, TypeScript and a separate MDX content repository.

## Run locally

```bash
git clone --recurse-submodules https://github.com/milesmoraliis759/portfolio.git
cd portfolio
npm install
npm run dev
```

## Save something to the portfolio

When Harsh says **“add this to my notes”** or **“save this to my portfolio”**, use the capture instructions in the [content repository](https://github.com/milesmoraliis759/content/blob/main/SAVE_TO_PORTFOLIO.md). All learning notes and articles belong in the content repository, not directly in this Next.js source repository.

## Content publishing automation

The `content` directory is a Git submodule pointing to https://github.com/milesmoraliis759/content.

When a content PR is merged to `main`, a workflow in the content repository opens a content-bump PR here. Review and merge that PR to update the site and trigger Vercel deployment.

## Contact

- Email: mishraharsh759@gmail.com
- LinkedIn: https://www.linkedin.com/in/harshmishra759/
