import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import { Icon, Waves } from "@/components/Icons";
import { site } from "@/lib/site";
import { bg, fd } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const sb = createClient();
  const since = new Date(Date.now() - 864e5).toISOString();
  const [posts, events, projects, nPosts, nEvents, nProjects] = await Promise.all([
    sb.from("posts").select("*").eq("published", true).order("created_at", { ascending: false }).limit(10),
    sb.from("events").select("*").eq("published", true).gte("event_date", since).order("event_date").limit(6),
    sb.from("projects").select("*").eq("published", true).order("created_at", { ascending: false }),
    sb.from("posts").select("id", { count: "exact", head: true }).eq("published", true),
    sb.from("events").select("id", { count: "exact", head: true }).eq("published", true).gte("event_date", since),
    sb.from("projects").select("id", { count: "exact", head: true }).eq("published", true),
  ]);
  const list: any[] = posts.data ?? [];
  const [first, ...rest] = list;
  const side = rest.slice(0, 3);
  const more = rest.slice(3, 9);
  const empty = <p className="sub">Rien à afficher pour le moment.</p>;
  const stats: [string, string][] = [
    [String(nPosts.count ?? 0), "publications"],
    [String(nEvents.count ?? 0), "événements à venir"],
    [String(nProjects.count ?? 0), "projets en cours"],
    ["71 %", "de la surface du globe est recouverte par l’océan"],
  ];
  return (
    <>
      <div className="hero"><div className="wrap reveal">
        <span className="eyebrow">{site.tagline}</span>
        <h1>Protéger l’océan, <em>c’est protéger la vie.</em></h1>
        <p className="lead">Actualités, événements et projets pour comprendre, partager et agir en faveur des mers, des côtes et de la vie marine.</p>
        <form className="hsearch" action="/actualites" method="get">
          <input name="q" placeholder="Rechercher une publication…" aria-label="Rechercher" />
          <button type="submit">Rechercher</button>
        </form>
      </div><Waves /></div>

      <div className="stats"><div className="wrap">
        {stats.map(([n, l]) => <div className="stat" key={l}><b>{n}</b><span>{l}</span></div>)}
      </div></div>

      <section><div className="wrap"><div className="tiles">
        <Link className="tile" href="/actualites"><Icon n="news" /><h3>Actualités</h3><p>Les dernières publications sur l’océan.</p></Link>
        <Link className="tile" href="/#evenements"><Icon n="cal" /><h3>Événements</h3><p>Conférences, nettoyages et rencontres.</p></Link>
        <Link className="tile" href="/#projets"><Icon n="folder" /><h3>Projets</h3><p>Recherche, éducation et actions terrain.</p></Link>
        <Link className="tile" href="/#agir"><Icon n="heart" /><h3>S’impliquer</h3><p>Rejoignez le mouvement.</p></Link>
      </div></div></section>

      <section className="alt" id="actualites"><div className="wrap">
        <div className="sh"><div><span className="k">À la une</span><h2>Actualités</h2></div>
          <Link className="more" href="/actualites">Toutes les actualités <Icon n="arrow" /></Link></div>
        {first ? (
          <div className="feat">
            <Link className="big fb" href={`/actualites/${first.id}`} style={bg(first.image_url)}>
              <div className="t">{first.category && <span className="tag" style={{ color: "#8ff0e6" }}>{first.category}</span>}
                <h3>{first.title}</h3><p>{first.excerpt}</p></div>
            </Link>
            <div className="side">
              {side.map((p) => (
                <Link className="mini" key={p.id} href={`/actualites/${p.id}`}>
                  <div className="th" style={bg(p.image_url)} />
                  <div>{p.category && <span className="tag">{p.category}</span>}<h4>{p.title}</h4><span className="date">{fd(p.created_at)}</span></div>
                </Link>
              ))}
            </div>
          </div>
        ) : empty}
        {more.length > 0 && <div className="grid" style={{ marginTop: 28 }}>{more.map((p) => <PostCard key={p.id} p={p} />)}</div>}
      </div></section>

      <section id="evenements"><div className="wrap">
        <div className="sh"><div><span className="k">Agenda</span><h2>Événements à venir</h2></div></div>
        <div className="evs">
          {(events.data ?? []).length ? (events.data ?? []).map((x: any) => {
            const d = x.event_date ? new Date(x.event_date) : null;
            return (
              <div className="ev" key={x.id}>
                <div className="d"><b>{d ? d.getDate() : "•"}</b>{d ? d.toLocaleDateString("fr-CA", { month: "short" }) : ""}</div>
                <div><h4>{x.url ? <a href={x.url} target="_blank" rel="noopener noreferrer">{x.title}</a> : x.title}</h4>
                  <span className="date">{[x.location, d ? d.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" }) : ""].filter(Boolean).join(" · ")}</span></div>
              </div>
            );
          }) : empty}
        </div>
      </div></section>

      <section className="alt" id="projets"><div className="wrap">
        <div className="sh"><div><span className="k">Vitrine</span><h2>Nos projets</h2></div></div>
        <div className="grid">{(projects.data ?? []).length ? (projects.data ?? []).map((x: any) => {
          const inner = (<><div className="img" style={bg(x.image_url)} /><div className="b"><span className="tag">{x.field}</span><h3>{x.title}</h3><p>{x.author}</p></div></>);
          return x.url ? <a key={x.id} className="card" href={x.url} target="_blank" rel="noopener noreferrer">{inner}</a> : <div key={x.id} className="card">{inner}</div>;
        }) : empty}</div>
      </div></section>

      <section id="apropos"><div className="wrap" style={{ maxWidth: 820 }}>
        <div className="sh"><div><span className="k">À propos</span><h2>Une organisation engagée pour l’océan</h2></div></div>
        <p style={{ fontSize: 19 }}>{site.name} rassemble des personnes passionnées par la protection du milieu marin. Nous partageons des connaissances fiables et soutenons des projets concrets pour un océan en santé, aujourd’hui et pour les générations futures.</p>
      </div></section>

      <section id="agir" style={{ paddingTop: 0 }}><div className="wrap"><div className="cta">
        <h2>Agissez pour l’océan</h2>
        <p>Partagez nos publications, participez à un événement ou proposez un projet : chaque geste compte.</p>
        {site.email ? <a className="btn" href={`mailto:${site.email}`}>Nous écrire</a> : <Link className="btn" href="/actualites">Découvrir les actualités</Link>}
      </div></div></section>
    </>
  );
}
