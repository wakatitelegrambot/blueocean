import Link from "next/link";
import { fd, bg } from "@/lib/utils";
export default function PostCard({ p }: { p: any }) {
  return (
    <Link className="card" href={`/actualites/${p.id}`}>
      <div className="img" style={bg(p.image_url)} />
      <div className="b">
        <span className="tag">{p.category}</span>
        <h3>{p.title}</h3>
        <div className="date">{fd(p.created_at)}</div>
        <p>{p.excerpt}</p>
      </div>
    </Link>
  );
}
