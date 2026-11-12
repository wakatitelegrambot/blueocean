import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/site";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await createClient().from("posts").select("id,created_at").eq("published", true);
  const posts: any[] = data ?? [];
  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/actualites`, lastModified: new Date() },
    ...posts.map((p) => ({ url: `${siteUrl}/actualites/${p.id}`, lastModified: new Date(p.created_at) })),
  ];
}
