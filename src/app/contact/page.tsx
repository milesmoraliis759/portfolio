import type { Metadata } from "next";
import { ArrowUpRight, Linkedin, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Harsh Mishra for pharmacy learning, internships and academic collaboration.",
};

export default function ContactPage() {
  return (
    <section className="page-shell container">
      <div className="section-kicker"><span>04</span> / CONTACT</div>
      <div className="contact-hero">
        <p className="eyebrow">OPEN TO MEANINGFUL CONVERSATIONS</p>
        <h1>Have something<br/>to <em>discuss?</em></h1>
        <p className="page-lede">
          I welcome conversations about pharmaceutical sciences, learning resources,
          internships, research mentorship and opportunities to grow in pharmacy.
        </p>
        <a className="button button-primary" href="mailto:mishraharsh759@gmail.com">Write me an email <Mail size={15}/></a>
      </div>
      <div className="contact-links">
        <a href="mailto:mishraharsh759@gmail.com"><Mail/><span><small>EMAIL</small>mishraharsh759@gmail.com</span><ArrowUpRight/></a>
        <a href="https://www.linkedin.com/in/harshmishra759/" target="_blank" rel="noopener noreferrer"><Linkedin/><span><small>LINKEDIN</small>Harsh Mishra</span><ArrowUpRight/></a>
      </div>
      <p className="fine-print">I prefer to keep communication here or on LinkedIn. No phone number or personal address is published.</p>
    </section>
  );
}
