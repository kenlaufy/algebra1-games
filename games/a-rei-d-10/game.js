/* Star Map · AI.A-REI.D.10 */
(function () {
  const Alg = window.Alg, M = Alg.MINUS;
  // eq: { text, test(x, y), f (for drawing y = f(x)) or circle r2 }, need = number of stars to light
  const LEVELS = [
    { stage: 1, text: "y = 2x + 1", test: (x, y) => y === 2 * x + 1, f: (x) => 2 * x + 1, need: 4, r: [-5, 5, -6, 10], tip: "Light up 4 stars whose coordinates make the equation true." },
    { stage: 1, text: "y = " + M + "x + 3", test: (x, y) => y === -x + 3, f: (x) => -x + 3, need: 4, r: [-5, 6, -4, 8], tip: "Pick an x, work out y, then click that point." },
    { stage: 1, text: "x + 2y = 6", test: (x, y) => x + 2 * y === 6, f: (x) => (6 - x) / 2, need: 4, r: [-4, 8, -3, 6], tip: "Standard form. Try x = 0, 2, 4, ..." },
    { stage: 1, text: "y = 3", test: (x, y) => y === 3, f: () => 3, need: 4, r: [-5, 5, -3, 6], tip: "Every point with y = 3, whatever x is." },
    { stage: 2, text: "y = x² " + M + " 3", test: (x, y) => y === x * x - 3, f: (x) => x * x - 3, need: 5, r: [-4, 4, -4, 10], tip: "Curves are made of solutions too." },
    { stage: 2, text: "y = 2ˣ", test: (x, y) => x >= 0 && y === Math.pow(2, x), f: (x) => Math.pow(2, x), need: 4, r: [-3, 5, -1, 17], step: [1, 1], tick: [1, 2], tip: "Which whole-number points work? Watch how fast it grows." },
    { stage: 2, text: "x² + y² = 25", test: (x, y) => x * x + y * y === 25, circle: 25, need: 6, r: [-7, 7, -6, 6], tip: "A circle. Find 6 whole-number points on it (try 3, 4 and 5)." },
    { stage: 2, text: "y = |x|", test: (x, y) => y === Math.abs(x), f: (x) => Math.abs(x), need: 5, r: [-5, 5, -2, 6], tip: "A V shape." },
    { stage: 3, text: "y = 2x + 1", quiz: [["(3, 7)", true, "2(3) + 1 = 7 ✓"], ["(" + M + "2, " + M + "5)", false, "2(−2) + 1 = −3, not −5"], ["(0.5, 2)", true, "2(0.5) + 1 = 2 ✓"]],
      tip: "No graph this time. Decide whether each point is on the line by substituting." },
    { stage: 3, text: "y = x² " + M + " 3", quiz: [["(" + M + "2, 1)", true, "(−2)² − 3 = 1 ✓"], ["(1, " + M + "1)", false, "1² − 3 = −2, not −1"], ["(3, 6)", true, "9 − 3 = 6 ✓"]],
      tip: "Substitute each point." },
    { stage: 3, text: "2x + 3y = 12", quiz: [["(3, 2)", true, "6 + 6 = 12 ✓"], ["(1, 3)", false, "2 + 9 = 11, not 12"], ["(" + M + "3, 6)", true, "−6 + 18 = 12 ✓"]],
      tip: "Standard form: plug in both coordinates." },
    { stage: 3, text: "y = x² " + M + " 3", concept: true, tip: "Last one: what does the graph of an equation actually show?" },
  ];

  GameShell.register({
    slug: "a-rei-d-10",
    title: "Star Map",
    firstMove: "Pick an x, use the equation to find y, and tap that point. Light four different stars, then press Check stars.",
    subtitle: "The graph of an equation is the set of all its solutions",
    stages: { 1: "Stage 1 · Lines of stars", 2: "Stage 2 · Curves of stars", 3: "Stage 3 · On the graph or not?" },
    levels: LEVELS,
    help: {
      intro: "A point is a solution if its x and y make the equation true. The graph is <b>every</b> solution, all lit up.",
      steps: [
        "Click grid points to light stars. Click again to turn one off.",
        "Press <b>Check stars</b>. Stars that aren't solutions are explained, then the graph appears.",
        "In stage 3 there's no graph: decide whether each point is a solution by substituting.",
        "Fewer wrong stars means more stars for you.",
      ],
      note: "Every point on a graph is a solution, and every solution is a point on the graph.",
    },
    load(lv, api) {
      api.stage.appendChild(api.h("div", { class: "stage-text" }, lv.text));
      if (lv.quiz || lv.concept) {
        const steps = lv.concept ? [
          { type: "choice", prompt: "The point (2, 1) is on the graph of y = x² − 3. That means…", options: [
            { label: "x = 2 and y = 1 make the equation true", ok: true }, { label: "the graph passes near (2, 1)", why: "It's exactly on it: 2² − 3 = 1." }, { label: "x = 1 and y = 2 make it true", why: "x comes first: (x, y) = (2, 1)." }] },
          { type: "choice", prompt: "You find that x = 5, y = 22 makes y = x² − 3 true. What must be true about the point (5, 22)?", options: [
            { label: "It's on the graph, even if the picture doesn't show that far", ok: true }, { label: "It might not be on the graph", why: "The graph is the set of ALL solutions, so every solution is on it." }, { label: "It's on the graph only if it's a whole number", why: "Any solution is on the graph, whole number or not." }] },
          { type: "input", prompt: "Find the y-value that puts (−3, y) on the graph: y = []", answers: [6], hint: "Substitute x = −3: (−3)² − 3." },
        ] : lv.quiz.map((q) => ({ type: "choice", prompt: "Is " + q[0] + " a solution of " + lv.text + "?", options: [
          { label: "Yes, it's on the graph", ok: q[1], why: "Substitute: " + q[2] }, { label: "No, it's not on the graph", ok: !q[1], why: "Substitute: " + q[2] }], done: q[0] + ": " + q[2] }));
        Steps.run(api, { steps, logTitle: "Your reasoning", result: () => ({ answer: "Graph = all solutions of " + lv.text, check: "A point is on the graph exactly when it satisfies the equation ✓" }) });
        return;
      }
      const step = lv.step || [1, 1];
      const P = Plane.create({ xmin: lv.r[0], xmax: lv.r[1], ymin: lv.r[2], ymax: lv.r[3], xstep: step[0], ystep: step[1], xtick: (lv.tick || [1, 1])[0], ytick: (lv.tick || [1, lv.r[3] - lv.r[2] > 12 ? 2 : 1])[1] });
      const svg = api.svg("0 0 900 460", "Star map grid");
      api.stage.appendChild(svg);
      let stars = [], reveal = false;
      const star = (x, y, ok) => {
        const X = P.X(x), Y = P.Y(y), r = 13, pts = [];
        for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; pts.push((X + rr * Math.cos(a)).toFixed(1) + "," + (Y + rr * Math.sin(a)).toFixed(1)); }
        return '<polygon points="' + pts.join(" ") + '" fill="' + (ok === false ? "#c8553d" : "#e7b84a") + '" stroke="#23262d" stroke-width="2" pointer-events="none"/>';
      };
      function draw() {
        let s = '<rect width="900" height="460" rx="12" fill="#22304a"/>' + P.grid().replace('fill="#fffdf7"', 'fill="#fffdf7" fill-opacity="0.94"');
        if (reveal) {
          if (lv.circle) { const R = Math.sqrt(lv.circle); s += P.curve((x) => Math.sqrt(Math.max(0, lv.circle - x * x)), { from: -R, to: R }) + P.curve((x) => -Math.sqrt(Math.max(0, lv.circle - x * x)), { from: -R, to: R }); }
          else s += P.curve(lv.f);
        }
        stars.forEach((p) => (s += star(p[0], p[1], reveal ? lv.test(p[0], p[1]) : null)));
        s += P.hitArea();
        svg.innerHTML = s;
        svg.setAttribute("aria-label", "Grid. Lit stars: " + (stars.map((p) => "(" + p[0] + ", " + p[1] + ")").join(", ") || "none"));
      }
      svg.addEventListener("click", (e) => {
        if (!e.target.closest("[data-plane]")) return;
        const q = P.fromEvent(e, svg, step[0], step[1]);
        const k = stars.findIndex((p) => p[0] === q.x && p[1] === q.y);
        if (k >= 0) stars.splice(k, 1); else stars.push([q.x, q.y]);
        reveal = false; draw();
      });
      draw();
      const sols = [];
      for (let x = lv.r[0]; x <= lv.r[1]; x += step[0]) for (let y = lv.r[2]; y <= lv.r[3]; y += step[1]) if (lv.test(x, y)) sols.push([x, y]);
      Steps.run(api, {
        steps: [{ type: "click", button: "Check stars", prompt: "Light " + lv.need + " stars that are solutions of " + lv.text + ".",
          check: () => {
            if (stars.length < lv.need) return "Light " + (lv.need - stars.length) + " more star" + (lv.need - stars.length === 1 ? "" : "s") + ".";
            const bad = stars.find((p) => !lv.test(p[0], p[1]));
            reveal = true; draw();
            if (bad) return "(" + Alg.num(bad[0]) + ", " + Alg.num(bad[1]) + ") isn't a solution: substitute x = " + Alg.num(bad[0]) + " and y = " + Alg.num(bad[1]) + " into " + lv.text + " and it's false.";
            return true;
          }, autoplay: () => { stars = sols.slice(0, lv.need).map((p) => p.slice()); draw(); }, done: "Stars on " + lv.text },
        ],
        logTitle: "Your stars",
        result: () => ({ answer: "Every star is a solution of " + lv.text, lines: ["Stars: " + stars.map((p) => "(" + Alg.num(p[0]) + ", " + Alg.num(p[1]) + ")").join(", ")],
          check: "The graph passes through every star ✓" }) });
    },
    guide: {
      summary: "A 12-level game about what a graph is. Students light up points that satisfy an equation, see the graph appear through them, and decide without a graph whether points are solutions.",
      also: "<span class='code'>AI.F-IF.A.1</span> the graph of f as the graph of y = f(x).",
      practices: "MP2 Reason abstractly and quantitatively · MP6 Attend to precision",
      evidence: "Give the student a point close to the line. Ask them to substitute its coordinates and use the result to accept or reject it.",
      goals: [
        "Explain that the graph of an equation in two variables is the set of all its solutions.",
        "Find solutions by choosing x and computing y, for lines, parabolas, exponentials, a circle and an absolute value.",
        "Show that a point is (or isn't) on a graph by substituting its coordinates.",
      ],
      howItWorks: "Stages 1 and 2 show an equation and an empty grid. Students light stars at points they think are solutions and press Check; the graph appears through the solutions and any non-solution star turns red with a substitution explaining why. Stage 3 removes the graph: students judge points by substituting, and the last level asks about the meaning of a graph.",
      stageNotes: {
        1: { sees: "Lines in slope-intercept and standard form, and y = 3.", builds: "Generating solutions; horizontal lines." },
        2: { sees: "A parabola, an exponential, a circle and an absolute value.", builds: "Graphs of non-linear equations as solution sets." },
        3: { sees: "No graph.", builds: "Substitution as proof; points beyond the window." },
      },
      discussion: [
        "Why is every point on the line y = 2x + 1 a solution, even ones between grid points?",
        "How many solutions does y = 3 have? How does the graph show that?",
        "Is (5, 22) on the graph of y = x² − 3 even though the picture doesn't reach it?",
      ],
      misconceptions: [
        ["Swapping x and y in an ordered pair", "Red stars come with a substitution showing the mistake."],
        ["Only whole-number points count", "Stage 3 includes (0.5, 2)."],
        ["The graph is only the part you can see", "The last level asks about (5, 22)."],
      ],
      exitTicket: {
        items: ["Give three solutions of y = −2x + 5.", "Is (4, 13) on the graph of y = x² − 3? Show how you know.", "Is (2, 3) on the graph of 3x − y = 4?"],
        answers: ["For example (0, 5), (1, 3), (2, 1).", "Yes: 4² − 3 = 13.", "No: 3(2) − 3 = 3, not 4."],
      },
    },
    answerKey(lv) {
      if (lv.quiz) return { prompt: lv.text, solution: lv.quiz.map((q) => q[0] + ": " + q[2]).join("; "), answer: lv.quiz.map((q) => q[0] + (q[1] ? " yes" : " no")).join(", ") };
      if (lv.concept) return { prompt: lv.text, solution: "A point is on the graph exactly when it satisfies the equation; (−3, 6)", answer: "y = 6" };
      const sols = [];
      for (let x = lv.r[0]; x <= lv.r[1]; x++) for (let y = lv.r[2]; y <= lv.r[3]; y++) if (lv.test(x, y)) sols.push("(" + Alg.num(x) + ", " + Alg.num(y) + ")");
      return { prompt: lv.text, solution: "Light any " + lv.need + " of: " + sols.slice(0, 8).join(", ") + (sols.length > 8 ? ", …" : ""), answer: lv.need + " solutions" };
    },
  });
})();
