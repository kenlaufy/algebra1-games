/* Graph Trimmer · AI.F-IF.B.5 */
(function () {
  const Alg = window.Alg, M = Alg.MINUS;
  const LEVELS = [
    { stage: 1, ctx: "h(n) is the number of person-hours it takes to assemble n engines in a factory.", f: (n) => 6 * n, r: [-4, 10, -20, 60, 1, 10], v: ["n", "h"],
      choice: [["The positive integers: 1, 2, 3, …", ""], ["All real numbers", "Can a factory assemble −2 engines, or 2.5 engines?"], ["0 ≤ n ≤ 10", "Nothing in the situation stops the factory at 10 engines."]], dom: { type: "int", from: 1 },
      tip: "The example from the standard: which inputs make sense?" },
    { stage: 1, ctx: "h(t) = −5t² + 20t is a ball's height (m), t seconds after it's thrown from the ground. It lands at t = 4.", f: (t) => -5 * t * t + 20 * t, r: [-2, 6, -40, 30, 1, 10], v: ["t", "h"],
      choice: [["0 ≤ t ≤ 4", ""], ["All real numbers", "Before t = 0 the ball hasn't been thrown; after t = 4 it's on the ground."], ["t ≥ 0", "After it lands at t = 4, the formula gives negative heights."]], dom: { type: "int-cont", from: 0, to: 4 },
      tip: "When does the model stop making sense?" },
    { stage: 1, ctx: "C(m) = 30m + 25 is the cost of a gym membership for m whole months.", f: (m) => 30 * m + 25, r: [-3, 12, -50, 400, 1, 50], v: ["m", "C"],
      choice: [["Whole numbers: 0, 1, 2, …", ""], ["All real numbers", "You can't buy −3 months or 1.7 months."], ["m > 0, any real number", "The gym only charges for whole months."]], dom: { type: "int", from: 0 },
      tip: "Whole months only." },
    { stage: 1, ctx: "A(s) = s² is the area of a square with side length s.", f: (s) => s * s, r: [-5, 5, -2, 26, 1, 5], v: ["s", "A"],
      choice: [["s > 0", ""], ["All real numbers", "A side length can't be negative."], ["Positive integers", "A side can be 2.5 cm long."]], dom: { type: "cont", from: 0 },
      tip: "Lengths can be fractions, but not negative." },
    { stage: 2, ctx: "Trim the ball model h(t) = −5t² + 20t to the times when the ball is in the air.", f: (t) => -5 * t * t + 20 * t, r: [-2, 6, -40, 30, 1, 10], v: ["t", "h"],
      trim: [0, 4], tip: "Type the first and last sensible inputs. The graph trims itself." },
    { stage: 2, ctx: "A fence: a rectangle with width w and length 20 − w. Area: A(w) = w(20 − w).", f: (w) => w * (20 - w), r: [-5, 25, -60, 120, 5, 20], v: ["w", "A"],
      trim: [0, 20], tip: "What widths make an actual rectangle? (The ends give zero area.)" },
    { stage: 2, ctx: "Coffee cools: T(t) = 70 + 130(0.9)ᵗ °F, t minutes after it's poured.", f: (t) => 70 + 130 * Math.pow(0.9, t), r: [-5, 30, 0, 300, 5, 50], v: ["t", "T"],
      trim: [0, null], tip: "Does this model have a natural end? (Leave the last box empty if not.)" },
    { stage: 2, ctx: "R(n) = 15n is the money from selling n tickets in a theater with 200 seats.", f: (n) => 15 * n, r: [-20, 240, -300, 3600, 20, 600], v: ["n", "R"],
      trim: [0, 200], tip: "The theater has a limit." },
    { stage: 3, ctx: "Graph the number of cars N in a parking lot at each hour h from 8 a.m. to 6 p.m.", choice: [["Separate dots, one per hour", ""], ["A smooth unbroken curve", "The question only asks about each hour, and you can't have half a car."]],
      tip: "Should the graph be dots or a line?" },
    { stage: 3, ctx: "f(x) = 2x + 1 with domain 0 ≤ x ≤ 5.", f: (x) => 2 * x + 1, r: [-1, 7, -2, 14, 1, 2], v: ["x", "y"], show: [0, 5],
      range: [[1, 11], "The range is all outputs: [] ≤ y ≤ []"], tip: "The domain controls the range." },
    { stage: 3, ctx: "The fence again: A(w) = w(20 − w) for 0 < w < 20.", f: (w) => w * (20 - w), r: [-5, 25, -60, 120, 5, 20], v: ["w", "A"], show: [0, 20],
      range: [[0, 100], "The range: [] < A ≤ [] square units"], tip: "What's the biggest area?" },
    { stage: 3, ctx: "The number of students absent from school each day, d days into the term.",
      choice: [["Dots at whole-number days, with whole-number heights", ""], ["A smooth line through the dots", "Day 2.5 and 3.7 absent students don't make sense."], ["Any real number of days", "Days are counted in whole numbers here."]],
      tip: "Last one: what does the domain look like?" },
  ];

  GameShell.register({
    slug: "f-if-b-5",
    title: "Graph Trimmer",
    firstMove: "Decide which numbers could count finished engines. Choose the matching set of inputs, then decide how to draw them.",
    subtitle: "Relate the domain of a function to its graph and its context",
    stages: { 1: "Stage 1 · Which inputs make sense?", 2: "Stage 2 · Trim the graph", 3: "Stage 3 · Dots, lines and ranges" },
    levels: LEVELS,
    help: {
      intro: "A formula doesn't know about the real world. The <b>domain</b> is the set of inputs that make sense, and the graph should only show those.",
      steps: [
        "Read the situation. Can the input be negative? A fraction? Is there a limit?",
        "Choose the domain, or type where the graph should start and end.",
        "Decide whether the graph should be separate dots or a solid line.",
        "Fewer wrong answers means more stars.",
      ],
      note: "Leave the \"end\" box empty if the model has no natural end.",
    },
    load(lv, api) {
      api.stage.appendChild(api.h("div", { class: "stage-text", style: { fontSize: "21px", lineHeight: 1.4 } }, lv.ctx));
      let P = null, svg = null, trim = lv.show || null, discrete = false;
      if (lv.f) {
        P = Plane.create({ xmin: lv.r[0], xmax: lv.r[1], ymin: lv.r[2], ymax: lv.r[3], xstep: lv.r[4], ystep: lv.r[5], xtick: lv.r[4] * ((lv.r[1] - lv.r[0]) / lv.r[4] > 12 ? 2 : 1), ytick: lv.r[5], xlabel: lv.v[0], ylabel: lv.v[1], h: 380 });
        svg = api.svg("0 0 900 380", "Graph");
        api.stage.appendChild(svg);
      }
      function draw() {
        if (!svg) return;
        let s = P.grid();
        if (!trim) s += P.curve(lv.f, { color: "#5a78b8" });
        else {
          s += P.curve(lv.f, { color: "#b8b0a0", width: 2, dash: "6 6" });
          if (discrete) for (let n = trim[0]; n <= Math.min(lv.r[1], trim[1] == null ? lv.r[1] : trim[1]); n += lv.r[4]) s += P.point(n, lv.f(n), { r: 6, fill: "#5a78b8" });
          else {
            s += P.curve(lv.f, { from: trim[0], to: trim[1] == null ? lv.r[1] : trim[1], color: "#5a78b8", width: 5 });
            s += P.point(trim[0], lv.f(trim[0]), { r: 7, fill: lv.open ? "#fff" : "#5a78b8" });
            if (trim[1] != null) s += P.point(trim[1], lv.f(trim[1]), { r: 7, fill: "#5a78b8" });
          }
        }
        svg.innerHTML = s;
      }
      draw();
      const steps = [];
      if (lv.choice) steps.push({ type: "choice", prompt: lv.f ? "Which domain makes sense?" : "Which kind of graph makes sense?", options: lv.choice.map((o, k) => ({ label: o[0], ok: k === 0, why: o[1] })),
        done: "Domain: " + lv.choice[0][0], onDone: () => {
          if (!lv.dom) return;
          discrete = lv.dom.type === "int";
          trim = [lv.dom.from, lv.dom.to == null ? null : lv.dom.to];
          lv.open = lv.dom.type === "cont";
          draw();
        } });
      if (lv.trim) steps.push({ type: "input", prompt: "The graph starts at " + lv.v[0] + " = [] and ends at " + lv.v[0] + " = [] " + (lv.trim[1] == null ? "(leave empty if no end)" : ""),
        answers: lv.trim.map((x) => (x == null ? 0 : x)), autoAnswers: lv.trim.map((x) => (x == null ? "" : x)),
        accept: (vals) => {
          // allow an empty second box when there's no natural end
          return true;
        }, done: "Domain: " + (lv.trim[1] == null ? lv.v[0] + " ≥ " + lv.trim[0] : lv.trim[0] + " ≤ " + lv.v[0] + " ≤ " + lv.trim[1]) });
      if (lv.range) steps.push({ type: "input", prompt: lv.range[1], answers: lv.range[0], hint: "Find the smallest and largest outputs over the domain. Check the endpoints and any maximum." });
      // custom check for trim inputs (empty box allowed)
      if (lv.trim) {
        const st = steps.find((s) => s.autoAnswers);
        st.type = "click";
        let fromIn, toIn;
        st.controls = () => {
          fromIn = api.h("input", { type: "text", inputmode: "decimal", "aria-label": "Start", style: { width: "90px", minHeight: "44px", fontSize: "20px", fontWeight: 800, textAlign: "center", border: "2px solid var(--line)", borderRadius: "10px" } });
          toIn = api.h("input", { type: "text", inputmode: "decimal", "aria-label": "End", style: { width: "90px", minHeight: "44px", fontSize: "20px", fontWeight: 800, textAlign: "center", border: "2px solid var(--line)", borderRadius: "10px" } });
          return api.h("div", { class: "coef-row", style: { textAlign: "left", fontSize: "20px" } }, "Start: ", fromIn, "  End: ", toIn);
        };
        st.prompt = "Where should the graph start and end? (Leave End empty if there's no natural end.)";
        st.button = "Trim";
        st.check = () => {
          const a = Alg.parseNum(fromIn.value), bRaw = toIn.value.trim(), b = bRaw === "" ? null : Alg.parseNum(bRaw);
          if (Number.isNaN(a) || Number.isNaN(b)) return "Type numbers (or leave End empty).";
          trim = [a, b]; draw();
          if (!Alg.close(a, lv.trim[0])) return "Start at " + lv.v[0] + " = " + Alg.num(a) + "? " + (a < lv.trim[0] ? "Inputs below " + lv.trim[0] + " don't make sense here." : "You've cut off inputs that do make sense.");
          if (lv.trim[1] == null && b !== null) return "Does the coffee stop cooling at " + lv.v[0] + " = " + Alg.num(b) + "? Nothing in the situation ends there.";
          if (lv.trim[1] != null && (b === null || !Alg.close(b, lv.trim[1]))) return b === null ? "This situation has a natural end. What is it?" : lv.v[0] + " = " + Alg.num(b) + " isn't the limit. Look at the situation again.";
          return true;
        };
        st.autoplay = () => { fromIn.value = lv.trim[0]; toIn.value = lv.trim[1] == null ? "" : lv.trim[1]; };
      }
      Steps.run(api, { steps, logTitle: "Your domain", result: () => ({ answer: lv.choice ? lv.choice[0][0] : lv.trim ? (lv.trim[1] == null ? lv.v[0] + " ≥ " + lv.trim[0] : lv.trim[0] + " ≤ " + lv.v[0] + " ≤ " + lv.trim[1]) : "Range found",
        check: "The domain matches what's possible in the situation ✓" }) });
    },
    guide: {
      summary: "A 12-level game about domains in context. Students choose sensible domains (including the standard's engine-assembly example), trim graphs to the meaningful inputs, decide between discrete dots and continuous lines, and find the range that follows from a domain.",
      also: "<span class='code'>AI.F-IF.B.4</span> interpreting key features.",
      practices: "MP4 Model with mathematics · MP6 Attend to precision",
      evidence: "Offer a negative number, a fraction, and a whole number of engines. Ask which inputs make sense and how that decision appears on the graph.",
      goals: [
        "Relate the domain of a function to the quantitative relationship it describes.",
        "Restrict a graph to the inputs that make sense, including situations with no natural end.",
        "Distinguish discrete from continuous domains and find the range from a domain.",
      ],
      howItWorks: "Each level gives a situation and its formula with a full graph. Students choose the sensible domain from options with explanations, or type the start and end of the graph; the graph then trims to the chosen domain, as dots for whole-number domains. Stage 3 asks for dots vs. lines and for ranges.",
      stageNotes: {
        1: { sees: "Engines, a thrown ball, gym months, square sides.", builds: "Integer vs. real; non-negative inputs; natural limits." },
        2: { sees: "Graphs to trim.", builds: "Domain endpoints from context; models with no end." },
        3: { sees: "Discrete situations and ranges.", builds: "Dots vs. lines; range from domain." },
      },
      discussion: [
        "Why is the domain of the engine function the positive integers and not all real numbers?",
        "The ball formula gives a height for t = 5. Why don't we use it?",
        "Why does the fence's area have a maximum of 100?",
      ],
      misconceptions: [
        ["The domain is always all real numbers", "Stage 1 distractors."],
        ["Connecting dots for counts of whole things", "Levels 9 and 12."],
        ["Range = the domain's endpoints plugged in", "Level 11's range needs the maximum at w = 10."],
      ],
      exitTicket: {
        items: ["P(n) = 12n is the cost of n pizzas. What's a sensible domain?", "A diver's height is h(t) = −5t² + 5t + 10, hitting the water at t = 2. Domain?", "f(x) = −x + 6 on 0 ≤ x ≤ 4. Range?"],
        answers: ["Whole numbers 0, 1, 2, … (up to what you can afford).", "0 ≤ t ≤ 2.", "2 ≤ y ≤ 6."],
      },
    },
    answerKey(lv) {
      const ans = lv.choice ? lv.choice[0][0] : lv.trim ? (lv.trim[1] == null ? lv.v[0] + " ≥ " + lv.trim[0] : lv.trim[0] + " ≤ " + lv.v[0] + " ≤ " + lv.trim[1]) : lv.range[1].replace("[]", lv.range[0][0]).replace("[]", lv.range[0][1]);
      return { prompt: lv.ctx, solution: lv.range ? "Range over the domain: " + lv.range[0].join(" to ") : "Use only inputs that make sense", answer: ans };
    },
  });
})();
