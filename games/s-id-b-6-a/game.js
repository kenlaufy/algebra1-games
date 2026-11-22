/* Range Bet · AI.S-ID.B.6.a */
(function () {
  const D = window.DataLab;
  const sc = (pts, o) => ({ vb: "0 0 900 420", html: D.scatter(pts, o).svg, label: "Scatter plot" });
  const ice = [[15, 22], [18, 42], [20, 48], [22, 62], [24, 68], [26, 82], [28, 88], [30, 98], [32, 112]];
  const study = [[1, 58], [2, 60], [3, 70], [4, 72], [5, 79], [6, 88], [7, 90], [8, 99]];
  const bact = [[0, 100], [1, 128], [2, 172], [3, 216], [4, 290], [5, 368]];
  const dbl = [[0, 2], [1, 3], [2, 4.6], [3, 6.7], [4, 10.2], [5, 15.1]];
  const LEVELS = [
    { stage: 1, ctx: "Ice cream sales vs. temperature, with the fitted line y = 5x − 50.", pic: sc(ice, { xr: [10, 35, 1, 5], yr: [0, 130, 10, 20], xlabel: "temperature (°C)", ylabel: "sales", line: { m: 5, b: -50 } }),
      steps: [["in", "Predicted sales at 30 °C: []", [100]]], answer: "100 cones", check: "5(30) − 50 = 100 ✓", tip: "Use the fitted line to predict." },
    { stage: 1, ctx: "Same line: y = 5x − 50.", pic: sc(ice, { xr: [10, 35, 1, 5], yr: [0, 130, 10, 20], xlabel: "temperature (°C)", ylabel: "sales", line: { m: 5, b: -50 } }),
      steps: [["in", "At what temperature should the shop expect 75 sales? x = []", [25]]], answer: "25 °C", check: "5x − 50 = 75 → x = 25 ✓", tip: "Work backwards." },
    { stage: 1, ctx: "A quantity measured each hour.", pic: sc(dbl, { xr: [0, 6, 1], yr: [0, 18, 1, 2], xlabel: "hour", ylabel: "amount" }),
      steps: [["ch", "Which kind of function fits best?", [["Exponential: it grows by a similar factor each hour (about ×1.5)", ""], ["Linear", "The increases keep getting bigger: 1, 1.6, 2.1, 3.5, 4.9."], ["Neither", "Ratios are roughly constant."]]]], answer: "Exponential", check: "3 ÷ 2 ≈ 4.6 ÷ 3 ≈ 1.5 ✓", tip: "Choose the model the data suggests." },
    { stage: 1, ctx: "The fitted exponential is y = 2 · 1.5ˣ.", pic: sc(dbl, { xr: [0, 7, 1], yr: [0, 26, 2, 4], xlabel: "hour", ylabel: "amount", curve: (x) => 2 * Math.pow(1.5, x) }),
      steps: [["in", "Predict hour 6: ≈ [] (2 decimal places)", [22.78], { tol: 0.006 }]], answer: "≈ 22.78", check: "2 × 1.5⁶ = 22.78 ✓", tip: "Predict with an exponential model." },
    { stage: 2, ctx: "Test score vs. hours studied. Fitted line y = 6x + 50; most points are within 8 points of the line.", pic: sc(study, { xr: [0, 10, 1], yr: [40, 120, 10], xlabel: "hours studied", ylabel: "score", line: { m: 6, b: 50 } }),
      steps: [["in", "Prediction for 5 hours: []", [80]], ["in", "Using 8 points on either side of the prediction, from [] to []", [72, 88]]], answer: "80, with a rough range from 72 to 88", check: "80 ± 8 ✓", tip: "Bet a range, not just one number." },
    { stage: 2, ctx: "Same model: y = 6x + 50.", steps: [["in", "The model predicts [] for 40 hours of study", [290]], ["ch", "Should you trust that prediction?", [["No: 40 hours is far outside the data, and scores max out at 100", ""], ["Yes: the line keeps going", "Predicting far beyond the data (extrapolation) can be nonsense."]]]], answer: "Don't extrapolate wildly", check: "290 is impossible on a 100-point test ✓", tip: "Know a model's limits." },
    { stage: 2, ctx: "A line drawn through two typical points, (2, 60) and (8, 90).", steps: [["in", "Slope = []", [5]], ["in", "Line: y = []x + []", [5, 50]], ["in", "Predict at x = 6: []", [80]]], answer: "y = 5x + 50, predicts 80", check: "5(6) + 50 = 80 ✓", tip: "Fit a line yourself." },
    { stage: 2, ctx: "Bacteria counts, with fitted model y = 100 · 1.3ᵗ.", pic: sc(bact, { xr: [0, 7, 1], yr: [0, 650, 50, 100], xlabel: "t (hours)", ylabel: "bacteria", curve: (t) => 100 * Math.pow(1.3, t) }),
      steps: [["in", "Predict t = 6: ≈ [] (nearest whole)", [483]]], answer: "≈ 483", check: "100 × 1.3⁶ ≈ 482.68 ✓", tip: "An exponential fit." },
    { stage: 3, ctx: "A phone battery drops about the same amount each hour.", steps: [["ch", "Which model fits this context?", [["Linear", ""], ["Exponential", "Same AMOUNT each hour is linear."], ["Quadratic", "Nothing suggests a curve."]]]], answer: "Linear", check: "Constant rate → linear ✓", tip: "Let the context suggest the function." },
    { stage: 3, ctx: "A savings account earns 4% interest each year, added to the balance annually.", steps: [["ch", "Which model fits?", [["Exponential", ""], ["Linear", "4% of a growing balance is a growing amount."]]], ["in", "Model starting at $500: y = 500 · []ᵗ", [1.04]]], answer: "y = 500(1.04)ᵗ", check: "Constant percent → exponential ✓", tip: "Context again." },
    { stage: 3, ctx: "Ice cream line y = 5x − 50. Tomorrow's forecast is 28 °C. Cones come in boxes of 20.", steps: [["in", "Predicted sales: []", [90]], ["in", "Boxes to order (round up): []", [5]]], answer: "90 sales → 5 boxes", check: "90 ÷ 20 = 4.5 → 5 ✓", tip: "Use a prediction to decide." },
    { stage: 3, ctx: "Study model y = 6x + 50. A student wants a score of at least 86.", steps: [["in", "Hours needed: x = []", [6]], ["ch", "Fair statement:", [["About 6 hours, though actual scores vary around the line", ""], ["Exactly 6 hours guarantees 86", "Points scatter around the line, so nothing is guaranteed."]]]], answer: "About 6 hours", check: "6(6) + 50 = 86 ✓", tip: "Last one: predictions aren't promises." },
  ];
  Timeline.stepGame({
    slug: "s-id-b-6-a", title: "Range Bet", firstMove: "Plug the value into the fitted model, then decide how far real data might land from that prediction.",
    subtitle: "Fit functions to data and use them to solve problems",
    stages: { 1: "Stage 1 · Predict with a fit", 2: "Stage 2 · Ranges and limits", 3: "Stage 3 · Let context choose" }, levels: LEVELS,
    help: { intro: "A function fitted to data lets you predict, but real data scatters around it. Bet on a sensible <b>range</b>.",
      steps: ["Use the fitted function to predict (or work backwards).", "Choose linear or exponential from the pattern or the context.", "Watch out for predictions far outside the data.", "Fewer wrong answers means more stars."], note: "Round as each question asks." },
    hint: "Substitute into the fitted function.",
    guide: {
      summary: "A 12-level game for using fitted functions: predicting from linear and exponential fits, working backwards, betting on ranges, recognizing the dangers of extrapolation, fitting a line through two points, and choosing models suggested by context.",
      also: "<span class='code'>AI.S-ID.B.6.c</span> fitting lines and <span class='code'>AI.S-ID.C.7</span> interpreting them.",
      practices: "MP4 Model with mathematics · MP5 Use appropriate tools strategically",
      goals: ["Fit a linear function to data and use it to solve problems in context.", "Use exponential fits and choose a model suggested by the data or context.", "Recognize the limits of predictions, including extrapolation and scatter."],
      howItWorks: "Each level shows a scatter plot with a fitted line or curve (or a context). Students predict, solve backwards, give ranges, and choose model types, with feedback about extrapolation and variability.",
      stageNotes: { 1: { sees: "Ice cream and a growing quantity.", builds: "Predicting; choosing linear vs. exponential." }, 2: { sees: "Study time; bacteria.", builds: "Ranges; extrapolation; fitting through two points." }, 3: { sees: "Batteries, savings, ordering, goals.", builds: "Context-driven models; decisions." } },
      discussion: ["Why is a range better than a single predicted number?", "What's wrong with predicting a test score for 40 hours of study?", "How does the context tell you to use an exponential model?"],
      misconceptions: [["Predictions are exact", "Levels 5 and 12."], ["Extrapolating without limits", "Level 6."], ["Every trend is linear", "Levels 3 and 10."]],
      exitTicket: { items: ["A fit is y = 3x + 20. Predict y at x = 10.", "Is predicting at x = 500 sensible if the data runs from 0 to 20?", "Population data grows about 5% per year. Which model?"],
        answers: ["50", "Probably not: that's far outside the data.", "Exponential."] },
    },
  });
})();
