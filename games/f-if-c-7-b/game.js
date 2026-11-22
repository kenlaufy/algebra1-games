/* Track Builder · AI.F-IF.C.7.b */
(function () {
  const Alg = window.Alg, M = Alg.MINUS;
  const abs = (a, h, k) => (x) => a * Math.abs(x - h) + k;
  const parking = (x) => (x <= 0 ? 0 : 3 * Math.ceil(x - 1e-9));
  const shipping = (w) => (w <= 0 ? 0 : 5 + 3 * (Math.ceil(w - 1e-9) - 1));
  const LEVELS = [
    { stage: 1, kind: "abs", pts: [[2, 1], [4, 3], [0, 3]], ans: [1, 2, 1], ask: "hk", tip: "Build a V-shaped track y = |x − h| + k through the flags. The corner is (h, k)." },
    { stage: 1, kind: "abs", pts: [[-3, 0], [-1, 2], [-5, 2]], ans: [1, -3, 0], ask: "hk", tip: "Careful: y = |x − h|, so a corner at x = −3 means h = −3." },
    { stage: 1, kind: "abs", pts: [[1, -2], [2, 0], [0, 0]], ans: [2, 1, -2], ask: "ahk", tip: "A steeper V: the slope of each side is a." },
    { stage: 1, kind: "abs", pts: [[0, 4], [2, 2], [-2, 2]], ans: [-1, 0, 4], ask: "ahk", tip: "This track is upside down." },
    { stage: 2, kind: "step", f: parking, ctx: "A garage charges $3 for each hour or part of an hour.", r: [0, 5, 0, 16, 1, 3],
      qs: [["Parking for half an hour costs $[]", [3]], ["Exactly 1 hour costs $[]", [3]], ["2.5 hours costs $[]", [9]]], tip: "Step functions jump. Read each price carefully." },
    { stage: 2, kind: "step", f: parking, ctx: "Same garage. Look at the graph at x = 1 and x = 2.", r: [0, 5, 0, 16, 1, 3], dots: true,
      qs: [{ c: "At exactly x = 1 hour, which dot is filled (closed)?", o: [["The one on the $3 step", ""], ["The one on the $6 step", "At exactly 1 hour you've parked for 1 hour, not part of a second hour."], ["Both", "A function has exactly one output at each input."]] },
        { c: "Why must one end of each step be open?", o: [["So each input has only one output", ""], ["To make the graph look nicer", "It's about the definition of a function."], ["Because the price is unknown there", "The price is known; it just can't be two prices at once."]] }],
      tip: "Open and closed dots matter." },
    { stage: 2, kind: "step", f: shipping, ctx: "Shipping costs $5 up to 1 lb, $8 up to 2 lb, $11 up to 3 lb, and so on.", r: [0, 5, 0, 20, 1, 2],
      qs: [["A 2.4 lb box costs $[]", [11]], ["A 2 lb box costs $[]", [8]], ["The heaviest box you can ship for $8 weighs [] lb", [2]]], tip: "Read the steps." },
    { stage: 2, kind: "step", f: (x) => Math.floor(x) + 1, ctx: "f(x) is shown on the graph: each step starts with a closed dot on the left.", r: [0, 5, 0, 7, 1, 1], dots: true, left: true,
      qs: [["f(3) = []", [4]], ["f(2.99) = []", [3]], ["f(0.5) = []", [1]]], tip: "Which step does each input land on?" },
    { stage: 3, kind: "pw", text: "f(x) = { x + 2 if x < 1;  " + M + "x + 4 if x ≥ 1 }", f: (x) => (x < 1 ? x + 2 : -x + 4), r: [-4, 6, -3, 6, 1, 1],
      qs: [["f(" + M + "1) = []", [1]], ["f(1) = []", [3]], ["f(3) = []", [1]]], tip: "Piecewise: first decide which piece an input uses." },
    { stage: 3, kind: "build", text: "f(x) = { 2x if x < 2;  ??? if x ≥ 2 }", r: [-2, 7, -2, 8, 1, 1], flags: [[2, 4], [5, 1]], ans: [-1, 6],
      tip: "Build the second piece so the track continues from (2, 4) to (5, 1)." },
    { stage: 3, kind: "pw", text: "f(x) = { 3 if x ≤ 0;  x + 1 if x > 0 }", f: (x) => (x <= 0 ? 3 : x + 1), r: [-4, 5, -2, 7, 1, 1], jump: true,
      qs: [["f(0) = []", [3]], { c: "At x = 0, the piece y = x + 1 starts at (0, 1). That dot is…", o: [["Open, because x = 0 uses the other piece", ""], ["Closed", "f(0) = 3, so (0, 1) is not on the graph."]] }, ["f(2) = []", [3]]],
      tip: "A jump: the pieces don't meet." },
    { stage: 3, kind: "pw", text: "y = |x " + M + " 2|  as a piecewise function", f: (x) => Math.abs(x - 2), r: [-3, 7, -2, 6, 1, 1],
      qs: [{ c: "For x ≥ 2, |x − 2| equals…", o: [["x " + M + " 2", ""], [M + "(x " + M + " 2)", "When x ≥ 2, x − 2 is already non-negative."], ["x + 2", "Inside is x − 2."]] },
        { c: "For x < 2, |x − 2| equals…", o: [[M + "x + 2", ""], ["x " + M + " 2", "For x = 0 that gives −2, but |0 − 2| = 2."], ["x + 2", "Check x = 0: |0 − 2| = 2, and −0 + 2 = 2."]] }],
      tip: "Last one: an absolute value is really two pieces." },
  ];

  GameShell.register({
    slug: "f-if-c-7-b",
    title: "Track Builder",
    subtitle: "Graph absolute value, step and piecewise-defined functions",
    stages: { 1: "Stage 1 · V-shaped tracks", 2: "Stage 2 · Step functions", 3: "Stage 3 · Piecewise tracks" },
    levels: LEVELS,
    help: {
      intro: "Some functions come in <b>pieces</b>: a V-shape, a staircase, or different rules on different intervals.",
      steps: [
        "Stage 1: build y = a|x − h| + k through the flags. The corner is (h, k); a is the slope of the right side.",
        "Stage 2: read step functions. Closed dots are included, open dots aren't.",
        "Stage 3: decide which piece an input uses, then evaluate or build the piece.",
        "Fewer wrong answers means more stars.",
      ],
      note: "A function has exactly one output for each input, so steps need one open end.",
    },
    load(lv, api) {
      const r = lv.r || [-6, 6, -4, 7, 1, 1];
      const P = Plane.create({ xmin: r[0], xmax: r[1], ymin: r[2], ymax: r[3], xstep: r[4], ystep: r[5], ytick: r[5] * (r[3] - r[2] > 12 ? 2 : 1) });
      if (lv.ctx || lv.text) api.stage.appendChild(api.h("div", { class: "stage-text", style: { fontSize: "21px" } }, lv.ctx || lv.text));
      const svg = api.svg("0 0 900 460", "Track graph");
      api.stage.appendChild(svg);
      let track = lv.kind === "step" || lv.kind === "pw" ? lv.f : null, extra = null;
      const flag = (x, y) => '<g pointer-events="none" transform="translate(' + P.X(x) + " " + P.Y(y) + ')"><line x1="0" y1="0" x2="0" y2="-30" stroke="#23262d" stroke-width="3"/><path d="M 0 -30 L 18 -24 L 0 -18 Z" fill="#c8553d" stroke="#23262d" stroke-width="2"/><circle r="5" fill="#23262d"/></g>';
      function stepDraw(f) {
        let s = "";
        for (let n = 0; n < r[1]; n++) {
          const y = lv.left ? f(n) : f(n + 0.5);
          s += P.seg(n, y, n + 1, y, { color: "#5a78b8", width: 5 });
          if (lv.dots || true) {
            s += P.point(n, y, { r: 6, fill: lv.left ? "#5a78b8" : "#fff" });
            s += P.point(n + 1, y, { r: 6, fill: lv.left ? "#fff" : "#5a78b8" });
          }
        }
        return s;
      }
      function draw() {
        let s = P.grid();
        (lv.pts || lv.flags || []).forEach((p) => (s += flag(p[0], p[1])));
        if (lv.kind === "step") s += stepDraw(lv.f);
        else if (lv.kind === "pw") {
          if (lv.jump) { s += P.curve(() => 3, { to: 0, color: "#5a78b8" }) + P.point(0, 3, { r: 6, fill: "#5a78b8" }) + P.curve((x) => x + 1, { from: 0, color: "#5a78b8" }) + P.point(0, 1, { r: 6, fill: "#fff" }); }
          else s += P.curve(lv.f, { color: "#5a78b8" });
        } else if (lv.kind === "build") {
          s += P.curve((x) => 2 * x, { to: 2, color: "#5a78b8" }) + P.point(2, 4, { r: 6, fill: "#fff" });
          if (extra) s += P.curve(extra, { from: 2, color: "#6b8f5e" }) + P.point(2, extra(2), { r: 6, fill: "#6b8f5e" });
        } else if (track) s += P.curve(track, { color: "#5a78b8" });
        svg.innerHTML = s;
      }
      draw();
      const steps = [];
      if (lv.kind === "abs") {
        const [a, h, k] = lv.ans;
        if (lv.ask === "hk") steps.push({ type: "input", prompt: "y = |x − h| + k with h = [], k = []", answers: [h, k], hint: "The corner of the V is at (h, k). Watch the sign of h.",
          onDone: () => { track = abs(a, h, k); draw(); }, done: "y = |x " + (h < 0 ? "+ " + Alg.num(-h) : M + " " + h) + "| " + (k < 0 ? M + " " + Alg.num(-k) : "+ " + k) });
        else steps.push({ type: "input", prompt: "y = a|x − h| + k with a = [], h = [], k = []", answers: [a, h, k], hint: "Corner (h, k). Then a is the slope from the corner to the flag on the right.",
          onDone: () => { track = abs(a, h, k); draw(); }, done: "y = " + (a === 1 ? "" : a === -1 ? M : Alg.num(a)) + "|x " + (h < 0 ? "+ " + Alg.num(-h) : M + " " + h) + "| " + (k < 0 ? M + " " + Alg.num(-k) : "+ " + k) });
      } else if (lv.kind === "build") {
        steps.push({ type: "input", prompt: "Second piece: y = []x + []", answers: lv.ans, hint: "Slope from (2, 4) to (5, 1) is (1 − 4)/(5 − 2). Then use one point to find the intercept.",
          onDone: () => { extra = (x) => lv.ans[0] * x + lv.ans[1]; draw(); }, done: "f(x) = 2x for x < 2; −x + 6 for x ≥ 2" });
        steps.push({ type: "input", prompt: "Check: f(2) = [] and f(4) = []", answers: [4, 2], hint: "x = 2 uses the second piece (x ≥ 2)." });
      } else {
        lv.qs.forEach((q) => steps.push(Array.isArray(q) ? { type: "input", prompt: q[0], answers: q[1], hint: lv.kind === "step" ? "Find the step that input lands on. At a jump, check which dot is closed." : "Decide which piece the input belongs to first." }
          : { type: "choice", prompt: q.c, options: q.o.map((o, k) => ({ label: o[0], ok: k === 0, why: o[1] })), done: q.c + " " + q.o[0][0] }));
      }
      Steps.run(api, { steps, logTitle: "Your track", result: () => ({ answer: lv.kind === "abs" ? "Track built" : lv.kind === "build" ? "f(x) = 2x (x < 2); −x + 6 (x ≥ 2)" : "All values read", check: "Every flag and value matches the graph ✓" }) });
    },
    guide: {
      summary: "A 12-level game for absolute value, step and piecewise functions. Students build absolute-value tracks through flags, read step functions in pricing contexts with careful attention to open and closed endpoints, and evaluate and build piecewise functions.",
      also: "<span class='code'>AI.F-BF.B.3</span> transformations of |x|.",
      practices: "MP6 Attend to precision · MP7 Look for and make use of structure",
      goals: [
        "Graph y = a|x − h| + k and identify its vertex and slopes.",
        "Interpret and graph step functions, including open and closed endpoints.",
        "Evaluate piecewise-defined functions, build a missing piece, and write |x − h| as a piecewise function.",
      ],
      howItWorks: "Stage 1 shows flags; students enter a, h and k and the V-track draws through them. Stage 2 graphs parking and shipping prices as step functions and asks for values at and between jumps. Stage 3 evaluates piecewise functions, builds a second piece to continue a track, handles a jump, and rewrites an absolute value.",
      stageNotes: {
        1: { sees: "Flags for V-shaped tracks.", builds: "Vertex (h, k), sign of h, slope a, opening down." },
        2: { sees: "Staircase graphs with dots.", builds: "Evaluating step functions; open vs. closed endpoints." },
        3: { sees: "Piecewise rules and graphs.", builds: "Choosing the piece; continuity vs. jumps; absolute value as pieces." },
      },
      discussion: [
        "Why does y = |x + 3| have its corner at x = −3?",
        "At exactly 1 hour, why does the garage charge $3 and not $6?",
        "Why is |x − 2| = −x + 2 when x < 2?",
      ],
      misconceptions: [
        ["Sign of h in |x − h|", "Level 2's hint and feedback."],
        ["Filling both dots at a jump", "Level 6 ties open dots to the definition of a function."],
        ["Using the wrong piece at a boundary", "Levels 9–11 ask at x = 1, x = 2 and x = 0."],
      ],
      exitTicket: {
        items: ["Write the V with corner (−1, 2) and slopes ±1.", "Tickets cost $10 per person, groups of up to 4 per table, $5 per table. What do 6 people pay for tables?", "f(x) = x² if x < 0, 2x if x ≥ 0. Find f(−3) and f(3)."],
        answers: ["y = |x + 1| + 2", "6 people need 2 tables: $10 (plus $60 tickets = $70 total).", "f(−3) = 9, f(3) = 6"],
      },
    },
    answerKey(lv) {
      if (lv.kind === "abs") return { prompt: "Flags at " + lv.pts.map((p) => "(" + p.join(", ") + ")").join(", "), solution: "a = " + lv.ans[0] + ", h = " + lv.ans[1] + ", k = " + lv.ans[2], answer: "y = " + lv.ans[0] + "|x − (" + lv.ans[1] + ")| + " + lv.ans[2] };
      if (lv.kind === "build") return { prompt: lv.text, solution: "slope −1 through (2, 4)", answer: "y = −x + 6 for x ≥ 2" };
      const vals = lv.qs.map((q) => (Array.isArray(q) ? q[0].replace("[]", Alg.num(q[1][0])) : q.o[0][0]));
      return { prompt: lv.ctx || lv.text, solution: vals.join("; "), answer: vals.join("; ") };
    },
  });
})();
