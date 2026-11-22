/* Territory · AI.A-REI.D.12 */
(function () {
  const Alg = window.Alg, M = Alg.MINUS;
  // inequality y REL m x + k  (vertical: x REL k with m = null)
  const I = (m, k, rel) => ({ m, k, rel });
  const SYM = { "<": "<", "<=": "≤", ">": ">", ">=": "≥" };
  const text = (q) => q.m === null ? "x " + SYM[q.rel] + " " + Alg.num(q.k) : "y " + SYM[q.rel] + " " + Alg.fmtTerms([{ coef: q.m, body: "x" }, { coef: q.k, body: "" }]);
  const sat = (q, p) => { const lhs = q.m === null ? p[0] : p[1], rhs = q.m === null ? q.k : q.m * p[0] + q.k; return q.rel === "<" ? lhs < rhs : q.rel === "<=" ? lhs <= rhs : q.rel === ">" ? lhs > rhs : lhs >= rhs; };
  const strict = (q) => q.rel === "<" || q.rel === ">";
  const above = (q) => q.rel === ">" || q.rel === ">=";
  const LEVELS = [
    { stage: 1, mode: "shade", qs: [I(2, -1, ">")], tip: "Claim the territory where y > 2x − 1. Choose the boundary style, then click the side to shade." },
    { stage: 1, mode: "shade", qs: [I(-1, 3, "<=")], tip: "≤ means the boundary line itself counts." },
    { stage: 1, mode: "shade", qs: [I(0.5, 1, ">=")], tip: "Test a point, like (0, 0), if you're not sure which side." },
    { stage: 1, mode: "shade", qs: [I(null, 2, "<")], tip: "x < 2: a vertical boundary." },
    { stage: 2, mode: "write", qs: [I(1, 1, "<")], tip: "Now the territory is shown. Write its inequality." },
    { stage: 2, mode: "write", qs: [I(-2, 4, ">=")], tip: "Read the slope and intercept, then the line style and side." },
    { stage: 2, mode: "write", qs: [I(0, -1, ">")], tip: "A horizontal boundary." },
    { stage: 2, mode: "write", qs: [I(-0.5, 3, "<=")], tip: "The slope is a fraction." },
    { stage: 3, mode: "system", qs: [I(1, 0, ">="), I(-1, 4, "<")], tip: "Two inequalities. Shade both; the base goes where they overlap." },
    { stage: 3, mode: "system", qs: [I(2, -3, "<"), I(-0.5, 2, "<=")], tip: "Find the region that satisfies both." },
    { stage: 3, mode: "system", qs: [I(null, -1, ">"), I(0, 3, "<="), I(1, -2, ">=")], tip: "Three borders this time." },
    { stage: 3, mode: "judge", qs: [I(1, 1, "<="), I(-2, 6, ">")], pts: [[3, 2, true], [0, 1, false], [3, 5, false]], tip: "Last one: is each point inside the overlap? Check both inequalities." },
  ];

  GameShell.register({
    slug: "a-rei-d-12",
    title: "Territory",
    subtitle: "Graph linear inequalities and systems as half-planes",
    stages: { 1: "Stage 1 · Claim a half-plane", 2: "Stage 2 · Name the territory", 3: "Stage 3 · Overlapping territories" },
    levels: LEVELS,
    help: {
      intro: "A linear inequality claims a <b>half-plane</b>: everything on one side of a line.",
      steps: [
        "Choose the border: <b>solid</b> for ≤ and ≥ (the line counts), <b>dashed</b> for < and >.",
        "Click anywhere on the side you want to shade.",
        "In stage 2, write the inequality for a territory that's already drawn.",
        "In stage 3, shade every inequality, then place your base where all of them overlap.",
      ],
      note: "Not sure which side? Test a point, like (0, 0), in the inequality.",
    },
    load(lv, api) {
      const P = Plane.create({ xmin: -6, xmax: 6, ymin: -5, ymax: 7, xstep: 1, ystep: 1 });
      api.stage.appendChild(api.h("div", { class: "stage-text", style: { fontSize: "24px" } }, lv.mode === "write" ? "Which inequality is this?" : lv.qs.map(text).join("   and   ")));
      const svg = api.svg("0 0 900 460", "Coordinate grid");
      api.stage.appendChild(svg);
      const state = lv.qs.map(() => ({ style: null, side: null, done: lv.mode === "write" || lv.mode === "judge" }));
      let cur = 0, base = null, clickMode = "side";
      const colors = ["#5a78b8", "#c8553d", "#6b8f5e"];
      function boundary(q, style, color) {
        const o = { color, dash: style === "dashed" ? "12 8" : null, width: 3.5 };
        return q.m === null ? P.seg(q.k, P.ymin, q.k, P.ymax, o) : P.curve((x) => q.m * x + q.k, o);
      }
      function region(q, color) {
        const rel = q.rel;
        // y REL m x + k  <=>  -m x + y REL k ;  x REL k
        return q.m === null ? P.halfplane(1, 0, q.k, rel, { fill: color }) : P.halfplane(-q.m, 1, q.k, rel, { fill: color });
      }
      function draw() {
        let s = P.grid();
        lv.qs.forEach((q, i) => {
          const st = state[i];
          if (st.done) { s += region(q, colors[i]); s += boundary(q, strict(q) ? "dashed" : "solid", colors[i]); }
          else if (i === cur) {
            if (st.style) s += boundary(q, st.style, colors[i]); else s += boundary(q, "solid", "#b8b0a0");
            if (st.side) s += P.point(st.side[0], st.side[1], { r: 7, fill: colors[i] });
          }
        });
        if (base) s += '<g pointer-events="none" transform="translate(' + P.X(base[0]) + " " + P.Y(base[1]) + ')"><path d="M -14 10 L 0 -16 L 14 10 Z" fill="#e7b84a" stroke="#23262d" stroke-width="3"/></g>';
        if (lv.mode === "judge") lv.pts.forEach((p) => (s += P.point(p[0], p[1], { r: 8, label: "(" + p[0] + ", " + p[1] + ")" })));
        s += P.hitArea();
        svg.innerHTML = s;
      }
      svg.addEventListener("click", (e) => {
        if (!e.target.closest("[data-plane]")) return;
        const q = P.fromEvent(e, svg, 0.5, 0.5);
        if (clickMode === "base") base = [q.x, q.y]; else if (state[cur]) state[cur].side = [q.x, q.y];
        draw();
      });
      draw();
      const steps = [];
      let styleSeg = null;
      const shadeStep = (i) => ({ type: "click", button: "Claim", prompt: "Border for " + text(lv.qs[i]) + ", then click the side to shade.",
        onEnter: () => { cur = i; clickMode = "side"; draw(); },
        controls: () => { styleSeg = api.seg([{ value: "solid", label: "solid ——" }, { value: "dashed", label: "dashed - - -" }], state[i].style, (v) => { state[i].style = v; draw(); }, "Border style"); return styleSeg.el; },
        check: () => {
          const q = lv.qs[i], st = state[i];
          if (!st.style || !st.side) return "Choose a border style and click a side.";
          if ((st.style === "dashed") !== strict(q)) return strict(q) ? "With " + SYM[q.rel] + ", points on the line are not included. Use a dashed border." : "With " + SYM[q.rel] + ", points on the line are included. Use a solid border.";
          const onLine = q.m === null ? st.side[0] === q.k : Alg.close(st.side[1], q.m * st.side[0] + q.k);
          if (onLine) return "That point is on the border. Click clearly on one side.";
          if (!sat(q, st.side)) return "Test (" + Alg.num(st.side[0]) + ", " + Alg.num(st.side[1]) + "): it makes " + text(q) + " false. Shade the other side.";
          st.done = true; draw(); return true;
        },
        autoplay: () => { styleSeg.buttons.find((b) => b._v === (strict(lv.qs[i]) ? "dashed" : "solid")).click(); const q = lv.qs[i];
          state[i].side = q.m === null ? [q.k + (above(q) ? 2 : -2), 0] : [0, q.k + (above(q) ? 2 : -2)]; },
        done: text(lv.qs[i]) + ": " + (strict(lv.qs[i]) ? "dashed" : "solid") + " border, shade " + (lv.qs[i].m === null ? (above(lv.qs[i]) ? "right" : "left") : (above(lv.qs[i]) ? "above" : "below")) });
      if (lv.mode === "shade" || lv.mode === "system") lv.qs.forEach((_, i) => steps.push(shadeStep(i)));
      if (lv.mode === "system") steps.push({ type: "click", button: "Place base", prompt: "Click to place your base where all the territories overlap.",
        onEnter: () => { clickMode = "base"; },
        check: () => { if (!base) return "Click a point first."; const bad = lv.qs.find((q) => !sat(q, base)); return bad ? "(" + Alg.num(base[0]) + ", " + Alg.num(base[1]) + ") breaks " + text(bad) + "." : true; },
        autoplay: () => { for (let x = -6; x <= 6 && !base; x++) for (let y = -5; y <= 7 && !base; y++) if (lv.qs.every((q) => sat(q, [x, y]))) base = [x, y]; },
        done: "Base in the overlap" });
      if (lv.mode === "write") {
        const q = lv.qs[0];
        if (q.m === null) steps.push({ type: "input", prompt: "Boundary: x = []", answers: [q.k] });
        else steps.push({ type: "input", prompt: "Boundary line: y = []x + []", answers: [q.m, q.k], hint: "The slope is rise over run; the intercept is where it crosses the y-axis." });
        steps.push({ type: "choice", prompt: "Which inequality sign?", options: ["<", "<=", ">", ">="].map((r) => ({ label: "y " + SYM[r] + " …", ok: r === q.rel,
          why: (strict({ rel: r }) !== strict(q) ? "Look at the border: " + (strict(q) ? "dashed means the line isn't included." : "solid means the line is included.") : "Which side is shaded: above or below?") })),
          done: text(q) });
      }
      if (lv.mode === "judge") lv.pts.forEach((p) => steps.push({ type: "choice", prompt: "Is (" + p[0] + ", " + p[1] + ") in the overlap?", options: [
        { label: "Yes: it satisfies both", ok: p[2], why: lv.qs.map((q) => text(q) + " is " + (sat(q, p) ? "true" : "false")).join("; ") },
        { label: "No", ok: !p[2], why: lv.qs.map((q) => text(q) + " is " + (sat(q, p) ? "true" : "false")).join("; ") }],
        done: "(" + p[0] + ", " + p[1] + "): " + lv.qs.map((q) => (sat(q, p) ? "✓" : "✗")).join(" ") }));
      Steps.run(api, { steps, logTitle: "Your territory", result: () => ({ answer: lv.qs.map(text).join("<br>"), check: "Solid border for ≤/≥, dashed for </>; shade the side whose points make it true ✓" }) });
    },
    guide: {
      summary: "A 12-level game for graphing linear inequalities. Students choose solid or dashed borders and shade half-planes, write the inequality for a shaded region, and find the overlap of systems of inequalities.",
      also: "<span class='code'>AI.A-CED.A.3</span> constraints as systems of inequalities.",
      practices: "MP6 Attend to precision · MP7 Look for and make use of structure",
      goals: [
        "Graph the solutions of a linear inequality in two variables as a half-plane, with a dashed boundary for strict inequalities.",
        "Write the inequality for a given half-plane.",
        "Graph a system of linear inequalities as the intersection of half-planes and test points in it.",
      ],
      howItWorks: "In stage 1 students choose the border style and click the side to shade; wrong sides are refuted by testing the clicked point. In stage 2 a region is drawn and students write the boundary line and choose the sign. In stage 3 students shade each inequality and place a base in the overlap, then judge points by checking every inequality.",
      stageNotes: {
        1: { sees: "Single inequalities, including a vertical boundary.", builds: "Solid vs. dashed; test points." },
        2: { sees: "Shaded regions.", builds: "Reading boundary equations; choosing the sign." },
        3: { sees: "Systems of two and three inequalities.", builds: "Intersections of half-planes; checking every inequality." },
      },
      discussion: [
        "Why is (0, 0) such a handy test point? When can't you use it?",
        "What's the difference between the graphs of y < x + 1 and y ≤ x + 1?",
        "Why must a point satisfy every inequality to be in the solution of the system?",
      ],
      misconceptions: [
        ["Solid border for a strict inequality", "The game names the rule for < and >."],
        ["Shading above for every \"<\" written as x < …", "A vertical boundary level shades left and right."],
        ["Checking only one inequality in a system", "Judge feedback evaluates each inequality."],
      ],
      exitTicket: {
        items: ["Graph y ≥ −x + 2. Solid or dashed? Which side?", "Write the inequality: dashed line y = 3x − 1, shaded below.", "Is (2, 1) a solution of y < x and y ≥ −1?"],
        answers: ["Solid; shade above (test (0, 0): 0 ≥ 2 is false).", "y < 3x − 1", "Yes: 1 < 2 and 1 ≥ −1."],
      },
    },
    answerKey(lv) {
      const desc = (q) => text(q) + " (" + (strict(q) ? "dashed" : "solid") + ", shade " + (q.m === null ? (above(q) ? "right" : "left") : (above(q) ? "above" : "below")) + ")";
      if (lv.mode === "judge") return { prompt: lv.qs.map(text).join(" and "), solution: lv.pts.map((p) => "(" + p[0] + ", " + p[1] + ") " + (p[2] ? "yes" : "no")).join("; "), answer: lv.pts.filter((p) => p[2]).map((p) => "(" + p[0] + ", " + p[1] + ")").join(", ") + " only" };
      return { prompt: lv.mode === "write" ? "Shaded region" : lv.qs.map(text).join(" and "), solution: lv.qs.map(desc).join("; "), answer: lv.qs.map(text).join(" and ") };
    },
  });
})();
