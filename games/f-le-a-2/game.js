/* Two-Point Rebuild · AI.F-LE.A.2 */
(function () {
  const M = "−";
  const pts2 = (p, q, r, f) => ({ r, series: [{ f, color: "#5a78b8" }], marks: [[p[0], p[1], "(" + p.join(", ") + ")"], [q[0], q[1], "(" + q.join(", ") + ")"]], reveal: "end" });
  const LEVELS = [
    { stage: 1, ctx: "A line through (0, 3) and (2, 7).", chart: pts2([0, 3], [2, 7], [-1, 5, -1, 12, 1, 1, 1, 2], (x) => 2 * x + 3),
      steps: [["in", "Slope = (7 − 3) / (2 − 0) = []", [2]], ["in", "y = []x + []", [2, 3]]], answer: "y = 2x + 3", check: "2(2) + 3 = 7 ✓", tip: "Rebuild the function from two clues." },
    { stage: 1, ctx: "An exponential y = a · bˣ through (0, 3) and (2, 12).", chart: pts2([0, 3], [2, 12], [-1, 4, -1, 26, 1, 2, 1, 4], (x) => 3 * Math.pow(2, x)),
      steps: [["in", "a = y at x = 0 = []", [3]], ["in", "Over 2 steps the factor is 12 ÷ 3 = 4, so b = []", [2]], ["in", "y = [] · []ˣ", [3, 2]]], answer: "y = 3 · 2ˣ", check: "3 · 4 = 12 ✓", tip: "For exponentials, use the ratio." },
    { stage: 1, ctx: "A line through (1, 5) and (4, 14).", chart: pts2([1, 5], [4, 14], [-1, 6, -1, 18, 1, 2, 1, 2], (x) => 3 * x + 2),
      steps: [["in", "Slope = []", [3]], ["in", "y = []x + []", [3, 2], { hint: "Use the slope and one point: 5 = 3(1) + b." }]], answer: "y = 3x + 2", check: "3(4) + 2 = 14 ✓", tip: "Neither point is on the y-axis." },
    { stage: 1, ctx: "An exponential through (1, 6) and (3, 54).", chart: pts2([1, 6], [3, 54], [-1, 4, -5, 60, 1, 5, 1, 10], (x) => 2 * Math.pow(3, x)),
      steps: [["in", "From x = 1 to 3 the factor is []", [9]], ["in", "So b = []", [3]], ["in", "a = 6 ÷ 3 = [], so y = [] · 3ˣ", [2, 2]]], answer: "y = 2 · 3ˣ", check: "2 · 27 = 54 ✓", tip: "Two steps of b make 9." },
    { stage: 2, ctx: "A bus has 40 riders and gains 6 riders every stop.", steps: [["in", "R(s) = []s + []", [6, 40]], ["in", "After 5 stops: []", [70]]], answer: "R(s) = 6s + 40", check: "30 + 40 = 70 ✓", tip: "From a description." },
    { stage: 2, ctx: "A forest has 500 trees and loses 10% each year.", steps: [["in", "T(t) = [] · []ᵗ", [500, 0.9]], ["in", "After 2 years: []", [405]]], answer: "T(t) = 500(0.9)ᵗ", check: "500 × 0.81 = 405 ✓", tip: "From a description, exponential." },
    { stage: 2, ctx: "From a table (linear):", table: { colLabel: "x", cols: [2, 5], rows: [{ label: "y", values: [11, 20] }] }, steps: [["in", "y = []x + []", [3, 5]]], answer: "y = 3x + 5", check: "3(5) + 5 = 20 ✓", tip: "Two input–output pairs." },
    { stage: 2, ctx: "An arithmetic sequence with a(1) = 4 and a(5) = 20.", steps: [["in", "Common difference d = (20 − 4) / 4 = []", [4]], ["in", "a(n) = [] + [](n − 1)", [4, 4]]], answer: "a(n) = 4 + 4(n − 1)", check: "4 + 16 = 20 ✓", tip: "Sequences count too." },
    { stage: 3, ctx: "Two clues: (0, 100) and (2, 25). It could be linear or exponential!", chart: { r: [-1, 5, -10, 110, 1, 10, 1, 20], series: [{ f: (x) => 100 * Math.pow(0.5, x) }, { pts: [[4, 6.25]], color: "#e7b84a" }], marks: [[0, 100, "(0, 100)"], [2, 25, "(2, 25)"]], reveal: "end" },
      steps: [["in", "Linear model: y = []x + 100", [-37.5]], ["in", "Exponential model: y = 100 · []ˣ", [0.5]], ["ch", "A third clue: (4, 6.25). Which model was right?", [["Exponential: 100 · 0.5⁴ = 6.25", ""], ["Linear", "The line gives −37.5(4) + 100 = −50 at x = 4."]]]],
      answer: "y = 100(0.5)ˣ", check: "100 × 0.0625 = 6.25 ✓", tip: "Two points fit both kinds of function." },
    { stage: 3, ctx: "A geometric sequence with a(1) = 5 and a(4) = 40.", steps: [["in", "r³ = 40 ÷ 5 = 8, so r = []", [2]], ["in", "a(n) = [] · []<sup>n − 1</sup>", [5, 2]]], answer: "a(n) = 5 · 2^(n−1)", check: "5 · 8 = 40 ✓", tip: "Three steps from a(1) to a(4)." },
    { stage: 3, ctx: "Read the graph: an exponential through (0, 2) and (1, 5).", chart: { r: [-2, 3, -1, 16, 1, 1, 1, 2], series: [{ f: (x) => 2 * Math.pow(2.5, x) }], marks: [[0, 2, "(0, 2)"], [1, 5, "(1, 5)"]], reveal: "start" },
      steps: [["in", "y = [] · []ˣ", [2, 2.5]]], answer: "y = 2 · 2.5ˣ", check: "2 · 2.5 = 5 ✓", tip: "Points from a graph." },
    { stage: 3, ctx: "An exponential through (2, 18) and (4, 162).", steps: [["in", "b² = 162 ÷ 18 = 9, so b = []", [3]], ["in", "a = 18 ÷ 3² = [], so y = [] · 3ˣ", [2, 2]]], answer: "y = 2 · 3ˣ", check: "2 · 81 = 162 ✓", tip: "Last one: no y-intercept given." },
  ];
  Timeline.stepGame({
    slug: "f-le-a-2", title: "Two-Point Rebuild", subtitle: "Construct linear and exponential functions from points, tables, graphs and descriptions",
    stages: { 1: "Stage 1 · From two points", 2: "Stage 2 · From words, tables, sequences", 3: "Stage 3 · Which kind?" }, levels: LEVELS,
    help: { intro: "Two clues are enough to rebuild a line or an exponential, if you know which kind it is.",
      steps: ["Linear: slope = change in y ÷ change in x, then find the intercept.", "Exponential: the ratio of y-values over the gap gives b; then find a.", "Fill in the function and check it with the clues.", "Fewer wrong answers means more stars."], note: "Decimals and fractions are fine." },
    hint: "Use the difference (linear) or the ratio (exponential).",
    guide: {
      summary: "A 12-level game for constructing linear and exponential functions, including arithmetic and geometric sequences, from two input–output pairs, graphs, tables and verbal descriptions, and for deciding between the two models with a third clue.",
      also: "<span class='code'>AI.F-BF.A.2</span> sequences and <span class='code'>AI.F-LE.A.1.a</span>.",
      practices: "MP4 Model with mathematics · MP7 Look for and make use of structure",
      goals: ["Construct a linear function from two points, a table, a graph or a description.", "Construct an exponential function y = a·bˣ the same ways, including when no y-intercept is given.", "Recognize that two points don't determine the type of function."],
      howItWorks: "Levels give two clues as points on a graph, a table, a sequence or words. Students compute the slope or ratio and fill in the function. The graph draws when solved; stage 3 compares a line and an exponential through the same two points.",
      stageNotes: { 1: { sees: "Two points on a graph.", builds: "Slope; ratio over a gap." }, 2: { sees: "Words, a table, an arithmetic sequence.", builds: "Translating clues to functions." }, 3: { sees: "Ambiguous points, a geometric sequence, a graph, no intercept.", builds: "Choosing and constructing the model." } },
      discussion: ["Why can a line AND an exponential pass through the same two points?", "How do you find b when the points are 2 apart in x?", "What extra information told you which model was right in level 9?"],
      misconceptions: [["Using the difference for an exponential", "Levels 2 and 4."], ["Taking the ratio over 2 steps as b", "Level 4."], ["Assuming a is the first y-value given", "Level 12."]],
      exitTicket: { items: ["Write the line through (1, 4) and (3, 10).", "Write y = a·bˣ through (0, 5) and (2, 45).", "A geometric sequence has a(1) = 3 and a(3) = 75. Find a(n)."],
        answers: ["y = 3x + 1", "y = 5 · 3ˣ", "a(n) = 3 · 5ⁿ⁻¹"] },
    },
  });
})();
