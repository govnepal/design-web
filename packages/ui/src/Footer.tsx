import type { ReactNode } from "react";
import { cx } from "./cx.js";
import { Container } from "./layout.js";

/**
 * Government footer (components/footer.md, identity/footer) — the standing trust cues on every page:
 * owning office (Nepali-first), a REAL verifiable phone and address, and the required accessibility
 * and report-a-problem links. Its absence is itself a phishing tell (§9.2). Two columns, collapsing
 * to one on mobile. No language switcher — that lives once, in the header.
 */
interface FooterProps {
  officeNe: string;
  officeEn: string;
  phone: string;
  address: string;
  links?: { label: ReactNode; href: string }[];
  copyright?: ReactNode;
  className?: string;
}

export function Footer({ officeNe, officeEn, phone, address, links = [], copyright, className }: FooterProps) {
  return (
    <footer className={cx("gov-footer", className)} role="contentinfo">
      <Container>
        <div className="gov-footer__grid">
          <div>
            <p style={{ fontWeight: "var(--gov-font-weight-semibold)" }} lang="ne">
              {officeNe}
            </p>
            <p className="gov-footer__office-en" lang="en">
              {officeEn}
            </p>
            <p>{phone}</p>
            <p>{address}</p>
            {copyright && <p className="gov-text-secondary gov-text-small">{copyright}</p>}
          </div>
          {links.length > 0 && (
            <ul className="gov-footer__links">
              {links.map((l, i) => (
                <li key={i}>
                  <a className="gov-link" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </footer>
  );
}
