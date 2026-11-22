/* Model It: Multiplying · AI.F-LE.A.1.c */
(function () {
  const M = "−";
  const SORT = (yes) => yes ? [["Constant percent rate: the same factor each unit", ""], ["Not a constant percent rate", "Each unit multiplies by the same factor."]]
    : [["Not a constant percent rate", ""], ["Constant percent rate: the same factor each unit", "The same AMOUNT is added each unit; the percent keeps changing."]];
  const LEVELS = [
    { stage: 1, ctx: "$200 in savings grows 5% per year.", steps: [["ch", "Sort it:", SORT(true)], ["in", "Model: A = 200 · []ᵗ", [1.05]], ["in", "After 2 years: $[]", [220.5]]], answer: "A = 200(1.05)ᵗ", check: "200 × 1.1025 = 220.50 ✓", tip: "Growing by a percent means multiplying by a factor." },
    { stage: 1, ctx: "50 mg of a medicine decreases by 20% every hour.", steps: [["ch", "Sort it:", SORT(true)], ["in", "Model: D = 50 · []ᵗ", [0.8]], ["in", "After 3 hours: [] mg", [25.6]]], answer: "D = 50(0.8)ᵗ", check: "50 × 0.512 = 25.6 ✓", tip: "Losing 20% keeps 80%." },
    { stage: 1, ctx: "A town adds 50 people every year.", steps: [["ch", "Sort it:", SORT(false)]], answer: "Constant amount: linear", check: "+50 each year ✓", tip: "Same amount isn't the same percent." },
    { stage: 1, ctx: "Equal steps in x.", table: { colLabel: "x", cols: [0, 1, 2, 3], rows: [{ label: "y", values: [40, 48, 57.6, 69.12] }] },
      steps: [["in", "Factor each step: []", [1.2]], ["in", "So it grows []% per unit", [20]]], answer: "×1.2: 20% growth", check: "48 ÷ 40 = 1.2 ✓", tip: "Divide neighbours." },
    { stage: 2, ctx: "Equal steps in x.", table: { colLabel: "x", cols: [0, 1, 2, 3], rows: [{ label: "y", values: [800, 600, 450, 337.5] }] },
      steps: [["in", "Factor each step: []", [0.75]], ["in", "So it decays []% per unit", [25]]], answer: "×0.75: 25% decay", check: "600 ÷ 800 = 0.75 ✓", tip: "A shrinking factor." },
    { stage: 2, ctx: "Steps of 2 in x.", table: { colLabel: "x", cols: [0, 2, 4], rows: [{ label: "y", values: [100, 121, 146.41] }] },
      steps: [["in", "Factor per 2 units: []", [1.21]], ["in", "Factor per 1 unit: √1.21 = []", [1.1]], ["in", "So it grows []% per unit", [10]]], answer: "10% per unit", check: "1.1² = 1.21 ✓", tip: "Per unit, not per step." },
    { stage: 2, ctx: "A city of 10,000 grows 3% per year.", steps: [["in", "Yearly factor: []", [1.03]], ["in", "After 1 year: [] people", [10300]]], answer: "P = 10000(1.03)ᵗ", check: "10000 × 1.03 = 10300 ✓", tip: "Percent to factor." },
    { stage: 2, ctx: "A $20,000 car loses 15% of its value each year.", steps: [["in", "Yearly factor: []", [0.85]], ["in", "After 2 years: $[]", [14450]]], answer: "V = 20000(0.85)ᵗ", check: "20000 × 0.7225 = 14450 ✓", tip: "Depreciation." },
    { stage: 3, ctx: "Starting with $1000: plan A adds $100 per year, plan B adds 8% per year.", chart: { r: [0, 20, 900, 5000, 2, 500, 2, 1000], xlabel: "years", ylabel: "$", series: [{ f: (t) => 1000 + 100 * t, color: "#c8553d" }, { f: (t) => 1000 * Math.pow(1.08, t) }], reveal: "end" },
      steps: [["in", "After 10 years: A = $[], B ≈ $[] (nearest dollar)", [2000, 2159], { tol: 1 }], ["ch", "Which is a constant percent rate?", [["B", ""], ["A", "A adds a constant amount."]]]], answer: "B wins at 10 years", check: "1000 × 1.08¹⁰ ≈ 2158.92 ✓", tip: "Percent growth pulls ahead." },
    { stage: 3, ctx: "A substance has a half-life of 3 days.", steps: [["in", "Daily factor: 0.5^(1/3) ≈ [] (3 decimal places)", [0.794], { tol: 0.0011 }], ["in", "So it decays about []% per day", [20.6], { tol: 0.11 }]], answer: "≈ 20.6% decay per day", check: "0.794³ ≈ 0.5 ✓", tip: "A percent rate hidden in a half-life." },
    { stage: 3, ctx: "Each year the herd is 1.15 times as big as the year before.", steps: [["in", "It grows []% per year", [15]], ["ch", "Sort it:", SORT(true)]], answer: "15% per year", check: "1.15 = 1 + 0.15 ✓", tip: "Factor to percent." },
    { stage: 3, ctx: "Which table changes by a constant percent per unit?", steps: [["ch", "Choose:", [["x: 0, 1, 2 → y: 50, 60, 72", ""], ["x: 0, 1, 2 → y: 50, 60, 70", "That adds 10: linear."], ["x: 0, 1, 2 → y: 50, 55, 65", "The factors are 1.1 and about 1.18."]]]], answer: "×1.2 each step", check: "60 ÷ 50 = 72 ÷ 60 = 1.2 ✓", tip: "Last one: compare factors." },
  ];
  Timeline.stepGame({
    slug: "f-le-a-1-c", title: "Model It: Multiplying", subtitle: "Recognize situations with a constant percent rate of change",
    stages: { 1: "Stage 1 · Sort and model", 2: "Stage 2 · Factors from tables and words", 3: "Stage 3 · Percent vs. amount" }, levels: LEVELS,
    help: { intro: "Some quantities change by the <b>same percent</b> every unit: multiply by the same factor. That gives an exponential model.",
      steps: ["Growing p% means multiplying by 1 + p/100. Shrinking p% means multiplying by 1 − p/100.", "In tables, divide neighbours to find the factor.", "Build the model a · bᵗ and use it.", "Fewer wrong answers means more stars."], note: "Adding the same amount is NOT a constant percent rate." },
    hint: "Divide neighbouring values, or turn the percent into a factor.",
    guide: {
      summary: "A 12-level game for recognizing situations in which a quantity grows or decays by a constant percent rate per unit interval, converting between percents and factors, and contrasting percent growth with constant-amount growth.",
      also: "<span class='code'>AI.F-LE.A.1.b</span> constant rate.",
      practices: "MP4 Model with mathematics · MP7 Look for and make use of structure",
      goals: ["Recognize situations with a constant percent rate per unit interval.", "Convert percents to growth or decay factors and back, including over intervals other than 1.", "Build and use exponential models and compare them with linear ones."],
      howItWorks: "Levels describe situations or show tables. Students sort them, find factors and percents, and build and evaluate exponential models; one graph compares $100 per year with 8% per year.",
      stageNotes: { 1: { sees: "Savings, medicine, a town, a table.", builds: "Percent ↔ factor; sorting." }, 2: { sees: "Decay tables, intervals of 2, cities and cars.", builds: "Per-unit factors." }, 3: { sees: "Linear vs. percent growth, half-life.", builds: "Hidden percent rates; comparisons." } },
      discussion: ["Why does losing 20% mean multiplying by 0.8?", "Plan A adds $100; plan B adds 8%. Why does B eventually win?", "How is a half-life a constant percent rate?"],
      misconceptions: [["Multiplying by 0.2 for a 20% loss", "Level 2."], ["Treating +50 per year as percent growth", "Level 3."], ["Using the per-2-units factor as per unit", "Level 6."]],
      exitTicket: { items: ["A $500 phone loses 30% per year. Write the model.", "y: 64, 48, 36, 27 at x = 0, 1, 2, 3. Percent change?", "Which grows by a constant percent: +$20 per week or +2% per week?"],
        answers: ["V = 500(0.7)ᵗ", "×0.75: 25% decay", "+2% per week"] },
    },
  });
})();
