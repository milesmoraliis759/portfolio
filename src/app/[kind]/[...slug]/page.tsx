import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllContent,getContentBySlug,type ContentKind } from "@/lib/content";
type Props={params:Promise<{kind:string;slug:string[]}>};
export function generateStaticParams(){return getAllContent().map(item=>({kind:item.kind,slug:item.slug.split("--")}));}
async function resolve(params:Props["params"]){const {kind,slug}=await params;if(kind!=="articles"&&kind!=="learning")return null;return getContentBySlug(kind as ContentKind,slug.join("--"));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const result=await resolve(params);return result?{title:result.item.title,description:result.item.description}:{title:"Not found"};}
export default async function ContentPage({params}:Props){const result=await resolve(params);if(!result)notFound();const {content}=await compileMDX({source:result.source,options:{parseFrontmatter:true,mdxOptions:{remarkPlugins:[remarkGfm]}}});const {item}=result;return <article className="article-shell container"><div className="article-heading"><span className="tag">{item.category}</span><p className="eyebrow">{item.kind==="articles"?"ARTICLE":"LEARNING NOTE"} · {item.readTime}</p><h1>{item.title}</h1><p className="article-description">{item.description}</p><div className="article-meta"><span>{item.date}</span><span>{item.level??"Pharmacy notes"}</span></div></div><div className="mdx-prose">{content}</div><div className="article-end"><span>END OF NOTE</span><span>Keep learning. Keep questioning.</span></div></article>}
