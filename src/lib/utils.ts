export const fd = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric" }) : "";
export const bg = (u?: string | null) => (u ? { backgroundImage: `url("${u.replace(/"/g, "%22")}")` } : undefined);
