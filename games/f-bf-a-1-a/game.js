/* Ecosystem · AI.F-BF.A.1.a */
(function () {
  const M = "−";
  const T = (label, cols, vals, hideFrom) => ({ colLabel: "year n", cols, rows: [{ label, values: vals }], hideFrom });
  const LEVELS = [
    { stage: 1, ctx: "A meadow's rabbit count each year.", table: T("rabbits", [0, 1, 2, 3, 4], [20, 25, 30, 35, 40], 4),
      steps: [["in", "Explicit rule: P(n) = [] + []n", [20, 5], { hint: "Start value, then the change per year." }], ["in", "P(4) = []", [40]]], answer: "P(n) = 20 + 5n", check: "P(4) = 40 ✓", tip: "Write the rule that gives any year directly." },
    { stage: 1, ctx: "Same meadow, recursive this time.", table: T("rabbits", [0, 1, 2, 3], [20, 25, 30, 35]),
      steps: [["in", "P(0) = [] and P(n + 1) = P(n) + []", [20, 5]]], answer: "P(0) = 20, P(n + 1) = P(n) + 5", check: "Same numbers, built step by step ✓", tip: "A recursive rule says how to get the next year from this year." },
    { stage: 1, ctx: "Algae in a pond triples every week.", table: T("algae (cm²)", [0, 1, 2, 3], [10, 30, 90, 270], 3),
      steps: [["in", "Explicit: A(n) = [] · []ⁿ", [10, 3]], ["in", "A(3) = []", [270]]], answer: "A(n) = 10 · 3ⁿ", check: "10 · 27 = 270 ✓", tip: "Multiplying each step is exponential." },
    { stage: 1, ctx: "Same algae.", steps: [["in", "Recursive: A(0) = [] and A(n + 1) = [] · A(n)", [10, 3]]], answer: "A(n + 1) = 3A(n)", check: "Each week is 3 times the last ✓", tip: "Now the recursive version." },
    { stage: 2, ctx: "A pond has 200 fish. Each year 10% die, then 50 new fish are added.",
      steps: [["in", "Recursive: F(n + 1) = []·F(n) + []", [0.9, 50], { hint: "Keeping 90% means multiplying by 0.9." }], ["in", "F(1) = [] and F(2) = []", [230, 257]]],
      answer: "F(n + 1) = 0.9F(n) + 50", check: "0.9 · 200 + 50 = 230; 0.9 · 230 + 50 = 257 ✓", tip: "Two things happen each year." },
    { stage: 2, ctx: "Square patios: a patio n tiles wide uses this many tiles.", table: T("tiles", [1, 2, 3, 4, 5], [1, 4, 9, 16, 25], 4),
      steps: [["ch", "Explicit rule:", [["T(n) = n²", ""], ["T(n) = 3n − 2", "That gives 1, 4, 7, …"], ["T(n) = 2ⁿ", "That gives 2, 4, 8, …"]]], ["in", "T(5) = []", [25]]], answer: "T(n) = n²", check: "5 × 5 = 25 ✓", tip: "Not every pattern is linear or exponential." },
    { stage: 2, ctx: "A phone plan: $25 per month plus $5 for every GB over 2 GB.",
      steps: [["ch", "Steps to find the bill for g GB (g > 2):", [["Subtract 2, multiply by 5, add 25", ""], ["Multiply by 5, add 25", "Only the GB over 2 cost extra."], ["Add 25, multiply by 5", "The $25 isn't multiplied."]]], ["in", "Bill for 6 GB: $[]", [45]]],
      answer: "C(g) = 25 + 5(g − 2)", check: "25 + 5·4 = 45 ✓", tip: "Steps for calculation." },
    { stage: 2, ctx: "Rabbit pairs (Fibonacci): R(1) = R(2) = 1, and each month R(n + 1) = R(n) + R(n − 1).", table: T("pairs", [1, 2, 3, 4, 5, 6], [1, 1, 2, 3, 5, 8], 2),
      steps: [["in", "R(3) = [], R(4) = [], R(5) = [], R(6) = []", [2, 3, 5, 8]]], answer: "1, 1, 2, 3, 5, 8", check: "Each is the sum of the two before ✓", tip: "Some ecosystems need two earlier values." },
    { stage: 3, ctx: "You have $100 and add $20 each week.", steps: [["in", "Explicit: S(n) = [] + []n", [100, 20]], ["in", "Recursive: S(n + 1) = S(n) + []", [20]], ["in", "S(10) = []", [300]]], answer: "S(n) = 100 + 20n", check: "100 + 200 = 300 ✓", tip: "Write both forms." },
    { stage: 3, ctx: "A $12,000 machine keeps 80% of its value each year.", steps: [["in", "Explicit: V(n) = [] · []ⁿ", [12000, 0.8]], ["in", "V(2) = []", [7680]]], answer: "V(n) = 12000(0.8)ⁿ", check: "12000 · 0.64 = 7680 ✓", tip: "Keeping 80% means multiplying by 0.8." },
    { stage: 3, ctx: "A ball dropped from 10 m bounces back to 80% of its height each time.", table: T("height (m)", [0, 1, 2, 3], [10, 8, 6.4, 5.12], 2),
      steps: [["in", "h(n) = [] · []ⁿ", [10, 0.8]], ["in", "h(3) = []", [5.12]]], answer: "h(n) = 10(0.8)ⁿ", check: "10 · 0.512 = 5.12 ✓", tip: "Bounce number n." },
    { stage: 3, ctx: "A wildlife reserve has 500 deer. Each year the herd grows 6%, then 20 are moved to another park.",
      steps: [["in", "D(n + 1) = []·D(n) − []", [1.06, 20]], ["in", "D(1) = []", [510]], ["ch", "Why is a recursive rule natural here?", [["Each year's count depends on last year's, with two steps", ""], ["Explicit rules can't have percents", "They can; but the subtract-20 step makes the explicit form messy."]]]],
      answer: "D(n + 1) = 1.06D(n) − 20", check: "530 − 20 = 510 ✓", tip: "Last one: grow, then remove." },
  ];
  Timeline.stepGame({
    slug: "f-bf-a-1-a", title: "Ecosystem", firstMove: "Find the starting value and what happens each year, then fill in the rule.", subtitle: "Write explicit rules, recursive rules and steps for calculation from a context",
    stages: { 1: "Stage 1 · Adding and multiplying", 2: "Stage 2 · Two-step and other patterns", 3: "Stage 3 · Both forms from a story" }, levels: LEVELS,
    help: { intro: "Watch a population, then write the rule behind it: <b>explicit</b> (any year directly) or <b>recursive</b> (next year from this year).",
      steps: ["Look for a pattern: same amount added, same factor multiplied, or something else.", "Fill in the rule. The hidden values appear when you finish.", "Some stories have two steps each year: do them in order.", "Fewer wrong answers means more stars."],
      note: "Keeping 90% means multiplying by 0.9; growing 6% means multiplying by 1.06." },
    hint: "Find the starting value and what happens each step.",
    guide: {
      summary: "A 12-level game for building functions from contexts: explicit and recursive rules for linear, exponential, quadratic and Fibonacci-style patterns, two-step recursive processes, and steps for calculation.",
      also: "<span class='code'>AI.F-BF.A.2</span> arithmetic and geometric sequences.",
      practices: "MP4 Model with mathematics · MP8 Look for and express regularity in repeated reasoning",
      goals: ["Write an explicit expression for a relationship from a table or context.", "Write a recursive process, including two-step processes like \"lose 10%, then add 50\".", "Describe steps for calculation and evaluate the model."],
      howItWorks: "Each level gives a population or money story with a table (some values hidden). Students fill in explicit or recursive templates, choose rules, and compute values.",
      stageNotes: { 1: { sees: "Rabbits and algae.", builds: "Explicit and recursive forms for adding and multiplying." }, 2: { sees: "A fish pond, patio tiles, a phone bill, Fibonacci rabbits.", builds: "Two-step recursion; non-linear patterns; calculation steps." }, 3: { sees: "Savings, depreciation, bounces, a deer herd.", builds: "Both forms; percent factors." } },
      discussion: ["When is a recursive rule easier to write than an explicit one?", "Why is \"lose 10%\" multiplying by 0.9?", "How would you find the fish population in year 20 with the recursive rule?"],
      misconceptions: [["Adding a percent instead of multiplying", "Fish and deer levels."], ["Mixing up the start value index", "Tables show n = 0."], ["Assuming every pattern is linear", "Patio tiles."]],
      exitTicket: { items: ["A tree is 2 m and grows 0.5 m per year. Write explicit and recursive rules.", "A colony of 40 doubles each day. Write the explicit rule.", "A tank has 100 L; each hour it loses half its water, then 10 L is added. Write a recursive rule."],
        answers: ["H(n) = 2 + 0.5n; H(0) = 2, H(n + 1) = H(n) + 0.5", "C(n) = 40 · 2ⁿ", "W(0) = 100, W(n + 1) = 0.5W(n) + 10"] },
    },
  });
})();
