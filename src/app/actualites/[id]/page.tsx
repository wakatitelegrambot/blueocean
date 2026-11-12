import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fd, bg } from "@/lib/utils";

export const dynamic = "force-dynamic";
const getPost = async (id: string) =>
  (await createClient().from("posts").select("*").eq("id", id).eq("published", true).maybeSingle()).data;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = await getPost(params.id);
  if (!p) return {};
  return { title: p.title, description: p.excerpt ?? undefined, openGraph: { title: p.title, description: p.excerpt ?? undefined, images: p.image_url ? [p.image_url] : [] } };
}

export default async function Post({ params }: { params: { id: string } }) {
  const p = await getPost(params.id);
  if (!p) notFound();
  return (
    <article className="article">
      <span className="tag">{p.category}</span>
      <h1>{p.title}</h1>
      <div className="date">{fd(p.created_at)}</div>
      {p.image_url && <div className="img" style={bg(p.image_url)} />}
      <div className="body">{p.content ?? p.excerpt}</div>
      <a className="more" href="/actualites">← Toutes les actualités</a>
    </article>
  );
}
