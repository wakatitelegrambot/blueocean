const P: Record<string, string> = {
  news: "M4 5h13v14H6a2 2 0 0 1-2-2V5zm13 3h3v9a2 2 0 0 1-2 2M8 9h5M8 13h5",
  cal: "M5 5h14v15H5zM5 10h14M9 3v4M15 3v4",
  folder: "M3 6h6l2 2h10v11H3z",
  heart: "M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4-4",
  arrow: "M5 12h14m-6-6 6 6-6 6",
};
export function Icon({ n }: { n: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[n]} />
    </svg>
  );
}
export function Waves() {
  return (
    <div className="waves" aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0,64 C240,120 480,0 720,48 C960,96 1200,16 1440,64 L1440,120 L0,120Z" /></svg>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w2"><path d="M0,80 C300,20 540,110 780,64 C1020,18 1240,100 1440,60 L1440,120 L0,120Z" /></svg>
    </div>
  );
}
