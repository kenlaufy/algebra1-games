/* Residual Detective · AI.S-ID.B.6.b */
(function () {
  const D = window.DataLab;
  const lin = [[1, 4.5], [2, 7.8], [3, 8.4], [4, 11.9], [5, 12.2], [6, 15.8], [7, 16.1], [8, 19.4]];
  const curvy = [[1, 3], [2, 5], [3, 9], [4, 15], [5, 23], [6, 33], [7, 45], [8, 59]];
  const exp = [[0, 2], [1, 3], [2, 4.5], [3, 6.8], [4, 10.1], [5, 15.2], [6, 22.8]];
  const two = (pts, line, xr, yr, labels) => ({ vb: "0 0 900 720", label: "Scatter plot and residual plot",
    html: D.scatter(pts, { xr, yr, line, resid: true, h: 420, xlabel: labels && labels[0], ylabel: labels && labels[1] }).svg + '<g transform="translate(0 420)">' + D.residualPlot(pts, line, { xr }) + "</g>" });
  const fitLin = D.fit(lin), fitCurvy = D.fit(curvy), fitExp = D.fit(exp);
  const LEVELS = [
    { stage: 1, ctx: "Line: y = 5x + 2. A data point is (4, 23).", steps: [["in", "Predicted y = []", [22]], ["in", "Residual = actual − predicted = []", [1]]], answer: "Residual +1", check: "23 − 22 = 1 ✓", tip: "Residual = actual − predicted." },
    { stage: 1, ctx: "Same line y = 5x + 2. Another point is (6, 28).", steps: [["in", "Residual = []", [-4]], ["ch", "A negative residual means the point is…", [["below the line", ""], ["above the line", "Actual is less than predicted, so it's below."], ["on the line", "That would be a residual of 0."]]]], answer: "Residual −4: below the line", check: "28 − 32 = −4 ✓", tip: "Negative residuals." },
    { stage: 1, ctx: "A line fitted to data, and its residual plot underneath.", pic: two(lin, fitLin, [0, 9, 1], [0, 24, 2, 4]),
      steps: [["ch", "The residuals look…", [["Randomly scattered around 0: the line fits well", ""], ["Curved", "There's no U shape or arch."], ["All positive", "Some are negative."]]]], answer: "Random residuals → good linear fit", check: "No pattern in the residuals ✓", tip: "What should a good residual plot look like?" },
    { stage: 1, ctx: "Another line and its residual plot.", pic: two(curvy, fitCurvy, [0, 9, 1], [-10, 65, 5, 10]),
      steps: [["ch", "The residuals form…", [["A U shape: the data curves, so a line is a poor model", ""], ["Random scatter", "Look: positive at both ends, negative in the middle."], ["A straight line", "A U shape."]]]], answer: "Pattern → try a curve", check: "Patterned residuals mean the wrong kind of model ✓", tip: "Patterns are clues." },
    { stage: 2, ctx: "Points (1, 4), (2, 7), (3, 8), (4, 11). Line y = 2x + 2.", steps: [["in", "Residuals: [], [], [], []", [0, 1, 0, 1]]], answer: "0, 1, 0, 1", check: "Each point minus 2x + 2 ✓", tip: "Several residuals." },
    { stage: 2, ctx: "Two lines for the same data. Line A's residuals: 3, −4, 5, −3. Line B's residuals: 1, −1, 0, 1.", steps: [["ch", "Which line fits better?", [["B: its residuals are much smaller", ""], ["A", "A's points are further from its line."], ["Can't tell", "Smaller residuals mean a closer fit."]]], ["in", "Sum of squared residuals: A = [], B = []", [59, 3]]], answer: "Line B (59 vs 3)", check: "9 + 16 + 25 + 9 = 59 ✓", tip: "Compare the sizes of residuals." },
    { stage: 2, ctx: "A line fitted to growing data.", pic: two(exp, fitExp, [0, 7, 1], [-4, 26, 2, 4]),
      steps: [["ch", "The residual pattern suggests…", [["An exponential model fits better", ""], ["The line is perfect", "Residuals bend: positive, negative, positive."], ["Remove the last point", "The pattern runs through all the points."]]]], answer: "Switch to exponential", check: "Curved residuals ✓", tip: "Which model would fix the pattern?" },
    { stage: 2, ctx: "The same data with an exponential fit y = 2 · 1.5ˣ.", pic: { vb: "0 0 900 420", label: "Scatter with exponential fit", html: D.scatter(exp, { xr: [0, 7, 1], yr: [0, 26, 2, 4], curve: (x) => 2 * Math.pow(1.5, x) }).svg },
      steps: [["in", "Residual at x = 3 (2 decimal places): 6.8 − 2 · 1.5³ = []", [0.05], { tol: 0.006 }], ["ch", "Compared with the line, this model…", [["fits much better: residuals are tiny", ""], ["fits worse", "The curve passes almost through every point."]]]], answer: "Exponential fits well", check: "2 × 3.375 = 6.75; 6.8 − 6.75 = 0.05 ✓", tip: "Check the new model's residuals." },
    { stage: 3, ctx: "Residuals for 6 students' scores: 2, −1, 3, −12, 1, −2.", steps: [["in", "The biggest miss is student number []", [4]], ["ch", "That student…", [["scored 12 points less than the model predicted", ""], ["scored 12 points more", "Negative means below the prediction."]]]], answer: "Student 4: −12", check: "Largest size residual ✓", tip: "Find the unusual point." },
    { stage: 3, ctx: "A model predicts a used car costs $9,400; it actually sold for $10,100.", steps: [["in", "Residual = $[]", [700]], ["ch", "Meaning:", [["It sold for $700 more than the model predicted", ""], ["The model is wrong by $10,100", "The residual is the difference, not the price."]]]], answer: "+$700", check: "10100 − 9400 = 700 ✓", tip: "Residuals in context." },
    { stage: 3, ctx: "Residual plots for three models.", steps: [["ch", "Which plot shows a good fit?", [["Points scattered randomly above and below 0, no pattern", ""], ["Points forming a clear arch", "An arch means the model shape is wrong."], ["Every residual positive", "Then the model is too low everywhere."]]]], answer: "Random scatter", check: "No pattern = good fit ✓", tip: "Recognize good and bad plots." },
    { stage: 3, ctx: "Data: (0, 1), (1, 2), (2, 5), (3, 10), (4, 17). A line gives residuals 2, −1, −2, −1, 2.", steps: [["ch", "The residual pattern is…", [["U-shaped, so a curve (like a quadratic) would fit better", ""], ["random", "2, −1, −2, −1, 2 is a clear U."]]], ["ch", "These points fit y = x² + 1 exactly. Its residuals are…", [["all 0", ""], ["the same as the line's", "Check: 0² + 1 = 1, 1² + 1 = 2, …"]]]], answer: "Quadratic fits; residuals 0", check: "Patterns point to better models ✓", tip: "Last one: follow the clue." },
  ];
  Timeline.stepGame({
    slug: "s-id-b-6-b", title: "Residual Detective", firstMove: "Find the predicted value from the model, then subtract it from the actual value.",
    subtitle: "Assess the fit of a function by plotting and analyzing residuals",
    stages: { 1: "Stage 1 · What's a residual?", 2: "Stage 2 · Compare fits", 3: "Stage 3 · Investigate" }, levels: LEVELS,
    help: { intro: "A <b>residual</b> is actual − predicted. A good model leaves residuals that scatter randomly around 0; a pattern means the model is the wrong shape.",
      steps: ["Compute predicted values, then residuals.", "Read residual plots: random scatter is good; curves are clues.", "Compare models by the size of their residuals.", "Fewer wrong answers means more stars."], note: "Positive residual: above the line. Negative: below." },
    hint: "Residual = actual − predicted.",
    guide: {
      summary: "A 12-level game about residuals: computing them, interpreting their signs in context, reading residual plots to judge fit, comparing models by residual size, and following residual patterns to better models (exponential, quadratic).",
      also: "<span class='code'>AI.S-ID.B.6.a</span> using fitted functions.",
      practices: "MP3 Construct viable arguments · MP7 Look for and make use of structure",
      goals: ["Compute and interpret residuals.", "Informally assess the fit of a function by plotting and analyzing residuals.", "Use residual patterns to choose a better model."],
      howItWorks: "Levels show lines and data, often with the residual plot below the scatter plot (dashed segments show each residual). Students compute residuals, judge patterns, and compare models.",
      stageNotes: { 1: { sees: "Single residuals and two residual plots.", builds: "Meaning and sign; random vs. patterned." }, 2: { sees: "Comparing lines; exponential data.", builds: "Sum of squared residuals; switching models." }, 3: { sees: "Unusual points; contexts; plots to classify.", builds: "Interpretation; model choice." } },
      discussion: ["What does a residual of −4 tell you about a point?", "Why does a U-shaped residual plot mean a line is the wrong model?", "How could two different lines have residuals of different sizes for the same data?"],
      misconceptions: [["Residual = predicted − actual", "Level 2's sign."], ["A line is fine if r is high", "Level 4 (high r, but curved)."], ["Small residuals at a few points prove a good fit", "Level 11."]],
      exitTicket: { items: ["Line y = 3x + 1; point (2, 9). Residual?", "Describe a residual plot that shows a good linear fit.", "Residuals 4, 0, −3, 0, 4 for a line. What does that suggest?"],
        answers: ["9 − 7 = 2", "Random scatter around 0 with no pattern.", "A U-shaped pattern: a curve (such as a quadratic) would fit better."] },
    },
  });
})();
