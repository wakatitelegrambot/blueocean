import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import { bg } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const sb = createClient();
  const [posts, events, projects] = await Promise.all([
    sb.from("posts").select("*").eq("published", true).order("created_at", { ascending: false }).limit(6),
    sb.from("events").select("*").eq("published", true).gte("event_date", new Date(Date.now() - 864e5).toISOString()).order("event_date"),
    sb.from("projects").select("*").eq("published", true).order("created_at", { ascending: false }),
  ]);
  const empty = <p className="sub">Rien à afficher pour le moment.</p>;
  return (
    <>
      <div className="hero"><div className="wrap">
        <h1>On s’engage pour l’océan</h1>
        <p>Informer, sensibiliser et agir pour protéger les mers, les côtes et la vie marine.</p>
        <Link className="btn" href="/actualites">Lire les actualités</Link>
        <a className="btn alt" href="#projets">Nos projets</a>
      </div></div>
      <section><div className="wrap">
        <h2>Actualités</h2><p className="sub">Les dernières publications</p>
        <div className="grid">{posts.data?.length ? posts.data.map((p) => <PostCard key={p.id} p={p} />) : empty}</div>
        <Link className="more" href="/actualites">Toutes les actualités</Link>
      </div></section>
      <section id="evenements" className="alt-bg"><div className="wrap">
        <h2>Événements à venir</h2><p className="sub">Rejoignez-nous sur le terrain et en ligne</p>
        {events.data?.length ? events.data.map((x) => {
          const d = x.event_date ? new Date(x.event_date) : null;
          return (
            <div className="ev" key={x.id}>
              <div className="d"><b>{d ? d.getDate() : "•"}</b>{d ? d.toLocaleDateString("fr-CA", { month: "short" }) : ""}</div>
              <div><h4>{x.url ? <a href={x.url} target="_blank" rel="noopener noreferrer">{x.title}</a> : x.title}</h4>
                <span className="date">{x.location}</span></div>
            </div>
          );
        }) : empty}
      </div></section>
      <section id="projets"><div className="wrap">
        <h2>Vitrine sur nos projets</h2><p className="sub">Recherche, actions et initiatives</p>
        <div className="grid">{projects.data?.length ? projects.data.map((x) => {
          const inner = (<><div className="img" style={bg(x.image_url)} /><div className="b"><span className="tag">{x.field}</span><h3>{x.author}</h3><p>{x.title}</p></div></>);
          return x.url ? <a key={x.id} className="card" href={x.url} target="_blank" rel="noopener noreferrer">{inner}</a>
                       : <div key={x.id} className="card">{inner}</div>;
        }) : empty}</div>
      </div></section>
      <section id="apropos" className="alt-bg"><div className="wrap">
        <h2>Une organisation engagée pour l’océan</h2>
        <p style={{ maxWidth: 760 }}>BlueEarthSavers·info rassemble des personnes passionnées par la protection du milieu marin. Nous partageons des connaissances fiables et soutenons des projets concrets pour un océan en santé.</p>
      </div></section>
    </>
  );
}
