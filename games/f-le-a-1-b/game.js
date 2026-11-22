/* Model It: Adding · AI.F-LE.A.1.b */
(function () {
  const M = "−";
  const SORT = (yes) => yes ? [["Constant rate: the same amount each unit", ""], ["Not a constant rate", "The same amount is added (or removed) every unit."]]
    : [["Not a constant rate", ""], ["Constant rate: the same amount each unit", "The amount changes by a percent, so the size of each change keeps changing."]];
  const LEVELS = [
    { stage: 1, ctx: "A pool fills with 30 liters every minute.", steps: [["ch", "Sort it:", SORT(true)], ["in", "Model: V = []t", [30]], ["in", "After 7 minutes: [] liters", [210]]], answer: "V = 30t", check: "30 × 7 = 210 ✓", tip: "Same amount every unit of time? Then it's a constant rate." },
    { stage: 1, ctx: "Your savings grow by 5% each month.", steps: [["ch", "Sort it:", SORT(false)]], answer: "Percent growth: not a constant rate", check: "5% of a bigger balance is a bigger amount ✓", tip: "Percent changes aren't the same amount each time." },
    { stage: 1, ctx: "A car travels 55 miles every hour.", steps: [["ch", "Sort it:", SORT(true)], ["in", "Model: D = []t", [55]], ["in", "In 3.5 hours: [] miles", [192.5]]], answer: "D = 55t", check: "55 × 3.5 = 192.5 ✓", tip: "Steady speed." },
    { stage: 1, ctx: "A town's population doubles every decade.", steps: [["ch", "Sort it:", SORT(false)]], answer: "Doubling: not a constant rate", check: "Each decade adds more than the last ✓", tip: "Doubling multiplies." },
    { stage: 2, ctx: "Is the rate constant per unit?", table: { colLabel: "x", cols: [0, 1, 2, 3], rows: [{ label: "y", values: [12, 19, 26, 33] }] },
      steps: [["in", "Change per unit: []", [7]], ["in", "Model: y = []x + []", [7, 12]]], answer: "y = 7x + 12", check: "Each step adds 7 ✓", tip: "Check the change for each unit." },
    { stage: 2, ctx: "Uneven steps in x! Compute the rate for each gap.", table: { colLabel: "x", cols: [0, 2, 5, 6], rows: [{ label: "y", values: [4, 10, 19, 22] }] },
      steps: [["in", "Rates: (10 − 4)/2 = [], (19 − 10)/3 = [], (22 − 19)/1 = []", [3, 3, 3]], ["in", "Model: y = []x + []", [3, 4]]], answer: "y = 3x + 4", check: "Constant rate 3 per unit ✓", tip: "Per unit means divide by the size of each gap." },
    { stage: 2, ctx: "A 20 cm candle burns 2 cm every hour.", steps: [["in", "h = [] − []t", [20, 2]], ["in", "It's 6 cm tall after [] hours", [7]]], answer: "h = 20 − 2t", check: "20 − 14 = 6 ✓", tip: "A constant rate down." },
    { stage: 2, ctx: "Gym A: $10 per visit. Gym B: 3% more expensive every year.", steps: [["ch", "Which changes by a constant amount per unit?", [["Gym A: +$10 per visit", ""], ["Gym B", "3% of a growing price is a growing amount."], ["Both", "Only one adds the same amount per unit."]]]], answer: "Gym A", check: "Constant amount per visit ✓", tip: "Compare the two." },
    { stage: 3, ctx: "A plant grows 1.5 inches per week.", steps: [["in", "Over 8 weeks it grows [] inches", [12]], ["ch", "Its height over time is…", [["Linear", ""], ["Exponential", "It adds 1.5 in each week, not a percent."]]]], answer: "Linear, +1.5 in/week", check: "1.5 × 8 = 12 ✓", tip: "Units matter: per week." },
    { stage: 3, ctx: "Is this table a constant rate?", table: { colLabel: "x", cols: [0, 1, 3, 4], rows: [{ label: "y", values: [5, 8, 14, 17] }] },
      steps: [["in", "Rates: [], [], []", [3, 3, 3]], ["ch", "Constant rate?", [["Yes, 3 per unit", ""], ["No, it jumps by 6 once", "That jump covers 2 units: 6 ÷ 2 = 3 per unit."]]]], answer: "Yes: 3 per unit", check: "6 over 2 units is still 3 per unit ✓", tip: "Look at the gap sizes." },
    { stage: 3, ctx: "A delivery fee is C = 4.5m + 20 dollars for m miles.", steps: [["ch", "What does 4.5 mean?", [["$4.50 added for every mile", ""], ["The starting fee", "That's the 20."], ["The total for 1 mile", "1 mile costs 4.5 + 20 = $24.50."]]], ["in", "Cost for 10 miles: $[]", [65]]], answer: "Constant rate $4.50 per mile", check: "45 + 20 = 65 ✓", tip: "The rate in a formula." },
    { stage: 3, ctx: "Which table changes at a constant rate per unit?", steps: [["ch", "Choose:", [["x: 0, 2, 4 → y: 1, 7, 13", ""], ["x: 0, 1, 2 → y: 1, 2, 4", "That doubles: a constant ratio."], ["x: 0, 1, 3 → y: 2, 4, 6", "4 to 6 over 2 units is 1 per unit, but 2 to 4 is 2 per unit."]]]],
      answer: "y = 3x + 1", check: "6 per 2 units, every time ✓", tip: "Last one: compare rates per unit." },
  ];
  Timeline.stepGame({
    slug: "f-le-a-1-b", title: "Model It: Adding", subtitle: "Recognize situations with a constant rate of change",
    stages: { 1: "Stage 1 · Sort the situations", 2: "Stage 2 · Tables and models", 3: "Stage 3 · Uneven steps and meanings" }, levels: LEVELS,
    help: { intro: "Some quantities change by the <b>same amount</b> every unit: that's a constant rate, and it gives a linear model.",
      steps: ["Ask: is the same amount added or removed each unit?", "For tables, divide each change by the size of its gap.", "Build the model y = mx + b and use it.", "Fewer wrong answers means more stars."], note: "Percent changes are NOT constant rates." },
    hint: "Rate = change in y ÷ change in x for each gap.",
    guide: {
      summary: "A 12-level game for recognizing situations with a constant rate of change per unit interval, sorting them from percent-change situations, checking tables with uneven steps, and building linear models.",
      also: "<span class='code'>AI.F-LE.A.1.c</span> constant percent rate.",
      practices: "MP4 Model with mathematics · MP7 Look for and make use of structure",
      goals: ["Recognize situations in which a quantity changes at a constant rate per unit interval.", "Check a table for a constant rate, including uneven intervals.", "Write and use linear models with interpreted rates."],
      howItWorks: "Levels describe situations or show tables. Students sort them as constant rate or not, compute rates per unit, and fill in linear models.",
      stageNotes: { 1: { sees: "Word situations.", builds: "Constant amount vs. percent." }, 2: { sees: "Tables, including uneven steps.", builds: "Rate per unit; models." }, 3: { sees: "Units and interpretation.", builds: "Meaning of the rate." } },
      discussion: ["Why isn't 5% per month a constant rate?", "How do you check a table whose x-values jump by different amounts?", "What does the 4.5 mean in C = 4.5m + 20?"],
      misconceptions: [["Percent change is a constant rate", "Levels 2 and 8."], ["Ignoring gap size in tables", "Levels 6 and 10."]],
      exitTicket: { items: ["Constant rate or not: a tank drains 12 L per minute.", "x: 0, 3, 5 → y: 2, 11, 17. Constant rate? Model?", "Constant rate or not: prices rise 2% a year."],
        answers: ["Constant rate (−12 L/min).", "Yes, 3 per unit: y = 3x + 2.", "Not constant: percent change."] },
    },
  });
})();
