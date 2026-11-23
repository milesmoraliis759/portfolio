import type { ReactNode } from "react";
import { AlertCircle, BookOpenCheck, FlaskConical, Lightbulb } from "lucide-react";
const callouts = {
  note: { Icon: BookOpenCheck, label: "Study note" },
  tip: { Icon: Lightbulb, label: "Remember" },
  exam: { Icon: FlaskConical, label: "Exam focus" },
  caution: { Icon: AlertCircle, label: "Caution" },
};
export function Callout({ type = "note", title, children }: { type?: keyof typeof callouts; title?: string; children: ReactNode }) {
  const { Icon, label } = callouts[type];
  return <aside className={`pharma-callout pharma-callout--${type}`} role="note"><div className="pharma-callout__heading"><Icon size={17} aria-hidden="true"/><strong>{title ?? label}</strong></div><div className="pharma-callout__body">{children}</div></aside>;
}
export function Definition({ term, children }: { term: string; children: ReactNode }) {
  return <aside className="pharma-definition"><span className="pharma-definition__label">KEY TERM</span><strong className="pharma-definition__term">{term}</strong><div>{children}</div></aside>;
}
export function Formula({ label, children }: { label?: string; children: ReactNode }) {
  return <figure className="pharma-formula">{label ? <figcaption>{label}</figcaption> : null}<div className="pharma-formula__content">{children}</div></figure>;
}
export function DrugCard({ name, drugClass, mechanism, uses, adverseEffects }: { name: string; drugClass?: string; mechanism?: string; uses?: string; adverseEffects?: string }) {
  return <section className="pharma-drug-card" aria-label={`Drug profile: ${name}`}><div className="pharma-drug-card__title"><strong>{name}</strong>{drugClass ? <span>{drugClass}</span> : null}</div>{mechanism ? <p><b>Mechanism:</b> {mechanism}</p> : null}{uses ? <p><b>Uses:</b> {uses}</p> : null}{adverseEffects ? <p><b>Adverse effects:</b> {adverseEffects}</p> : null}</section>;
}
export function ProcessFlow({ title, children }: { title?: string; children: ReactNode }) {
  return <section className="pharma-process">{title ? <h3>{title}</h3> : null}<div className="pharma-process__content">{children}</div></section>;
}
