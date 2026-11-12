export const site = {
  name: "BlueEarthSavers·info",
  tagline: "Ensemble pour l’océan",
  description: "Actualités, événements et projets pour la protection de l’océan.",
  email: "", // ex. "contact@votre-domaine.org" : affiché dans le pied de page et le bouton « Nous écrire »
};
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
