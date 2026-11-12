import Link from "next/link";
import { fd, bg } from "@/lib/utils";
export default function PostCard({ p }: { p: any }) {
  return (
    <Link className="card" href={`/actualites/${p.id}`}>
      <div className="img" style={bg(p.image_url)} />
      <div className="b">
        {p.category && <span className="tag">{p.category}</span>}
        <h3>{p.title}</h3>
        <p>{p.excerpt}</p>
        <div className="date" style={{ marginTop: 12 }}>{fd(p.created_at)}</div>
      </div>
    </Link>
  );
}
