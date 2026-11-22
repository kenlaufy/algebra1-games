/* Shop Simulator · AI.F-BF.A.1.b */
(function () {
  const M = "−";
  const pr = (fR, fC, r) => ({ r, xlabel: "x (items)", ylabel: "$", series: [{ f: fR, color: "#3f7d4c" }, { f: fC, color: "#c8553d" }, { f: (x) => fR(x) - fC(x), color: "#5a78b8", dash: "8 6" }], reveal: "end" });
  const LEVELS = [
    { stage: 1, ctx: "Lemonade stand: revenue R(x) = 5x, cost C(x) = 2x + 30 for x cups.", chart: pr((x) => 5 * x, (x) => 2 * x + 30, [0, 20, -40, 100, 2, 10, 2, 20]),
      steps: [["in", "Profit P(x) = R(x) − C(x) = []x + []", [3, -30], { hint: "Subtract every term of C, including the 30." }], ["in", "Break-even (P = 0) at x = []", [10]]],
      answer: "P(x) = 3x − 30; break even at 10 cups", check: "R(10) = C(10) = 50 ✓", tip: "Profit = revenue − cost." },
    { stage: 1, ctx: "T-shirts: R(x) = 8x, C(x) = 3x + 100.", steps: [["in", "P(x) = []x + []", [5, -100]], ["in", "Profit from 50 shirts: $[]", [150]]], answer: "P(x) = 5x − 100", check: "400 − 250 = 150 ✓", tip: "Same idea, new shop." },
    { stage: 1, ctx: "Printing: C(x) = 200 + 4x dollars for x posters. Average cost per poster A(x) = C(x) / x.", steps: [["in", "A(50) = []", [8]], ["in", "A(200) = []", [5]]],
      answer: "A(x) = (200 + 4x)/x", check: "400/50 = 8; 1000/200 = 5 ✓", tip: "Dividing functions: cost per item." },
    { stage: 1, ctx: "At price p, customers buy d(p) = 100 − 5p items. Revenue R(p) = p · d(p).", steps: [["in", "R(p) = []p − []p²", [100, 5]], ["in", "R(8) = []", [480]]], answer: "R(p) = 100p − 5p²", check: "8 · 60 = 480 ✓", tip: "Multiplying functions: price times quantity." },
    { stage: 2, ctx: "Revenue R(p) = 100p − 5p². What price brings in the most?", chart: { r: [0, 20, 0, 600, 2, 100, 2, 100], xlabel: "p ($)", ylabel: "R ($)", series: [{ f: (p) => 100 * p - 5 * p * p }], reveal: "end" },
      steps: [["in", "Best price p = []", [10], { hint: "Vertex: p = −b/(2a) = −100/(−10)." }], ["in", "Maximum revenue: $[]", [500]]], answer: "p = $10, R = $500", check: "1000 − 500 = 500 ✓", tip: "A combined function can have a maximum." },
    { stage: 2, ctx: "A cooling body (from the standard): T(t) = 20 + 60(0.9)ᵗ °C.", chart: { r: [0, 30, 0, 90, 5, 10, 5, 20], xlabel: "t (min)", ylabel: "T (°C)", series: [{ f: (t) => 20 + 60 * Math.pow(0.9, t) }, { f: () => 20, color: "#c8553d", dash: "6 5" }], reveal: "end" },
      steps: [["in", "T(0) = []", [80]], ["in", "As t gets large, T gets close to []", [20]], ["ch", "What does the constant 20 represent?", [["Room temperature", ""], ["Starting temperature", "That's 80."], ["Cooling rate", "The 0.9 sets how fast it cools."]]]],
      answer: "Room temperature + a decaying difference", check: "20 + 60 = 80 at the start ✓", tip: "A constant plus a decaying exponential." },
    { stage: 2, ctx: "Same model: T(t) = 20 + 60(0.9)ᵗ.", steps: [["in", "T(5) ≈ [] °C (2 decimal places)", [55.43], { tol: 0.011, hint: "0.9⁵ ≈ 0.59049." }]], answer: "T(5) ≈ 55.43 °C", check: "20 + 60 × 0.59049 ≈ 55.43 ✓", tip: "Evaluate the combined model." },
    { stage: 2, ctx: "A taxi ride costs C(m) = 3 + 2m dollars. You add a 15% tip.", steps: [["ch", "Total with tip:", [["1.15 · C(m)", ""], ["C(m) + 0.15", "That's a 15-cent tip, not 15%."], ["C(m) + 15", "That's a $15 tip."]]], ["in", "Total for 10 miles: $[]", [26.45]]],
      answer: "T(m) = 1.15(3 + 2m)", check: "1.15 × 23 = 26.45 ✓", tip: "Scaling a function." },
    { stage: 3, ctx: "R(x) = 40x − x², C(x) = 10x + 100.", chart: pr((x) => 40 * x - x * x, (x) => 10 * x + 100, [0, 30, -100, 450, 2, 50, 4, 100]),
      steps: [["in", "P(x) = []x² + []x + []", [-1, 30, -100]], ["in", "Maximum profit at x = [], P = []", [15, 125]]], answer: "P(x) = −x² + 30x − 100; max $125 at x = 15", check: "−225 + 450 − 100 = 125 ✓", tip: "Combine, then find the best." },
    { stage: 3, ctx: "Town A: A(t) = 1000 + 50t. Town B: B(t) = 800(1.05)ᵗ. Total population S(t) = A(t) + B(t).", steps: [["in", "S(2) = []", [1982]]],
      answer: "S(t) = 1000 + 50t + 800(1.05)ᵗ", check: "1100 + 882 = 1982 ✓", tip: "Adding a linear and an exponential function." },
    { stage: 3, ctx: "Each item costs $4 to make. At price p, you sell 200 − 10p items.", steps: [["ch", "Profit P(p) =", [["(p − 4)(200 − 10p)", ""], ["p(200 − 10p) − 4", "The $4 cost applies to every item."], ["(p + 4)(200 − 10p)", "Profit per item is price minus cost."]]], ["in", "P(12) = []", [640]]],
      answer: "P(p) = (p − 4)(200 − 10p)", check: "8 × 80 = 640 ✓", tip: "Profit per item times number sold." },
    { stage: 3, ctx: "Tea is poured at 90 °C into a 22 °C room and cools: the difference shrinks 20% each minute.", steps: [["ch", "Model:", [["T(t) = 22 + 68(0.8)ᵗ", ""], ["T(t) = 90(0.8)ᵗ", "That would cool to 0 °C, not room temperature."], ["T(t) = 22 + 90(0.8)ᵗ", "At t = 0 that gives 112 °C."]]], ["in", "T(1) = [] °C", [76.4]]],
      answer: "T(t) = 22 + 68(0.8)ᵗ", check: "22 + 54.4 = 76.4 ✓", tip: "Last one: build the model yourself." },
  ];
  Timeline.stepGame({
    slug: "f-bf-a-1-b", title: "Shop Simulator", firstMove: "Combine the two functions term by term, then evaluate or find the best value.", subtitle: "Combine standard functions with arithmetic operations",
    stages: { 1: "Stage 1 · Add, subtract, multiply, divide", 2: "Stage 2 · Combined models", 3: "Stage 3 · Build your own" }, levels: LEVELS,
    help: { intro: "Real models are often built from simpler functions: profit = revenue − cost, revenue = price × demand, temperature = room + difference.",
      steps: ["Identify the pieces and how they combine.", "Write or choose the combined function.", "Evaluate it or find its best value.", "Fewer wrong answers means more stars."], note: "Decimals are fine." },
    hint: "Combine the functions term by term, then evaluate.",
    guide: {
      summary: "A 12-level game for combining functions: profit as revenue minus cost, average cost as a quotient, revenue as price times demand, a cooling body as a constant plus a decaying exponential (the standard's example), and scaling for tips.",
      also: "<span class='code'>AI.F-IF.C.8.a</span> maximums of quadratics.",
      practices: "MP4 Model with mathematics · MP7 Look for and make use of structure",
      goals: ["Combine standard function types using addition, subtraction, multiplication and division.", "Interpret each part of a combined model.", "Evaluate and optimize combined models."],
      howItWorks: "Each level gives component functions in a shop or science context; graphs show revenue, cost and profit together. Students fill in combined formulas, choose correct models over common mistakes, and evaluate them.",
      stageNotes: { 1: { sees: "Revenue and cost; average cost; demand.", builds: "Combining with each operation." }, 2: { sees: "Maximizing revenue; Newton's cooling model; tips.", builds: "Interpreting parts; scaling." }, 3: { sees: "Nonlinear profit, two towns, profit per item, tea.", builds: "Constructing combined models." } },
      discussion: ["What does the break-even point mean on the graph?", "Why is a cooling body modeled as 20 + 60(0.9)ᵗ and not 80(0.9)ᵗ?", "Why does revenue eventually fall as the price rises?"],
      misconceptions: [["Subtracting only the first term of the cost", "Level 1 hint."], ["Adding a percent instead of scaling", "Level 8."], ["Modeling cooling toward 0", "Level 12."]],
      exitTicket: { items: ["R(x) = 12x and C(x) = 4x + 200. Write P(x) and find the break-even point.", "At price p, a shop sells 50 − 2p items. Write revenue.", "A pie at 180 °C cools in a 20 °C kitchen; the difference halves every 10 minutes. Write T(t)."],
        answers: ["P(x) = 8x − 200; x = 25", "R(p) = p(50 − 2p) = 50p − 2p²", "T(t) = 20 + 160(0.5)^(t/10)"] },
    },
  });
})();
