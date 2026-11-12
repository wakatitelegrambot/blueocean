import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import { siteUrl } from "@/lib/site";
import { fd, bg } from "@/lib/utils";

export const dynamic = "force-dynamic";
const getPost = async (id: string) =>
  (await createClient().from("posts").select("*").eq("id", id).eq("published", true).maybeSingle()).data;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = await getPost(params.id);
  if (!p) return {};
  return { title: p.title, description: p.excerpt ?? undefined, openGraph: { title: p.title, description: p.excerpt ?? undefined, type: "article", images: p.image_url ? [p.image_url] : [] } };
}

export default async function Post({ params }: { params: { id: string } }) {
  const p = await getPost(params.id);
  if (!p) notFound();
  const text: string = p.content ?? p.excerpt ?? "";
  const mins = Math.max(1, Math.round(text.split(/\s+/).length / 200));
  const url = encodeURIComponent(`${siteUrl}/actualites/${p.id}`);
  const t = encodeURIComponent(p.title);
  let q = createClient().from("posts").select("*").eq("published", true).neq("id", p.id).order("created_at", { ascending: false }).limit(3);
  if (p.category) q = q.eq("category", p.category);
  const related: any[] = (await q).data ?? [];
  return (
    <>
      <article className="article reveal">
        <div className="crumb"><Link href="/">Accueil</Link> / <Link href="/actualites">Actualités</Link></div>
        {p.category && <span className="tag">{p.category}</span>}
        <h1>{p.title}</h1>
        <div className="meta">{fd(p.created_at)} · {mins} min de lecture</div>
        {p.image_url && <div className="cover" style={bg(p.image_url)} />}
        {p.excerpt && <p style={{ fontSize: 21, color: "var(--mute)" }}>{p.excerpt}</p>}
        <div className="body">{p.content}</div>
        <div className="share"><b>Partager :</b>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href={`https://wa.me/?text=${t}%20${url}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={`https://twitter.com/intent/tweet?text=${t}&url=${url}`} target="_blank" rel="noopener noreferrer">X</a>
        </div>
      </article>
      {related.length > 0 && (
        <section className="alt"><div className="wrap">
          <div className="sh"><div><span className="k">À lire aussi</span><h2>Publications similaires</h2></div></div>
          <div className="grid">{related.map((r) => <PostCard key={r.id} p={r} />)}</div>
        </div></section>
      )}
    </>
  );
}
