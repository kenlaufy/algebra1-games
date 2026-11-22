/* Contract Auction · AI.F-LE.A.3 */
(function () {
  const M = "−";
  const race = (fA, fB, r) => ({ r, xlabel: "day", ylabel: "$", series: [{ f: fA, color: "#c8553d" }, { f: fB, color: "#5a78b8" }], reveal: "end" });
  const LEVELS = [
    { stage: 1, ctx: "Contract A pays $100 × day number. Contract B pays $2<sup>day</sup>.", table: { colLabel: "day", cols: [5, 8, 9, 10, 11], rows: [{ label: "A", values: [500, 800, 900, 1000, 1100] }, { label: "B", values: [32, 256, 512, 1024, 2048] }], hideFrom: 3 },
      chart: race((d) => 100 * d, (d) => Math.pow(2, d), [0, 12, 0, 2200, 1, 200, 1, 400]),
      steps: [["ch", "On day 5, which pays more?", [["A: $500 vs $32", ""], ["B", "2⁵ = 32."]]], ["in", "The first day B pays more is day []", [10]]], answer: "B overtakes A on day 10", check: "2¹⁰ = 1024 > 1000 ✓", tip: "Linear starts strong. Does it stay ahead?" },
    { stage: 1, ctx: "y = 50x versus y = 1.5ˣ.", table: { colLabel: "x", cols: [10, 15, 16, 17], rows: [{ label: "50x", values: [500, 750, 800, 850] }, { label: "1.5ˣ", values: [57.67, 437.89, 656.84, 985.26] }], hideFrom: 2 },
      steps: [["in", "The first whole x where 1.5ˣ is bigger: x = []", [17]]], answer: "x = 17", check: "1.5¹⁷ ≈ 985 > 850 ✓", tip: "Even a slow exponential gets there." },
    { stage: 1, ctx: "y = x² versus y = 2ˣ (for x ≥ 0).", table: { colLabel: "x", cols: [2, 3, 4, 5, 6], rows: [{ label: "x²", values: [4, 9, 16, 25, 36] }, { label: "2ˣ", values: [4, 8, 16, 32, 64] }], hideFrom: 3 },
      steps: [["in", "From x = [] on, 2ˣ stays bigger", [5]]], answer: "For x ≥ 5", check: "32 > 25, 64 > 36 ✓", tip: "Exponential vs. quadratic." },
    { stage: 1, ctx: "y = 1000x versus y = 1.01ˣ.", steps: [["ch", "Eventually, which is bigger?", [["1.01ˣ, eventually", ""], ["1000x, always", "Any exponential with b > 1 eventually passes any line."], ["They stay equal", "They only cross; they don't stay equal."]]]], answer: "1.01ˣ eventually wins", check: "It takes a long time, but it happens ✓", tip: "Think about \"eventually\"." },
    { stage: 2, ctx: "y = x³ versus y = 2ˣ.", table: { colLabel: "x", cols: [8, 9, 10, 11], rows: [{ label: "x³", values: [512, 729, 1000, 1331] }, { label: "2ˣ", values: [256, 512, 1024, 2048] }], hideFrom: 2 },
      steps: [["in", "First whole x where 2ˣ is bigger again: x = []", [10]]], answer: "x = 10", check: "1024 > 1000 ✓", tip: "Even a cubic gets passed." },
    { stage: 2, ctx: "Savings: A starts at $5000 and adds $500 per year. B starts at $5000 and grows 6% per year.",
      chart: { r: [0, 25, 4000, 22000, 1, 2000, 5, 4000], xlabel: "years", ylabel: "$", series: [{ f: (t) => 5000 + 500 * t, color: "#c8553d" }, { f: (t) => 5000 * Math.pow(1.06, t) }], reveal: "end" },
      table: { colLabel: "year", cols: [10, 15, 17, 18], rows: [{ label: "A", values: [10000, 12500, 13500, 14000] }, { label: "B", values: [8954.24, 11982.79, 13463.82, 14271.65] }], hideFrom: 2 },
      steps: [["in", "B first pulls ahead in year []", [18]]], answer: "Year 18", check: "14271.65 > 14000 ✓", tip: "Patience pays." },
    { stage: 2, ctx: "Two graphs: one linear, one exponential. They cross. Look at what happens after the crossing.", chart: race((x) => 10 * x + 10, (x) => Math.pow(2, x), [0, 8, 0, 120, 1, 10, 1, 20]),
      steps: [["ch", "Which one ends up on top as x grows?", [["The exponential", ""], ["The line", "Its rate stays 10; the exponential's rate keeps growing."]]]], answer: "The exponential", check: "2ˣ's rate of change keeps growing ✓", tip: "Look at the right side of the graph." },
    { stage: 2, ctx: "Why does the exponential always win eventually?", steps: [["ch", "Because…", [["Its increase each step keeps growing, while a line's stays the same", ""], ["It starts bigger", "It often starts smaller."], ["Exponents are always larger than multiplication", "It's about how the rate of change grows."]]]], answer: "Its rate of change keeps growing", check: "Equal factors beat equal differences ✓", tip: "Explain the pattern." },
    { stage: 3, ctx: "A 30-day contract: A pays $1000 every day. B pays 1¢ on day 1, doubling every day.", steps: [["in", "B on day 30 alone pays 0.01 · 2²⁹ ≈ $[] (nearest dollar)", [5368709], { tol: 1 }], ["ch", "Which contract do you take for 30 days?", [["B, by a mile", ""], ["A", "A pays $30,000 in total. B's day 30 alone pays millions."]]]], answer: "B", check: "0.01 × 536,870,912 ≈ $5.37 million ✓", tip: "The classic penny problem." },
    { stage: 3, ctx: "y = 100x² versus y = 2ˣ.", table: { colLabel: "x", cols: [13, 14, 15], rows: [{ label: "100x²", values: [16900, 19600, 22500] }, { label: "2ˣ", values: [8192, 16384, 32768] }], hideFrom: 2 },
      steps: [["in", "First whole x where 2ˣ wins: x = []", [15]]], answer: "x = 15", check: "32768 > 22500 ✓", tip: "A big head start." },
    { stage: 3, ctx: "A 5-day contract: A pays $100 × day; B pays $2<sup>day</sup>.", steps: [["ch", "For only 5 days, which is better?", [["A", ""], ["B", "In 5 days B pays 2 + 4 + 8 + 16 + 32 = $62 total; A pays $1500."]]]], answer: "A for short contracts", check: "Eventually ≠ immediately ✓", tip: "The length of the contract matters." },
    { stage: 3, ctx: "Is this true: 1.001ˣ > 1000x for some x?", steps: [["ch", "", [["Yes: any exponential with b > 1 eventually passes any line", ""], ["No: 1.001 is too close to 1", "It grows by 0.1% per step, and that still compounds forever."]]]], answer: "Yes, eventually", check: "Exponential growth beats polynomial growth ✓", tip: "Last one: trust the pattern." },
  ];
  Timeline.stepGame({
    slug: "f-le-a-3", title: "Contract Auction", subtitle: "Exponential growth eventually beats linear, quadratic and polynomial growth",
    stages: { 1: "Stage 1 · Who wins?", 2: "Stage 2 · When and why", 3: "Stage 3 · Choose wisely" }, levels: LEVELS,
    help: { intro: "A linear contract adds the same amount each day. An exponential one multiplies. Who wins, and when?",
      steps: ["Compare the values in the table or on the graph.", "Find the first input where the exponential pulls ahead.", "Think about the length of the contract.", "Fewer wrong answers means more stars."], note: "\"Eventually\" can take a long time." },
    hint: "Compare the two rows at each input.",
    guide: {
      summary: "A 12-level game showing with tables and graphs that a quantity increasing exponentially eventually exceeds one increasing linearly, quadratically or as any polynomial, while short contracts may favor linear growth.",
      also: "<span class='code'>AI.A-REI.D.11</span> where two functions meet.",
      practices: "MP3 Construct viable arguments · MP5 Use appropriate tools strategically",
      goals: ["Observe with tables and graphs that exponential growth eventually exceeds linear, quadratic and polynomial growth.", "Find the input where an exponential first overtakes another function.", "Explain why, in terms of the growing rate of change."],
      howItWorks: "Each level compares contracts or functions in a table (later values hidden until solved) and on a graph. Students find the overtaking point, choose contracts, and explain the pattern.",
      stageNotes: { 1: { sees: "Linear, quadratic and slow-exponential races.", builds: "Overtaking points." }, 2: { sees: "Cubic, savings, two crossings.", builds: "Why exponential wins." }, 3: { sees: "The penny problem, a big head start, a short contract.", builds: "Eventually vs. now." } },
      discussion: ["Why does 2ˣ beat 100x² even though it starts far behind?", "When would you choose the linear contract?", "How can 1.001ˣ beat 1000x?"],
      misconceptions: [["The function ahead now stays ahead", "Levels 1, 3 and 10."], ["Exponential always wins immediately", "Level 11."], ["A base close to 1 never catches up", "Level 12."]],
      exitTicket: { items: ["Make a table for 20x and 2ˣ. When does 2ˣ win?", "Which grows faster eventually: x⁵ or 1.1ˣ?", "Why does an exponential eventually beat a line?"],
        answers: ["At x = 8 (256 > 160); 2ˣ is also above at x = 0 and 1.", "1.1ˣ", "Its increase each step keeps growing; a line's increase is constant."] },
    },
  });
})();
