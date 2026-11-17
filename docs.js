// A quiet field of dots that drifts toward the pointer. Stops when the tab is
// hidden and does nothing at all for reduced-motion readers.
(() => {
  const c = document.getElementById("dots");
  if (!c) return;
  const x = c.getContext("2d");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, dpr, pts = [], mx = -1e4, my = -1e4, raf;
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = c.width = innerWidth * dpr;
    h = c.height = innerHeight * dpr;
    pts = [];
    const gap = 34 * dpr;
    for (let y = gap / 2; y < h; y += gap) for (let X = gap / 2; X < w; X += gap) pts.push({ x: X, y, ox: X, oy: y });
  };
  const draw = () => {
    x.clearRect(0, 0, w, h);
    for (const p of pts) {
      const dx = mx - p.ox, dy = my - p.oy, d = Math.hypot(dx, dy), r = 160 * dpr;
      const k = d < r ? 1 - d / r : 0;
      p.x += (p.ox + dx * k * 0.18 - p.x) * 0.12;
      p.y += (p.oy + dy * k * 0.18 - p.y) * 0.12;
      x.fillStyle = k ? `rgba(130,216,183,${0.18 + k * 0.6})` : "rgba(125,137,214,0.14)";
      x.beginPath();
      x.arc(p.x, p.y, (1.1 + k * 1.6) * dpr, 0, 6.283);
      x.fill();
    }
    if (!still) raf = requestAnimationFrame(draw);
  };
  addEventListener("resize", () => { size(); if (still) draw(); });
  addEventListener("pointermove", (e) => { mx = e.clientX * dpr; my = e.clientY * dpr; });
  addEventListener("pointerleave", () => { mx = my = -1e4; });
  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(raf);
    if (!document.hidden && !still) draw();
  });
  size();
  draw();
})();
