/* Build the Rectangle · AI.A-APR.A.1.b */
(function () {
  const A = window.Cartoon, Alg = window.Alg, M = Alg.MINUS;
  const LEVELS = [
    { stage: 1, type: "factor", P: [1, 5, 6], ans: [1, 2, 1, 3], tip: "Arrange 1 big square, 5 strips and 6 small squares into a rectangle. What are its side lengths?" },
    { stage: 1, type: "factor", P: [1, 6, 8], ans: [1, 2, 1, 4], tip: "Which two numbers multiply to 8 and add to 6?" },
    { stage: 1, type: "factor", P: [1, 7, 12], ans: [1, 3, 1, 4], tip: "12 has several factor pairs. Which pair adds to 7?" },
    { stage: 1, type: "factor", P: [1, 8, 16], ans: [1, 4, 1, 4], tip: "This rectangle turns out to be a square." },
    { stage: 2, type: "factor", P: [1, 1, -6], ans: [1, 3, 1, -2], tip: "Red tiles are negative. Now one side has a negative number." },
    { stage: 2, type: "factor", P: [1, -7, 10], ans: [1, -2, 1, -5], tip: "Positive 10 but negative 7x. What signs do the two numbers need?" },
    { stage: 2, type: "factor", P: [2, 6, 0], ans: [2, 0, 1, 3], tip: "No ones at all. Pull out the biggest common factor: one side can be just 2x." },
    { stage: 2, type: "factor", P: [1, 0, -9], ans: [1, 3, 1, -3], tip: "No x tiles. The middle terms must cancel." },
    { stage: 3, type: "expand", text: "3(x + 2) + 2(x " + M + " 4)", parts: [["3(x + 2) = []x + []", [3, 6]], ["2(x " + M + " 4) = []x + []", [2, -8]]], ans: [5, -2],
      tip: "Simplify: distribute each number, then combine like terms." },
    { stage: 3, type: "expand", text: "4(2x " + M + " 1) " + M + " 3(x + 5)", parts: [["4(2x " + M + " 1) = []x + []", [8, -4]], [M + "3(x + 5) = []x + []", [-3, -15]]], ans: [5, -19],
      tip: "The minus sign belongs to the 3. Distribute −3." },
    { stage: 3, type: "factor", P: [2, 7, 3], ans: [2, 1, 1, 3], tip: "Two big squares this time, so one side starts with 2x." },
    { stage: 3, type: "factor", P: [3, 10, 8], ans: [3, 4, 1, 2], tip: "Last one: 3 big squares, 10 strips, 8 ones." },
  ];
  const pstr = (p) => Alg.fmtPoly(Alg.polyTrim(p));
  const bin = (a, b) => (b === 0 ? (a === 1 ? "x" : Alg.num(a) + "x") : Alg.fmtBinom(a, b));
  const fstr = (f) => (f[1] === 0 ? bin(f[0], 0) + bin(f[2], f[3]) : f[3] === 0 ? bin(f[2], 0) + bin(f[0], f[1]) : bin(f[0], f[1]) + bin(f[2], f[3]));

  function tilePile(P) {
    // loose tiles: x² squares, x strips, ones; negatives red
    const specs = [];
    const add = (n, kind) => { for (let i = 0; i < Math.abs(n); i++) specs.push(A.tileSpec(n > 0 ? kind : "n" + kind, kind === "x" ? { w: 22, h: 62 } : {})); };
    add(P[0], "x2");
    add(P[1], "x");
    add(P[2], "u");
    return specs.map((t) => (t.kind === "x" || t.kind === "nx" ? Object.assign(t, { w: 22, h: 62, svg: stripSvg(t.kind) }) : t));
  }
  function stripSvg(kind) {
    return (x, y) => '<rect x="' + x + '" y="' + y + '" width="22" height="62" rx="4" fill="' + (kind === "x" ? "#5a78b8" : "#c8553d") + '" ' + A.OUT + "/>" +
      A.text(x + 11, y + 37, kind === "x" ? "x" : M + "x", { size: 14, fill: "#fff" });
  }

  GameShell.register({
    slug: "a-apr-a-1-b",
    title: "Build the Rectangle",
    firstMove: "Build a rectangle with exactly the tiles shown. Enter the two side lengths and choose Build.",
    subtitle: "Factor and expand polynomials; combine like terms",
    stages: { 1: "Stage 1 · Rectangles from tiles", 2: "Stage 2 · Negatives and common factors", 3: "Stage 3 · Expand, then factor harder ones" },
    levels: LEVELS,
    help: {
      intro: "Factoring means finding the side lengths of a rectangle made from all the tiles.",
      steps: [
        "Look at the pile: big squares are x², strips are x, small squares are 1. Red tiles are negative.",
        "Type the side lengths as (□x + □)(□x + □). Use a minus sign for negative numbers.",
        "Press <b>Build</b>. The game multiplies your sides and compares the result with the pile.",
        "Some levels ask you to expand instead: distribute, then combine like terms.",
      ],
      note: "A wrong rectangle shows you exactly which tiles are off.",
    },
    load(lv, api) {
      if (lv.type === "expand") {
        api.stage.appendChild(api.h("div", { class: "stage-text" }, "Simplify: " + lv.text));
        const steps = lv.parts.map(([p, ans]) => ({ type: "input", prompt: p, answers: ans, hint: "Multiply the number outside by every term inside the parentheses, signs included." }));
        steps.push({ type: "input", prompt: "Combine like terms: " + lv.text + " = []x + []", answers: lv.ans, hint: "Add the x terms together and the number terms together." });
        Steps.run(api, { steps, logTitle: "Your work", result: () => ({ answer: lv.text + " = " + Alg.fmtTerms([{ coef: lv.ans[0], body: "x" }, { coef: lv.ans[1], body: "" }]),
          check: "Check with x = 10: both forms give " + Alg.num(lv.ans[0] * 10 + lv.ans[1]) + " ✓" }) });
        return;
      }
      let mistakes = 0;
      const svg = api.svg("0 0 900 300", "Pile of algebra tiles");
      const out = api.h("div");
      api.stage.append(api.h("div", { class: "stage-text" }, "Factor: " + pstr(lv.P)), svg, out);
      svg.innerHTML = A.backdrop(900, 300, { ground: 250, clouds: false }) + A.stack(tilePile(lv.P), 330, 245, 520) + A.mascot(780, 262, "think", 0.9);

      const row = api.h("div", { class: "coef-row", style: { margin: 0 } });
      const f = [];
      const mk = (label) => { const i = api.h("input", { type: "text", "aria-label": label }); f.push(i); return i; };
      row.append("(", mk("first side, x coefficient"), api.h("span", { html: "<i>x</i> + " }), mk("first side, number"), ")(",
        mk("second side, x coefficient"), api.h("span", { html: "<i>x</i> + " }), mk("second side, number"), ")");
      const btn = api.button("Build", build, "primary");
      api.controls.append(api.h("div", { style: { width: "100%" } }, api.h("div", { class: "preview" }, "Side lengths of the rectangle:"), row), btn);
      api.meta("Fewer wrong rectangles, more stars");
      f.forEach((i) => i.addEventListener("keydown", (e) => { if (e.key === "Enter") build(); }));

      function build() {
        const v = f.map((i) => (i.value.trim() === "" ? NaN : Alg.parseNum(i.value)));
        if (v.some(Number.isNaN)) return api.msg("Fill all four boxes (use 1 for x, and 0 if there's no number).", "warn");
        if (v.some((n) => !Number.isInteger(n))) return api.msg("Use whole numbers for the side lengths.", "warn");
        const prod = Alg.polyMul([v[0], v[1]], [v[2], v[3]]);
        showArea(v, prod);
        if (!Alg.polyEq(prod, lv.P)) {
          mistakes++;
          const names = ["x² tiles", "x tiles", "ones"];
          const diffs = [];
          const pad = (p) => new Array(3 - Alg.polyTrim(p).length).fill(0).concat(Alg.polyTrim(p));
          const a = pad(prod), b = pad(lv.P);
          a.forEach((c, k) => { if (c !== b[k]) diffs.push("your rectangle has " + Alg.num(c) + " " + names[k] + " but the pile has " + Alg.num(b[k])); });
          return api.msg("Your rectangle is " + pstr(prod) + ": " + diffs.join("; ") + ".", "bad");
        }
        const common = (a, b) => a !== 0 && b !== 0 && Alg.gcd(a, b) > 1;
        if (common(v[0], v[1]) || common(v[2], v[3])) {
          mistakes++;
          return api.msg("That rectangle has the right area, but a side still has a common factor. Factor completely.", "warn");
        }
        const answer = fstr(v);
        api.win({ answer: pstr(lv.P) + " = " + answer, lines: ["Sides: " + answer, "Area: " + pstr(prod)], stars: mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1,
          note: mistakes === 0 ? "First try. Perfect!" : mistakes + (mistakes === 1 ? " wrong rectangle." : " wrong rectangles."),
          check: "Check with x = 10: " + Alg.num(v[0] * 10 + v[1]) + " × " + Alg.num(v[2] * 10 + v[3]) + " = " + Alg.num(Alg.polyEval(lv.P, 10)) + " ✓" });
      }
      function showArea(v, prod) {
        const At = [[v[0], 1], [v[1], 0]].filter((t) => t[0] !== 0), Bt = [[v[2], 1], [v[3], 0]].filter((t) => t[0] !== 0);
        const ts = (t) => Alg.fmtTerm(t[0], t[1]);
        const cls = (c, p) => (c < 0 ? "t-neg" : p === 2 ? "t-x2" : p === 1 ? "t-x" : "t-u");
        const table = api.h("table", { class: "area", "aria-label": "Your rectangle" });
        table.appendChild(api.h("tr", null, api.h("th", null, "×"), ...Bt.map((b) => api.h("th", null, ts(b)))));
        At.forEach((a) => table.appendChild(api.h("tr", null, api.h("th", null, ts(a)),
          ...Bt.map((b) => api.h("td", { class: cls(a[0] * b[0], a[1] + b[1]) + " done", style: { color: a[0] * b[0] > 0 && a[1] + b[1] === 0 ? "var(--ink)" : "#fff", fontWeight: 800, fontSize: "20px" } }, ts([a[0] * b[0], a[1] + b[1]]))))));
        out.innerHTML = "";
        out.append(api.h("div", { class: "preview", style: { textAlign: "center" } }, "Your rectangle: " + fstr(v) + " = " + pstr(prod)), table);
      }
      api.autoplay = () => { lv.ans.forEach((n, k) => (f[k].value = n)); build(); return {}; };
    },
    guide: {
      evidence: "Ask a student to predict the two cross-products before choosing Build. Their sum should explain the middle coefficient.",
      summary: "A 12-level game for factoring and expanding. Students factor a pile of algebra tiles by naming the side lengths of a rectangle; the game builds their rectangle and compares it tile by tile. Two levels expand expressions with the distributive property.",
      also: "<span class='code'>AI.A-SSE.B.3.a</span> factoring a quadratic (the zeros come next, in Zero Link).",
      practices: "MP7 Look for and make use of structure · MP1 Make sense of problems and persevere",
      goals: [
        "Factor quadratic expressions, including negatives, a common monomial factor, and a leading coefficient greater than 1.",
        "Expand expressions with the distributive property and combine like terms.",
        "Check a factorization by multiplying it back out.",
      ],
      howItWorks: "Factoring levels show a pile of tiles (x² squares, x strips, ones; red for negative). Students type side lengths (□x + □)(□x + □). The game multiplies them out as an area model and reports exactly which tile counts don't match. A correct area with a side that still has a common factor is flagged as not fully factored. Expanding levels walk through distributing each term, then combining like terms.",
      stageNotes: {
        1: { sees: "Positive tile piles.", builds: "Factor pairs that multiply to c and add to b." },
        2: { sees: "Red negative tiles; a pile with no ones; a pile with no x tiles.", builds: "Sign patterns; greatest common factor; difference of squares." },
        3: { sees: "Two expanding levels, then leading coefficients 2 and 3.", builds: "Distributive property; factoring ax² + bx + c." },
      },
      discussion: [
        "Why does x² + 5x + 6 need two numbers that multiply to 6 and add to 5? Point to the tiles.",
        "In level 8, x² − 9 has no x tiles. How can a rectangle be built anyway?",
        "How can you check a factorization without the game?",
      ],
      misconceptions: [
        ["Choosing factors that multiply to c but don't add to b", "The comparison names the x-tile count that's off."],
        ["Wrong sign pattern, e.g. (x + 2)(x + 5) for x² − 7x + 10", "The comparison shows +7x versus −7x."],
        ["Stopping before factoring completely", "Sides with a common factor are flagged."],
        ["Distributing −3 as −3x + 15", "Expanding feedback reminds students the sign multiplies every term."],
      ],
      exitTicket: {
        items: ["Factor: x² + 9x + 20", "Factor: x² − 2x − 15", "Simplify: 5(x − 1) − 2(x − 4)"],
        answers: ["(x + 4)(x + 5)", "(x − 5)(x + 3)", "3x + 3"],
      },
    },
    answerKey(lv) {
      if (lv.type === "expand") return { prompt: lv.text, solution: lv.parts.map((p) => p[0].replace(/\[\]x \+ \[\]/, Alg.fmtTerms([{ coef: p[1][0], body: "x" }, { coef: p[1][1], body: "" }]))).join("; ") + "; combine like terms",
        answer: Alg.fmtTerms([{ coef: lv.ans[0], body: "x" }, { coef: lv.ans[1], body: "" }]) };
      return { prompt: pstr(lv.P), solution: "Rectangle with sides " + fstr(lv.ans), answer: fstr(lv.ans) };
    },
  });
})();
