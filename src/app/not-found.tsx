import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <section className="page-shell container not-found">
      <div className="section-kicker"><span>404</span> / PAGE NOT FOUND</div>
      <p className="eyebrow">THIS PAGE ISN&apos;T IN THE MONOGRAPH</p>
      <h1>Looks like this<br/><em>entry is missing.</em></h1>
      <p className="page-lede">The link may be old, or the page may have moved. You can return to the notebook or browse the learning library.</p>
      <div className="hero-actions">
        <Link className="button button-primary" href="/"><ArrowLeft size={15}/> Back home</Link>
        <Link className="button button-quiet" href="/learning"><BookOpen size={15}/> Learning Studio</Link>
      </div>
    </section>
  );
}
