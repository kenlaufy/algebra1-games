/* Master Key · AI.A-REI.B.4.a */
(function () {
  const A = window.Cartoon, M = "−";
  const SQ = "√";
  const fr = Alg.fractionHTML;
  // step: [prompt, answers, unordered?, showAfter] for inputs, or { c: prompt, o: [[label, why]...], show } for choices
  const LEVELS = [
    { stage: 1, eq: "x² + 6x + 5 = 0", steps: [["Move the constant: x² + 6x = []", [-5], 0, "x² + 6x = −5"],
      ["The missing corner is (6 ÷ 2)² = []. Add it to both sides.", [9], 0, "x² + 6x + 9 = 4"], ["(x + [])² = []", [3, 4], 0, "(x + 3)² = 4"],
      ["x + 3 = 2 or x + 3 = −2, so x = [] or []", [-1, -5], 1, "x = −1 or x = −5"]], answer: "x = −1 or x = −5", check: "(−1)² + 6(−1) + 5 = 0 ✓",
      tip: "Make the left side a perfect square, then take square roots." },
    { stage: 1, eq: "x² − 4x − 5 = 0", steps: [["Move the constant: x² − 4x = []", [5], 0, "x² − 4x = 5"],
      ["Add the corner (−4 ÷ 2)² = [] to both sides", [4], 0, "x² − 4x + 4 = 9"], ["(x + [])² = []", [-2, 9], 0, "(x − 2)² = 9"],
      ["x − 2 = ±3, so x = [] or []", [5, -1], 1, "x = 5 or x = −1"]], answer: "x = 5 or x = −1", check: "5² − 4(5) − 5 = 0 ✓",
      tip: "Half of −4 is −2, but the corner is still positive." },
    { stage: 1, eq: "x² − 8x + 12 = 0", steps: [["Move the constant: x² − 8x = []", [-12], 0, "x² − 8x = −12"],
      ["Add the corner: []", [16], 0, "x² − 8x + 16 = 4"], ["(x + [])² = []", [-4, 4], 0, "(x − 4)² = 4"],
      ["x = [] or []", [6, 2], 1, "x = 6 or x = 2"]], answer: "x = 6 or x = 2", check: "6² − 8(6) + 12 = 0 ✓", tip: "Same steps. You've got this." },
    { stage: 1, eq: "x² + 10x + 16 = 0", steps: [["Move the constant: x² + 10x = []", [-16], 0, "x² + 10x = −16"],
      ["Add the corner: []", [25], 0, "x² + 10x + 25 = 9"], ["(x + [])² = []", [5, 9], 0, "(x + 5)² = 9"],
      ["x = [] or []", [-2, -8], 1, "x = −2 or x = −8"]], answer: "x = −2 or x = −8", check: "(−2)² + 10(−2) + 16 = 0 ✓", tip: "Last of the warm-ups." },
    { stage: 2, eq: "x² + 4x + 1 = 0", steps: [["Move the constant: x² + 4x = []", [-1], 0, "x² + 4x = −1"],
      ["Add the corner: []", [4], 0, "x² + 4x + 4 = 3"], ["(x + [])² = []", [2, 3], 0, "(x + 2)² = 3"],
      ["3 isn't a perfect square, so leave the root: x = [] ± √[]", [-2, 3], 0, "x = −2 ± √3"]], answer: "x = −2 ± √3", check: "≈ −0.27 and −3.73; both make x² + 4x + 1 ≈ 0 ✓",
      tip: "Not every square root is a whole number." },
    { stage: 2, eq: "2x² + 12x + 10 = 0", steps: [["The x² needs a coefficient of 1. Divide everything by 2: x² + []x + [] = 0", [6, 5], 0, "x² + 6x + 5 = 0"],
      ["Move the constant: x² + 6x = []", [-5], 0, "x² + 6x = −5"], ["Add the corner: []", [9], 0, "x² + 6x + 9 = 4"],
      ["(x + [])² = []", [3, 4], 0, "(x + 3)² = 4"], ["x = [] or []", [-1, -5], 1, "x = −1 or x = −5"]], answer: "x = −1 or x = −5", check: "2(1) − 12 + 10 = 0 ✓",
      tip: "A leading coefficient other than 1. Deal with it first." },
    { stage: 2, eq: "x² − 3x − 4 = 0", steps: [["Move the constant: x² − 3x = []", [4], 0, "x² − 3x = 4"],
      ["Half of −3 is −1.5. Add the corner (−1.5)² = []", [2.25], 0, "x² − 3x + 2.25 = 6.25"], ["(x + [])² = []", [-1.5, 6.25], 0, "(x − 1.5)² = 6.25"],
      ["x − 1.5 = ±2.5, so x = [] or []", [4, -1], 1, "x = 4 or x = −1"]], answer: "x = 4 or x = −1", check: "4² − 3(4) − 4 = 0 ✓", tip: "An odd middle term gives decimals. Keep going." },
    { stage: 2, eq: "x² + 6x + 13 = 0", steps: [["Move the constant: x² + 6x = []", [-13], 0, "x² + 6x = −13"],
      ["Add the corner: []", [9], 0, "x² + 6x + 9 = −4"], ["(x + [])² = []", [3, -4], 0, "(x + 3)² = −4"],
      { c: "(x + 3)² = −4. What does that tell you?", o: [["No real solutions: a square can't be negative", ""], ["x + 3 = −2, so x = −5", "(−2)² is +4, not −4."], ["x + 3 = ±2", "Squaring ±2 gives +4, not −4."]], show: "No real solutions" }],
      answer: "No real solutions", check: "(x + 3)² + 4 is at least 4 for every x, so it never equals 0 ✓", tip: "Something different happens at the last step." },
    { stage: 3, eq: "x² + bx + c = 0", steps: [
      { c: "Now with letters. Move the constant:", o: [["x² + bx = " + M + "c", ""], ["x² + bx = c", "Subtracting c from both sides leaves −c on the right."], ["x² = " + M + "bx " + M + " c", "Keep the x terms together on the left."]], show: "x² + bx = −c" },
      { c: "The strips are each b/2 wide. Add the corner to both sides:", o: [["x² + bx + " + fr("b²", "4") + " = " + fr("b²", "4") + " " + M + " c", ""], ["x² + bx + b² = b² " + M + " c", "The corner is (b/2)², not b²."], ["x² + bx + " + fr("b", "2") + " = " + fr("b", "2") + " " + M + " c", "The corner is a square: (b/2)²."]], show: "x² + bx + b²/4 = b²/4 − c" },
      { c: "The left side is a perfect square:", o: [["(x + " + fr("b", "2") + ")² = " + fr("b²", "4") + " " + M + " c", ""], ["(x + b)² = " + fr("b²", "4") + " " + M + " c", "(x + b)² = x² + 2bx + b²."], ["(x² + " + fr("b", "2") + ")² = " + fr("b²", "4") + " " + M + " c", "Only x is squared inside."]], show: "(x + b/2)² = b²/4 − c" }],
      answer: "(x + b/2)² = b²/4 − c", check: "Same steps as level 1, with b = 6 and c = 5: (x + 3)² = 9 − 5 = 4 ✓", tip: "The same moves as level 1, with letters. This is how the master key is forged." },
    { stage: 3, eq: "ax² + bx + c = 0", steps: [
      { c: "First make the x² coefficient 1:", o: [["x² + " + fr("b", "a") + "x + " + fr("c", "a") + " = 0", ""], ["x² + bx + c = a", "Divide every term by a; don't move a."], ["x² + " + fr("b", "a") + "x + c = 0", "Every term gets divided by a, including c."]], show: "x² + (b/a)x + c/a = 0" },
      { c: "Move the constant and add the corner (b/(2a))² to both sides:", o: [["x² + " + fr("b", "a") + "x + " + fr("b²", "4a²") + " = " + fr("b²", "4a²") + " " + M + " " + fr("c", "a"), ""], ["x² + " + fr("b", "a") + "x + " + fr("b²", "4a") + " = " + fr("b²", "4a") + " " + M + " " + fr("c", "a"), "(b/(2a))² = b²/(4a²): square the a too."], ["x² + " + fr("b", "a") + "x = " + M + fr("c", "a") + " + " + fr("b", "2a"), "The corner is the square of half the x coefficient."]], show: "x² + (b/a)x + b²/(4a²) = b²/(4a²) − c/a" },
      { c: "Write the left side as a square and combine the right side over 4a²:", o: [["(x + " + fr("b", "2a") + ")² = " + fr("b² " + M + " 4ac", "4a²"), ""], ["(x + " + fr("b", "a") + ")² = " + fr("b² " + M + " 4ac", "4a²"), "Half of b/a is b/(2a)."], ["(x + " + fr("b", "2a") + ")² = " + fr("b² " + M + " c", "4a²"), "c/a = 4ac/(4a²), so the numerator is b² − 4ac."]], show: "(x + b/(2a))² = (b² − 4ac)/(4a²)" }],
      answer: "(x + b/(2a))² = (b² − 4ac)/(4a²)", check: "This is the form (x − p)² = q with p = −b/(2a) and q = (b² − 4ac)/(4a²) ✓", tip: "For a quadratic, a ≠ 0. Divide every term by a." },
    { stage: 3, eq: "(x + b/(2a))² = (b² − 4ac)/(4a²)", steps: [
      { c: "Take the square root of both sides:", o: [["x + " + fr("b", "2a") + " = ±" + fr(SQ + "(b² " + M + " 4ac)", "2a"), ""], ["x + " + fr("b", "2a") + " = " + fr(SQ + "(b² " + M + " 4ac)", "2a"), "Don't forget the ± : both roots square to the same number."], ["x + " + fr("b", "2a") + " = ±" + fr("b " + M + " 2" + SQ + "(ac)", "2a"), "The square root of a difference isn't the difference of square roots."]], show: "x + b/(2a) = ±√(b² − 4ac)/(2a)" },
      { c: "Subtract b/(2a) from both sides:", o: [["x = " + fr(M + "b ± " + SQ + "(b² " + M + " 4ac)", "2a"), ""], ["x = " + fr("b ± " + SQ + "(b² " + M + " 4ac)", "2a"), "Subtracting b/(2a) makes it −b."], ["x = " + M + "b ± " + fr(SQ + "(b² " + M + " 4ac)", "2a"), "Both pieces are over 2a."]], show: "x = (−b ± √(b² − 4ac)) / (2a)" }],
      answer: "x = (−b ± √(b² − 4ac)) / (2a)", check: "You built the quadratic formula: the master key ✓", tip: "Two more moves to forge the key." },
    { stage: 3, eq: "2x² + 3x − 2 = 0", steps: [["Use the master key with a = 2, b = 3, c = −2. First: b² − 4ac = []", [25], 0, "b² − 4ac = 9 + 16 = 25"],
      ["x = (−3 ± √25) / (2 × 2) = (−3 ± []) / []", [5, 4], 0, "x = (−3 ± 5)/4"], ["x = [] or []", [0.5, -2], 1, "x = 1/2 or x = −2"]],
      answer: "x = 1/2 or x = −2", check: "2(1/2)² + 3(1/2) − 2 = 0.5 + 1.5 − 2 = 0 ✓", tip: "Last one: test the key you just built." },
  ];

  GameShell.register({
    slug: "a-rei-b-4-a",
    title: "Master Key",
    firstMove: "Forge the quadratic formula. Fill in the missing number or choose the next equation to complete the square.",
    subtitle: "Complete the square, then derive the quadratic formula",
    stages: { 1: "Stage 1 · (x − p)² = q with numbers", 2: "Stage 2 · Harder numbers", 3: "Stage 3 · Forge the master key" },
    levels: LEVELS,
    help: {
      intro: "Every quadratic equation can be turned into the form <b>(x − p)² = q</b>. Do it with numbers, then with letters, and you'll build the quadratic formula yourself.",
      steps: [
        "Move the constant to the right side.",
        "Add the missing corner (half the x coefficient, squared) to <b>both</b> sides.",
        "Write the left side as a square, then take square roots (±!).",
        "In stage 3, choose each next line of the derivation.",
      ],
      note: "Decimals and fractions are fine in the boxes: 2.25, 9/4, 1/2.",
    },
    load(lv, api) {
      const view = api.h("div", { class: "stage-text", style: { lineHeight: "1.4" } });
      const svg = api.svg("0 0 900 170", "Key forge");
      api.stage.append(view, svg);
      let shown = lv.eq;
      const keyParts = LEVELS.indexOf(lv) - 7; // stage 3 progress
      const draw = (joy) => {
        view.textContent = shown;
        let s = A.backdrop(900, 170, { ground: 150, clouds: false });
        // a key that gets more complete through stage 3
        const pieces = lv.stage < 3 ? 0 : Math.max(0, Math.min(4, keyParts));
        s += '<g transform="translate(300 40)"><circle cx="40" cy="45" r="34" fill="' + (pieces >= 1 ? "#e7b84a" : "#efe4c8") + '" ' + A.OUT + '/><circle cx="40" cy="45" r="12" fill="#c3d9ea" ' + A.OUT + "/>" +
          '<rect x="72" y="37" width="170" height="16" rx="6" fill="' + (pieces >= 2 ? "#e7b84a" : "#efe4c8") + '" ' + A.OUT + "/>" +
          '<rect x="200" y="53" width="14" height="24" fill="' + (pieces >= 3 ? "#e7b84a" : "#efe4c8") + '" ' + A.OUT + '/><rect x="226" y="53" width="14" height="32" fill="' + (pieces >= 4 ? "#e7b84a" : "#efe4c8") + '" ' + A.OUT + "/></g>";
        s += A.mascot(760, 150, joy ? "joy" : "think", 0.8);
        svg.innerHTML = s;
      };
      draw(false);
      const steps = lv.steps.map((st, index) => Array.isArray(st)
        ? { type: "input", prompt: st[0], answers: st[1], unordered: !!st[2], done: st[3], hint: st[2] ? "Use each sign of the square root, then isolate x in both equations." :
              /corner/.test(st[0]) ? "Take half the coefficient of x and square the whole result." :
              /Move the constant/.test(st[0]) ? "Undo the constant term by adding its opposite to both sides." :
              index === 0 && lv.stage === 3 ? "In b² − 4ac, multiply a by the signed value of c before subtracting." :
              "Use the equation shown above. Check that both sides still have the same value.",
            onDone: () => { shown = st[3]; draw(false); } }
        : { type: "choice", prompt: st.c, options: st.o.map((o, k) => ({ label: o[0], ok: k === 0, why: o[1] })), done: st.show, onDone: () => { shown = st.show; draw(false); } });
      Steps.run(api, { steps, logTitle: "Your work", result: () => { draw(true); return { answer: lv.answer, check: lv.check }; } });
    },
    guide: {
      evidence: "Pause before the missing corner appears. Ask how its size follows from the middle coefficient and why both sides need the same addition.",
      summary: "A 12-level game for completing the square on equations. Students transform equations into (x − p)² = q with numbers, handle non-perfect squares and no real solutions, then repeat the same moves with letters to derive the quadratic formula.",
      also: "<span class='code'>AI.A-SSE.B.3.b</span> completing the square in expressions.",
      practices: "MP8 Look for and express regularity in repeated reasoning · MP3 Construct viable arguments",
      goals: [
        "Use completing the square to rewrite a quadratic equation as (x − p)² = q with the same solutions.",
        "Solve from that form, including irrational solutions and the case q < 0.",
        "Derive the quadratic formula by applying the same steps to ax² + bx + c = 0.",
      ],
      howItWorks: "Stages 1 and 2 walk through numeric equations step by step (move the constant, add the corner, write the square, take ± square roots), with the current equation updating after every step. Stage 3 asks students to choose each next line of the derivation from options whose distractors are common algebra errors, building up a key that completes on level 11. Level 12 uses the formula.",
      stageNotes: {
        1: { sees: "Monic equations with perfect-square q.", builds: "The completing-the-square routine." },
        2: { sees: "Irrational roots, a leading coefficient of 2, decimals, and q < 0.", builds: "Flexibility; recognizing no real solutions." },
        3: { sees: "Letters b, c, then a.", builds: "The derivation of x = (−b ± √(b² − 4ac)) / (2a)." },
      },
      discussion: [
        "Why must the corner be added to both sides?",
        "What does (x + 3)² = −4 tell you about the graph of y = x² + 6x + 13?",
        "Compare level 1 and level 9 line by line. What changed and what stayed the same?",
      ],
      misconceptions: [
        ["Adding the corner to one side only", "Inputs model adding it to both sides; the equation display updates."],
        ["Forgetting ± when taking square roots", "Two-answer steps require both roots; level 11's distractor omits ±."],
        ["(b/(2a))² = b²/(4a)", "Level 10's distractor is explained."],
        ["√(b² − 4ac) = b − 2√(ac)", "Level 11's distractor is explained."],
      ],
      exitTicket: {
        items: ["Solve by completing the square: x² + 8x + 7 = 0", "Rewrite x² − 2x − 6 = 0 as (x − p)² = q and solve.", "Use the quadratic formula: x² − 5x + 6 = 0"],
        answers: ["(x + 4)² = 9, so x = −1 or x = −7.", "(x − 1)² = 7, so x = 1 ± √7.", "x = (5 ± 1)/2, so x = 3 or x = 2."],
      },
    },
    answerKey(lv) {
      const strip = (s) => s.replace(/<span class="frac"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g, "($1)/($2)");
      return { prompt: lv.eq, solution: lv.steps.map((s) => Array.isArray(s) ? s[3] : strip(s.o[0][0])).join("; "), answer: lv.answer };
    },
  });
})();
