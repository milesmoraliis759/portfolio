import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
export type ContentKind="articles"|"learning";
export type ContentItem={slug:string;kind:ContentKind;title:string;description:string;date:string;category:string;tags:string[];readTime:string;level?:string;featured:boolean;published:boolean;filePath:string};
const ROOT=path.join(process.cwd(),"content");
function walk(dir:string):string[]{if(!fs.existsSync(dir))return[];return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=path.join(dir,e.name);return e.isDirectory()?walk(p):e.isFile()&&e.name.endsWith(".mdx")?[p]:[];});}
function parse(filePath:string,kind:ContentKind):ContentItem|null{const raw=fs.readFileSync(filePath,"utf8");const {data}=matter(raw);const relative=path.relative(path.join(ROOT,kind),filePath).replace(/\\/g,"/");const slug=relative.replace(/\.mdx$/,"").replace(/\//g,"--");if(!data.title||data.published===false)return null;return{slug,kind,title:String(data.title),description:String(data.description??""),date:String(data.date??""),category:String(data.category??"General"),tags:Array.isArray(data.tags)?data.tags.map(String):[],readTime:String(data.readTime??"5 min read"),level:data.level?String(data.level):undefined,featured:Boolean(data.featured),published:data.published!==false,filePath};}
export function getAllContent(kind?:ContentKind):ContentItem[]{const kinds:ContentKind[]=kind?[kind]:["articles","learning"];return kinds.flatMap(k=>walk(path.join(ROOT,k)).map(p=>parse(p,k))).filter((x):x is ContentItem=>x!==null).sort((a,b)=>b.date.localeCompare(a.date));}
export function getContentBySlug(kind:ContentKind,slug:string){const item=getAllContent(kind).find(x=>x.slug===slug);return item?{item,source:fs.readFileSync(item.filePath,"utf8")}:null;}
export function getCategories(){return Array.from(new Set(getAllContent().map(x=>x.category))).sort();}
export function getFeaturedContent(){return getAllContent().filter(x=>x.featured).slice(0,4);}
