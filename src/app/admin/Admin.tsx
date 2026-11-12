"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Kind = "text" | "area" | "dt" | "chk" | "img";
const T: Record<string, { l: string; f: [string, string, Kind][] }> = {
  posts: { l: "Publications", f: [["title", "Titre", "text"], ["category", "Catégorie", "text"], ["image_url", "Image", "img"], ["excerpt", "Résumé", "area"], ["content", "Contenu", "area"], ["published", "Publié", "chk"]] },
  events: { l: "Événements", f: [["title", "Titre", "text"], ["location", "Lieu", "text"], ["event_date", "Date et heure", "dt"], ["url", "Lien", "text"], ["published", "Publié", "chk"]] },
  projects: { l: "Projets", f: [["title", "Titre", "text"], ["author", "Responsable", "text"], ["field", "Domaine", "text"], ["image_url", "Image", "img"], ["url", "Lien", "text"], ["published", "Publié", "chk"]] },
};
const local = (d: string) => new Date(new Date(d).getTime() - new Date(d).getTimezoneOffset() * 6e4).toISOString().slice(0, 16);

export default function Admin({ email }: { email: string }) {
  const sb = createClient();
  const router = useRouter();
  const [cur, setCur] = useState("posts");
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<{ id?: string } | null>(null);
  const [v, setV] = useState<Record<string, any>>({});
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await sb.from(cur).select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
    setErr(error?.message ?? "");
  }, [cur]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [load]);

  function open(r: any | null) {
    const init: Record<string, any> = { published: true };
    if (r) for (const [k, , t] of T[cur].f) init[k] = t === "dt" && r[k] ? local(r[k]) : r[k] ?? (t === "chk" ? true : "");
    setV(init); setForm(r ?? {}); setErr("");
  }
  async function save() {
    if (!String(v.title ?? "").trim()) return setErr("Le titre est requis.");
    const o: Record<string, any> = {};
    for (const [k, , t] of T[cur].f) o[k] = t === "chk" ? !!v[k] : t === "dt" ? (v[k] ? new Date(v[k]).toISOString() : null) : String(v[k] ?? "").trim() || null;
    const { error } = form?.id ? await sb.from(cur).update(o).eq("id", form.id) : await sb.from(cur).insert(o);
    if (error) return setErr(error.message);
    setForm(null); load();
  }
  async function del(id: string) {
    if (!confirm("Supprimer définitivement ?")) return;
    const { error } = await sb.from(cur).delete().eq("id", id);
    error ? setErr(error.message) : load();
  }
  async function upload(k: string, file?: File) {
    if (!file) return;
    const path = `${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await sb.storage.from("images").upload(path, file);
    if (error) return setErr(error.message);
    setV((x) => ({ ...x, [k]: sb.storage.from("images").getPublicUrl(path).data.publicUrl }));
  }
  async function logout() { await sb.auth.signOut(); router.push("/admin/login"); router.refresh(); }

  return (
    <div className="panel">
      <div className="row"><span>Connecté : {email}</span><button className="btn pri" onClick={logout}>Se déconnecter</button></div>
      {err && <div className="msg">{err}</div>}
      {form ? (
        <>
          <h2>{form.id ? "Modifier" : "Nouveau"} — {T[cur].l}</h2>
          {T[cur].f.map(([k, l, t]) => (
            <div key={k}>
              {t === "chk" ? (
                <label><input type="checkbox" checked={!!v[k]} onChange={(e) => setV({ ...v, [k]: e.target.checked })} /> {l}</label>
              ) : (
                <>
                  <label htmlFor={k}>{l}</label>
                  {t === "area" ? <textarea id={k} value={v[k] ?? ""} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
                    : t === "img" ? (<>
                        <input id={k} type="file" accept="image/*" onChange={(e) => upload(k, e.target.files?.[0])} />
                        {v[k] && <p className="date">Image : {v[k]}</p>}
                      </>)
                    : <input id={k} type={t === "dt" ? "datetime-local" : "text"} value={v[k] ?? ""} onChange={(e) => setV({ ...v, [k]: e.target.value })} />}
                </>
              )}
            </div>
          ))}
          <p><button className="btn pri" onClick={save}>Enregistrer</button>
            <button className="btn" style={{ color: "var(--navy)", border: "1px solid var(--line)" }} onClick={() => setForm(null)}>Annuler</button></p>
        </>
      ) : (
        <>
          <div className="tabs">{Object.keys(T).map((k) => <button key={k} className={k === cur ? "on" : ""} onClick={() => setCur(k)}>{T[k].l}</button>)}</div>
          <button className="btn pri" style={{ margin: "0 0 14px" }} onClick={() => open(null)}>+ Ajouter</button>
          {rows.map((r) => (
            <div className="row" key={r.id}>
              <div><b>{r.title}</b> <span className={`badge ${r.published ? "" : "off"}`}>{r.published ? "Publié" : "Brouillon"}</span></div>
              <div><button className="btn pri" onClick={() => open(r)}>Modifier</button><button className="btn dng" onClick={() => del(r.id)}>Supprimer</button></div>
            </div>
          ))}
          {!rows.length && <p className="sub">Aucun élément. Ajoutez-en un.</p>}
        </>
      )}
    </div>
  );
}
