/* Hoops · AI.F-IF.C.7.a */
(function () {
  const Alg = window.Alg, M = Alg.MINUS;
  const LEVELS = [
    { stage: 1, kind: "line", text: "y = 2x " + M + " 4", f: (x) => 2 * x - 4, ints: [-4, 2], tip: "A line is easy to graph from its two intercepts." },
    { stage: 1, kind: "line", text: "y = " + M + "x + 3", f: (x) => -x + 3, ints: [3, 3], tip: "Where does it cross each axis?" },
    { stage: 1, kind: "line", text: "3x + 2y = 6", f: (x) => (6 - 3 * x) / 2, ints: [3, 2], tip: "Standard form: set x = 0, then y = 0." },
    { stage: 1, kind: "line", text: "y = 0.5x + 1", f: (x) => 0.5 * x + 1, ints: [1, -2], tip: "The x-intercept can be negative." },
    { stage: 2, kind: "shot", desc: "The ball starts at (0, 0), lands at (8, 0), and peaks at a height of 4.", start: [0, 0], ans: [-0.25, 4, 4], hoop: [6, 3], tip: "Write the path as y = a(x − h)² + k. The peak is the vertex (h, k)." },
    { stage: 2, kind: "shot", desc: "The ball leaves the hand at (0, 2) and peaks at (3, 6.5).", start: [0, 2], ans: [-0.5, 3, 6.5], hoop: [5, 4.5], tip: "Use the start point to find a." },
    { stage: 2, kind: "shot", desc: "The ball starts at (−2, 0), lands at (4, 0), and peaks at a height of 9.", start: [-2, 0], ans: [-1, 1, 9], hoop: [3, 5], tip: "The peak is halfway between where it starts and lands." },
    { stage: 2, kind: "shot", desc: "The ball starts at (0, 1) and peaks at (4, 9).", start: [0, 1], ans: [-0.5, 4, 9], hoop: [6, 7], tip: "Last shot of the stage." },
    { stage: 3, kind: "std", P: [1, -6, 5], tip: "Standard form hides the vertex: x = −b/(2a). Find the key features, then graph." },
    { stage: 3, kind: "std", P: [-1, 4, 5], tip: "This one opens down: a maximum." },
    { stage: 3, kind: "std", P: [2, 4, -6], tip: "Factor out the 2 to find the zeros." },
    { stage: 3, kind: "std", P: [-2, 8, 0], tip: "Last one: no constant term." },
  ];
  const pform = (a, h, k) => "y = " + (a === 1 ? "" : a === -1 ? M : Alg.num(a)) + "(x " + (h < 0 ? "+ " + Alg.num(-h) : M + " " + Alg.num(h)) + ")² " + (k < 0 ? M + " " + Alg.num(-k) : "+ " + Alg.num(k));
  const feats = (P) => { const [a, b, c] = P; const h = -b / (2 * a), k = Alg.polyEval(P, h), d = b * b - 4 * a * c; const r1 = (-b - Math.sqrt(d)) / (2 * a), r2 = (-b + Math.sqrt(d)) / (2 * a); return { h, k, z: [r1, r2].sort((p, q) => p - q), c }; };

  GameShell.register({
    slug: "f-if-c-7-a",
    title: "Hoops",
    subtitle: "Graph lines and parabolas; show intercepts, maximums and minimums",
    stages: { 1: "Stage 1 · Lines from intercepts", 2: "Stage 2 · Shoot with vertex form", 3: "Stage 3 · Features from standard form" },
    levels: LEVELS,
    help: {
      intro: "Every graph has landmarks: where it crosses the axes, and for a parabola, its highest or lowest point (the <b>vertex</b>).",
      steps: [
        "Stage 1: find a line's intercepts; the line draws through them.",
        "Stage 2: build the ball's path y = a(x − h)² + k from the description, then shoot. It scores only if your parabola is right.",
        "Stage 3: find the vertex, maximum or minimum, zeros and y-intercept from standard form.",
        "Fewer misses means more stars.",
      ],
      note: "The vertex of y = ax² + bx + c is at x = −b/(2a).",
    },
    load(lv, api) {
      const P = lv.kind === "line" ? Plane.create({ xmin: -6, xmax: 6, ymin: -6, ymax: 6 })
        : lv.kind === "shot" ? Plane.create({ xmin: -3, xmax: 9, ymin: -1, ymax: 10 }) : Plane.create({ xmin: -5, xmax: 7, ymin: -10, ymax: 10, ytick: 2 });
      const head = api.h("div", { class: "stage-text", style: { fontSize: lv.desc ? "21px" : "28px" } }, lv.desc || (lv.kind === "std" ? "y = " + Alg.fmtPoly(lv.P) : lv.text));
      const svg = api.svg("0 0 900 460", "Graph");
      api.stage.append(head, svg);
      let shown = null, t = 0, marks = [];
      const hoop = (x, y) => '<g pointer-events="none"><ellipse cx="' + P.X(x) + '" cy="' + P.Y(y) + '" rx="22" ry="7" fill="none" stroke="#c8553d" stroke-width="4"/><line x1="' + (P.X(x) + 22) + '" y1="' + P.Y(y) + '" x2="' + (P.X(x) + 30) + '" y2="' + (P.Y(y) - 40) + '" stroke="#23262d" stroke-width="3"/></g>';
      function draw() {
        let s = P.grid();
        if (lv.kind === "shot") { s += hoop(lv.hoop[0], lv.hoop[1]); s += P.point(lv.start[0], lv.start[1], { r: 7, fill: "#6b8f5e", label: "start" }); }
        if (shown) {
          const from = lv.kind === "shot" ? lv.start[0] : P.xmin, to = lv.kind === "shot" ? P.xmax : P.xmax;
          s += P.curve(shown, { from, to: from + (to - from) * t, color: "#5a78b8" });
          if (lv.kind === "shot" && t > 0) { const bx = from + (to - from) * t; s += '<circle cx="' + P.X(bx) + '" cy="' + P.Y(shown(bx)) + '" r="11" fill="#e78a2e" stroke="#23262d" stroke-width="2.5" pointer-events="none"/>'; }
        }
        marks.forEach((m) => (s += P.point(m[0], m[1], { r: 8, label: "(" + Alg.num(Alg.round(m[0], 2)) + ", " + Alg.num(Alg.round(m[1], 2)) + ")" })));
        svg.innerHTML = s;
      }
      draw();
      const reveal = (f) => { shown = f; api.tween(0, 1, 900, (u) => { t = u; draw(); }); };
      const steps = [];
      if (lv.kind === "line") {
        steps.push({ type: "input", prompt: "y-intercept (set x = 0): y = []", answers: [lv.ints[0]], hint: "Substitute x = 0.", onDone: () => { marks.push([0, lv.ints[0]]); draw(); } });
        steps.push({ type: "input", prompt: "x-intercept (set y = 0): x = []", answers: [lv.ints[1]], hint: "Substitute y = 0 and solve for x.", onDone: () => { marks.push([lv.ints[1], 0]); reveal(lv.f); } });
      } else if (lv.kind === "shot") {
        const [a, h, k] = lv.ans;
        steps.push({ type: "input", prompt: "Vertex (the peak): h = [], k = []", answers: [h, k], hint: "The peak's coordinates. If you know where it starts and lands, the peak is halfway between.",
          onDone: () => { marks.push([h, k]); draw(); } });
        steps.push({ type: "input", prompt: "Make it pass through the start (" + Alg.num(lv.start[0]) + ", " + Alg.num(lv.start[1]) + "): a = []", answers: [a],
          hint: "Substitute the start point into y = a(x − " + Alg.num(h) + ")² + " + Alg.num(k) + " and solve for a.", onDone: () => reveal((x) => a * (x - h) * (x - h) + k), done: pform(a, h, k) });
        steps.push({ type: "choice", prompt: "Shoot! Does the ball go through the hoop at (" + lv.hoop.join(", ") + ")?", options: [
          { label: "Yes: " + pform(a, h, k).replace("y = ", "") + " gives y = " + Alg.num(lv.hoop[1]) + " at x = " + lv.hoop[0], ok: true }, { label: "No", why: "Substitute x = " + lv.hoop[0] + " into your path and compare with " + lv.hoop[1] + "." }] });
      } else {
        const F = feats(lv.P), a = lv.P[0];
        steps.push({ type: "input", prompt: "Vertex: x = −b/(2a) = []", answers: [F.h], hint: "b = " + Alg.num(lv.P[1]) + " and a = " + Alg.num(a) + "." });
        steps.push({ type: "input", prompt: "The " + (a > 0 ? "minimum" : "maximum") + " value is y = []", answers: [F.k], hint: "Substitute x = " + Alg.num(F.h) + " into the equation.", onDone: () => { marks.push([F.h, F.k]); draw(); } });
        steps.push({ type: "input", prompt: "Zeros (x-intercepts): x = [] and x = []", answers: F.z, unordered: true, hint: "Factor, or use the quadratic formula.", onDone: () => { F.z.forEach((z) => marks.push([z, 0])); draw(); } });
        steps.push({ type: "input", prompt: "y-intercept: y = []", answers: [F.c], hint: "Set x = 0.", onDone: () => { marks.push([0, F.c]); reveal((x) => Alg.polyEval(lv.P, x)); } });
      }
      Steps.run(api, { steps, logTitle: "Landmarks", result: () => ({
        answer: lv.kind === "line" ? lv.text : lv.kind === "shot" ? pform(...lv.ans) : "Vertex (" + Alg.num(feats(lv.P).h) + ", " + Alg.num(feats(lv.P).k) + ")",
        check: lv.kind === "shot" ? "Swish ✓" : "The graph passes through every landmark ✓" }) });
    },
    guide: {
      summary: "A 12-level game for graphing linear and quadratic functions by their key features: intercepts for lines, vertex form for basketball shots, and vertex, extreme value, zeros and y-intercept from standard form.",
      also: "<span class='code'>AI.F-IF.C.8.a</span> using forms of a quadratic to reveal features.",
      practices: "MP7 Look for and make use of structure · MP4 Model with mathematics",
      goals: [
        "Graph a line from its intercepts.",
        "Write y = a(x − h)² + k from a vertex and a point, and interpret it as a path.",
        "Find the vertex, maximum or minimum, zeros and y-intercept of y = ax² + bx + c and graph it.",
      ],
      howItWorks: "Each landmark the student finds is marked on the grid; the graph draws once enough is known. In stage 2 the ball flies along the student's parabola toward a hoop that lies on the correct path.",
      stageNotes: {
        1: { sees: "Lines in slope-intercept and standard form.", builds: "Intercepts as quick graphing landmarks." },
        2: { sees: "Basketball shots described in words.", builds: "Vertex form; finding a from a point." },
        3: { sees: "Quadratics in standard form.", builds: "x = −b/2a; max vs. min; zeros; y-intercept." },
      },
      discussion: [
        "In stage 2, why is the peak halfway between where the ball starts and lands (when both are at height 0)?",
        "How does the sign of a tell you whether there's a maximum or minimum?",
        "Why is the y-intercept of y = ax² + bx + c always c?",
      ],
      misconceptions: [
        ["Mixing up x- and y-intercepts", "Each intercept is asked for separately with a hint."],
        ["Sign of h in (x − h)²", "Shots with h = 1, 3, 4 and the start point check."],
        ["Vertex x = b/2a", "Stage 3 hints restate −b/(2a)."],
      ],
      exitTicket: {
        items: ["Find the intercepts of 2x − 5y = 10.", "A ball starts at (0, 0) and peaks at (5, 10). Write its path.", "Find the vertex and zeros of y = x² + 2x − 8."],
        answers: ["x-intercept 5, y-intercept −2.", "y = −0.4(x − 5)² + 10", "Vertex (−1, −9); zeros −4 and 2."],
      },
    },
    answerKey(lv) {
      if (lv.kind === "line") return { prompt: lv.text, solution: "y-intercept " + Alg.num(lv.ints[0]) + ", x-intercept " + Alg.num(lv.ints[1]), answer: "(0, " + Alg.num(lv.ints[0]) + ") and (" + Alg.num(lv.ints[1]) + ", 0)" };
      if (lv.kind === "shot") return { prompt: lv.desc, solution: "Vertex (" + lv.ans[1] + ", " + lv.ans[2] + "); a from the start point", answer: pform(...lv.ans) };
      const F = feats(lv.P);
      return { prompt: "y = " + Alg.fmtPoly(lv.P), solution: "Vertex x = " + Alg.num(F.h) + "; " + (lv.P[0] > 0 ? "min " : "max ") + Alg.num(F.k) + "; zeros " + F.z.map(Alg.num).join(", ") + "; y-intercept " + Alg.num(F.c),
        answer: "(" + Alg.num(F.h) + ", " + Alg.num(F.k) + ")" };
    },
  });
})();
