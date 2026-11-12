"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  async function go() {
    const { error } = await createClient().auth.signInWithPassword({ email, password: pw });
    if (error) return setErr(error.message);
    router.push("/admin");
    router.refresh();
  }
  return (
    <div className="panel" style={{ maxWidth: 420 }}>
      <h2>Connexion</h2>
      {err && <div className="msg">{err}</div>}
      <label htmlFor="em">Courriel</label>
      <input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="pw">Mot de passe</label>
      <input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} />
      <button className="btn pri" onClick={go}>Se connecter</button>
    </div>
  );
}
