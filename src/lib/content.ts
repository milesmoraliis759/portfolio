import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ContentKind = "articles" | "learning";
export type ContentItem = {
  slug: string;
  kind: ContentKind;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  level?: string;
  featured: boolean;
  published: boolean;
  filePath: string;
};

const ROOT = path.join(process.cwd(), "content");

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(filePath);
    return entry.isFile() && entry.name.endsWith(".mdx") ? [filePath] : [];
  });
}

function parse(filePath: string, kind: ContentKind): ContentItem | null {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  const relative = path.relative(path.join(ROOT, kind), filePath).replace(/\\/g, "/");
  const slug = relative.replace(/\.mdx$/, "").replace(/\//g, "--");

  if (data.published === false) return null;
  if (typeof data.title !== "string" || !data.title.trim()) {
    throw new Error(`Missing required frontmatter field "title" in ${filePath}`);
  }
  if (data.date && Number.isNaN(Date.parse(String(data.date)))) {
    throw new Error(`Invalid frontmatter date in ${filePath}: ${String(data.date)}`);
  }
  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    throw new Error(`Frontmatter "tags" must be a list in ${filePath}`);
  }

  return {
    slug,
    kind,
    title: data.title.trim(),
    description: typeof data.description === "string" ? data.description : "",
    date: data.date ? String(data.date) : "",
    category: typeof data.category === "string" ? data.category : "General",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readTime: typeof data.readTime === "string" ? data.readTime : "5 min read",
    level: data.level ? String(data.level) : undefined,
    featured: data.featured === true,
    published: true,
    filePath,
  };
}

export function getAllContent(kind?: ContentKind): ContentItem[] {
  const kinds: ContentKind[] = kind ? [kind] : ["articles", "learning"];
  return kinds
    .flatMap((contentKind) => walk(path.join(ROOT, contentKind)).map((filePath) => parse(filePath, contentKind)))
    .filter((item): item is ContentItem => item !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getContentBySlug(kind: ContentKind, slug: string) {
  const item = getAllContent(kind).find((entry) => entry.slug === slug);
  return item ? { item, source: fs.readFileSync(item.filePath, "utf8") } : null;
}

export function getCategories(kind?: ContentKind) {
  return Array.from(new Set(getAllContent(kind).map((item) => item.category))).sort();
}

export function getFeaturedContent() {
  return getAllContent().filter((item) => item.featured).slice(0, 4);
}
