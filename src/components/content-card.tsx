import Link from "next/link";
import { ArrowUpRight,Clock3 } from "lucide-react";
import type { ContentItem } from "@/lib/content";
export function ContentCard({item,index=0}:{item:ContentItem;index?:number}){const href=`/${item.kind}/${item.slug.replace(/--/g,"/")}`;return <Link href={href} className="content-card"><div className="card-topline"><span className="tag">{item.category}</span><span className="card-index">0{index+1}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="card-meta"><span><Clock3 size={13}/> {item.readTime}</span><span>{item.level??"Read article"} <ArrowUpRight size={14}/></span></div></Link>}
