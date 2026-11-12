import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = { title: "Actualités" };
export const dynamic = "force-dynamic";

export default async function Actualites({ searchParams }: { searchParams: { q?: string; c?: string } }) {
  const sb = createClient();
  const q = (searchParams.q ?? "").replace(/[,()%*\\]/g, " ").trim();
  const c = searchParams.c ?? "";
  let query = sb.from("posts").select("*").eq("published", true).order("created_at", { ascending: false });
  if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`);
  if (c) query = query.eq("category", c);
  const [{ data }, { data: cats }] = await Promise.all([query, sb.from("posts").select("category").eq("published", true)]);
  const categories = Array.from(new Set(((cats ?? []) as any[]).map((x) => x.category).filter(Boolean))) as string[];
  const posts: any[] = data ?? [];
  return (
    <>
      <div className="ph"><div className="wrap"><h1>Actualités</h1><p>Toutes nos publications sur l’océan</p></div></div>
      <section><div className="wrap">
        <form className="sform" action="/actualites" method="get">
          <input name="q" defaultValue={q} placeholder="Rechercher…" aria-label="Rechercher" />
          {c && <input type="hidden" name="c" value={c} />}
          <button className="btn pri" style={{ margin: 0 }} type="submit">Rechercher</button>
        </form>
        <div className="filters">
          <Link className={`chip ${!c ? "on" : ""}`} href={q ? `/actualites?q=${encodeURIComponent(q)}` : "/actualites"}>Toutes</Link>
          {categories.map((k) => (
            <Link key={k} className={`chip ${c === k ? "on" : ""}`} href={`/actualites?c=${encodeURIComponent(k)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>{k}</Link>
          ))}
        </div>
        <div className="grid">{posts.length ? posts.map((p) => <PostCard key={p.id} p={p} />) : <p className="sub">Aucune publication trouvée.</p>}</div>
      </div></section>
    </>
  );
}
