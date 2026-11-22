/* Twin Engines · AI.F-BF.A.2 */
(function () {
  const M = "−";
  const tab = (vals, hideFrom) => ({ colLabel: "n", cols: vals.map((_, i) => i + 1), rows: [{ label: "a(n)", values: vals }], hideFrom });
  const AR = (a, d) => [["in", "Recursive engine: a(1) = [], a(n + 1) = a(n) + []", [a, d], { hint: "First term, then what you add each step." }], ["in", "Explicit engine: a(n) = [] + [](n − 1)", [a, d], { hint: "Start at a(1) and add the difference (n − 1) times." }]];
  const GE = (a, r) => [["in", "Recursive engine: a(1) = [], a(n + 1) = [] · a(n)", [a, r], { hint: "First term, then what you multiply by each step." }], ["in", "Explicit engine: a(n) = [] · []<sup>n − 1</sup>", [a, r], { hint: "Start at a(1) and multiply by the ratio (n − 1) times." }]];
  const LEVELS = [
    { stage: 1, ctx: "5, 8, 11, 14, …", table: tab([5, 8, 11, 14, 17, 20], 4), steps: [...AR(5, 3), ["in", "Both engines agree: a(10) = []", [32]]], answer: "a(n) = 5 + 3(n − 1)", check: "a(10) = 5 + 27 = 32 ✓", tip: "Build both engines. They must make the same sequence." },
    { stage: 1, ctx: "4, 12, 36, 108, …", table: tab([4, 12, 36, 108, 324], 4), steps: [...GE(4, 3), ["in", "a(5) = []", [324]]], answer: "a(n) = 4 · 3^(n−1)", check: "4 · 81 = 324 ✓", tip: "Multiplying means geometric." },
    { stage: 1, ctx: "50, 45, 40, 35, …", table: tab([50, 45, 40, 35, 30, 25, 20, 15], 4), steps: [...AR(50, -5), ["in", "a(8) = []", [15]]], answer: "a(n) = 50 − 5(n − 1)", check: "50 − 35 = 15 ✓", tip: "A negative difference." },
    { stage: 1, ctx: "64, 32, 16, 8, …", table: tab([64, 32, 16, 8, 4, 2, 1], 4), steps: [...GE(64, 0.5), ["in", "a(7) = []", [1]]], answer: "a(n) = 64 · 0.5^(n−1)", check: "64 / 64 = 1 ✓", tip: "A ratio less than 1." },
    { stage: 2, ctx: "Translate the explicit rule a(n) = 7 + 2(n − 1) into a recursive rule.", steps: [["in", "a(1) = [], a(n + 1) = a(n) + []", [7, 2]]], answer: "a(1) = 7, a(n + 1) = a(n) + 2", check: "Both give 7, 9, 11, … ✓", tip: "Explicit → recursive." },
    { stage: 2, ctx: "Translate the recursive rule a(1) = 3, a(n + 1) = 2 · a(n) into an explicit rule.", steps: [["in", "a(n) = [] · []<sup>n − 1</sup>", [3, 2]], ["in", "a(6) = []", [96]]], answer: "a(n) = 3 · 2^(n−1)", check: "3 · 32 = 96 ✓", tip: "Recursive → explicit." },
    { stage: 2, ctx: "a(n) = 10 − 4n (for n = 1, 2, 3, …)", steps: [["in", "a(1) = [] and the common difference is []", [6, -4]], ["in", "Recursive: a(n + 1) = a(n) + []", [-4]]], answer: "a(1) = 6, a(n + 1) = a(n) − 4", check: "6, 2, −2, … ✓", tip: "An explicit rule in a different shape." },
    { stage: 2, ctx: "a(n) = 5 · (1.1)<sup>n − 1</sup>", steps: [["in", "Recursive: a(1) = [], a(n + 1) = [] · a(n)", [5, 1.1]], ["in", "a(3) = []", [6.05]]], answer: "a(n + 1) = 1.1 · a(n)", check: "5 · 1.21 = 6.05 ✓", tip: "Geometric with a decimal ratio." },
    { stage: 3, ctx: "A theater's first row has 20 seats; each row has 2 more than the row in front.", steps: [...AR(20, 2), ["in", "Row 15 has [] seats", [48]]], answer: "a(n) = 20 + 2(n − 1)", check: "20 + 28 = 48 ✓", tip: "Model a real pattern." },
    { stage: 3, ctx: "You save $10 in week 1 and double the amount each week.", steps: [...GE(10, 2), ["in", "In week 6 you save $[]", [320]]], answer: "a(n) = 10 · 2^(n−1)", check: "10 · 32 = 320 ✓", tip: "Doubling adds up fast." },
    { stage: 3, ctx: "A ticket costs $40 in year 1, and the price rises 5% every year.", steps: [...GE(40, 1.05), ["in", "Year 3 price: $[]", [44.1]]], answer: "a(n) = 40 · 1.05^(n−1)", check: "40 · 1.1025 = 44.10 ✓", tip: "A 5% raise means × 1.05." },
    { stage: 3, ctx: "Two sequences: A is 2, 6, 18, …  B is 2, 6, 10, …", steps: [["ch", "Which is geometric?", [["A: it multiplies by 3", ""], ["B", "B adds 4 each time: arithmetic."], ["Both", "Check differences and ratios."]]], ["in", "Next terms: A gives [] and B gives []", [54, 14]]],
      answer: "A geometric, B arithmetic", check: "18 × 3 = 54; 10 + 4 = 14 ✓", tip: "Last one: same start, different engines." },
  ];
  Timeline.stepGame({
    slug: "f-bf-a-2", title: "Twin Engines", subtitle: "Write arithmetic and geometric sequences recursively and explicitly",
    stages: { 1: "Stage 1 · Build both engines", 2: "Stage 2 · Translate", 3: "Stage 3 · Model with sequences" }, levels: LEVELS,
    help: { intro: "Every arithmetic or geometric sequence can be built by two engines: <b>recursive</b> (from the previous term) and <b>explicit</b> (straight from n). They must agree.",
      steps: ["Arithmetic: add the same difference d. a(n) = a(1) + d(n − 1).", "Geometric: multiply by the same ratio r. a(n) = a(1) · rⁿ⁻¹.", "Fill in both engines, then check a term.", "Fewer wrong answers means more stars."], note: "Decreasing sequences have a negative difference or a ratio between 0 and 1." },
    hint: "Find the first term and the common difference or ratio.",
    guide: {
      summary: "A 12-level game for arithmetic and geometric sequences. Students write each sequence both recursively and explicitly, translate between the forms, and use sequences to model situations.",
      also: "<span class='code'>AI.F-LE.A.2</span> constructing linear and exponential functions including sequences.",
      practices: "MP8 Look for and express regularity in repeated reasoning · MP4 Model with mathematics",
      goals: ["Write arithmetic and geometric sequences recursively and with an explicit formula.", "Translate between recursive and explicit forms.", "Use sequences to model situations and find specific terms."],
      howItWorks: "Each level gives a sequence, a rule in one form, or a situation. Students fill in recursive and explicit templates (a(1), difference or ratio), then compute a later term. Hidden table values appear when both engines are built.",
      stageNotes: { 1: { sees: "Increasing and decreasing arithmetic and geometric sequences.", builds: "Both forms for each." }, 2: { sees: "One form given.", builds: "Translation, including a(n) = 10 − 4n." }, 3: { sees: "Seats, savings, prices.", builds: "Modeling; recognizing the type." } },
      discussion: ["Why is the explicit form a(1) + d(n − 1) and not a(1) + dn?", "Which form is faster for finding the 100th term?", "How can you tell from three terms whether a sequence is arithmetic or geometric?"],
      misconceptions: [["Using dn instead of d(n − 1)", "Hidden terms check the formula."], ["Confusing ratio and difference", "Level 12."], ["Percent increase as adding 0.05", "Level 11."]],
      exitTicket: { items: ["Write both forms for 9, 13, 17, …", "Write both forms for 5, 15, 45, …", "Translate a(n) = 2 · 4ⁿ⁻¹ into a recursive rule."],
        answers: ["a(1) = 9, a(n + 1) = a(n) + 4; a(n) = 9 + 4(n − 1)", "a(1) = 5, a(n + 1) = 3a(n); a(n) = 5 · 3ⁿ⁻¹", "a(1) = 2, a(n + 1) = 4a(n)"] },
    },
  });
})();
