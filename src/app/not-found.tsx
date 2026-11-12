import Link from "next/link";
export default function NotFound() {
  return (
    <section><div className="wrap" style={{ textAlign: "center" }}>
      <h1 style={{ fontSize: 64 }}>404</h1>
      <p className="sub">Cette page a dérivé au large…</p>
      <Link className="btn pri" href="/">Retour à l’accueil</Link>
    </div></section>
  );
}
