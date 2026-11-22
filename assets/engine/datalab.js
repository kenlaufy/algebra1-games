/* Algebra 1 Games: statistics helpers and data plots (SVG strings). */
(function () {
  "use strict";
  const INK = "#23262d";
  const D = (window.DataLab = {});
  const sorted = (a) => a.slice().sort((x, y) => x - y);
  const r2 = (v) => Math.round(v * 100) / 100;
  const fmt = (v) => (v < 0 ? "−" + Math.abs(r2(v)) : String(r2(v)));

  // ---------- statistics ----------
  D.mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  D.median = (a) => { const s = sorted(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  // quartiles: median of each half, excluding the overall median when n is odd (common US classroom method)
  D.quartiles = (a) => {
    const s = sorted(a), n = s.length, h = Math.floor(n / 2);
    const lower = s.slice(0, h), upper = s.slice(n % 2 ? h + 1 : h);
    return { min: s[0], q1: D.median(lower), med: D.median(s), q3: D.median(upper), max: s[n - 1] };
  };
  D.iqr = (a) => { const q = D.quartiles(a); return q.q3 - q.q1; };
  D.sd = (a) => { const m = D.mean(a); return Math.sqrt(a.reduce((s, v) => s + (v - m) * (v - m), 0) / a.length); }; // population SD
  D.fit = (pts) => {
    const n = pts.length, mx = D.mean(pts.map((p) => p[0])), my = D.mean(pts.map((p) => p[1]));
    let sxy = 0, sxx = 0;
    pts.forEach(([x, y]) => { sxy += (x - mx) * (y - my); sxx += (x - mx) * (x - mx); });
    const m = sxy / sxx;
    return { m, b: my - m * mx };
  };
  D.r = (pts) => {
    const mx = D.mean(pts.map((p) => p[0])), my = D.mean(pts.map((p) => p[1]));
    let sxy = 0, sxx = 0, syy = 0;
    pts.forEach(([x, y]) => { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; syy += (y - my) ** 2; });
    return sxy / Math.sqrt(sxx * syy);
  };
  D.sse = (pts, m, b) => pts.reduce((s, [x, y]) => s + (y - (m * x + b)) ** 2, 0);

  // ---------- plots ----------
  function axisX(L, R, Y, min, max, step, label, X) {
    let s = '<line x1="' + L + '" y1="' + Y + '" x2="' + R + '" y2="' + Y + '" stroke="' + INK + '" stroke-width="2.5"/>';
    for (let v = min; v <= max + 1e-9; v += step) {
      const x = X(v);
      s += '<line x1="' + x + '" y1="' + Y + '" x2="' + x + '" y2="' + (Y + 7) + '" stroke="' + INK + '" stroke-width="2"/>';
      s += '<text class="ct" x="' + x + '" y="' + (Y + 24) + '" text-anchor="middle" font-size="14" fill="' + INK + '">' + fmt(v) + "</text>";
    }
    if (label) s += '<text class="ct" x="' + ((L + R) / 2) + '" y="' + (Y + 46) + '" text-anchor="middle" font-size="16" fill="' + INK + '">' + label + "</text>";
    return s;
  }
  const frame = (w, h) => '<rect width="' + w + '" height="' + h + '" rx="12" fill="#fffdf7"/>';

  /* dot plot: o = { min, max, step, label, w, h, color } */
  D.dotPlot = function (data, o) {
    o = Object.assign({ w: 900, h: 260, color: "#5a78b8" }, o);
    const L = 50, R = o.w - 40, Y = o.h - 70;
    const X = (v) => L + ((v - o.min) / (o.max - o.min)) * (R - L);
    let s = frame(o.w, o.h) + axisX(L, R, Y, o.min, o.max, o.step || 1, o.label, X);
    const counts = {};
    data.forEach((v) => {
      const k = String(v); counts[k] = (counts[k] || 0) + 1;
      s += '<circle cx="' + X(v) + '" cy="' + (Y - 14 - (counts[k] - 1) * 20) + '" r="8" fill="' + o.color + '" stroke="' + INK + '" stroke-width="2"/>';
    });
    if (o.mark != null) s += '<path d="M ' + X(o.mark) + " " + (Y + 2) + ' l -8 14 h 16 z" fill="#c8553d" stroke="' + INK + '" stroke-width="2"/>';
    return s;
  };

  /* histogram: o = { min, max, width (bin), label, ymax } — bins [min, min+width), … */
  D.histogram = function (data, o) {
    o = Object.assign({ w: 900, h: 300 }, o);
    const L = 60, R = o.w - 40, Y = o.h - 70, T = 20;
    const X = (v) => L + ((v - o.min) / (o.max - o.min)) * (R - L);
    const bins = [];
    for (let a = o.min; a < o.max - 1e-9; a += o.width) bins.push(data.filter((v) => v >= a && (v < a + o.width || (a + o.width >= o.max && v <= o.max))).length);
    const ymax = o.ymax || Math.max(...bins) + 1;
    const H = (c) => ((Y - T) * c) / ymax;
    let s = frame(o.w, o.h) + axisX(L, R, Y, o.min, o.max, o.width, o.label, X);
    bins.forEach((c, i) => {
      const a = o.min + i * o.width;
      if (c) s += '<rect x="' + X(a) + '" y="' + (Y - H(c)) + '" width="' + (X(a + o.width) - X(a)) + '" height="' + H(c) + '" fill="#e7b84a" stroke="' + INK + '" stroke-width="2.5"/>';
    });
    for (let c = 0; c <= ymax; c++) s += '<text class="ct" x="' + (L - 10) + '" y="' + (Y - H(c) + 5) + '" text-anchor="end" font-size="13" fill="' + INK + '">' + c + "</text>";
    s += '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + Y + '" stroke="' + INK + '" stroke-width="2"/>';
    return s;
  };

  /* box plot (single or stacked): sets = [{ data, label, color }] */
  D.boxPlot = function (sets, o) {
    o = Object.assign({ w: 900 }, o);
    const rowH = 90, L = 120, R = o.w - 40, Y = 30 + sets.length * rowH;
    const X = (v) => L + ((v - o.min) / (o.max - o.min)) * (R - L);
    let s = frame(o.w, Y + 60) + axisX(L, R, Y, o.min, o.max, o.step || 1, o.label, X);
    sets.forEach((set, i) => {
      const q = D.quartiles(set.data), cy = 30 + i * rowH + 40;
      s += '<text class="ct" x="' + (L - 14) + '" y="' + (cy + 5) + '" text-anchor="end" font-size="16" fill="' + INK + '">' + (set.label || "") + "</text>";
      s += '<line x1="' + X(q.min) + '" y1="' + cy + '" x2="' + X(q.q1) + '" y2="' + cy + '" stroke="' + INK + '" stroke-width="2.5"/>';
      s += '<line x1="' + X(q.q3) + '" y1="' + cy + '" x2="' + X(q.max) + '" y2="' + cy + '" stroke="' + INK + '" stroke-width="2.5"/>';
      s += '<rect x="' + X(q.q1) + '" y="' + (cy - 22) + '" width="' + (X(q.q3) - X(q.q1)) + '" height="44" fill="' + (set.color || "#8fa6d6") + '" stroke="' + INK + '" stroke-width="2.5"/>';
      s += '<line x1="' + X(q.med) + '" y1="' + (cy - 22) + '" x2="' + X(q.med) + '" y2="' + (cy + 22) + '" stroke="' + INK + '" stroke-width="4"/>';
      [q.min, q.max].forEach((v) => (s += '<line x1="' + X(v) + '" y1="' + (cy - 12) + '" x2="' + X(v) + '" y2="' + (cy + 12) + '" stroke="' + INK + '" stroke-width="2.5"/>'));
    });
    return s;
  };

  /* scatter plot with optional line and residual segments. o = { xr:[min,max,step], yr:[min,max,step], xlabel, ylabel, line:{m,b}, resid, h } */
  D.scatter = function (pts, o) {
    o = Object.assign({ w: 900, h: 420 }, o);
    const P = window.Plane.create({ xmin: o.xr[0], xmax: o.xr[1], ymin: o.yr[0], ymax: o.yr[1], xstep: o.xr[2], ystep: o.yr[2], xtick: o.xr[3] || o.xr[2], ytick: o.yr[3] || o.yr[2],
      xlabel: o.xlabel || "x", ylabel: o.ylabel || "y", h: o.h });
    let s = P.grid();
    if (o.line) {
      s += P.curve((x) => o.line.m * x + o.line.b, { color: o.lineColor || "#c8553d", width: 3.5 });
      if (o.resid) pts.forEach(([x, y]) => (s += P.seg(x, y, x, o.line.m * x + o.line.b, { color: "#a77d18", width: 2, dash: "4 3" })));
    }
    if (o.curve) s += P.curve(o.curve, { color: "#6b8f5e", width: 3 });
    pts.forEach(([x, y]) => (s += P.point(x, y, { r: 7, fill: o.color || "#5a78b8", sw: 2 })));
    if (o.hit) s += P.hitArea();
    return { svg: s, P };
  };

  /* residual plot: residuals vs x */
  D.residualPlot = function (pts, line, o) {
    o = o || {};
    const res = pts.map(([x, y]) => [x, y - (line.m * x + line.b)]);
    const mag = Math.max(1, ...res.map((p) => Math.abs(p[1]))) * 1.3;
    const step = mag > 8 ? 2 : mag > 4 ? 1 : 0.5;
    const P = window.Plane.create({ xmin: o.xr[0], xmax: o.xr[1], ymin: -Math.ceil(mag), ymax: Math.ceil(mag), xstep: o.xr[2], ystep: step, xtick: o.xr[3] || o.xr[2], ytick: step * 2, xlabel: o.xlabel || "x", ylabel: "residual", h: 300 });
    let s = P.grid();
    res.forEach(([x, r]) => (s += P.point(x, r, { r: 7, fill: "#e7b84a", sw: 2 })));
    return s;
  };

  D.fmt = fmt;
})();
