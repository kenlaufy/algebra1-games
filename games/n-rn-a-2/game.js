/* Exponent Blocks · AI.N-RN.A.2 */
(function () {
  const A = window.Cartoon, Alg = window.Alg;
  const LEVELS = [
    { stage: 1, expr: "√(x⁶)", n: 6, k: 2, steps: [["Split 6 blocks into 2 equal towers: each tower has [] blocks", [3]], ["So √(x⁶) = x<sup>[]</sup>", [3]]],
      answer: "√(x⁶) = x³", check: "With x = 2: √(2⁶) = √64 = 8 = 2³ ✓", tip: "A square root splits the tower into 2 equal towers." },
    { stage: 1, expr: "∛(x⁶)", n: 6, k: 3, steps: [["Split 6 blocks into 3 equal towers: [] blocks each", [2]], ["So ∛(x⁶) = x<sup>[]</sup>", [2]]],
      answer: "∛(x⁶) = x²", check: "With x = 2: ∛64 = 4 = 2² ✓", tip: "A cube root splits it into 3 towers." },
    { stage: 1, expr: "√(x⁸)", n: 8, k: 2, steps: [["8 blocks into 2 towers: [] blocks each", [4]], ["√(x⁸) = x<sup>[]</sup>", [4]]],
      answer: "√(x⁸) = x⁴", check: "With x = 2: √256 = 16 = 2⁴ ✓", tip: "Same idea, taller tower." },
    { stage: 1, expr: "∛(x¹²)", n: 12, k: 3, steps: [["12 blocks into 3 towers: [] blocks each", [4]], ["∛(x¹²) = x<sup>[]</sup>", [4]]],
      answer: "∛(x¹²) = x⁴", check: "With x = 2: ∛4096 = 16 = 2⁴ ✓", tip: "Do you see the pattern? Divide the exponent by the root." },
    { stage: 2, expr: "√x", n: 1, k: 2, steps: [["One block split into 2 equal towers: each tower is []/[] of a block", [1, 2]], ["So √x = x<sup>[]/[]</sup>", [1, 2]]],
      answer: "√x = x<sup>1/2</sup>", check: "x<sup>1/2</sup> · x<sup>1/2</sup> = x<sup>1</sup> = x, just like √x · √x = x ✓", tip: "What if the blocks don't split evenly?" },
    { stage: 2, expr: "∛(x²)", n: 2, k: 3, steps: [["2 blocks into 3 equal towers: each is []/[] of a block", [2, 3]], ["∛(x²) = x<sup>[]/[]</sup>", [2, 3]]],
      answer: "∛(x²) = x<sup>2/3</sup>", check: "(x<sup>2/3</sup>)³ = x<sup>2</sup> ✓", tip: "Fractional towers are fine." },
    { stage: 2, expr: "(√x)⁶", n: 1, k: 2, times: 6, steps: [["√x = x<sup>1/2</sup>. Six of them multiplied: x<sup>1/2 × 6</sup> = x<sup>[]</sup>", [3]]],
      answer: "(√x)⁶ = x³", check: "With x = 4: (√4)⁶ = 2⁶ = 64 = 4³ ✓", tip: "Stack 6 half-blocks." },
    { stage: 2, expr: "x<sup>3/2</sup>", n: 3, k: 2, choice: { c: "Which of these equals x<sup>3/2</sup>?", o: [["√(x³)", ""], ["x³ ÷ 2", "3/2 is an exponent: it means split 3 blocks into 2 towers, not divide x³ by 2."], ["∛(x²)", "That's x<sup>2/3</sup>: 2 blocks into 3 towers."]] },
      steps: [["Check with x = 4: 4<sup>3/2</sup> = √(4³) = √64 = []", [8]]], answer: "x<sup>3/2</sup> = √(x³)", check: "4<sup>3/2</sup> = 8 ✓", tip: "Numerator: how many blocks. Denominator: how many towers." },
    { stage: 3, expr: "8<sup>2/3</sup>", n: 2, k: 3, num: 8, steps: [["8<sup>1/3</sup> = ∛8 = []", [2]], ["8<sup>2/3</sup> = (∛8)² = []", [4]]],
      answer: "8<sup>2/3</sup> = 4", check: "4 × 4 × 4 = 64 = 8² ✓", tip: "Numbers now. Take the root first; it keeps numbers small." },
    { stage: 3, expr: "16<sup>3/4</sup>", n: 3, k: 4, num: 16, steps: [["16<sup>1/4</sup> = ∜16 = []", [2]], ["16<sup>3/4</sup> = 2³ = []", [8]]],
      answer: "16<sup>3/4</sup> = 8", check: "8⁴ = 4096 = 16³ ✓", tip: "Root first, then the power." },
    { stage: 3, expr: "x<sup>1/2</sup> · x<sup>1/3</sup>", n: 1, k: 2, steps: [["Multiplying adds exponents: 1/2 + 1/3 = []/[]", [5, 6]], ["So x<sup>1/2</sup> · x<sup>1/3</sup> = x<sup>[]/[]</sup>", [5, 6]]],
      answer: "x<sup>1/2</sup> · x<sup>1/3</sup> = x<sup>5/6</sup>", check: "With x = 64: 8 × 4 = 32 = 64<sup>5/6</sup> ✓", tip: "The same exponent rules work for fractions." },
    { stage: 3, expr: "(x<sup>2/3</sup>)³", n: 2, k: 3, steps: [["A power of a power multiplies exponents: 2/3 × 3 = []", [2]], ["(x<sup>2/3</sup>)³ = x<sup>[]</sup>", [2]]],
      answer: "(x<sup>2/3</sup>)³ = x²", check: "With x = 8: (8<sup>2/3</sup>)³ = 4³ = 64 = 8² ✓", tip: "Last one: stack three 2/3-towers." },
  ];

  function picture(lv, split) {
    let s = A.backdrop(900, 330, { ground: 300, clouds: false });
    const bh = Math.min(70, 220 / Math.max(lv.n, 1)), bw = 60;
    const block = (x, y, frac, label, faded) => {
      const h = bh * frac;
      return '<rect x="' + x + '" y="' + (y - h) + '" width="' + bw + '" height="' + h + '" rx="4" fill="#5a78b8" ' + A.OUT + (faded ? ' opacity="0.35"' : "") + "/>" +
        (frac === 1 && label ? A.text(x + bw / 2, y - h / 2 + 7, label, { size: 18, fill: "#fff" }) : "");
    };
    const whole = (lv.num || "x") + (lv.n > 1 ? Alg.sup(lv.n) : "");
    const tower = (x, faded) => {
      let t = "";
      for (let i = 0; i < lv.n; i++) t += block(x, 296 - i * bh, 1, lv.num ? "" : "x", faded);
      return t + A.text(x + bw / 2, 296 - lv.n * bh - 14, whole, { size: 22, var: !lv.num });
    };
    if (!split) {
      s += tower(150, false);
      s += A.text(480, 150, lv.expr.replace(/<sup>([0-9/]+)<\/sup>/g, (_, p) => Alg.sup(p)), { size: 40, var: false });
    } else {
      s += tower(60, true);
      const each = lv.n / lv.k;
      for (let t = 0; t < lv.k; t++) {
        const x = 200 + t * (bw + 26);
        let y = 296, left = each;
        while (left > 1e-9) { const f = Math.min(1, left); s += block(x, y, f, f === 1 && !lv.num ? "x" : ""); y -= bh * f; left -= f; }
        s += A.text(x + bw / 2, y - 12, (Number.isInteger(each) ? String(each) : lv.n + "/" + lv.k), { size: 20, var: false });
      }
      s += A.text(640, 120, lv.k + " equal towers", { size: 28, var: false });
      s += A.text(640, 160, Number.isInteger(each) ? each + (each === 1 ? " block" : " blocks") + " per tower" : lv.n + "/" + lv.k + " of a block per tower", { size: 20, var: false });
    }
    s += A.mascot(820, 296, split ? "joy" : "think");
    return s;
  }

  GameShell.register({
    slug: "n-rn-a-2",
    title: "Exponent Blocks",
    firstMove: "Predict the height of one tower after the split. Type your answer and choose Check to see how the blocks regroup.",
    subtitle: "Rewrite radicals and rational exponents",
    stages: { 1: "Stage 1 · Even splits", 2: "Stage 2 · Fractional towers", 3: "Stage 3 · Numbers and rules" },
    levels: LEVELS,
    help: {
      intro: "x⁶ is a tower of 6 blocks multiplied together. A root splits the tower into equal towers: √ makes 2, ∛ makes 3.",
      steps: [
        "Figure out how tall each tower is: that's the new exponent.",
        "If the blocks don't split evenly, the exponent is a fraction: blocks over towers.",
        "Use the same exponent rules with fractions: add exponents when multiplying, multiply them for a power of a power.",
        "Fewer wrong answers means more stars.",
      ],
      note: "For a fraction, enter the numerator first and the denominator second.",
    },
    load(lv, api) {
      const svg = api.svg("0 0 900 330", "Tower of blocks");
      api.stage.append(api.h("div", { class: "stage-text", html: lv.expr }), svg);
      if (!lv.num) api.stage.prepend(api.h("p", { class: "domain-note" }, "Assume x ≥ 0."));
      let split = false;
      const draw = () => { svg.innerHTML = picture(lv, split); };
      draw();
      const steps = [];
      if (lv.choice) steps.push({ type: "choice", prompt: lv.choice.c, options: lv.choice.o.map((o, i) => ({ label: o[0], ok: i === 0, why: o[1].replace(/<sup>([0-9/]+)<\/sup>/g, (_, p) => Alg.sup(p)) })),
        onDone: () => { split = true; draw(); } });
      lv.steps.forEach((st, i) => steps.push({ type: "input", prompt: st[0], answers: st[1],
        accept: st[1].length === 2 ? ([top, bottom]) => {
          if (!Number.isSafeInteger(top) || !Number.isSafeInteger(bottom) || bottom === 0)
            return "Use whole numbers for both parts of the fraction and a nonzero denominator.";
          return top * st[1][1] === bottom * st[1][0] || (lv === LEVELS[10] ?
            "Rewrite the two exponents with a common denominator before adding." :
            "The numerator counts blocks and the denominator counts equal towers. Compare the two ratios.");
        } : null,
        fieldLabels: st[1].length === 2 ? ["Numerator", "Denominator"] : null,
        hint: lv.num ? "Find the root first. Then raise that value to the numerator’s power." :
          lv === LEVELS[10] ? "Use sixths to add one half and one third." :
          lv === LEVELS[11] || lv.times ? "For a power raised to a power, multiply the exponents." :
          "Divide " + lv.n + " blocks among " + lv.k + " towers. Each tower gets the same share.",
        onDone: () => { if (i === 0) { split = true; draw(); } } }));
      Steps.run(api, { steps, logTitle: "Your work", result: () => ({ answer: lv.answer, check: lv.check }) });
    },
    guide: {
      evidence: "Ask the student to use the tower to explain both numbers in a fractional exponent, then reverse the split by raising the result to the root index.",
      summary: "Variables are nonnegative throughout this game. A power is drawn as a tower of blocks; a root splits it into equal towers, which makes fractional exponents visible. Students rewrite radicals as exponents, evaluate numeric rational powers, and apply exponent rules to fractions.",
      also: "<span class='code'>AI.N-RN.A.1</span> the meaning of rational exponents.",
      practices: "MP7 Look for and make use of structure · MP6 Attend to precision",
      goals: [
        "Rewrite radicals as rational exponents and back, e.g. ∛(x²) = x<sup>2/3</sup>.",
        "Evaluate numeric rational powers such as 8<sup>2/3</sup> and 16<sup>3/4</sup>.",
        "Apply the product and power-of-a-power rules with fractional exponents.",
      ],
      howItWorks: "Each level shows an expression and a tower of x blocks. Entering the first answer splits the tower into k equal towers for a k-th root; uneven splits show fractional blocks. Later steps ask for the exponent or value. Stage 3 adds numbers and exponent rules.",
      stageNotes: {
        1: { sees: "Towers that split evenly.", builds: "Root as division of the exponent." },
        2: { sees: "Towers that split into fractions; equivalent forms.", builds: "x<sup>m/n</sup> as the n-th root of x<sup>m</sup>." },
        3: { sees: "Numeric bases and exponent rules.", builds: "Evaluating rational powers; adding and multiplying fractional exponents." },
      },
      discussion: [
        "Why does x<sup>1/2</sup> have to mean √x if we want x<sup>1/2</sup> · x<sup>1/2</sup> = x?",
        "Is it easier to compute 8<sup>2/3</sup> as (∛8)² or ∛(8²)? Why?",
        "What does the denominator of a fractional exponent tell you? The numerator?",
      ],
      misconceptions: [
        ["x<sup>3/2</sup> means x³ ÷ 2", "Level 8's distractor explains the exponent meaning."],
        ["Mixing up x<sup>2/3</sup> and x<sup>3/2</sup>", "The tower picture shows blocks over towers."],
        ["Adding fractions incorrectly when multiplying powers", "Level 11 requires 1/2 + 1/3 = 5/6."],
      ],
      exitTicket: {
        items: ["Rewrite ∜(x³) with a rational exponent.", "Evaluate 27<sup>2/3</sup>.", "Simplify x<sup>3/4</sup> · x<sup>1/4</sup>."],
        answers: ["x<sup>3/4</sup>", "(∛27)² = 3² = 9", "x<sup>1</sup> = x"],
      },
    },
    answerKey(lv) {
      const fill = (st) => { let k = 0; return st[0].replace(/\[\]/g, () => st[1][k++]); };
      return { prompt: lv.expr + (lv.num ? "" : " (x ≥ 0)"), solution: (lv.choice ? lv.choice.o[0][0] + "; " : "") + lv.steps.map(fill).join("; "), answer: lv.answer };
    },
  });
})();
