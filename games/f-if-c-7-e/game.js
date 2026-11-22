/* Exponential Slide · AI.F-IF.C.7.e */
(function () {
  const Alg = window.Alg, M = Alg.MINUS;
  // y = a·bˣ + c
  const LEVELS = [
    { stage: 1, coins: [[0, 1], [1, 2], [2, 4]], ans: [1, 2], r: [-3, 4, -1, 12], tip: "Set a and b in y = a · bˣ so the slide passes through every coin." },
    { stage: 1, coins: [[0, 3], [1, 6], [2, 12]], ans: [3, 2], r: [-3, 4, -1, 16], tip: "a is where the slide crosses the y-axis." },
    { stage: 1, coins: [[0, 2], [1, 6], [2, 18]], ans: [2, 3], r: [-3, 3, -1, 20], tip: "b is what you multiply by each step to the right." },
    { stage: 1, coins: [[0, 1], [1, 1.5], [2, 2.25]], ans: [1, 1.5], r: [-3, 4, -1, 6], tip: "b doesn't have to be a whole number." },
    { stage: 2, coins: [[0, 8], [1, 4], [2, 2]], ans: [8, 0.5], r: [-2, 5, -1, 16], end: [">", "0"], tip: "A decaying slide: each step multiplies by something less than 1." },
    { stage: 2, coins: [[0, 10], [1, 8], [2, 6.4]], ans: [10, 0.8], r: [-2, 6, -1, 16], end: [">", "0"], tip: "Losing 20% per step." },
    { stage: 2, show: [5, 0.6], r: [-4, 5, -1, 20], qs: [["The y-intercept is []", [5]], { c: "As x → −∞ (far left), y…", o: [["grows without bound", ""], ["approaches 0", "That happens to the right for b < 1."], ["approaches 5", "5 is the y-intercept, not a limit."]] }],
      tip: "Read the graph in both directions." },
    { stage: 2, show: [3, 2], r: [-5, 3, -1, 14], qs: [{ c: "Does y = 3 · 2ˣ ever equal 0?", o: [["No: 3 · 2ˣ is always positive", ""], ["Yes, when x is very negative", "It gets very close, but a positive number times positive powers of 2 is never 0."], ["Yes, at x = 0", "At x = 0, y = 3."]] },
      { c: "The line the graph gets closer and closer to is…", o: [["y = 0 (the floor)", ""], ["x = 0", "That's the y-axis; the graph crosses it at y = 3."], ["y = 3", "The graph passes through y = 3; it doesn't approach it."]] }], tip: "The floor the slide never touches." },
    { stage: 3, show: [1, 2, 1], r: [-5, 3, -1, 9], qs: [["y = 2ˣ + 1. The floor (horizontal asymptote) is y = []", [1]], ["The y-intercept is []", [2]]], tip: "Adding 1 lifts the whole slide, floor and all." },
    { stage: 3, show: [3, 0.5, -2], r: [-3, 5, -4, 14], qs: [["y = 3(0.5)ˣ − 2. The floor is y = []", [-2]], ["The y-intercept is []", [1]], { c: "As x → ∞, y…", o: [["approaches −2", ""], ["approaches 0", "The −2 moved the floor down."], ["grows without bound", "b = 0.5 < 1, so it decays toward the floor."]] }],
      tip: "A floor below zero." },
    { stage: 3, coins: [[0, 4], [1, 2.5], [2, 1.75]], ans: [3, 0.5, 1], floor: true, r: [-2, 6, -1, 8], tip: "Coins with a raised floor at y = 1: y = a · bˣ + c." },
    { stage: 3, show: [-1, 2, 0], r: [-4, 4, -12, 3], qs: [["y = −2ˣ. The y-intercept is []", [-1]], { c: "As x → ∞, y…", o: [["goes down without bound", ""], ["approaches 0", "That's what happens to the left."], ["grows without bound", "The minus sign flips the graph upside down."]] }],
      tip: "Last one: a slide flipped upside down." },
  ];
  const fn = (v) => (x) => v[0] * Math.pow(v[1], x) + (v[2] || 0);
  const eq = (v) => "y = " + (v[0] === 1 ? "" : v[0] === -1 ? M : Alg.num(v[0]) + " · ") + Alg.num(v[1]) + "ˣ" + (v[2] ? (v[2] < 0 ? " " + M + " " + Alg.num(-v[2]) : " + " + Alg.num(v[2])) : "");

  GameShell.register({
    slug: "f-if-c-7-e",
    title: "Exponential Slide",
    firstMove: "Read the coin height at x = 0 for a. Divide the next height by the first to find b, enter both, and press Slide.",
    subtitle: "Graph exponential functions; show intercepts and end behavior",
    stages: { 1: "Stage 1 · Growing slides", 2: "Stage 2 · Decay and the floor", 3: "Stage 3 · Moving the floor" },
    levels: LEVELS,
    help: {
      intro: "An exponential slide y = a · bˣ starts at a (the y-intercept) and multiplies by b with every step right.",
      steps: [
        "Set a and b (and c in stage 3) so the slide collects every coin, then press <b>Slide</b>.",
        "b > 1 grows; 0 < b < 1 decays.",
        "The slide gets closer and closer to a floor (the horizontal asymptote) but never touches it.",
        "Fewer wrong answers means more stars.",
      ],
      note: "In y = a · bˣ + c, the graph approaches the horizontal line y = c.",
    },
    load(lv, api) {
      const P = Plane.create({ xmin: lv.r[0], xmax: lv.r[1], ymin: lv.r[2], ymax: lv.r[3], xstep: 1, ystep: 1, ytick: lv.r[3] - lv.r[2] > 12 ? 2 : 1 });
      const head = api.h("div", { class: "stage-text" }, lv.show ? eq(lv.show) : "y = a · bˣ" + (lv.floor ? " + c" : ""));
      const svg = api.svg("0 0 900 460", "Graph");
      api.stage.append(head, svg);
      let v = lv.show || null, t = lv.show ? 1 : 0;
      function draw() {
        let s = P.grid();
        const floor = v ? v[2] || 0 : null;
        if (v) s += P.seg(P.xmin, floor, P.xmax, floor, { dash: "8 6", width: 2, color: "#a77d18" });
        if (v) s += P.curve(fn(v), { upto: t, color: "#5a78b8", width: 6 });
        (lv.coins || []).forEach((c) => {
          const got = v && Alg.close(fn(v)(c[0]), c[1], 1e-6) && t >= 1;
          const mark = v && t >= 1 ? (got ? "✓ " : "× ") : "";
          s += P.point(c[0], c[1], { r: 12, fill: got ? "#3f7d4c" : "#e7b84a",
            label: mark + "(" + Alg.num(c[0]) + ", " + Alg.num(c[1]) + ")" });
        });
        svg.innerHTML = s;
      }
      draw();
      const steps = [];
      if (lv.coins) {
        const n = lv.ans.length;
        steps.push({ type: "input", prompt: n === 3 ? "a = [], b = [], c = []" : "a = [], b = []", answers: lv.ans, button: "Slide",
          accept: (vals) => {
            if (vals[1] <= 0) return "An exponential growth factor must be positive. Divide one height by the previous height.";
            v = vals; t = 0; head.textContent = eq(vals);
            api.tween(0, 1, 900, (u) => { t = u; draw(); });
            const miss = lv.coins.find((c) => !Alg.close(fn(vals)(c[0]), c[1], 1e-6));
            if (!miss) return true;
            return "Missed (" + Alg.num(miss[0]) + ", " + Alg.num(miss[1]) + "): your slide gives y = " + Alg.num(Alg.round(fn(vals)(miss[0]), 3)) + " there. " +
              (miss[0] === 0 ? "At x = 0, bˣ = 1, so y = a" + (n === 3 ? " + c." : ".") : "Compare neighboring coins: what do you multiply by" + (n === 3 ? " (after subtracting the floor)?" : "?"));
          }, done: eq(lv.ans) });
        if (lv.end) steps.push({ type: "choice", prompt: "As x → ∞, y…", options: [{ label: "approaches 0", ok: true }, { label: "grows without bound", why: "b < 1: each step multiplies by less than 1." }, { label: "becomes negative", why: "A positive a times positive powers stays positive." }] });
      } else {
        lv.qs.forEach((q) => steps.push(Array.isArray(q) ? { type: "input", prompt: q[0], answers: q[1], hint: "At x = 0, bˣ = 1. The floor is the constant added on." } : { type: "choice", prompt: q.c, options: q.o.map((o, k) => ({ label: o[0], ok: k === 0, why: o[1] })), done: q.c + " " + q.o[0][0] }));
      }
      Steps.run(api, { steps, logTitle: "Your slide", result: () => ({ answer: eq(lv.ans || lv.show), check: lv.coins ? "Every coin collected ✓" : "Intercept and end behavior match the graph ✓" }) });
    },
    guide: {
      summary: "A 12-level game for graphing exponential functions. Students choose a and b (and a vertical shift c) so the curve passes through coins, and read intercepts, horizontal asymptotes and end behavior.",
      also: "<span class='code'>AI.F-LE.A.2</span> constructing exponential functions from points.",
      practices: "MP7 Look for and make use of structure · MP8 Look for and express regularity in repeated reasoning",
      evidence: "Hide the next coin and ask the student to predict its height. Listen for the factor between consecutive heights and an explanation of what happens when it is below one.",
      goals: [
        "Graph y = a · bˣ and identify its y-intercept and whether it grows or decays.",
        "Describe end behavior as x → ∞ and x → −∞ and identify the horizontal asymptote.",
        "Explain how adding c moves the asymptote, and how a negative a flips the graph.",
      ],
      howItWorks: "Coin levels show points on an exponential; students enter parameters and the slide draws, coloring collected coins green, with feedback about the first miss. Other levels show a graph and ask about intercepts, floors (asymptotes) and end behavior.",
      stageNotes: {
        1: { sees: "Growing exponentials.", builds: "a as the y-intercept, b as the growth factor." },
        2: { sees: "Decay, and questions about the floor.", builds: "0 < b < 1; asymptote y = 0; end behavior both ways." },
        3: { sees: "Vertical shifts and a reflection.", builds: "Asymptote y = c; y-intercept a + c; flipping with −1." },
      },
      discussion: [
        "Why is the y-intercept of y = a · bˣ always a?",
        "Why can y = 3 · 2ˣ never equal 0?",
        "How does y = 2ˣ + 1 compare with y = 2ˣ? What moved?",
      ],
      misconceptions: [
        ["Thinking an exponential eventually reaches 0", "Level 8 asks directly."],
        ["Confusing b with the y-intercept", "Coin feedback explains a vs. b."],
        ["Forgetting the shift when finding the intercept", "Levels 9–11."],
      ],
      exitTicket: {
        items: ["Write y = a · bˣ through (0, 5) and (1, 15).", "Describe the end behavior of y = 4(0.5)ˣ.", "What are the asymptote and y-intercept of y = 2ˣ − 3?"],
        answers: ["y = 5 · 3ˣ", "As x → ∞, y → 0; as x → −∞, y grows without bound.", "Asymptote y = −3; y-intercept −2."],
      },
    },
    answerKey(lv) {
      if (lv.coins) return { prompt: "Coins " + lv.coins.map((c) => "(" + c.join(", ") + ")").join(", "), solution: "a = y at x = 0" + (lv.floor ? " minus the floor" : "") + "; b = ratio of neighboring coins", answer: eq(lv.ans) };
      const vals = lv.qs.map((q) => (Array.isArray(q) ? q[0].replace("[]", Alg.num(q[1][0])) : q.c + " " + q.o[0][0]));
      return { prompt: eq(lv.show), solution: vals.join("; "), answer: vals.join("; ") };
    },
  });
})();
