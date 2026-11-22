/* Algebra 1 Games: shared cartoon drawing helpers (SVG strings).
 * Everything returns SVG markup so games can compose a scene and set innerHTML once per frame. */
(function () {
  "use strict";
  const INK = "#23262d";
  const OUT = 'stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"';
  const MINUS = "−";
  const A = (window.Cartoon = { INK, OUT, MINUS });

  A.esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  A.text = function (x, y, txt, o) {
    o = o || {};
    const isVar = o.var != null ? o.var : /[a-z]/.test(String(txt)) && !o.plain;
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.anchor || "middle") + '" font-size="' + (o.size || 18) +
      '" fill="' + (o.fill || INK) + '"' + (isVar ? ' class="var"' : "") + (o.weight ? ' font-weight="' + o.weight + '"' : "") +
      (o.extra || "") + ">" + A.esc(txt) + "</text>";
  };

  A.backdrop = function (w, h, o) {
    o = o || {};
    const ground = o.ground == null ? h - 56 : o.ground;
    const id = "sky" + Math.random().toString(36).slice(2, 7);
    const cloud = (x, y, s) =>
      '<g transform="translate(' + x + " " + y + ") scale(" + s + ')" fill="#fff">' +
      '<ellipse cx="0" cy="10" rx="62" ry="20"/><ellipse cx="-22" cy="-2" rx="28" ry="22"/><ellipse cx="16" cy="-8" rx="32" ry="26"/></g>';
    return (
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#c3d9ea"/><stop offset="1" stop-color="#e6eff4"/></linearGradient></defs>' +
      '<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="url(#' + id + ')"/>' +
      (o.sun === false ? "" : '<circle cx="' + (w - 80) + '" cy="64" r="52" fill="#f6dc86" opacity="0.35"/><circle cx="' + (w - 80) + '" cy="64" r="34" fill="#f3d06a"/>') +
      (o.clouds === false ? "" : cloud(w * 0.13, 60, 1) + cloud(w * 0.62, 40, 0.8) + cloud(w * 0.37, 120, 0.6)) +
      (o.noGround ? "" : '<rect x="0" y="' + ground + '" width="' + w + '" height="' + (h - ground) + '" fill="#dccca6"/>' +
        '<line x1="0" y1="' + ground + '" x2="' + w + '" y2="' + ground + '" stroke="#a8946a" stroke-width="3"/>')
    );
  };

  /* Our mascot: a young engineer in a hard hat. mood: ok | worry | joy | think */
  A.mascot = function (x, y, mood, scale) {
    const skin = "#f3cfa6";
    const s = scale || 1;
    let mouth, brows = "", extra = "", arms;
    const armDown = '<path d="M -16 -20 l -12 16" ' + OUT + ' stroke-linecap="round"/><path d="M 16 -20 l 12 16" ' + OUT + ' stroke-linecap="round"/>';
    if (mood === "joy") {
      mouth = '<path d="M -9 -48 q 9 12 18 0 z" fill="' + INK + '"/>';
      arms = '<path d="M -16 -20 l -16 -26" ' + OUT + ' stroke-linecap="round"/><path d="M 16 -20 l 16 -26" ' + OUT + ' stroke-linecap="round"/>';
      extra = '<text x="26" y="-82" font-size="22" fill="' + INK + '">✦</text>';
    } else if (mood === "worry") {
      mouth = '<ellipse cx="0" cy="-46" rx="4" ry="5" fill="' + INK + '"/>';
      brows = '<path d="M -12 -66 l 7 3 M 12 -66 l -7 3" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';
      extra = '<path d="M 22 -66 q 5 8 0 11 q -5 -3 0 -11 z" fill="#8cc7ea" stroke="' + INK + '" stroke-width="1.5"/>';
      arms = armDown;
    } else if (mood === "think") {
      mouth = '<path d="M -6 -46 h 12" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';
      arms = '<path d="M -16 -20 l -12 16" ' + OUT + ' stroke-linecap="round"/><path d="M 16 -20 q 10 -8 2 -24" ' + OUT + ' stroke-linecap="round" fill="none"/>';
      extra = '<circle cx="30" cy="-80" r="4" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/><circle cx="40" cy="-92" r="6" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/>';
    } else {
      mouth = '<path d="M -7 -48 q 7 7 14 0" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';
      arms = armDown;
    }
    return (
      '<g transform="translate(' + x + " " + y + ") scale(" + s + ')">' +
      '<path d="M -8 0 v 18 M 8 0 v 18" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
      arms +
      '<rect x="-18" y="-30" width="36" height="34" rx="9" fill="#5a78b8" ' + OUT + "/>" +
      '<rect x="-9" y="-22" width="18" height="12" rx="3" fill="#7f97c9" stroke="' + INK + '" stroke-width="2"/>' +
      '<circle cx="0" cy="-54" r="20" fill="' + skin + '" ' + OUT + "/>" +
      '<circle cx="-7" cy="-56" r="2.6" fill="' + INK + '"/><circle cx="7" cy="-56" r="2.6" fill="' + INK + '"/>' +
      brows + mouth +
      '<path d="M -22 -64 q 0 -24 22 -24 q 22 0 22 24 z" fill="#e7b84a" ' + OUT + "/>" +
      '<rect x="-26" y="-66" width="52" height="7" rx="3" fill="#e7b84a" ' + OUT + "/>" +
      extra + "</g>"
    );
  };

  /* Tiles. kind: x, nx, u, nu, x2, nx2, box (mystery), nbox, or {fill,label}.
     Returns { w, h, svg(x, y) } */
  A.tileSpec = function (kind, o) {
    o = o || {};
    const size = { x: [42, 42], nx: [42, 42], box: [42, 42], nbox: [42, 42], u: [25, 25], nu: [25, 25], x2: [62, 62], nx2: [62, 62] }[kind] || [o.w || 42, o.h || 42];
    const fills = { x: "#5a78b8", nx: "#c8553d", u: "#e7b84a", nu: "#c8553d", x2: "#6b8f5e", nx2: "#c8553d", box: "#c9965c", nbox: "#c8553d" };
    const labels = { x: o.letter || "x", nx: MINUS + (o.letter || "x"), u: "", nu: MINUS, x2: (o.letter || "x") + "²", nx2: MINUS + (o.letter || "x") + "²", box: "?", nbox: MINUS + "?" };
    const fill = o.fill || fills[kind] || "#5a78b8";
    const label = o.label != null ? o.label : labels[kind] != null ? labels[kind] : "";
    const w = size[0], hgt = size[1];
    return {
      w, h: hgt, kind,
      svg(x, y) {
        const cx = x + w / 2, cy = y + hgt / 2;
        let s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hgt + '" rx="' + (w > 30 ? 6 : 4) + '" fill="' + fill + '" ' + OUT + "/>";
        if (kind === "box" || kind === "nbox") {
          s += '<rect x="' + (cx - 5) + '" y="' + y + '" width="10" height="' + hgt + '" fill="#e9d3a6" opacity="0.85"/>' +
            '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hgt + '" rx="6" fill="none" ' + OUT + "/>";
        }
        if (label) {
          const size2 = o.size || (w >= 60 ? 22 : w >= 40 ? (label.length > 2 ? 16 : 20) : 18);
          s += A.text(cx, cy + size2 * 0.36, label, { size: size2, fill: kind === "box" ? INK : o.ink || "#fff", var: /[a-z]/.test(label) });
        }
        if (o.many) s += A.text(x + w + 5, cy + 7, "×" + o.many, { size: 19, anchor: "start", plain: true });
        return s;
      },
    };
  };

  /* Flow tiles into rows from the bottom up, centered on cx. Returns svg string. */
  A.stack = function (specs, cx, baseY, maxW, gap) {
    gap = gap == null ? 6 : gap;
    let out = "", rowY = baseY, row = [], rowW = 0, rowH = 0;
    const flush = () => {
      let x = cx - (rowW - gap) / 2;
      row.forEach((t) => { out += t.svg(x, rowY - t.h); x += t.w + gap; });
      rowY -= rowH + gap; row = []; rowW = 0; rowH = 0;
    };
    specs.forEach((t) => {
      if (row.length && (rowW + t.w > maxW || row[0].h !== t.h)) flush();
      row.push(t); rowW += t.w + gap; rowH = Math.max(rowH, t.h);
    });
    if (row.length) flush();
    return out;
  };

  /* Tiles for a linear side { x, c } (optionally x2), aggregating big counts. */
  A.sideTiles = function (side, o) {
    o = o || {};
    const specs = [];
    const add = (count, pos, neg, cap) => {
      const n = Math.abs(count || 0);
      const kind = count > 0 ? pos : neg;
      if (!n) return;
      if (n > cap) specs.push(A.tileSpec(kind, Object.assign({}, o, { many: n })));
      else for (let i = 0; i < n; i++) specs.push(A.tileSpec(kind, o));
    };
    add(side.x2, "x2", "nx2", 4);
    add(side.x, o.mystery ? "box" : "x", o.mystery ? "nbox" : "nx", 8);
    add(side.c, "u", "nu", 18);
    return specs;
  };

  /* A balance scale. o = { cx, cy, arm, rope, phi, left: specs, right: specs, armedSide, hit: true, mood, mascotX } */
  A.scale = function (o) {
    const cx = o.cx || 450, cy = o.cy || 82, arm = o.arm || 300, rope = o.rope || 186, phi = o.phi || 0;
    const groundY = o.groundY || 400;
    const lx = cx - arm * Math.cos(phi), ly = cy + arm * Math.sin(phi);
    const rx = cx + arm * Math.cos(phi), ry = cy - arm * Math.sin(phi);
    const pan = (px, py, side, specs) => {
      const trayY = py + rope;
      const armed = o.armedSide === side;
      const top = py + 14;
      return (
        '<path d="M ' + px + " " + py + " L " + (px - 118) + " " + trayY + " M " + px + " " + py + " L " + (px + 118) + " " + trayY +
        '" stroke="' + INK + '" stroke-width="2.4" fill="none"/>' +
        A.stack(specs, px, trayY - 5, 232) +
        (o.hit === false ? "" : '<rect class="hit" data-side="' + side + '" x="' + (px - 138) + '" y="' + top + '" width="276" height="' + (trayY - top + 26) + '" fill="transparent"/>') +
        '<path d="M ' + (px - 132) + " " + trayY + " L " + (px + 132) + " " + trayY + " Q " + (px + 118) + " " + (trayY + 20) + " " + (px + 96) + " " + (trayY + 20) +
        " L " + (px - 96) + " " + (trayY + 20) + " Q " + (px - 118) + " " + (trayY + 20) + " " + (px - 132) + " " + trayY + ' Z" fill="' +
        (armed ? "#fbe7a8" : "#efe4c8") + '" ' + OUT + ' pointer-events="none"/>' +
        (o.labels ? A.text(px, trayY + 46, o.labels[side], { size: 24, var: false }) : "") +
        (armed ? '<g pointer-events="none"><rect x="' + (px - 58) + '" y="' + (trayY + 28) + '" width="116" height="30" rx="15" fill="' + INK + '"/>' +
          A.text(px, trayY + 49, "click here!", { size: 17, fill: "#fff", var: false }) + "</g>" : "")
      );
    };
    const nx = -Math.sin(phi) * 8, ny = -Math.cos(phi) * 8;
    const beam = [[lx + nx, ly + ny], [rx + nx, ry + ny], [rx - nx, ry - ny], [lx - nx, ly - ny]].map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
    return (
      '<path d="M ' + (cx - 14) + " " + (cy + 4) + " L " + (cx - 24) + " " + groundY + " L " + (cx + 24) + " " + groundY + " L " + (cx + 14) + " " + (cy + 4) + ' Z" fill="#a47b52" ' + OUT + "/>" +
      '<rect x="' + (cx - 80) + '" y="' + (groundY - 8) + '" width="160" height="22" rx="8" fill="#8a6440" ' + OUT + "/>" +
      (o.mood ? A.mascot(o.mascotX || cx + 120, groundY - 12, o.mood) : "") +
      '<polygon points="' + beam + '" fill="#b98b5e" ' + OUT + "/>" +
      '<circle cx="' + cx + '" cy="' + cy + '" r="12" fill="#e7b84a" ' + OUT + "/>" +
      '<circle cx="' + lx + '" cy="' + ly + '" r="5" fill="' + INK + '"/><circle cx="' + rx + '" cy="' + ry + '" r="5" fill="' + INK + '"/>' +
      pan(lx, ly, "L", o.left || []) + pan(rx, ry, "R", o.right || [])
    );
  };

  /* Tilt angle for a weight difference (positive diff = left heavier = left down). */
  A.tilt = function (diff, k) {
    if (!diff) return 0;
    return Math.sign(diff) * Math.min(0.22, Math.max(0.09, Math.abs(diff) * (k || 0.03)));
  };

  /* A rounded "card" label, e.g. for equations drawn inside a scene. */
  A.card = function (x, y, w, h, fill) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" fill="' + (fill || "#fffdf7") + '" ' + OUT + "/>";
  };
})();
