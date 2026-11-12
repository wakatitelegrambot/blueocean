import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "BlueEarthSavers·info — Ensemble pour l’océan", template: "%s | BlueEarthSavers·info" },
  description: "Actualités, événements et projets pour la protection de l’océan.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="top"><div className="wrap">
          <Link href="/actualites">Actualités</Link><Link href="/#evenements">Événements</Link>
          <Link href="/#projets">Projets</Link><Link href="/#apropos">À propos</Link><Link href="/admin">Administration</Link>
        </div></div>
        <header className="main"><div className="wrap">
          <Link className="logo" href="/">BlueEarth<b>Savers</b>·info</Link>
          <nav><Link href="/actualites">Actualités</Link><Link href="/#projets">Projets</Link>
            <Link href="/#evenements">Événements</Link><Link href="/#apropos">L’organisation</Link></nav>
        </div></header>
        {children}
        <footer><div className="wrap">© 2026 BlueEarthSavers·info. Tous droits réservés.</div></footer>
      </body>
    </html>
  );
}
