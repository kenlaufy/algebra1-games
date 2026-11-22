/* Algebra 1 Games: "time machine" helpers and a data-driven step game.
 *
 * Timeline.stepGame(config) registers a game whose levels are data:
 *   { stage, tip, ctx (html), table?, chart?, steps: [...], answer, check }
 *   table: { colLabel, cols: [..], rows: [{ label, values: [..], color }], hideFrom? }   // hidden cells revealed when solved
 *   chart: { r: [xmin, xmax, ymin, ymax, xstep, ystep], xlabel, ylabel, series: [{ f | pts, color, dash }], reveal: "end" | "start" }
 *   steps: ["in", prompt with [] slots, answers, { unordered, tol, hint }]  or  ["ch", prompt, [[label, why], ...]]  (first choice is right)
 * The teacher-guide answer key is generated from the steps.
 */
(function () {
  "use strict";
  const TL = (window.Timeline = {});
  const A = () => window.Alg;
  const fmt = (v) => (typeof v === "string" ? v : A().num(A().round(v, 4)));

  TL.table = function (h, t, revealAll) {
    const tbl = h("table", { class: "area", style: { borderSpacing: "4px" }, "aria-label": "Table of values" });
    const cell = (v, hidden) => h("td", { style: { height: "auto", minWidth: "54px", fontWeight: 800, fontSize: "18px", background: hidden ? "var(--chip)" : "#fff" } }, hidden ? "?" : fmt(v));
    tbl.appendChild(h("tr", null, h("th", null, t.colLabel || "t"), ...t.cols.map((c) => cell(c, false))));
    t.rows.forEach((r) => tbl.appendChild(h("tr", null, h("th", { style: { color: r.color || "inherit" } }, r.label),
      ...r.values.map((v, i) => cell(v, !revealAll && t.hideFrom != null && i >= t.hideFrom)))));
    return h("div", { style: { overflowX: "auto" } }, tbl);
  };

  TL.chart = function (c, show) {
    const r = c.r;
    const P = window.Plane.create({ xmin: r[0], xmax: r[1], ymin: r[2], ymax: r[3], xstep: r[4], ystep: r[5], xtick: r[6] || r[4], ytick: r[7] || r[5], xlabel: c.xlabel || "x", ylabel: c.ylabel || "y", h: 360 });
    let s = P.grid();
    c.series.forEach((sr) => {
      if (!show && !sr.always) return;
      if (sr.f) s += P.curve(sr.f, { color: sr.color || "#5a78b8", dash: sr.dash, from: sr.from, to: sr.to });
      (sr.pts || []).forEach((p) => (s += P.point(p[0], p[1], { r: 7, fill: sr.color || "#5a78b8" })));
    });
    if (c.marks) c.marks.forEach((m) => (s += P.point(m[0], m[1], { r: 8, fill: "#e7b84a", label: m[2] })));
    return s;
  };

  function fill(prompt, ans) { let k = 0; return prompt.replace(/\[\]/g, () => fmt(ans[k++])); }

  TL.stepGame = function (cfg) {
    GameShell.register({
      slug: cfg.slug, title: cfg.title, subtitle: cfg.subtitle, stages: cfg.stages, levels: cfg.levels, help: cfg.help, guide: cfg.guide, firstMove: cfg.firstMove,
      load(lv, api) {
        const h = api.h;
        if (lv.ctx) api.stage.appendChild(h("div", { class: "stage-text", style: { fontSize: "21px", lineHeight: 1.4 }, html: lv.ctx }));
        let tableBox = null, svg = null;
        if (lv.table) { tableBox = h("div"); api.stage.appendChild(tableBox); tableBox.appendChild(TL.table(h, lv.table, false)); }
        if (lv.chart) { svg = api.svg("0 0 900 360", "Graph"); api.stage.appendChild(svg); svg.innerHTML = TL.chart(lv.chart, lv.chart.reveal !== "end"); }
        const reveal = () => {
          if (tableBox) { tableBox.innerHTML = ""; tableBox.appendChild(TL.table(h, lv.table, true)); }
          if (svg) svg.innerHTML = TL.chart(lv.chart, true);
        };
        const steps = lv.steps.map((st) => {
          if (st[0] === "ch") return { type: "choice", prompt: st[1], options: st[2].map((o, k) => ({ label: o[0], ok: k === 0, why: o[1] })), done: st[1] + " " + st[2][0][0] };
          const o = st[3] || {};
          const step = { type: "input", prompt: st[1], answers: st[2], unordered: !!o.unordered, hint: o.hint || cfg.hint || "Check your work and try again.", done: fill(st[1], st[2]) };
          if (o.tol) step.accept = (vals) => {
            const left = st[2].slice();
            const ok = vals.length === left.length && vals.every((v, i) => {
              if (!o.unordered) return Math.abs(v - st[2][i]) <= o.tol;
              const k = left.findIndex((a) => Math.abs(v - a) <= o.tol); if (k < 0) return false; left.splice(k, 1); return true;
            });
            return ok ? true : step.hint;
          };
          return step;
        });
        if (steps.length) steps[steps.length - 1].onDone = reveal;
        Steps.run(api, { steps, logTitle: cfg.logTitle || "Your work", result: () => ({ answer: lv.answer || "", check: lv.check || "" }) });
      },
      answerKey(lv) {
        const parts = lv.steps.map((st) => (st[0] === "ch" ? st[1].replace(/<[^>]+>/g, "") + " " + st[2][0][0] : fill(st[1], st[2])));
        return { prompt: (lv.ctx || "").replace(/<[^>]+>/g, ""), solution: parts.join("; "), answer: lv.answer || parts[parts.length - 1] };
      },
    });
  };
})();
