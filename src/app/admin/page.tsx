import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Admin from "./Admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: a } = await sb.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!a) { await sb.auth.signOut(); redirect("/admin/login"); }
  return <Admin email={user.email ?? ""} />;
}
