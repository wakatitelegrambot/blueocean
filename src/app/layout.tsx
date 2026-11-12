import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Fraunces, Inter } from "next/font/google";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, locale: "fr_CA", type: "website" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#06243f" };

function Mark() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="18" cy="18" r="17" fill="#0e6ba8" />
      <path d="M5 19c3.5-3.5 6-3.5 9.5 0s6 3.5 9.5 0 4.5-3 7-1" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M8 25c3-2.5 5-2.5 8 0s5 2.5 8 0" fill="none" stroke="#8ff0e6" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <div className="top"><div className="wrap">
          <span>{site.tagline} · Information, sensibilisation, action</span>
          <div><Link href="/actualites">Actualités</Link><Link href="/admin">Espace admin</Link></div>
        </div></div>
        <header className="main"><div className="wrap bar">
          <Link className="logo" href="/"><Mark />BlueEarth<b>Savers</b></Link>
          <input type="checkbox" id="nt" className="nt" aria-label="Ouvrir le menu" />
          <label htmlFor="nt" className="burger">☰</label>
          <nav className="menu">
            <Link href="/actualites">Actualités</Link><Link href="/#evenements">Événements</Link>
            <Link href="/#projets">Projets</Link><Link href="/#apropos">À propos</Link>
            <Link className="btn" href="/#agir">S’impliquer</Link>
          </nav>
        </div></header>
        {children}
        <footer><div className="wrap">
          <div className="fg">
            <div><div className="logo" style={{ color: "#fff", marginBottom: 14 }}><Mark />BlueEarth<b>Savers</b></div>
              <p style={{ maxWidth: 380 }}>{site.description} Une source fiable pour comprendre, partager et agir en faveur du milieu marin.</p></div>
            <div><h4>Explorer</h4><Link href="/actualites">Actualités</Link><Link href="/#evenements">Événements</Link><Link href="/#projets">Projets</Link></div>
            <div><h4>Contact</h4>{site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : <span>Bientôt disponible</span>}<Link href="/admin">Espace administrateur</Link></div>
          </div>
          <div className="copy">© {new Date().getFullYear()} {site.name}. Tous droits réservés.</div>
        </div></footer>
      </body>
    </html>
  );
}
