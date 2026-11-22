/* Countdown to Target · AI.A-CED.A.1 */
(function () {
  const M = "−";
  const ch = (f, target, r, xl, yl) => ({ r, xlabel: xl, ylabel: yl, series: [{ f, color: "#5a78b8" }, { f: () => target, color: "#c8553d", dash: "8 6", always: true }], reveal: "end" });
  const LEVELS = [
    { stage: 1, ctx: "You have $40 and save $15 each week. When will you have $160?", chart: ch((w) => 40 + 15 * w, 160, [0, 12, 0, 220, 1, 20, 2, 40], "w (weeks)", "$"),
      steps: [["in", "Equation: [] + []w = []", [40, 15, 160], { hint: "Start amount + (amount per week)·w = target." }], ["in", "w = []", [8]]], answer: "40 + 15w = 160, w = 8 weeks", check: "40 + 15·8 = 160 ✓", tip: "Write the equation from the story, then solve it." },
    { stage: 1, ctx: "A phone battery is at 100% and drops 8% each hour. When is it at 20% or less?", chart: ch((h) => 100 - 8 * h, 20, [0, 14, 0, 110, 1, 10, 2, 20], "h (hours)", "%"),
      steps: [["in", "Inequality: 100 − []h ≤ []", [8, 20]], ["in", "Solve: h ≥ []", [10]]], answer: "100 − 8h ≤ 20, h ≥ 10", check: "After 10 h: 100 − 80 = 20 ✓", tip: "\"Or less\" means an inequality." },
    { stage: 1, ctx: "Plan A: $20 + $5 per month. Plan B: $35 + $2 per month. When do they cost the same?", chart: { r: [0, 10, 0, 80, 1, 10, 1, 20], xlabel: "m (months)", ylabel: "$", series: [{ f: (m) => 20 + 5 * m }, { f: (m) => 35 + 2 * m, color: "#c8553d" }], reveal: "end" },
      steps: [["in", "20 + []m = 35 + []m", [5, 2]], ["in", "m = []", [5]]], answer: "20 + 5m = 35 + 2m, m = 5", check: "Both cost $45 at m = 5 ✓", tip: "Set the two costs equal." },
    { stage: 1, ctx: "A rental costs $30 plus $0.25 per mile. Your budget is $55. How far can you drive?", chart: ch((x) => 30 + 0.25 * x, 55, [0, 140, 0, 70, 10, 10, 20, 10], "miles", "$"),
      steps: [["in", "30 + []x ≤ []", [0.25, 55]], ["in", "x ≤ [] miles", [100]]], answer: "30 + 0.25x ≤ 55, x ≤ 100", check: "30 + 25 = 55 ✓", tip: "A budget is an upper limit." },
    { stage: 2, ctx: "A square garden has area 81 m². How long is each side?", chart: ch((s) => s * s, 81, [0, 12, 0, 120, 1, 10, 1, 20], "s (m)", "area"),
      steps: [["in", "Equation: s² = []", [81]], ["ch", "s² = 81 has solutions 9 and −9. Which makes sense?", [["9 m: a length can't be negative", ""], ["−9 m", "Lengths are positive."], ["Both", "Only one is a real length."]]]],
      answer: "s² = 81, s = 9 m", check: "9² = 81 ✓", tip: "Quadratic now." },
    { stage: 2, ctx: "A ball's height is h = 20t − 5t² meters. When is it 15 m high?", chart: ch((t) => 20 * t - 5 * t * t, 15, [0, 4.5, 0, 25, 0.5, 5, 1, 5], "t (s)", "h"),
      steps: [["in", "20t − 5t² = []", [15]], ["in", "Move everything to one side and factor: −5(t − 1)(t − 3) = 0, so t = [] or t = []", [1, 3], { unordered: true }]],
      answer: "t = 1 s (going up) and t = 3 s (coming down)", check: "20 − 5 = 15 and 60 − 45 = 15 ✓", tip: "Two answers can both make sense." },
    { stage: 2, ctx: "A rectangle's length is 3 cm more than its width w. Its area is 40 cm².", chart: ch((w) => w * (w + 3), 40, [0, 8, 0, 60, 1, 10, 1, 10], "w (cm)", "area"),
      steps: [["in", "w(w + []) = []", [3, 40]], ["in", "w² + 3w − 40 = (w + 8)(w − 5) = 0, so the width is w = []", [5]]], answer: "w(w + 3) = 40, w = 5 cm", check: "5 × 8 = 40 ✓", tip: "Only the positive width works." },
    { stage: 2, ctx: "Profit P = −x² + 12x − 20 (hundreds of $) at price x. For which prices is profit at least 12?", chart: ch((x) => -x * x + 12 * x - 20, 12, [0, 12, -20, 20, 1, 5, 1, 5], "x ($)", "P"),
      steps: [["in", "−x² + 12x − 20 ≥ []", [12]], ["in", "Equality at x = 4 and x = 8. Profit ≥ 12 for [] ≤ x ≤ []", [4, 8]]], answer: "4 ≤ x ≤ 8", check: "P(6) = 16 ≥ 12; P(9) = 7 < 12 ✓", tip: "Use the graph to choose between and outside." },
    { stage: 3, ctx: "A colony of 50 bacteria doubles every hour. When does it reach 800?", chart: ch((t) => 50 * Math.pow(2, t), 800, [0, 6, 0, 1000, 1, 100, 1, 200], "t (h)", "bacteria"),
      steps: [["in", "50 · []ᵗ = []", [2, 800]], ["in", "2ᵗ = 16, so t = []", [4]]], answer: "50 · 2^t = 800, t = 4 h", check: "50 · 16 = 800 ✓", tip: "Exponential, with whole-number answers." },
    { stage: 3, ctx: "$1000 grows 10% per year. After how many whole years is it more than $1500?", chart: ch((t) => 1000 * Math.pow(1.1, t), 1500, [0, 8, 900, 2000, 1, 100, 1, 200], "t (years)", "$"),
      table: { colLabel: "t", cols: [3, 4, 5], rows: [{ label: "1000(1.1)ᵗ", values: [1331, 1464.1, 1610.51] }], hideFrom: 3 },
      steps: [["in", "1000 · []ᵗ > 1500", [1.1]], ["in", "Smallest whole number of years: t = []", [5]]], answer: "1000(1.1)^t > 1500, t = 5 years", check: "1.1⁴ ≈ 1.46 < 1.5 < 1.61 ≈ 1.1⁵ ✓", tip: "Use the table." },
    { stage: 3, ctx: "A rumor: each day, 3 times as many people know it, starting with 1 person. When do 243 people know?", chart: ch((d) => Math.pow(3, d), 243, [0, 6, 0, 300, 1, 50, 1, 50], "d (days)", "people"),
      steps: [["in", "[]ᵈ = []", [3, 243]], ["in", "d = []", [5]]], answer: "3^d = 243, d = 5", check: "3⁵ = 243 ✓", tip: "Powers of 3." },
    { stage: 3, ctx: "A $16,000 car loses half its value every 2 years: V = 16000 · (0.5)<sup>t/2</sup>. When is it worth $1000?", chart: ch((t) => 16000 * Math.pow(0.5, t / 2), 1000, [0, 10, 0, 17000, 1, 2000, 2, 4000], "t (years)", "$"),
      steps: [["in", "16000 · (0.5)<sup>t/2</sup> = []", [1000]], ["in", "(0.5)<sup>t/2</sup> = 1/16 = (0.5)⁴, so t/2 = 4 and t = []", [8]]], answer: "t = 8 years", check: "16000 → 8000 → 4000 → 2000 → 1000 every 2 years ✓", tip: "Last one: halving." },
  ];
  Timeline.stepGame({
    slug: "a-ced-a-1", title: "Countdown to Target", firstMove: "Turn the story into an equation. Fill in the numbers, then solve it.", subtitle: "Create equations and inequalities in one variable and solve them",
    stages: { 1: "Stage 1 · Linear", 2: "Stage 2 · Quadratic", 3: "Stage 3 · Exponential" }, levels: LEVELS,
    help: { intro: "Every story has a target. Write an equation or inequality that says \"we've reached it\", then solve it.",
      steps: ["Read the story: what's the starting amount, the change, and the target?", "Fill in the equation or inequality.", "Solve it. The graph then shows where the target is reached.", "Fewer wrong answers means more stars."],
      note: "\"At least\" is ≥, \"at most\" is ≤. Check that your answer makes sense in the story." },
    hint: "Match each number in the story to its place in the equation.",
    guide: {
      summary: "A 12-level game for creating and solving equations and inequalities in one variable from linear, quadratic and exponential situations, and interpreting the solutions in context.",
      also: "<span class='code'>AI.A-REI.B.3</span> and <span class='code'>AI.A-REI.B.4.b</span> solving the equations.",
      practices: "MP4 Model with mathematics · MP2 Reason abstractly and quantitatively",
      goals: ["Create equations and inequalities in one variable that model a situation.", "Solve them, including quadratic and simple exponential cases with integer inputs.", "Decide which solutions make sense in context."],
      howItWorks: "Each level tells a short story. Students fill in an equation or inequality template, then solve. When solved, the graph shows the quantity reaching the target line.",
      stageNotes: { 1: { sees: "Savings, battery, phone plans, a rental budget.", builds: "Linear equations and inequalities." }, 2: { sees: "Area, a thrown ball, a rectangle, profit.", builds: "Quadratics; rejecting impossible solutions; ranges." }, 3: { sees: "Bacteria, interest, a rumor, depreciation.", builds: "Exponential equations with whole-number solutions." } },
      discussion: ["Why does the ball problem have two sensible answers but the garden only one?", "In the battery level, why is the answer an inequality?", "How did the table help in the interest level?"],
      misconceptions: [["Using = for \"at least\"", "Inequality levels name the words."], ["Keeping negative lengths", "Levels 5 and 7."], ["Expecting exponential answers to come from division", "Stage 3 rewrites with matching bases."]],
      exitTicket: { items: ["A pool has 500 L and fills at 40 L/min. When does it hold 1300 L?", "A square has area 49. Find its side.", "A population of 20 triples each year. When does it reach 540?"],
        answers: ["500 + 40t = 1300, t = 20 min.", "s² = 49, s = 7.", "20 · 3ᵗ = 540, 3ᵗ = 27, t = 3 years."] },
    },
  });
})();
