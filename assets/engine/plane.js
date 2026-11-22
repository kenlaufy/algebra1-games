/* Algebra 1 Games: coordinate plane helpers (SVG strings + click mapping). */
(function () {
  "use strict";
  const INK = "#23262d";
  const Plane = (window.Plane = {});
  const fmt = (v) => (v < 0 ? "−" + Math.abs(v) : String(v));
  const round = (v) => Math.round(v * 1e6) / 1e6;

  /* o: { xmin, xmax, ymin, ymax, w, h, pad, xstep, ystep, xlabel, ylabel, xtick, ytick } */
  Plane.create = function (o) {
    const p = Object.assign({ w: 900, h: 460, pad: 44, xstep: 1, ystep: 1, xlabel: "x", ylabel: "y" }, o);
    p.xtick = p.xtick || p.xstep;
    p.ytick = p.ytick || p.ystep;
    const L = p.pad, R = p.w - 20, T = 16, B = p.h - p.pad + 8;
    p.X = (x) => L + ((x - p.xmin) / (p.xmax - p.xmin)) * (R - L);
    p.Y = (y) => B - ((y - p.ymin) / (p.ymax - p.ymin)) * (B - T);
    p.inv = (sx, sy) => ({ x: p.xmin + ((sx - L) / (R - L)) * (p.xmax - p.xmin), y: p.ymin + ((B - sy) / (B - T)) * (p.ymax - p.ymin) });
    p.box = { L, R, T, B };
    p.clipId = "clip" + Math.random().toString(36).slice(2, 7);

    p.grid = function (opt) {
      opt = opt || {};
      let s = '<rect width="' + p.w + '" height="' + p.h + '" rx="12" fill="#fffdf7"/>';
      s += '<defs><clipPath id="' + p.clipId + '"><rect x="' + L + '" y="' + T + '" width="' + (R - L) + '" height="' + (B - T) + '"/></clipPath></defs>';
      const xs = [], ys = [];
      for (let x = Math.ceil(p.xmin / p.xstep) * p.xstep; x <= p.xmax + 1e-9; x += p.xstep) xs.push(round(x));
      for (let y = Math.ceil(p.ymin / p.ystep) * p.ystep; y <= p.ymax + 1e-9; y += p.ystep) ys.push(round(y));
      xs.forEach((x) => (s += '<line x1="' + p.X(x) + '" y1="' + T + '" x2="' + p.X(x) + '" y2="' + B + '" stroke="#ebe3d0" stroke-width="1"/>'));
      ys.forEach((y) => (s += '<line x1="' + L + '" y1="' + p.Y(y) + '" x2="' + R + '" y2="' + p.Y(y) + '" stroke="#ebe3d0" stroke-width="1"/>'));
      const ax = Math.min(Math.max(0, p.ymin), p.ymax), ay = Math.min(Math.max(0, p.xmin), p.xmax);
      s += '<line x1="' + L + '" y1="' + p.Y(ax) + '" x2="' + R + '" y2="' + p.Y(ax) + '" stroke="' + INK + '" stroke-width="2.5"/>';
      s += '<line x1="' + p.X(ay) + '" y1="' + T + '" x2="' + p.X(ay) + '" y2="' + B + '" stroke="' + INK + '" stroke-width="2.5"/>';
      xs.forEach((x) => {
        if (Math.abs((x / p.xtick) - Math.round(x / p.xtick)) > 1e-9 || (x === ay && ay !== p.xmin)) return;
        s += '<text x="' + p.X(x) + '" y="' + Math.min(B + 22, p.Y(ax) + 22) + '" text-anchor="middle" font-size="14" fill="' + INK + '">' + fmt(x) + "</text>";
      });
      ys.forEach((y) => {
        if (Math.abs((y / p.ytick) - Math.round(y / p.ytick)) > 1e-9 || (y === ax && ax !== p.ymin)) return;
        s += '<text x="' + (Math.max(L, p.X(ay)) - 8) + '" y="' + (p.Y(y) + 5) + '" text-anchor="end" font-size="14" fill="' + INK + '">' + fmt(y) + "</text>";
      });
      s += '<text x="' + (R - 4) + '" y="' + (p.Y(ax) - 8) + '" text-anchor="end" font-size="17" class="var" fill="' + INK + '">' + (opt.xlabel || p.xlabel) + "</text>";
      s += '<text x="' + (p.X(ay) + 8) + '" y="' + (T + 16) + '" font-size="17" class="var" fill="' + INK + '">' + (opt.ylabel || p.ylabel) + "</text>";
      return s;
    };

    /* f(x) curve; o: { color, width, dash, from, to, samples, upto (0..1 animation) } */
    p.curve = function (f, o) {
      o = o || {};
      const a = o.from == null ? p.xmin : o.from, b = o.to == null ? p.xmax : o.to;
      const n = o.samples || 300;
      const segs = [];
      let cur = [];
      const lim = (o.upto == null ? 1 : o.upto);
      for (let i = 0; i <= n * lim; i++) {
        const x = a + ((b - a) * i) / n;
        const y = f(x);
        if (!Number.isFinite(y) || y > p.ymax + (p.ymax - p.ymin) * 3 || y < p.ymin - (p.ymax - p.ymin) * 3) { if (cur.length) segs.push(cur); cur = []; continue; }
        cur.push(p.X(x).toFixed(1) + "," + p.Y(y).toFixed(1));
      }
      if (cur.length) segs.push(cur);
      return segs.map((sg) => '<polyline clip-path="url(#' + p.clipId + ')" points="' + sg.join(" ") + '" fill="none" stroke="' + (o.color || "#5a78b8") +
        '" stroke-width="' + (o.width || 4.5) + '" stroke-linejoin="round" stroke-linecap="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : "") + "/>").join("");
    };

    p.seg = function (x1, y1, x2, y2, o) {
      o = o || {};
      return '<line clip-path="url(#' + p.clipId + ')" x1="' + p.X(x1) + '" y1="' + p.Y(y1) + '" x2="' + p.X(x2) + '" y2="' + p.Y(y2) + '" stroke="' + (o.color || INK) +
        '" stroke-width="' + (o.width || 3) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : "") + ' stroke-linecap="round"/>';
    };

    p.point = function (x, y, o) {
      o = o || {};
      let s = '<circle cx="' + p.X(x) + '" cy="' + p.Y(y) + '" r="' + (o.r || 9) + '" fill="' + (o.fill || "#e7b84a") + '" stroke="' + INK + '" stroke-width="' + (o.sw || 3) + '"' + (o.hollow ? ' fill-opacity="0"' : "") + ' pointer-events="none"/>';
      if (o.label) s += '<text x="' + (p.X(x) + 12) + '" y="' + (p.Y(y) - 12) + '" font-size="15" fill="' + INK + '" pointer-events="none">' + o.label + "</text>";
      return s;
    };

    /* region a·x + b·y (rel) c, rel one of < <= > >= ; returns a clipped polygon */
    p.halfplane = function (a, b, c, rel, o) {
      o = o || {};
      // sample the box corners and edges; polygon = box ∩ half-plane (Sutherland–Hodgman against one line)
      const box = [[p.xmin, p.ymin], [p.xmax, p.ymin], [p.xmax, p.ymax], [p.xmin, p.ymax]];
      const inside = (pt) => { const v = a * pt[0] + b * pt[1] - c; return rel === "<" || rel === "≤" || rel === "<=" ? v <= 1e-9 : v >= -1e-9; };
      const out = [];
      for (let i = 0; i < box.length; i++) {
        const P1 = box[i], P2 = box[(i + 1) % box.length];
        const in1 = inside(P1), in2 = inside(P2);
        if (in1) out.push(P1);
        if (in1 !== in2) {
          const v1 = a * P1[0] + b * P1[1] - c, v2 = a * P2[0] + b * P2[1] - c;
          const t = v1 / (v1 - v2);
          out.push([P1[0] + (P2[0] - P1[0]) * t, P1[1] + (P2[1] - P1[1]) * t]);
        }
      }
      if (out.length < 3) return "";
      return '<polygon points="' + out.map((q) => p.X(q[0]).toFixed(1) + "," + p.Y(q[1]).toFixed(1)).join(" ") + '" fill="' + (o.fill || "#5a78b8") +
        '" fill-opacity="' + (o.opacity == null ? 0.22 : o.opacity) + '" pointer-events="none"/>';
    };
    /* boundary line of a·x + b·y = c across the box */
    p.boundary = function (a, b, c, o) {
      if (b !== 0) return p.curve((x) => (c - a * x) / b, Object.assign({ color: INK, width: 3 }, o));
      const x = c / a;
      return p.seg(x, p.ymin, x, p.ymax, Object.assign({ width: 3 }, o));
    };

    /* transparent overlay that catches clicks */
    p.hitArea = function () {
      return '<rect class="hit" data-plane="1" x="' + L + '" y="' + T + '" width="' + (R - L) + '" height="' + (B - T) + '" fill="transparent"/>';
    };
    /* convert a click to data coordinates, snapped to (sx, sy) steps */
    p.fromEvent = function (evt, svg, snapX, snapY) {
      const pt = svg.createSVGPoint();
      pt.x = evt.clientX; pt.y = evt.clientY;
      const loc = pt.matrixTransform(svg.getScreenCTM().inverse());
      const d = p.inv(loc.x, loc.y);
      const sx = snapX || p.xstep, sy = snapY || p.ystep;
      return { x: round(Math.round(d.x / sx) * sx), y: round(Math.round(d.y / sy) * sy) };
    };
    return p;
  };

  /* Number line helper: o = { min, max, step, w, y } */
  Plane.numberLine = function (o) {
    const n = Object.assign({ w: 900, h: 130, min: -10, max: 10, step: 1, label: 1 }, o);
    const L = 40, R = n.w - 40, Y = 64;
    n.X = (v) => L + ((v - n.min) / (n.max - n.min)) * (R - L);
    n.base = function () {
      let s = '<rect width="' + n.w + '" height="' + n.h + '" rx="12" fill="#fffdf7"/>';
      s += '<line x1="' + (L - 14) + '" y1="' + Y + '" x2="' + (R + 14) + '" y2="' + Y + '" stroke="' + INK + '" stroke-width="3"/>';
      s += '<path d="M ' + (R + 20) + " " + Y + " l -12 -7 v 14 z M " + (L - 20) + " " + Y + ' l 12 -7 v 14 z" fill="' + INK + '"/>';
      for (let v = n.min; v <= n.max + 1e-9; v += n.step) {
        const r = round(v);
        s += '<line x1="' + n.X(r) + '" y1="' + (Y - 9) + '" x2="' + n.X(r) + '" y2="' + (Y + 9) + '" stroke="' + INK + '" stroke-width="2"/>';
        if (Math.abs(r / n.label - Math.round(r / n.label)) < 1e-9) s += '<text x="' + n.X(r) + '" y="' + (Y + 32) + '" text-anchor="middle" font-size="15" fill="' + INK + '">' + fmt(r) + "</text>";
      }
      return s;
    };
    n.hits = function () {
      let s = "";
      const wv = ((R - L) / (n.max - n.min)) * n.step;
      for (let v = n.min; v <= n.max + 1e-9; v += n.step) s += '<rect class="hit" data-v="' + round(v) + '" x="' + (n.X(round(v)) - wv / 2) + '" y="20" width="' + wv + '" height="90" fill="transparent"/>';
      return s;
    };
    n.ray = function (from, dir, color) { const x2 = dir > 0 ? R + 10 : L - 10; return '<line x1="' + n.X(from) + '" y1="' + Y + '" x2="' + x2 + '" y2="' + Y + '" stroke="' + (color || "#5a78b8") + '" stroke-width="9" stroke-linecap="round" pointer-events="none"/>'; };
    n.span = function (a, b, color) { return '<line x1="' + n.X(a) + '" y1="' + Y + '" x2="' + n.X(b) + '" y2="' + Y + '" stroke="' + (color || "#5a78b8") + '" stroke-width="9" stroke-linecap="round" pointer-events="none"/>'; };
    n.dot = function (v, closed, color) { return '<circle cx="' + n.X(v) + '" cy="' + Y + '" r="11" fill="' + (closed ? color || "#5a78b8" : "#fff") + '" stroke="' + INK + '" stroke-width="3" pointer-events="none"/>'; };
    n.Y = Y;
    return n;
  };
})();
