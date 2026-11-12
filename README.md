# BlueEarthSavers·info (Next.js + Supabase)

## Lancer en local
    npm install
    npm run dev        # http://localhost:3000   (admin : /admin)

Les variables sont déjà dans `.env.local` (non versionné). Voir `.env.example`.

## GitHub puis Vercel
    git init && git add . && git commit -m "Site initial"
    git branch -M main
    git remote add origin https://github.com/VOTRE-COMPTE/blueearthsavers-info.git
    git push -u origin main

Sur vercel.com : Add New > Project > importer le dépôt > ajouter les variables
`NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` > Deploy.

Ensuite, dans Supabase > Authentication > URL Configuration, mettez l’URL Vercel
dans « Site URL ».
