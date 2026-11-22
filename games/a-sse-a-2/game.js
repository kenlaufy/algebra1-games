/* Cut and Rearrange · AI.A-SSE.A.2 */
(function () {
  const A = window.Cartoon, M = "−";
  const opt = (label, why) => [label, why || ""];
  // fig: dos = difference of squares (cut & slide), ps = perfect square. la/lb: side labels. a/b: drawing proportions.
  const LEVELS = [
    { stage: 1, expr: "10² " + M + " 4²", fig: "dos", la: "10", lb: "4", a: 10, b: 4,
      steps: [{ choice: "Rewrite 10² − 4² as a rectangle:", opts: [opt("(10 + 4)(10 " + M + " 4)"), opt("(10 " + M + " 4)²", "(10 − 4)² is 36, but 100 − 16 is 84. Cutting the hole out doesn't leave a square."), opt("(10 " + M + " 4) × 2", "Look at the picture: the leftover piece slides into a rectangle that is (10 + 4) wide.")] },
        { input: "(10 + 4)(10 " + M + " 4) = 14 × 6 = []", ans: [84] }],
      answer: "10² − 4² = 14 × 6 = 84", check: "100 − 16 = 84 ✓", tip: "A 10-by-10 square with a 4-by-4 hole cut out. Watch what happens when you cut and slide." },
    { stage: 1, expr: "9² " + M + " 1²", fig: "dos", la: "9", lb: "1", a: 9, b: 1,
      steps: [{ choice: "Rewrite as a rectangle:", opts: [opt("(9 + 1)(9 " + M + " 1)"), opt("(9 " + M + " 1)²", "(9 − 1)² = 64, but 81 − 1 = 80."), opt("9 + 1", "That's only one side of the rectangle.")] },
        { input: "(9 + 1)(9 " + M + " 1) = 10 × 8 = []", ans: [80] }],
      answer: "9² − 1² = 10 × 8 = 80", check: "81 − 1 = 80 ✓", tip: "Same cut, different numbers." },
    { stage: 1, expr: "21² " + M + " 19²", fig: "dos", la: "21", lb: "19", a: 21, b: 19,
      steps: [{ choice: "This one is hard to square in your head. Rewrite it:", opts: [opt("(21 + 19)(21 " + M + " 19)"), opt("(21 " + M + " 19)²", "That's 4, much too small."), opt("21 × 19", "21 × 19 is a different number. Use the pattern a² − b² = (a + b)(a − b).")] },
        { input: "(21 + 19)(21 " + M + " 19) = 40 × 2 = []", ans: [80] }],
      answer: "21² − 19² = 40 × 2 = 80", check: "441 − 361 = 80 ✓", tip: "Structure can be a mental-math shortcut." },
    { stage: 1, expr: "51 × 49", fig: "dos", la: "50", lb: "1", a: 10, b: 2,
      steps: [{ choice: "Run the pattern backwards. 51 × 49 is:", opts: [opt("(50 + 1)(50 " + M + " 1) = 50² " + M + " 1²"), opt("50² + 1²", "(50 + 1)(50 − 1) is a difference, not a sum."), opt("(50 + 1)² ", "That would be 51 × 51.")] },
        { input: "50² " + M + " 1² = 2500 " + M + " 1 = []", ans: [2499] }],
      answer: "51 × 49 = 2499", check: "51 × 49 = 2499 ✓", tip: "This time start from the rectangle." },
    { stage: 2, expr: "x² " + M + " 9", fig: "dos", la: "x", lb: "3", a: 10, b: 4,
      steps: [{ choice: "9 is 3². Rewrite x² − 9:", opts: [opt("(x + 3)(x " + M + " 3)"), opt("(x " + M + " 3)²", "(x − 3)² = x² − 6x + 9. There's no x term in x² − 9."), opt("(x " + M + " 9)(x + 1)", "That multiplies to x² − 8x − 9.")] },
        { input: "Check with x = 10: 10² " + M + " 9 = 91, and 13 × 7 = []", ans: [91] }],
      answer: "x² − 9 = (x + 3)(x − 3)", check: "At x = 10: 13 × 7 = 91 = 100 − 9 ✓", tip: "Now with a letter. The picture works for any x." },
    { stage: 2, expr: "4x² " + M + " 25", fig: "dos", la: "2x", lb: "5", a: 10, b: 4,
      steps: [{ input: "Spot the squares: 4x² = ([]x)² and 25 = []²", ans: [2, 5] },
        { choice: "So 4x² − 25 is:", opts: [opt("(2x + 5)(2x " + M + " 5)"), opt("(4x + 5)(x " + M + " 5)", "That multiplies to 4x² − 15x − 25."), opt("(2x " + M + " 5)²", "That has a middle term, −20x.")] }],
      answer: "4x² − 25 = (2x + 5)(2x − 5)", check: "At x = 10: 25 × 15 = 375 = 400 − 25 ✓", tip: "First, what is being squared?" },
    { stage: 2, expr: "x⁴ " + M + " 16", fig: "dos", la: "x²", lb: "4", a: 10, b: 4,
      steps: [{ choice: "x⁴ is (x²)² and 16 is 4². So x⁴ − 16 is:", opts: [opt("(x² + 4)(x² " + M + " 4)"), opt("(x² " + M + " 4)²", "That has a middle term."), opt("(x + 4)(x " + M + " 4)", "(x + 4)(x − 4) = x² − 16, not x⁴ − 16.")] },
        { choice: "One factor is another difference of squares. Factor it:", opts: [opt("x² " + M + " 4 = (x + 2)(x " + M + " 2)"), opt("x² + 4 = (x + 2)(x + 2)", "(x + 2)² = x² + 4x + 4, not x² + 4."), opt("Nothing more to factor", "Look at x² − 4 again.")] }],
      answer: "x⁴ − 16 = (x² + 4)(x + 2)(x − 2)", check: "At x = 2: 16 − 16 = 0 and (8)(4)(0) = 0 ✓", tip: "The pattern can be used twice." },
    { stage: 2, expr: "(x + 2)² " + M + " 9", fig: "dos", la: "x + 2", lb: "3", a: 10, b: 4,
      steps: [{ choice: "Treat (x + 2) as one thing. (x + 2)² − 3² is:", opts: [opt("((x + 2) + 3)((x + 2) " + M + " 3)"), opt("(x + 2 " + M + " 3)²", "That's a square, not a difference of squares."), opt("x² + 4 " + M + " 9", "(x + 2)² is not x² + 4.")] },
        { input: "Simplify: (x + [])(x + [])", ans: [5, -1], unordered: true }],
      answer: "(x + 2)² − 9 = (x + 5)(x − 1)", check: "At x = 10: 144 − 9 = 135 and 15 × 9 = 135 ✓", tip: "This is the example from the Massachusetts standard." },
    { stage: 3, expr: "x² + 6x + 9", fig: "ps", la: "x", lb: "3", a: 10, b: 4,
      steps: [{ choice: "x² + 6x + 9 fills a square. Which one?", opts: [opt("(x + 3)²"), opt("(x + 9)²", "(x + 9)² = x² + 18x + 81."), opt("(x + 3)(x " + M + " 3)", "That's x² − 9.")] },
        { input: "Check with x = 10: 100 + 60 + 9 = [] = 13²", ans: [169] }],
      answer: "x² + 6x + 9 = (x + 3)²", check: "13² = 169 ✓", tip: "A different structure: a perfect square." },
    { stage: 3, expr: "9x² " + M + " 12x + 4", fig: "ps", la: "3x", lb: "2", a: 10, b: 4,
      steps: [{ input: "Spot the squares: 9x² = ([]x)² and 4 = []²", ans: [3, 2] },
        { choice: "The middle term is −12x = −2(3x)(2). So the expression is:", opts: [opt("(3x " + M + " 2)²"), opt("(3x + 2)²", "That gives +12x."), opt("(9x " + M + " 4)²", "(9x)² is 81x².")] }],
      answer: "9x² − 12x + 4 = (3x − 2)²", check: "At x = 10: 900 − 120 + 4 = 784 = 28² ✓", tip: "Check the middle term to choose the sign." },
    { stage: 3, expr: "x⁴ " + M + " y⁴", fig: "dos", la: "x²", lb: "y²", a: 10, b: 5,
      steps: [{ choice: "x⁴ − y⁴ is (x²)² − (y²)². Rewrite it:", opts: [opt("(x² + y²)(x² " + M + " y²)"), opt("(x " + M + " y)⁴", "That expands to many more terms."), opt("(x² " + M + " y²)²", "That has a middle term −2x²y².")] },
        { choice: "Keep going. Fully factored:", opts: [opt("(x² + y²)(x + y)(x " + M + " y)"), opt("(x + y)²(x " + M + " y)²", "(x + y)²(x − y)² = (x² − y²)², not x⁴ − y⁴."), opt("(x + y)(x " + M + " y)(x + y)(x " + M + " y)", "x² + y² can't be split into (x + y)(x − y).")] }],
      answer: "x⁴ − y⁴ = (x² + y²)(x + y)(x − y)", check: "At x = 2, y = 1: 16 − 1 = 15 = 5 × 3 × 1 ✓", tip: "Two letters, same structure." },
    { stage: 3, expr: "2x² " + M + " 18", fig: "dos", la: "x", lb: "3", a: 10, b: 4,
      steps: [{ choice: "18 isn't a perfect square. What first?", opts: [opt("Take out the common factor: 2(x² " + M + " 9)"), opt("(2x + 9)(x " + M + " 2)", "That multiplies to 2x² + 5x − 18."), opt("(√2x + √18)(√2x " + M + " √18)", "That's true, but there's a neater way with whole numbers.")] },
        { choice: "Now factor x² − 9:", opts: [opt("2(x + 3)(x " + M + " 3)"), opt("2(x " + M + " 3)²", "That has a middle term."), opt("(2x + 3)(x " + M + " 3)", "Keep the 2 outside.")] }],
      answer: "2x² − 18 = 2(x + 3)(x − 3)", check: "At x = 10: 200 − 18 = 182 = 2 × 13 × 7 ✓", tip: "Last one: look for a common factor first." },
  ];

  // ---------- picture ----------
  function figure(lv, state, t) {
    // state: "start" | "cut" (animated by t from 0 to 1)
    const W = 900, H = 330;
    let s = A.backdrop(W, H, { ground: 300, clouds: false, sun: false });
    const k = 220 / lv.a, S = lv.a * k, B = lv.b * k;
    const x0 = 140, y0 = 50;
    const blue = "#5a78b8", light = "#8fa6d6";
    if (lv.fig === "ps") {
      const done = state === "cut";
      const parts = [[x0, y0, S, S, "#6b8f5e", lv.la + "²"], [x0 + S, y0, B, S, blue, ""], [x0, y0 + S, S, B, blue, ""], [x0 + S, y0 + S, B, B, "#e7b84a", ""]];
      parts.forEach((p, i) => {
        s += '<rect x="' + p[0] + '" y="' + p[1] + '" width="' + p[2] + '" height="' + p[3] + '" fill="' + p[4] + '" ' + A.OUT + "/>";
        if (p[5]) s += A.text(p[0] + p[2] / 2, p[1] + p[3] / 2 + 8, p[5], { size: 24, fill: "#fff" });
      });
      s += A.text(x0 + S / 2, y0 - 12, lv.la, { size: 22 }) + A.text(x0 + S + B / 2, y0 - 12, lv.lb, { size: 22 });
      s += A.text(x0 - 26, y0 + S / 2, lv.la, { size: 22 }) + A.text(x0 - 26, y0 + S + B / 2 + 6, lv.lb, { size: 22 });
      if (done) s += A.text(x0 + (S + B) / 2, y0 + S + B + 34, "(" + lv.la + " + " + lv.lb + ")²", { size: 24, var: false });
      s += A.mascot(760, 296, done ? "joy" : "think");
      return s;
    }
    // difference of squares: big square minus corner hole; piece P (bottom-left strip) slides to the right side
    const topH = S - B;
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + S + '" height="' + topH + '" fill="' + blue + '" ' + A.OUT + "/>";
    // hole outline (dashed) at bottom-right, fades as the piece moves
    s += '<rect x="' + (x0 + S - B) + '" y="' + (y0 + topH) + '" width="' + B + '" height="' + B + '" fill="none" stroke="#23262d" stroke-dasharray="7 6" stroke-width="2" opacity="' + (1 - t) + '"/>';
    // moving piece: from (x0, y0+topH, S−B, B) to (x0+S, y0, B, S−B)
    const fx = x0 + (x0 + S - x0) * t, fy = y0 + topH + (y0 - (y0 + topH)) * t;
    const fw = (S - B) + (B - (S - B)) * t, fh = B + ((S - B) - B) * t;
    s += '<rect x="' + fx + '" y="' + fy + '" width="' + fw + '" height="' + fh + '" fill="' + light + '" ' + A.OUT + "/>";
    s += A.text(x0 + S / 2, y0 - 12, lv.la, { size: 22 });
    if (t === 0) {
      s += A.text(x0 - 30, y0 + S / 2, lv.la, { size: 22 });
      s += A.text(x0 + S - B / 2, y0 + topH + B / 2 + 8, lv.lb + "²", { size: 20 });
      s += A.text(x0 + S + 120, y0 + S / 2, "area = " + lv.la + "² " + M + " " + lv.lb + "²", { size: 22, var: false, anchor: "start" });
    }
    if (t === 1) {
      s += '<path d="M ' + x0 + " " + (y0 + topH + 22) + " h " + (S + B) + '" stroke="#23262d" stroke-width="2" marker-end=""/>';
      s += A.text(x0 + (S + B) / 2, y0 + topH + 46, lv.la + " + " + lv.lb, { size: 22, var: false });
      s += A.text(x0 + S + B + 46, y0 + topH / 2 + 8, lv.la + " " + M + " " + lv.lb, { size: 22, var: false, anchor: "start" });
    }
    s += A.mascot(800, 296, t === 1 ? "joy" : "think");
    return s;
  }

  GameShell.register({
    slug: "a-sse-a-2",
    title: "Cut and Rearrange",
    subtitle: "Use the structure of an expression to rewrite it",
    stages: { 1: "Stage 1 · Number shortcuts", 2: "Stage 2 · Differences of squares", 3: "Stage 3 · Squares and more" },
    levels: LEVELS,
    help: {
      intro: "A square with a square hole cut out can be sliced and slid into a rectangle. That's why <b>a² − b² = (a + b)(a − b)</b>.",
      steps: [
        "Look at the expression and the picture. What's being squared?",
        "Choose the rewrite. When it's right, the picture cuts and slides into the new shape.",
        "Answer the follow-up: a number, a factor, or a check.",
        "Fewer wrong choices means more stars.",
      ],
      note: "Stage 3 adds perfect squares like x² + 6x + 9 = (x + 3)².",
    },
    load(lv, api) {
      const svg = api.svg("0 0 900 330", "Picture of the expression");
      api.stage.append(api.h("div", { class: "stage-text" }, lv.expr), svg);
      let t = 0, state = "start";
      const draw = () => { svg.innerHTML = figure(lv, state, t); };
      draw();
      const steps = lv.steps.map((st, k) => st.choice
        ? { type: "choice", prompt: st.choice, options: st.opts.map((o, j) => ({ label: o[0], ok: j === 0, why: o[1] })),
            done: st.choice + " " + st.opts[0][0], onDone: () => { if (k === 0) { state = "cut"; api.tween(0, 1, 900, (v) => { t = v; draw(); }); } } }
        : { type: "input", prompt: st.input, answers: st.ans, unordered: !!st.unordered, hint: "Work it out step by step; the picture can help.",
            onDone: () => { if (k === 0) { state = "cut"; api.tween(0, 1, 900, (v) => { t = v; draw(); }); } } });
      Steps.run(api, { steps, logTitle: "Your work", result: () => ({ answer: lv.answer, check: lv.check }) });
    },
    guide: {
      summary: "A 12-level game about seeing structure. Students rewrite differences of squares, perfect squares and related forms, while a picture cuts a square with a hole and slides it into a rectangle.",
      also: "<span class='code'>AI.A-APR.A.1.b</span> factoring polynomial expressions.",
      practices: "MP7 Look for and make use of structure · MP8 Look for and express regularity in repeated reasoning",
      goals: [
        "Recognize a difference of squares, including disguised ones such as 4x² − 25, x⁴ − 16 and (x + 2)² − 9.",
        "Rewrite a² − b² as (a + b)(a − b) and explain it with an area picture.",
        "Recognize perfect-square trinomials and use a common factor first when needed.",
      ],
      howItWorks: "Each level shows an expression and a picture. Students choose the correct rewrite from options whose distractors match common errors, each with feedback. A correct choice animates the cut: the L-shaped region slides into an (a + b) × (a − b) rectangle. Follow-up steps compute a value, factor further, or check by substitution.",
      stageNotes: {
        1: { sees: "Number differences of squares and 51 × 49.", builds: "The pattern as a mental-math tool, in both directions." },
        2: { sees: "Expressions with x, including (x + 2)² − 9 from the standard's example.", builds: "Identifying what is squared; factoring twice." },
        3: { sees: "Perfect squares, two variables, and a common factor.", builds: "Choosing the right structure for the expression." },
      },
      discussion: [
        "Why can't a² − b² be written as (a − b)²? Use 10² − 4² as an example.",
        "How does 21² − 19² become easy to compute mentally?",
        "In x⁴ − 16, why does x² + 4 not factor further while x² − 4 does?",
      ],
      misconceptions: [
        ["a² − b² = (a − b)²", "Each level offers this as a distractor with a numeric counterexample."],
        ["Missing hidden squares (4x², x⁴)", "Level 6 asks students to name what is squared first."],
        ["Factoring a sum of squares", "Level 7 and level 11 reject (x + 2)(x + 2) for x² + 4."],
        ["Skipping the common factor", "Level 12 asks what to do first."],
      ],
      exitTicket: {
        items: ["Compute 30² − 28² without squaring either number.", "Factor: 16x² − 49", "Factor completely: 3x² − 75"],
        answers: ["(30 + 28)(30 − 28) = 58 × 2 = 116.", "(4x + 7)(4x − 7)", "3(x + 5)(x − 5)"],
      },
    },
    answerKey(lv) {
      return { prompt: lv.expr, solution: lv.steps.map((s) => s.choice ? s.opts[0][0] : (() => { let k = 0; return s.input.replace(/\[\]/g, () => String(s.ans[k++]).replace("-", M)); })()).join("; "), answer: lv.answer.split(" = ").slice(1).join(" = ") || lv.answer };
    },
  });
})();
