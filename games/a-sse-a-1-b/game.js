/* Packing · AI.A-SSE.A.1.b */
(function () {
  const M = "−";
  const BOX = '<span class="pack" aria-label="box">&nbsp;&nbsp;</span>';
  const I = (s) => s.replace(/\bx\b/g, "<i>x</i>").replace(/\bt\b/g, "<i>t</i>");
  const pack = (opts) => opts.map((o, k) => ({ label: o[0], ok: k === 0, why: o[1] }));
  // Each level: expr (before packing), packed (after), chunk options for the pack step, then steps.
  const LEVELS = [
    { stage: 1, expr: "3(x + 1) = 12", chunk: "x + 1", packed: "3" + BOX + " = 12",
      opts: [["x + 1", ""], ["3", "3 appears once and isn't the hard part. What piece is inside the parentheses?"], ["x", "x is only part of the chunk. Pack the whole thing inside the parentheses."]],
      steps: [["3 × box = 12, so box = []", [4]], ["x + 1 = 4, so x = []", [3]]], answer: "x = 3", check: "3(3 + 1) = 12 ✓",
      tip: "Pack a chunk into a box and treat it as one thing." },
    { stage: 1, expr: "2(x " + M + " 3) + 5 = 13", chunk: "x " + M + " 3", packed: "2" + BOX + " + 5 = 13",
      opts: [["x " + M + " 3", ""], ["2(x " + M + " 3) + 5", "That's almost everything. Pack just the part in parentheses."], ["5", "5 isn't repeated or hidden inside anything."]],
      steps: [["2 × box + 5 = 13, so box = []", [4]], ["x " + M + " 3 = 4, so x = []", [7]]], answer: "x = 7", check: "2(7 " + M + " 3) + 5 = 13 ✓",
      tip: "Same idea: pack, solve for the box, unpack." },
    { stage: 1, expr: "(x + 2)² = 25", chunk: "x + 2", packed: BOX + "² = 25",
      opts: [["x + 2", ""], ["x²", "The square applies to all of (x + 2), not just x."], ["25", "25 is already a single number."]],
      steps: [["box² = 25, so box = [] or []", [5, -5], true], ["x + 2 = 5 or x + 2 = " + M + "5, so x = [] or []", [3, -7], true]],
      answer: "x = 3 or x = " + M + "7", check: "(3 + 2)² = 25 and (" + M + "7 + 2)² = 25 ✓", tip: "A box squared can come from two different numbers." },
    { stage: 1, expr: "5(2x " + M + " 1) " + M + " 2(2x " + M + " 1) = 9", chunk: "2x " + M + " 1", packed: "5" + BOX + " " + M + " 2" + BOX + " = 9",
      opts: [["2x " + M + " 1", ""], ["5(2x " + M + " 1)", "That only packs one of the two copies. Which chunk appears twice?"], ["2x", "Pack the whole repeated chunk, not part of it."]],
      steps: [["5 boxes " + M + " 2 boxes = 3 boxes = 9, so box = []", [3]], ["2x " + M + " 1 = 3, so x = []", [2]]], answer: "x = 2", check: "5(3) " + M + " 2(3) = 9 ✓",
      tip: "The same chunk shows up twice. Pack it, then combine." },
    { stage: 2, expr: "Savings account: A = 500(1.04)<sup>t</sup>", chunk: "1.04", packed: "A = 500 · " + BOX + "<sup>t</sup>",
      opts: [["1.04", ""], ["500", "500 is the starting amount. What gets multiplied in every year?"], ["t", "t counts the years. Pack the number that's multiplied each year."]],
      steps: [{ type: "choice", prompt: "What does 500 mean?", options: [["The amount at the start (t = 0)", ""], ["The interest earned each year", "At t = 0, (1.04)⁰ = 1, so A = 500. That's the start."], ["The amount after t years", "That's A, the whole expression."]] },
        { type: "choice", prompt: "Each year the amount is multiplied by the box (1.04). Is the box more or less than 1?", options: [["More than 1, so the savings grow", ""], ["Less than 1, so the savings shrink", "1.04 is bigger than 1."]] },
        ["1.04 = 1 + 0.04. The savings grow by []% per year", [4]]],
      answer: "500 at the start, growing 4% per year", check: "After 1 year: 500 × 1.04 = 520 ✓", tip: "Real formulas have structure too. Pack the growth factor." },
    { stage: 2, expr: "Car value: V = 18000(0.85)<sup>t</sup>", chunk: "0.85", packed: "V = 18000 · " + BOX + "<sup>t</sup>",
      opts: [["0.85", ""], ["18000", "That's the price when new. What's multiplied every year?"], ["18000(0.85)", "Pack just the yearly factor."]],
      steps: [{ type: "choice", prompt: "Is the box (0.85) more or less than 1?", options: [["Less than 1, so the value goes down", ""], ["More than 1, so the value goes up", "0.85 is less than 1."]] },
        ["0.85 = 1 " + M + " 0.15. The car loses []% of its value each year", [15]]],
      answer: "18000 new, losing 15% per year", check: "After 1 year: 18000 × 0.85 = 15300 ✓", tip: "Growing or shrinking? The box decides." },
    { stage: 2, expr: "Cooling coffee: T = 70 + 130(0.9)<sup>t</sup>", chunk: "130(0.9)<sup>t</sup>", packed: "T = 70 + " + BOX,
      opts: [["130(0.9)<sup>t</sup>", ""], ["70", "70 never changes. Pack the part that changes with time."], ["0.9", "Pack the whole changing part: 130(0.9)ᵗ."]],
      steps: [["As t gets very large, the box gets closer and closer to []", [0]], ["So the temperature T gets closer to []°", [70]],
        { type: "choice", prompt: "What does 70 represent?", options: [["The room temperature", ""], ["The starting temperature", "At t = 0, T = 70 + 130 = 200. That's the start."], ["How fast it cools", "The 0.9 controls how fast it cools."]] }],
      answer: "T approaches 70°, the room temperature", check: "Start: 70 + 130 = 200°. Later: 70 + a tiny number ≈ 70° ✓", tip: "Pack the part that changes over time." },
    { stage: 2, expr: "y = (x + 3)² " + M + " 4", chunk: "(x + 3)²", packed: "y = " + BOX + " " + M + " 4",
      opts: [["(x + 3)²", ""], ["x + 3", "Pack the whole squared chunk, so the box is (x + 3)²."], ["4", "Pack the part that can change."]],
      steps: [["A square is never negative. The smallest the box can be is []", [0]], ["So the smallest y can be is []", [-4]], ["That happens when x + 3 = 0, at x = []", [-3]]],
      answer: "Minimum y = " + M + "4 at x = " + M + "3", check: "(" + M + "3 + 3)² " + M + " 4 = " + M + "4 ✓", tip: "What's the smallest a square can be?" },
    { stage: 3, expr: "2(x + 4)² = 32", chunk: "x + 4", packed: "2" + BOX + "² = 32",
      opts: [["x + 4", ""], ["2(x + 4)", "The 2 isn't inside the square. Pack x + 4."], ["(x + 4)²", "That works too, but pack x + 4 so you can find x."]],
      steps: [["2 × box² = 32, so box² = []", [16]], ["box = [] or []", [4, -4], true], ["x + 4 = 4 or x + 4 = " + M + "4, so x = [] or []", [0, -8], true]],
      answer: "x = 0 or x = " + M + "8", check: "2(0 + 4)² = 32 and 2(" + M + "8 + 4)² = 32 ✓", tip: "Pack, then undo one operation at a time." },
    { stage: 3, expr: "7 " + M + " 2(3 " + M + " x) = 15", chunk: "3 " + M + " x", packed: "7 " + M + " 2" + BOX + " = 15",
      opts: [["3 " + M + " x", ""], ["7 " + M + " 2", "7 − 2 isn't a group here: the 2 multiplies the parentheses first."], ["x", "Pack the whole chunk in parentheses."]],
      steps: [["7 " + M + " 2 × box = 15, so box = []", [-4]], ["3 " + M + " x = " + M + "4, so x = []", [7]]], answer: "x = 7", check: "7 " + M + " 2(3 " + M + " 7) = 7 + 8 = 15 ✓",
      tip: "Watch out: 7 − 2(...) is not 5(...)." },
    { stage: 3, expr: "Which is bigger for every x: (x " + M + " 5)² + 3, or 2?", chunk: "(x " + M + " 5)²", packed: BOX + " + 3  vs  2",
      opts: [["(x " + M + " 5)²", ""], ["x " + M + " 5", "Pack the whole square: then you know it's never negative."], ["3", "3 is fixed. Pack the part that depends on x."]],
      steps: [["The box is never negative, so box + 3 is always at least []", [3]],
        { type: "choice", prompt: "So which is bigger, for every x?", options: [["(x " + M + " 5)² + 3, always", ""], ["2, always", "box + 3 is at least 3, and 3 > 2."], ["It depends on x", "No matter what x is, box + 3 ≥ 3 > 2."]] }],
      answer: "(x " + M + " 5)² + 3 is always bigger", check: "Even at x = 5: 0 + 3 = 3 > 2 ✓", tip: "You can answer without trying any x values." },
    { stage: 3, expr: "(x " + M + " 1)³ = 8", chunk: "x " + M + " 1", packed: BOX + "³ = 8",
      opts: [["x " + M + " 1", ""], ["x³", "The cube applies to all of (x − 1)."], ["8", "Pack the chunk with x in it."]],
      steps: [["box³ = 8, so box = []", [2]], ["x " + M + " 1 = 2, so x = []", [3]]], answer: "x = 3", check: "(3 " + M + " 1)³ = 8 ✓", tip: "Last one. A cube has just one real root." },
  ];

  function stepsFor(lv, api, show) {
    const out = [{ type: "choice", prompt: "Which chunk should go in the box?", options: pack(lv.opts.map((o) => [I(o[0]), o[1]])),
      done: "Packed " + lv.chunk + " into a box", onDone: () => show(true) }];
    lv.steps.forEach((st) => {
      if (Array.isArray(st)) out.push({ type: "input", prompt: I(st[0]).replace(/box/g, BOX), answers: st[1], unordered: !!st[2],
        hint: st[2] ? "There are two answers. Think positive and negative." : "Solve for the box first, then unpack it." });
      else out.push({ type: "choice", prompt: st.prompt.replace(/box/g, BOX), options: pack(st.options), done: st.prompt.replace(/box/g, "box") + " " + st.options[0][0] });
    });
    return out;
  }

  GameShell.register({
    slug: "a-sse-a-1-b",
    title: "Packing",
    firstMove: "Choose the part of the expression to pack into one box. Use that box to answer the next question.",
    subtitle: "See a complicated expression as a few simple pieces",
    stages: { 1: "Stage 1 · Pack and solve", 2: "Stage 2 · Pack and interpret", 3: "Stage 3 · Bigger chunks" },
    levels: LEVELS,
    help: {
      intro: "Big expressions get easier when you pack a chunk into a box and treat it as <b>one thing</b>.",
      steps: [
        "Choose which chunk to pack. It turns into a cardboard box.",
        "Work with the box like a single number: solve for it, or reason about it.",
        "Unpack the box to finish.",
        "Fewer wrong answers means more stars.",
      ],
      note: "Answers can be fractions like 3/4 or negatives like −7.",
    },
    load(lv, api) {
      const view = api.h("div", { class: "stage-text", style: { lineHeight: "1.5" } });
      api.stage.appendChild(view);
      const show = (packed) => { view.innerHTML = packed ? lv.packed.replace(/\bx\b/g, "<i>x</i>") : I(lv.expr); };
      show(false);
      Steps.run(api, { steps: stepsFor(lv, api, show), logTitle: "Your work", result: () => ({ answer: lv.answer, check: lv.check }) });
    },
    guide: {
      evidence: "Ask the student to point to everything the box replaces. Can they unpack it into the original expression without changing its value or exponent?",
      summary: "A 12-level game about structure. Students pack a repeated or complicated chunk of an expression into a box, reason about the box as a single quantity, and then unpack it to solve equations and interpret formulas like P(1 + r)ᵗ.",
      practices: "MP7 Look for and make use of structure · MP2 Reason abstractly and quantitatively",
      goals: [
        "Identify a chunk of an expression that can be treated as a single quantity.",
        "Solve equations such as 3(x + 1) = 12 or (x + 2)² = 25 by solving for the chunk first.",
        "Interpret parts of formulas like 500(1.04)ᵗ and 70 + 130(0.9)ᵗ in context without computing.",
      ],
      howItWorks: "Each level starts by asking which chunk to pack. The chunk becomes a cardboard box in the expression, and the following steps treat the box as one number: solving for it, deciding whether it grows or shrinks, or finding its smallest value. Wrong chunk choices get an explanation.",
      stageNotes: {
        1: { sees: "Equations with a repeated or parenthesized chunk.", builds: "Solve for the box, then unpack it; two solutions from a square." },
        2: { sees: "Growth, decay, cooling and vertex-form formulas.", builds: "Interpreting a factor (1.04 vs 0.85), a limiting value, and a minimum." },
        3: { sees: "Harder chunks and a comparison for all x.", builds: "Reasoning with structure instead of trying values." },
      },
      discussion: [
        "In level 4, why is packing (2x − 1) faster than distributing?",
        "How can you tell from 18000(0.85)ᵗ that the car loses value, without calculating anything?",
        "In level 11, how do you know (x − 5)² + 3 is bigger than 2 for every x?",
      ],
      misconceptions: [
        ["Squaring only the x in (x + 2)²", "Choosing x² as the chunk is rejected with an explanation."],
        ["Forgetting the negative root when box² = 25", "The step requires both answers."],
        ["Reading 7 − 2(3 − x) as 5(3 − x)", "Level 10's chunk choice addresses this directly."],
        ["Thinking 0.85 means 85% growth", "Level 6 compares the factor with 1."],
      ],
      exitTicket: {
        items: ["Solve by packing: 4(x − 2) + 1 = 21", "Solve: (x − 3)² = 49", "Without calculating, does 2000(0.92)ᵗ grow or shrink? By what percent per year?"],
        answers: ["box = x − 2: 4·box + 1 = 21, box = 5, x = 7.", "x − 3 = 7 or −7, so x = 10 or x = −4.", "Shrinks, because 0.92 < 1; by 8% per year."],
      },
    },
    answerKey(lv) {
      const strip = (s) => s.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, "");
      const fill = (s) => { let k = 0; return s[0].replace(/\[\]/g, () => Alg.num(s[1][k++])); };
      return { prompt: strip(lv.expr), solution: "Pack " + strip(lv.chunk) + " as □; " + lv.steps.map((s) => Array.isArray(s) ? fill(s) : s.prompt + " " + s.options[0][0]).join("; ").replace(/box/g, "□"),
        answer: lv.answer };
    },
  });
})();
