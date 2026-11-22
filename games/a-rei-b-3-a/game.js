/* Radar Station · AI.A-REI.B.3.a */
(function () {
  const A = window.Cartoon, Alg = window.Alg, M = Alg.MINUS;
  // c = center, r = radius, rel: = | <= | < | >= | > ; pre: a step that simplifies first
  const LEVELS = [
    { stage: 1, expr: "|x " + M + " 2| = 3", c: 2, r: 3, rel: "=", tip: "|x − 2| means the distance from x to 2. Which numbers are exactly 3 away from the base at 2?" },
    { stage: 1, expr: "|x + 4| = 2", c: -4, r: 2, rel: "=", tip: "x + 4 = x − (−4). Where is the base?" },
    { stage: 1, expr: "|x| = 6", c: 0, r: 6, rel: "=", tip: "Distance from 0." },
    { stage: 1, expr: "|x " + M + " 1| + 4 = 9", c: 1, r: 5, rel: "=", pre: ["First get the absolute value alone: |x − 1| = []", [5]], tip: "Undo the + 4 before you use the radar." },
    { stage: 2, expr: "|x " + M + " 5| ≤ 3", c: 5, r: 3, rel: "<=", tip: "Every number within 3 of the base, including exactly 3 away." },
    { stage: 2, expr: "|x + 2| < 4", c: -2, r: 4, rel: "<", tip: "Strictly less than 4 away. Are the edges included?" },
    { stage: 2, expr: "|x| ≤ 7", c: 0, r: 7, rel: "<=", tip: "Inside the radar zone." },
    { stage: 2, expr: "|2x " + M + " 4| ≤ 6", c: 2, r: 3, rel: "<=", pre: ["Divide everything by 2: |x − 2| ≤ []", [3]], tip: "Factor out the 2 first: |2x − 4| = 2|x − 2|." },
    { stage: 3, expr: "|x " + M + " 3| > 2", c: 3, r: 2, rel: ">", tip: "More than 2 away: outside the radar zone, in both directions." },
    { stage: 3, expr: "|x + 1| ≥ 4", c: -1, r: 4, rel: ">=", tip: "At least 4 away. Two pieces." },
    { stage: 3, expr: "|x " + M + " 2| + 1 > 6", c: 2, r: 5, rel: ">", pre: ["Get the absolute value alone: |x − 2| > []", [5]], tip: "Simplify, then sweep." },
    { stage: 3, expr: "|3x + 3| ≥ 9", c: -1, r: 3, rel: ">=", pre: ["Divide by 3: |x + 1| ≥ []", [3]], tip: "Last one: simplify, then sweep." },
  ];
  const lo = (lv) => lv.c - lv.r, hi = (lv) => lv.c + lv.r;
  const SYM = { "<=": "≤", "<": "<", ">=": "≥", ">": ">" };
  function answer(lv) {
    const a = Alg.num(lo(lv)), b = Alg.num(hi(lv));
    if (lv.rel === "=") return "x = " + a + " or x = " + b;
    if (lv.rel === "<=" || lv.rel === "<") return a + " " + SYM[lv.rel] + " x " + SYM[lv.rel] + " " + b;
    const flip = lv.rel === ">=" ? "≤" : "<";
    return "x " + flip + " " + a + " or x " + SYM[lv.rel] + " " + b;
  }
  const holds = (lv, x) => { const d = Math.abs(x - lv.c); return lv.rel === "=" ? Alg.close(d, lv.r) : lv.rel === "<=" ? d <= lv.r : lv.rel === "<" ? d < lv.r : lv.rel === ">=" ? d >= lv.r : d > lv.r; };

  GameShell.register({
    slug: "a-rei-b-3-a",
    title: "Radar Station",
    firstMove: "Start at the radar base. Count the given distance in both directions, tap the two endpoints, then press Sweep.",
    subtitle: "Solve absolute value equations and inequalities",
    stages: { 1: "Stage 1 · Exactly this far", 2: "Stage 2 · Inside the zone", 3: "Stage 3 · Outside the zone" },
    levels: LEVELS,
    help: {
      intro: "|x − c| is the <b>distance</b> between x and the radar base at c.",
      steps: [
        "Find the base and the range. Simplify first if the absolute value isn't alone.",
        "Click the number line to mark the endpoints (click again to remove).",
        "For inequalities, choose open or closed circles and whether the solutions are inside or outside the zone.",
        "Press <b>Sweep</b>. Fewer wrong sweeps means more stars.",
      ],
      note: "≤ and ≥ include the endpoints (closed circles). < and > don't (open circles).",
    },
    load(lv, api) {
      const N = Plane.numberLine({ min: -12, max: 12, step: 1, label: 2, h: 200 });
      const svg = api.svg("0 0 900 200", "Number line with radar");
      api.stage.append(api.h("div", { class: "stage-text" }, lv.expr), svg);
      let marks = [], closed = null, shade = null, show = false;
      function draw() {
        let s = N.base();
        if (show) {
          // radar circle around the base
          const R = N.X(lv.c + lv.r) - N.X(lv.c);
          s += '<ellipse cx="' + N.X(lv.c) + '" cy="' + N.Y + '" rx="' + R + '" ry="46" fill="#5a78b8" fill-opacity="0.12" stroke="#5a78b8" stroke-dasharray="6 5" stroke-width="2"/>';
        }
        s += '<g transform="translate(' + N.X(lv.c) + " " + (N.Y - 14) + ')"><path d="M -10 0 L 10 0 L 0 -26 Z" fill="#a47b52" stroke="#23262d" stroke-width="2.5"/><path d="M -12 -30 q 12 -14 24 0" fill="none" stroke="#23262d" stroke-width="2.5"/></g>';
        if (marks.length === 2 && shade) {
          const [a, b] = marks.slice().sort((p, q) => p - q);
          if (shade === "in") s += N.span(a, b); else { s += N.ray(a, -1); s += N.ray(b, 1); }
        }
        marks.forEach((m) => (s += N.dot(m, lv.rel === "=" ? true : closed === true)));
        s += N.hits();
        svg.innerHTML = s;
        svg.setAttribute("aria-label", "Number line. Base at " + lv.c + ". Marked: " + (marks.length ? marks.join(", ") : "nothing"));
      }
      svg.addEventListener("click", (e) => {
        const t = e.target.closest("[data-v]"); if (!t) return;
        const v = Number(t.getAttribute("data-v"));
        const k = marks.indexOf(v);
        if (k >= 0) marks.splice(k, 1); else if (marks.length < 2) marks.push(v); else { marks.shift(); marks.push(v); }
        draw();
      });
      draw();
      const steps = [];
      if (lv.pre) steps.push({ type: "input", prompt: lv.pre[0], answers: lv.pre[1], hint: "Undo the outside operations first, on both sides." });
      const isEq = lv.rel === "=";
      let circleSeg, shadeSeg;
      steps.push({ type: "click", button: "Sweep",
        prompt: isEq ? "Mark the two numbers that are exactly " + lv.r + " from the base at " + Alg.num(lv.c) + "." : "Mark the endpoints, then choose the circles and the shading.",
        controls: () => {
          const wrap = api.h("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" } });
          if (!isEq) {
            circleSeg = api.seg([{ value: false, label: "○ open" }, { value: true, label: "● closed" }], closed, (v) => { closed = v; draw(); }, "Circles");
            shadeSeg = api.seg([{ value: "in", label: "between" }, { value: "out", label: "outside" }], shade, (v) => { shade = v; draw(); }, "Shading");
            wrap.append(circleSeg.el, shadeSeg.el);
          }
          return wrap;
        },
        check: () => {
          show = true; draw();
          const want = [lo(lv), hi(lv)];
          if (marks.length !== 2) return "Mark two endpoints. Each is " + lv.r + " away from the base, one on each side.";
          const sorted = marks.slice().sort((a, b) => a - b);
          if (sorted[0] !== want[0] || sorted[1] !== want[1]) {
            const bad = sorted.find((m) => !want.includes(m));
            return Alg.num(bad) + " is " + Alg.num(Math.abs(bad - lv.c)) + " away from the base at " + Alg.num(lv.c) + ", not " + lv.r + ".";
          }
          if (isEq) return true;
          if (closed === null || shade === null) return "Choose open or closed circles, and between or outside.";
          const wantClosed = lv.rel === "<=" || lv.rel === ">=", wantShade = lv.rel === "<=" || lv.rel === "<" ? "in" : "out";
          if (closed !== wantClosed) return "Is x = " + Alg.num(want[1]) + " itself a solution? |" + Alg.num(want[1]) + " − " + Alg.num(lv.c) + "| = " + lv.r + ", and " + lv.r + " " + SYM[lv.rel] + " " + lv.r + " is " + (wantClosed ? "true, so the circles are closed." : "false, so the circles are open.");
          if (shade !== wantShade) {
            const t = shade === "in" ? lv.c : want[1] + 2;
            return "Test x = " + Alg.num(t) + " from your shaded part: |" + Alg.num(t) + " − " + Alg.num(lv.c) + "| = " + Math.abs(t - lv.c) + ", and " + Math.abs(t - lv.c) + " " + SYM[lv.rel] + " " + lv.r + " is false. Shade the other way.";
          }
          return true;
        },
        autoplay: () => { marks = [lo(lv), hi(lv)]; if (!isEq) { circleSeg.buttons.find((b) => b._v === (lv.rel === "<=" || lv.rel === ">=")).click(); shadeSeg.buttons.find((b) => b._v === (lv.rel === "<=" || lv.rel === "<" ? "in" : "out")).click(); } draw(); },
        done: answer(lv) });
      Steps.run(api, { steps, logTitle: "Your work", result: () => {
        const t = isEq ? lo(lv) : (lv.rel === "<=" || lv.rel === "<") ? lv.c : hi(lv) + 1;
        return { answer: answer(lv), check: "Test x = " + Alg.num(t) + ": distance from " + Alg.num(lv.c) + " is " + Math.abs(t - lv.c) + (holds(lv, t) ? " ✓" : "") };
      } });
    },
    guide: {
      summary: "A 12-level game for absolute value equations and inequalities. |x − c| is shown as the distance from a radar base at c; students mark endpoints on a number line, choose open or closed circles, and decide whether the solutions are inside or outside the radar zone.",
      also: "<span class='code'>AI.A-REI.B.3</span> linear inequalities in one variable.",
      practices: "MP2 Reason abstractly and quantitatively · MP6 Attend to precision",
      evidence: "Change “exactly three units away” to “less than three units away.” Ask which points to shade and whether the endpoints count.",
      goals: [
        "Interpret |x − c| as the distance between x and c on the number line.",
        "Solve |x − c| = r, |x − c| ≤ r and |x − c| ≥ r and graph the solutions.",
        "Isolate the absolute value or divide out a factor before solving.",
      ],
      howItWorks: "Each level shows an absolute value equation or inequality and a radar base on a number line. Students mark endpoints by clicking, choose circles and shading, and press Sweep. Feedback reports how far a wrong endpoint is from the base, or refutes wrong shading with a test point. Some levels start by isolating or simplifying the absolute value.",
      stageNotes: {
        1: { sees: "Equations: exactly r away.", builds: "Two solutions; reading the base from x + 4." },
        2: { sees: "≤ and < inequalities; |2x − 4| ≤ 6.", builds: "Intervals inside the zone; open vs. closed; factoring out a coefficient." },
        3: { sees: "≥ and > inequalities.", builds: "Two rays outside the zone; isolating the absolute value." },
      },
      discussion: [
        "Why does |x + 4| = 2 have its base at −4?",
        "Why are the solutions of |x − 3| > 2 in two separate pieces?",
        "How is |2x − 4| ≤ 6 related to |x − 2| ≤ 3?",
      ],
      misconceptions: [
        ["Only one solution to |x − 2| = 3", "Both endpoints must be marked."],
        ["Reading the base of |x + 4| as +4", "Feedback reports the actual distance from the base."],
        ["Shading between for a > inequality", "A test point from the shaded part is shown to fail."],
        ["Subtracting inside the absolute value: |x − 1| + 4 = 9 → |x + 3| = 9", "A first step isolates the absolute value."],
      ],
      exitTicket: {
        items: ["Solve and graph: |x − 4| = 6", "Solve and graph: |x + 3| < 5", "Solve: |2x + 2| ≥ 8"],
        answers: ["x = −2 or x = 10", "−8 < x < 2 (open circles, shade between)", "|x + 1| ≥ 4, so x ≤ −5 or x ≥ 3"],
      },
    },
    answerKey(lv) {
      return { prompt: lv.expr, solution: (lv.pre ? lv.pre[0].replace("[]", lv.pre[1][0]) + "; " : "") + "base " + Alg.num(lv.c) + ", range " + lv.r, answer: answer(lv) };
    },
  });
})();
