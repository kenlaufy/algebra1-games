/* Complete the Square · AI.A-SSE.B.3.b */
(function () {
  const A = window.Cartoon, Alg = window.Alg, M = Alg.MINUS;
  const LEVELS = [
    { stage: 1, P: [1, 6, 0], tip: "x² + 6x is almost a square. Split the 6x strip in half and see what's missing." },
    { stage: 1, P: [1, 4, 1], tip: "Find the missing corner, then balance it out." },
    { stage: 1, P: [1, 8, 20], tip: "Vertex form shows the smallest value right away." },
    { stage: 1, P: [1, -6, 5], tip: "Negative x term: the strips are negative, but the corner is still positive." },
    { stage: 2, P: [1, -10, 30], tip: "Same steps, bigger numbers." },
    { stage: 2, P: [1, 2, -8], tip: "A small corner this time." },
    { stage: 2, P: [1, 5, 4], tip: "An odd x term means half-strips: decimals or fractions are fine." },
    { stage: 2, P: [1, -3, 0], tip: "No constant term. Watch the signs." },
    { stage: 3, P: [2, 8, 3], tip: "The leading coefficient is 2. Factor it out of the x terms first." },
    { stage: 3, P: [-1, 6, -4], tip: "A negative leading coefficient: this parabola has a maximum." },
    { stage: 3, P: [-1, 10, -16], context: "A shop's daily profit is P = −x² + 10x − 16 (hundreds of dollars) when it charges x dollars.",
      tip: "Which price gives the most profit?" },
    { stage: 3, P: [3, -12, 7], tip: "Last one: factor out 3, then complete the square." },
  ];
  const parts = (lv) => {
    const [a, b, c] = lv.P;
    const inner = b / a, h = -inner / 2, half = inner / 2, corner = half * half, k = c - a * corner;
    return { a, b, c, inner, half, corner, h, k };
  };
  const n = (v) => Alg.num(Alg.round(v, 4));
  const pstr = (lv) => Alg.fmtPoly(lv.P);
  const vform = (lv) => {
    const p = parts(lv);
    const lead = p.a === 1 ? "" : p.a === -1 ? M : n(p.a);
    const sq = "(x " + (p.half < 0 ? M + " " + n(-p.half) : "+ " + n(p.half)) + ")²";
    return lead + sq + (p.k === 0 ? "" : p.k < 0 ? " " + M + " " + n(-p.k) : " + " + n(p.k));
  };

  function picture(lv, filled) {
    const p = parts(lv);
    let s = A.backdrop(900, 320, { ground: 300, clouds: false, sun: false });
    const S = 170, u = Math.min(28, 92 / Math.max(1, Math.abs(p.half)));
    const W = Math.abs(p.half) * u;
    const x0 = 120, y0 = 40;
    const strip = p.half < 0 ? "#c8553d" : "#5a78b8";
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + S + '" height="' + S + '" fill="#6b8f5e" ' + A.OUT + "/>" + A.text(x0 + S / 2, y0 + S / 2 + 9, "x²", { size: 28, fill: "#fff" });
    s += '<rect x="' + (x0 + S) + '" y="' + y0 + '" width="' + W + '" height="' + S + '" fill="' + strip + '" ' + A.OUT + "/>";
    s += '<rect x="' + x0 + '" y="' + (y0 + S) + '" width="' + S + '" height="' + W + '" fill="' + strip + '" ' + A.OUT + "/>";
    s += A.text(x0 + S + W / 2, y0 - 10, n(p.half), { size: 18, var: false }) + A.text(x0 + S / 2, y0 - 10, "x", { size: 20 });
    s += A.text(x0 - 22, y0 + S / 2, "x", { size: 20 }) + A.text(x0 - 22, y0 + S + W / 2 + 6, n(p.half), { size: 18, var: false });
    s += '<rect x="' + (x0 + S) + '" y="' + (y0 + S) + '" width="' + W + '" height="' + W + '" fill="' + (filled ? "#e7b84a" : "none") + '" stroke="#23262d" stroke-width="' + (filled ? 3 : 2) + '"' + (filled ? "" : ' stroke-dasharray="6 5"') + "/>";
    if (!filled) s += A.text(x0 + S + W / 2, y0 + S + W / 2 + 7, "?", { size: 20, var: false });
    const label = (p.a === 1 ? "" : "inside " + n(p.a) + "( … ):  ") + Alg.fmtTerms([{ coef: 1, body: "x²" }, { coef: Alg.round(p.inner, 4), body: "x" }]);
    s += A.text(560, 90, label, { size: 24, var: false });
    s += A.text(560, 130, filled ? "corner = " + Alg.paren(p.half) + "² = " + n(p.corner) : "corner = ?", { size: 24, var: false });
    s += A.mascot(800, 296, filled ? "joy" : "think");
    return s;
  }

  GameShell.register({
    slug: "a-sse-b-3-b",
    title: "Complete the Square",
    firstMove: "Find the highest or lowest value. Enter the strip width and missing corner, then read the vertex from the square.",
    subtitle: "Complete the square to reveal a maximum or minimum",
    stages: { 1: "Stage 1 · Find the missing corner", 2: "Stage 2 · Odd and negative terms", 3: "Stage 3 · Leading coefficients and maximums" },
    levels: LEVELS,
    help: {
      intro: "x² + bx is a square with two strips and a <b>missing corner</b>. Fill the corner and the expression becomes a perfect square.",
      steps: [
        "Split the x strip into two equal strips: each is half of b.",
        "The missing corner is (half of b)². Add it, and subtract it again so nothing changes.",
        "Write the vertex form a(x − h)² + k.",
        "Read off the minimum (or maximum) value k and where it happens, x = h.",
      ],
      note: "Fractions and decimals are fine: 2.5, 5/2 and −9/4 all work.",
    },
    load(lv, api) {
      const p = parts(lv);
      const svg = api.svg("0 0 900 320", "Tile square with a missing corner");
      if (lv.context) api.stage.appendChild(api.h("div", { class: "preview", style: { textAlign: "center", paddingTop: "8px" } }, lv.context));
      api.stage.append(api.h("div", { class: "stage-text" }, "f(x) = " + pstr(lv)), svg);
      let filled = false;
      const draw = () => { svg.innerHTML = picture(lv, filled); };
      draw();
      const steps = [];
      if (p.a !== 1) steps.push({ type: "input", prompt: "Factor " + n(p.a) + " out of the x terms: " + pstr(lv) + " = " + n(p.a) + "(x² + []x)" + (p.c < 0 ? " − " : " + ") + Math.abs(p.c), answers: [p.inner],
        hint: "Divide the x coefficient by " + n(p.a) + ".", done: pstr(lv) + " = " + n(p.a) + "(" + Alg.fmtPoly([1, p.inner, 0]) + ")" + (p.c < 0 ? " − " : " + ") + Math.abs(p.c) });
      steps.push({ type: "input", prompt: "Split the " + n(p.inner) + "x strip into two equal strips. Each strip is []x", answers: [p.half], hint: "Half of " + n(p.inner) + ".",
        done: "Two strips of " + n(p.half) + "x" });
      steps.push({ type: "input", prompt: "The missing corner is " + n(p.half) + " × " + n(p.half) + " = []", answers: [p.corner], hint: "Square the strip width: (" + n(p.half) + ")². A square is never negative.",
        done: "Corner: (" + n(p.half) + ")² = " + n(p.corner), onDone: () => { filled = true; draw(); } });
      const lead = p.a === 1 ? "" : n(p.a);
      steps.push({ type: "input", prompt: "Add the corner and take it away again: f(x) = " + lead + "(x + [])² + []", answers: [p.half, p.k],
        hint: p.a === 1 ? "The constant is " + n(p.c) + " − " + n(p.corner) + "." : "The constant is " + n(p.c) + " − " + n(p.a) + " × " + n(p.corner) + ", because the corner sits inside the " + n(p.a) + "( … ).",
        done: "f(x) = " + vform(lv) });
      const word = p.a > 0 ? "smallest" : "largest";
      steps.push({ type: "input", prompt: "The " + word + " value of f is [], at x = []", answers: [p.k, p.h],
        hint: "A square is never negative, so " + Alg.fmtBinom(1, p.half) + "² is smallest (zero) when x = " + n(p.h) + ".", done: (p.a > 0 ? "Minimum " : "Maximum ") + n(p.k) + " at x = " + n(p.h) });
      Steps.run(api, { steps, logTitle: "Your work", result: () => ({ answer: "f(x) = " + vform(lv) + "<br><small>" + (p.a > 0 ? "minimum " : "maximum ") + n(p.k) + " at x = " + n(p.h) + "</small>",
        check: "Check: f(" + n(p.h) + ") = " + n(Alg.polyEval(lv.P, p.h)) + " ✓" }) });
    },
    guide: {
      evidence: "Ask what makes the squared part zero. The student should distinguish the input at the vertex from the maximum or minimum output.",
      summary: "A 12-level game for completing the square. The x² + bx tiles form a square with a missing corner; students split the strips, fill the corner, write vertex form, and read off the minimum or maximum.",
      also: "<span class='code'>AI.F-IF.C.8.a</span> using completing the square to show maximum and minimum values.",
      practices: "MP7 Look for and make use of structure · MP4 Model with mathematics",
      goals: [
        "Complete the square to rewrite ax² + bx + c as a(x − h)² + k.",
        "Explain the missing corner (b/2)² with an area picture.",
        "Use vertex form to state the maximum or minimum value and where it occurs, including in context.",
      ],
      howItWorks: "Each level shows the tiles for x² + bx: a green x² square and two strips (red when negative), with a dashed missing corner. Students enter the strip width, the corner, the vertex form, and the extreme value. When a ≠ 1, they first factor a out of the x terms.",
      stageNotes: {
        1: { sees: "Even b, positive and negative.", builds: "The corner (b/2)²; balancing by subtracting it." },
        2: { sees: "Odd b and no constant term.", builds: "Fractional halves; signs." },
        3: { sees: "Leading coefficients 2, −1 and 3, plus a profit context.", builds: "Factoring a first; maximums; interpretation." },
      },
      discussion: [
        "Why must we subtract the corner after adding it?",
        "In level 9, why is the constant 3 − 2·4 and not 3 − 4?",
        "How can you tell from vertex form whether the parabola has a maximum or a minimum?",
      ],
      misconceptions: [
        ["Adding b² or b/2 instead of (b/2)²", "The corner step shows the square with side b/2."],
        ["Forgetting to subtract the corner", "The constant step requires c − (b/2)²."],
        ["Ignoring the leading coefficient when balancing", "Stage 3 hints explain the corner sits inside a( … )."],
        ["Sign of h", "The final step asks where the minimum happens, and the check substitutes x = h."],
      ],
      exitTicket: {
        items: ["Write x² + 10x + 7 in vertex form and give its minimum.", "Write x² − 7x in vertex form.", "Find the maximum of −x² + 4x + 1 and where it occurs."],
        answers: ["(x + 5)² − 18; minimum −18 at x = −5.", "(x − 3.5)² − 12.25", "−(x − 2)² + 5: maximum 5 at x = 2."],
      },
    },
    answerKey(lv) {
      const p = parts(lv);
      return { prompt: pstr(lv), solution: (p.a !== 1 ? "Factor out " + n(p.a) + "; " : "") + "half of " + n(p.inner) + " is " + n(p.half) + "; corner " + n(p.corner) + "; " + vform(lv),
        answer: (p.a > 0 ? "min " : "max ") + n(p.k) + " at x = " + n(p.h) };
    },
  });
})();
