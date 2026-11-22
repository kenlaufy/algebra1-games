/* Parameter Dials · AI.F-LE.B.5 */
(function () {
  const M = "−";
  const LEVELS = [
    { stage: 1, ctx: "A taxi ride costs C = 2.5m + 4 dollars for m miles.", steps: [["ch", "What does 2.5 mean?", [["$2.50 for each mile", ""], ["The starting fee", "The starting fee is the constant, 4."], ["The cost of 1 mile in total", "One mile costs 2.5 + 4 = $6.50."]]],
      ["ch", "What does 4 mean?", [["A $4 fee before any miles", ""], ["$4 per mile", "That's 2.5."]]], ["in", "A 10-mile ride costs $[]", [29]]], answer: "2.5 = rate per mile, 4 = starting fee", check: "25 + 4 = 29 ✓", tip: "Every number in a model means something." },
    { stage: 1, ctx: "A plant's height is h = 0.8w + 5 cm after w weeks.", steps: [["in", "It started at [] cm and grows [] cm per week", [5, 0.8]]], answer: "Starts 5 cm, grows 0.8 cm/week", check: "h(0) = 5 ✓", tip: "Starting value and rate." },
    { stage: 1, ctx: "Turn the dial: the taxi fee changes from C = 2.5m + 4 to C = 2.5m + 6.", chart: { r: [0, 10, 0, 35, 1, 5, 1, 5], xlabel: "m (miles)", ylabel: "C ($)", series: [{ f: (m) => 2.5 * m + 4, color: "#9a9284" }, { f: (m) => 2.5 * m + 6 }], reveal: "end" },
      steps: [["ch", "What happens to the graph?", [["It shifts up by 2: every ride costs $2 more", ""], ["It gets steeper", "The rate per mile didn't change."], ["It shifts right", "Changing the constant moves it up or down."]]]], answer: "Up 2: a bigger starting fee", check: "Same slope, new intercept ✓", tip: "Predict before you look." },
    { stage: 1, ctx: "Turn the other dial: C = 2.5m + 4 becomes C = 3m + 4.", chart: { r: [0, 10, 0, 35, 1, 5, 1, 5], xlabel: "m (miles)", ylabel: "C ($)", series: [{ f: (m) => 2.5 * m + 4, color: "#9a9284" }, { f: (m) => 3 * m + 4 }], reveal: "end" },
      steps: [["ch", "What happens?", [["It gets steeper: each mile costs more", ""], ["It shifts up", "The starting fee is the same."], ["Nothing changes at m = 10", "At 10 miles it's now $34 instead of $29."]]]], answer: "Steeper", check: "Rate 3 > 2.5 ✓", tip: "The rate dial." },
    { stage: 2, ctx: "A town's population: P = 1200(1.03)ᵗ.", steps: [["in", "Population now: []", [1200]], ["in", "It grows []% per year", [3]]], answer: "1200 people now, 3% growth per year", check: "P(0) = 1200 ✓", tip: "Exponential parameters." },
    { stage: 2, ctx: "A car's value: V = 22000(0.85)ᵗ.", steps: [["ch", "What does 22000 mean?", [["The price when new", ""], ["The value lost each year", "That's 15% of the value, which changes each year."]]], ["in", "It loses []% of its value each year", [15]]], answer: "$22,000 new; 15% depreciation", check: "0.85 = 1 − 0.15 ✓", tip: "Two parameters, two meanings." },
    { stage: 2, ctx: "Dial: P = 1200(1.03)ᵗ becomes P = 1200(1.05)ᵗ.", chart: { r: [0, 20, 0, 3500, 2, 500, 4, 500], xlabel: "t (years)", ylabel: "P", series: [{ f: (t) => 1200 * Math.pow(1.03, t), color: "#9a9284" }, { f: (t) => 1200 * Math.pow(1.05, t) }], reveal: "end" },
      steps: [["ch", "What changes?", [["It grows faster (5% per year), same start", ""], ["It starts higher", "The 1200 didn't change."], ["It shrinks", "1.05 > 1."]]]], answer: "Faster growth", check: "Same intercept, steeper curve ✓", tip: "The growth dial." },
    { stage: 2, ctx: "Dial: P = 1200(1.03)ᵗ becomes P = 2400(1.03)ᵗ.", steps: [["ch", "What changes?", [["Every value doubles; the growth rate stays 3%", ""], ["It grows twice as fast", "The rate is still 3%; only the starting amount doubled."], ["Nothing", "The start doubled."]]], ["in", "At t = 10 the new value is [] times the old one", [2]]], answer: "Starting value doubled", check: "2400/1200 = 2 at every t ✓", tip: "The starting dial." },
    { stage: 3, ctx: "Two plans: A: C = 15 + 3h; B: C = 5 + 4h (h = hours).", steps: [["ch", "Which has the bigger starting fee?", [["A ($15)", ""], ["B", "B's fee is $5."]]], ["ch", "Which costs more per hour?", [["B ($4)", ""], ["A", "A costs $3 per hour."]]], ["in", "They cost the same at h = []", [10]]], answer: "A: higher fee; B: higher rate; equal at 10 h", check: "45 = 45 ✓", tip: "Compare parameters." },
    { stage: 3, ctx: "A tank holds 60 L and gains 4 L each minute.", steps: [["in", "Model: V = []t + []", [4, 60]]], answer: "V = 4t + 60", check: "Rate 4, start 60 ✓", tip: "Parameters from words." },
    { stage: 3, ctx: "A cooling rate: the temperature difference D = 50(0.9)ᵗ. Engineers want the drink to cool faster.", steps: [["ch", "Which change makes it cool faster?", [["Use 0.8 instead of 0.9", ""], ["Use 100 instead of 50", "That doubles the difference; it doesn't cool faster."], ["Use 0.95", "That cools slower."]]]], answer: "A smaller factor: 0.8", check: "Losing 20% per minute beats losing 10% ✓", tip: "Which dial controls the speed?" },
    { stage: 3, ctx: "Temperature: T = −2h + 70 °F, h hours after sunset.", steps: [["ch", "What does −2 mean?", [["It cools 2 °F every hour", ""], ["It's 2 °F at sunset", "At sunset it's 70 °F."], ["It warms 2 °F per hour", "The negative means falling."]]], ["in", "4 hours after sunset: [] °F", [62]]], answer: "70 °F at sunset, cooling 2 °F/hour", check: "70 − 8 = 62 ✓", tip: "Last one: a negative rate." },
  ];
  Timeline.stepGame({
    slug: "f-le-b-5", title: "Parameter Dials", subtitle: "Interpret the parameters of linear and exponential functions in context",
    stages: { 1: "Stage 1 · Linear dials", 2: "Stage 2 · Exponential dials", 3: "Stage 3 · Compare and build" }, levels: LEVELS,
    help: { intro: "In f(x) = mx + k and f(x) = a · bˣ, each number is a <b>dial</b> with a meaning: a rate, a starting value, a growth factor.",
      steps: ["Say what each parameter means in the situation.", "Predict what turning a dial does, then see the graph change.", "Build models from descriptions.", "Fewer wrong answers means more stars."], note: "Predict before the graph appears." },
    hint: "Starting value: what you get at 0. Rate or factor: what happens per unit.",
    guide: {
      summary: "A 12-level game for interpreting parameters in linear and exponential functions: rates and starting values, growth factors and initial amounts, and the effect of changing each parameter on the graph and in context.",
      also: "<span class='code'>AI.F-IF.C.8.b</span> interpreting growth and decay rates.",
      practices: "MP2 Reason abstractly and quantitatively · MP4 Model with mathematics",
      goals: ["Interpret the slope and intercept of a linear function in context.", "Interpret a and b in y = a·bˣ in context.", "Predict the effect of changing a parameter."],
      howItWorks: "Levels give models in context. Students choose the meaning of each parameter and predict what happens when a parameter is changed; graphs show the old and new versions after the prediction.",
      stageNotes: { 1: { sees: "Taxi and plant models.", builds: "Rate vs. starting value; shifting vs. steepening." }, 2: { sees: "Population and car models.", builds: "Initial amount vs. growth factor." }, 3: { sees: "Comparing plans, building models, a cooling factor, a negative rate.", builds: "Using parameters to decide." } },
      discussion: ["Why does changing 4 to 6 shift the taxi graph up instead of making it steeper?", "What's the difference between doubling a and changing b?", "What does a negative slope mean for the temperature?"],
      misconceptions: [["The constant is the rate", "Level 1."], ["Doubling a doubles the growth rate", "Level 8."], ["A bigger multiplier means faster cooling", "Level 11."]],
      exitTicket: { items: ["In y = 12x + 30 for a phone plan, what do 12 and 30 mean?", "In P = 500(1.07)ᵗ, what do 500 and 1.07 mean?", "What happens to y = 3x + 2 if the 2 becomes 5?"],
        answers: ["$12 per month; $30 one-time fee (or similar).", "500 now; 7% growth per year.", "The graph shifts up 3; the slope stays the same."] },
    },
  });
})();
