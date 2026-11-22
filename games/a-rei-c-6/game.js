/* Intercept · AI.A-REI.C.6 */
(function () {
  const Alg = window.Alg, M = Alg.MINUS;
  // lines as [a, b, c]: a x + b y = c, with display text
  const L = (a, b, c, text) => ({ a, b, c, text });
  const LEVELS = [
    { stage: 1, l: [L(-1, 1, 1, "y = x + 1"), L(1, 1, 5, "y = " + M + "x + 5")], sol: [2, 3], r: [-2, 8, -3, 9], tip: "Two routes. Click where they cross to place your interceptor." },
    { stage: 1, l: [L(-2, 1, -1, "y = 2x " + M + " 1"), L(-0.5, 1, 2, "y = 0.5x + 2")], sol: [2, 3], r: [-2, 8, -3, 9], tip: "Read the crossing point carefully." },
    { stage: 1, l: [L(2, 1, 4, "y = " + M + "2x + 4"), L(-1, 1, -2, "y = x " + M + " 2")], sol: [2, 0], r: [-2, 8, -5, 7], tip: "Crossing points can be on an axis." },
    { stage: 1, l: [L(1, 1, 6, "x + y = 6"), L(-2, 1, 0, "y = 2x")], sol: [2, 4], r: [-2, 8, -3, 9], tip: "One equation is in standard form." },
    { stage: 2, l: [L(-3, 1, -2, "y = 3x " + M + " 2"), L(-1, 1, 4, "y = x + 4")], sol: [3, 7], r: [-2, 8, -3, 11], hidden: true, tip: "The routes are hidden. Predict the crossing, then solve exactly." },
    { stage: 2, l: [L(2, 1, 7, "2x + y = 7"), L(1, -1, -1, "x " + M + " y = " + M + "1")], sol: [2, 3], r: [-2, 8, -3, 9], hidden: true, tip: "Solve one equation for y, then substitute." },
    { stage: 2, l: [L(-2, 1, 1, "y = 2x + 1"), L(-2, 1, -3, "y = 2x " + M + " 3")], sol: "none", r: [-2, 8, -4, 10], tip: "Compare the slopes before you look for a crossing." },
    { stage: 2, l: [L(-1, 1, 2, "y = x + 2"), L(-2, 2, 4, "2y " + M + " 2x = 4")], sol: "all", r: [-2, 8, -3, 9], tip: "Rewrite the second equation in y = form." },
    { stage: 3, l: [L(-1, 1, 1, "y = x + 1"), L(2, 1, 3, "y = " + M + "2x + 3")], sol: [2 / 3, 5 / 3], frac: [[2, 3], [5, 3]], r: [-2, 6, -2, 6], approx: true,
      tip: "The crossing isn't on a grid point. Estimate it, then find it exactly." },
    { stage: 3, l: [L(-5, 1, 20, "Plan A: C = 5m + 20"), L(-2, 1, 35, "Plan B: C = 2m + 35")], sol: [5, 45], r: [0, 10, 0, 80], step: [1, 5], ctx: "Two gym plans. When do they cost the same? (m = months, C = dollars)",
      tip: "A real question: when are the costs equal?" },
    { stage: 3, l: [L(3, 2, 6, "3x + 2y = 6"), L(1, -1, 4, "x " + M + " y = 4")], sol: [2.8, -1.2], frac: [[14, 5], [-6, 5]], r: [-2, 6, -4, 4], approx: true, tip: "Estimate first. Then substitute x − 4 for y." },
    { stage: 3, l: [L(-2, 1, -1, "y = 2x " + M + " 1"), L(0.5, 1, 3, "y = " + M + "0.5x + 3")], sol: [1.6, 2.2], frac: [[8, 5], [11, 5]], r: [-2, 6, -2, 6], approx: true, tip: "Last one: estimate, then solve exactly." },
  ];
  const yOf = (l) => (x) => (l.c - l.a * x) / l.b;
  const pt = (p) => "(" + Alg.num(Alg.round(p[0], 4)) + ", " + Alg.num(Alg.round(p[1], 4)) + ")";

  GameShell.register({
    slug: "a-rei-c-6",
    title: "Intercept",
    firstMove: "Tap the point where the solid and dashed routes cross, then press Place. Read x across and y up.",
    subtitle: "Solve systems of linear equations with graphs and exactly",
    stages: { 1: "Stage 1 · Read the crossing", 2: "Stage 2 · Predict, then solve", 3: "Stage 3 · Off the grid" },
    levels: LEVELS,
    help: {
      intro: "Each route is the graph of a linear equation. The interceptor must sit where the two routes cross: the <b>solution of the system</b>.",
      steps: [
        "Click the grid where you think the routes cross, then press <b>Place</b>.",
        "When the routes are hidden, predict first; they appear after you place the interceptor.",
        "Solve exactly: substitute one equation into the other. Fractions like 2/3 are fine.",
        "Some systems have no crossing, or the two routes are the same line.",
      ],
      note: "Fewer wrong guesses means more stars.",
    },
    load(lv, api) {
      const step = lv.step || [1, 1];
      const P = Plane.create({ xmin: lv.r[0], xmax: lv.r[1], ymin: lv.r[2], ymax: lv.r[3], xstep: step[0], ystep: step[1], xtick: step[0] * (lv.r[1] - lv.r[0] > 12 ? 2 : 1), ytick: step[1] * 2,
        xlabel: lv.ctx ? "m" : "x", ylabel: lv.ctx ? "C" : "y" });
      if (lv.ctx) api.stage.appendChild(api.h("div", { class: "preview", style: { textAlign: "center", padding: "8px", fontSize: "18px", color: "var(--ink)" } }, lv.ctx));
      api.stage.appendChild(api.h("div", { class: "stage-text", style: { fontSize: "24px" } }, "Solid: " + lv.l[0].text + " · Dashed: " + lv.l[1].text));
      const svg = api.svg("0 0 900 460", "Two routes on a grid");
      api.stage.appendChild(svg);
      let pick = null, reveal = !lv.hidden, marked = null;
      let coordinates = [];
      const axes = lv.ctx ? ["m", "C"] : ["x", "y"];
      const colors = ["#5a78b8", "#c8553d"];
      function draw() {
        let s = P.grid();
        if (reveal) lv.l.forEach((l, i) => {
          s += l.b !== 0 ? P.curve(yOf(l), { color: colors[i], dash: i === 1 ? "10 8" : null }) : P.seg(l.c / l.a, P.ymin, l.c / l.a, P.ymax, { color: colors[i], dash: i === 1 ? "10 8" : null });
        });
        if (marked) s += P.point(marked[0], marked[1], { fill: "#3f7d4c", r: 10, label: pt(marked) });
        if (pick) s += '<g pointer-events="none" transform="translate(' + P.X(pick[0]) + " " + P.Y(pick[1]) + ')"><circle r="14" fill="none" stroke="#23262d" stroke-width="3"/><path d="M -20 0 h 40 M 0 -20 v 40" stroke="#23262d" stroke-width="2.5"/></g>';
        s += P.hitArea();
        svg.innerHTML = s;
      }
      svg.addEventListener("click", (e) => {
        if (!e.target.closest("[data-plane]")) return;
        const q = P.fromEvent(e, svg, lv.approx ? 0.5 * step[0] : step[0], lv.approx ? 0.5 * step[1] : step[1]);
        if (!coordinates.length || marked) return;
        pick = [q.x, q.y];
        coordinates.forEach((field, i) => { field.value = pick[i]; });
        draw();
      });
      draw();
      const steps = [];
      if (lv.sol === "none" || lv.sol === "all") {
        steps.push({ type: "choice", prompt: "How many solutions does this system have?", onDone: () => { reveal = true; draw(); },
          options: [
            { label: "No solution: the lines are parallel", ok: lv.sol === "none", why: lv.sol === "all" ? "Rewrite 2y − 2x = 4 as y = x + 2. Is it a different line?" : "" },
            { label: "Infinitely many: it's the same line", ok: lv.sol === "all", why: lv.sol === "none" ? "Same slope, but the y-intercepts are 1 and −3. Different lines." : "" },
            { label: "Exactly one solution", ok: false, why: "Two lines cross exactly once only if their slopes are different. Compare the slopes." } ] });
        if (lv.sol === "none") steps.push({ type: "choice", prompt: "Try substituting: 2x + 1 = 2x − 3 gives…", options: [
          { label: "1 = −3, which is never true", ok: true }, { label: "x = 1", why: "The 2x terms cancel. What's left?" }, { label: "0 = 0", why: "1 and −3 are different numbers." }] });
        else steps.push({ type: "choice", prompt: "Substitute y = x + 2 into 2y − 2x = 4. You get…", options: [
          { label: "4 = 4, always true", ok: true }, { label: "x = 2", why: "2(x + 2) − 2x = 2x + 4 − 2x. The x terms cancel." }, { label: "4 = 0", why: "Check: 2x + 4 − 2x = 4." }] });
      } else {
        steps.push({ type: "click", button: "Place", prompt: lv.approx ? "Estimate the crossing. Tap the graph or enter its coordinates." :
          lv.hidden ? "Predict the crossing. Tap the graph or enter its coordinates." : "Tap where the routes cross or enter the coordinates.",
          controls: () => {
            coordinates = axes.map(axis => api.number("", { type: "text", "aria-label": axis + " coordinate", inputmode: "decimal" }));
            return api.h("div", { class: "row" }, ...coordinates.map((field, i) => api.h("label", null, axes[i] + " ", field)));
          },
          check: () => {
            const point = coordinates.map(field => Alg.parseNum(field.value));
            const [x, y] = point;
            if (!Number.isFinite(x) || !Number.isFinite(y)) return "Tap the graph or fill in both coordinates first.";
            if (x < P.xmin || x > P.xmax || y < P.ymin || y > P.ymax) return "Choose coordinates inside the grid.";
            pick = point;
            const tol = lv.approx ? 0.6 : 1e-9;
            reveal = true; draw();
            const dx = Math.abs(pick[0] - lv.sol[0]) / step[0], dy = Math.abs(pick[1] - lv.sol[1]) / step[1];
            if (dx <= tol && dy <= tol) { marked = pick; draw(); return true; }
            const f0 = yOf(lv.l[0])(pick[0]), f1 = yOf(lv.l[1])(pick[0]);
            if (dx <= tol) return "You chose " + pt(pick) + ". Keep the same horizontal position and move " + (pick[1] > lv.sol[1] ? "down" : "up") + " toward the crossing.";
            return "At " + (lv.ctx ? "m" : "x") + " = " + Alg.num(pick[0]) + " the routes are at " + Alg.num(Alg.round(f0, 2)) + " and " + Alg.num(Alg.round(f1, 2)) + ". They cross where those are equal.";
          },
          autoplay: () => { coordinates.forEach((field, i) => { field.value = lv.approx ? Math.round(lv.sol[i] * 2) / 2 : lv.sol[i]; }); }, get done() { return (lv.approx ? "Your estimate: " : "Crossing at ") + pt(marked); } });
        if (lv.hidden || lv.approx || lv.ctx) {
          const xv = lv.ctx ? "m" : "x", yv = lv.ctx ? "C" : "y";
          steps.push({ type: "input", prompt: "Solve exactly: " + xv + " = [], " + yv + " = []", answers: lv.sol, hint: "Set the two expressions for " + yv + " equal (or substitute), then solve for " + xv + ". Put " + xv + " back in to get " + yv + ".",
            done: "Exactly " + (lv.frac ? "(" + lv.frac.map((f) => (f[0] < 0 ? M : "") + Math.abs(f[0]) + "/" + f[1]).join(", ") + ")" : pt(lv.sol)) });
        }
      }
      Steps.run(api, { steps, logTitle: "Your work", result: () => ({
        answer: lv.sol === "none" ? "No solution" : lv.sol === "all" ? "Infinitely many solutions" : (lv.frac ? "(" + lv.frac.map((f) => (f[0] < 0 ? M : "") + Math.abs(f[0]) + "/" + f[1]).join(", ") + ")" : pt(lv.sol)),
        check: Array.isArray(lv.sol) ? "Check: " + lv.l.map((l) => Alg.num(Alg.round(l.a * lv.sol[0] + l.b * lv.sol[1], 6)) + " = " + Alg.num(l.c)).join(" and ") + " ✓<br><strong>Explain:</strong> Why must the crossing point satisfy both equations?" : "Graphs and algebra agree ✓<br><strong>Explain:</strong> How would you tell how many solutions there are from the graph?" }) });
    },
    guide: {
      summary: "A 12-level game for systems of two linear equations. Students place an interceptor where two routes cross, predict crossings before the lines appear, solve exactly by substitution, estimate non-grid crossings, and recognize parallel and identical lines.",
      also: "<span class='code'>AI.A-REI.D.11</span> intersections as solutions of f(x) = g(x).",
      practices: "MP5 Use appropriate tools strategically · MP6 Attend to precision",
      evidence: "Ask the student to check a proposed crossing in both equations. A point that fits only one route makes a useful counterexample.",
      goals: [
        "Solve systems of linear equations approximately from graphs.",
        "Solve systems exactly by substitution, including fractional solutions.",
        "Recognize systems with no solution and with infinitely many solutions.",
      ],
      howItWorks: "Stage 1 draws both lines; students click the crossing. Stage 2 hides the lines until students place a prediction, then asks for the exact solution; two levels ask how many solutions a system has. Stage 3 crossings fall between grid points: students estimate (snapping to halves), then solve exactly.",
      stageNotes: {
        1: { sees: "Both lines drawn, integer crossings.", builds: "The solution as the shared point." },
        2: { sees: "Hidden lines; parallel and identical lines.", builds: "Substitution; slopes and number of solutions." },
        3: { sees: "Fractional crossings and a gym-plan context.", builds: "Estimating, then solving exactly; interpreting the solution." },
      },
      discussion: [
        "Why does the graph only give an estimate in stage 3?",
        "What happens algebraically when two lines are parallel? When they're the same line?",
        "In the gym-plan level, what does the solution (5, 45) mean?",
      ],
      misconceptions: [
        ["Reading the crossing from one line only", "Feedback gives both lines' values at the clicked x."],
        ["Every system has exactly one solution", "Levels 7 and 8."],
        ["Trusting a rough graph estimate as exact", "Stage 3 requires exact fractions after the estimate."],
      ],
      exitTicket: {
        items: ["Solve: y = 3x − 1 and y = x + 5", "How many solutions: y = −2x + 4 and 2y + 4x = 8?", "Solve: x + y = 5 and 2x − y = 3"],
        answers: ["(3, 8)", "Infinitely many: the second is y = −2x + 4.", "(8/3, 7/3)"],
      },
    },
    answerKey(lv) {
      const ans = lv.sol === "none" ? "No solution" : lv.sol === "all" ? "Infinitely many" : (lv.frac ? "(" + lv.frac.map((f) => (f[0] < 0 ? M : "") + Math.abs(f[0]) + "/" + f[1]).join(", ") + ")" : pt(lv.sol));
      return { prompt: lv.l[0].text + "; " + lv.l[1].text, solution: Array.isArray(lv.sol) ? "Set the y-expressions equal (or substitute) and solve" : lv.sol === "none" ? "Same slope, different intercepts: parallel" : "Same line", answer: ans };
    },
  });
})();
