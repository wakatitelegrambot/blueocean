import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = { title: "Actualités" };
export const dynamic = "force-dynamic";

export default async function Actualites() {
  const { data } = await createClient().from("posts").select("*").eq("published", true).order("created_at", { ascending: false });
  return (
    <section><div className="wrap">
      <h2>Actualités</h2><p className="sub">Toutes les publications</p>
      <div className="grid">{data?.length ? data.map((p) => <PostCard key={p.id} p={p} />) : <p className="sub">Aucune publication.</p>}</div>
    </div></section>
  );
}
