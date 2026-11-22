/* Guess r · AI.S-ID.C.8 */
(function () {
  const D = window.DataLab;
  const S = {
    strongPos: [[1, 2], [2, 3.1], [3, 3.9], [4, 5.2], [5, 6.1], [6, 6.8], [7, 8.1], [8, 9]],
    modPos: [[1, 3], [2, 6], [3, 4], [4, 8], [5, 5], [6, 9], [7, 6], [8, 10]],
    none: [[1, 5], [2, 2], [3, 8], [4, 4], [5, 6], [6, 3], [7, 7], [8, 5]],
    strongNeg: [[1, 9], [2, 8.2], [3, 7.1], [4, 6.3], [5, 4.8], [6, 4.1], [7, 3.2], [8, 1.9]],
    modNeg: [[1, 8], [2, 9], [3, 5], [4, 7], [5, 4], [6, 6], [7, 2], [8, 4]],
    perfect: [[1, 1], [2, 2.5], [3, 4], [4, 5.5], [5, 7], [6, 8.5], [7, 10], [8, 11.5]],
    curve: [[1, 12.25], [2, 6.25], [3, 2.25], [4, 0.25], [5, 0.25], [6, 2.25], [7, 6.25], [8, 12.25]],
  };
  const R = (k) => window.Alg.round(D.r(S[k]), 2);
  const pic = (k) => ({ vb: "0 0 900 420", label: "Scatter plot", html: D.scatter(S[k], { xr: [0, 9, 1], yr: [0, 14, 1, 2] }).svg });
  const guess = (k) => ["in", "Your guess for r (−1 to 1): []", [R(k)], { tol: 0.25, hint: "Strong straight-line trends are near ±1; no trend is near 0. The sign follows the direction." }];
  const LEVELS = [
    { stage: 1, ctx: "Study the scatter plot: which way does it go, and how tightly do the points hug a line?", pic: pic("strongPos"), steps: [guess("strongPos")], answer: "r ≈ " + R("strongPos"), check: "Points hug a rising line ✓", tip: "Guess r. Within 0.25 counts." },
    { stage: 1, ctx: "Study the scatter plot: which way does it go, and how tightly do the points hug a line?", pic: pic("strongNeg"), steps: [guess("strongNeg")], answer: "r ≈ " + R("strongNeg"), check: "Points hug a falling line ✓", tip: "Downhill means negative." },
    { stage: 1, ctx: "Study the scatter plot: which way does it go, and how tightly do the points hug a line?", pic: pic("none"), steps: [guess("none")], answer: "r ≈ " + R("none"), check: "No trend: r near 0 ✓", tip: "Is there any trend at all?" },
    { stage: 1, ctx: "Study the scatter plot: which way does it go, and how tightly do the points hug a line?", pic: pic("modPos"), steps: [guess("modPos")], answer: "r ≈ " + R("modPos"), check: "Upward but scattered ✓", tip: "A trend with lots of scatter." },
    { stage: 2, ctx: "Study the scatter plot: which way does it go, and how tightly do the points hug a line?", pic: pic("modNeg"), steps: [guess("modNeg"), ["ch", "Describe this association:", [["Moderate negative", ""], ["Strong positive", "The trend goes down, and it's loose."], ["None", "There is a downward trend."]]]], answer: "Moderate negative", check: "r ≈ " + R("modNeg") + " ✓", tip: "Guess, then describe." },
    { stage: 2, ctx: "Study the scatter plot: which way does it go, and how tightly do the points hug a line?", pic: pic("perfect"), steps: [["in", "These points are exactly on a line. r = []", [1]]], answer: "r = 1", check: "Perfect positive linear fit ✓", tip: "What's the biggest r can be?" },
    { stage: 2, ctx: "Technology computed r = 0.92 for hours of sleep vs. test score.", steps: [["ch", "Interpretation:", [["A strong positive linear association", ""], ["92% of the score is caused by sleep", "r measures linear association, not causes or percents."], ["A weak association", "0.92 is close to 1."]]]], answer: "Strong positive", check: "|r| near 1 = strong ✓", tip: "Interpret a computed r." },
    { stage: 2, ctx: "Four data sets have r = 0.3, −0.85, 0.6 and −0.1.", steps: [["ch", "Which shows the strongest linear association?", [["r = −0.85", ""], ["r = 0.6", "Strength is about closeness to ±1: |−0.85| > 0.6."], ["r = 0.3", "Weaker."]]], ["ch", "Which is weakest?", [["r = −0.1", ""], ["r = 0.3", "|−0.1| is smaller."]]]], answer: "−0.85 strongest, −0.1 weakest", check: "Compare |r| ✓", tip: "Strength ignores the sign." },
    { stage: 3, ctx: "Study the scatter plot: which way does it go, and how tightly do the points hug a line?", pic: pic("curve"), steps: [guess("curve"), ["ch", "So is there no relationship between x and y?", [["There IS a strong relationship, but it's curved, not linear", ""], ["Right: no relationship", "The points follow a clear U shape."], ["r must be wrong", "r only measures LINEAR association."]]]], answer: "r ≈ 0 but a strong curved pattern", check: "r is only about straight lines ✓", tip: "A trick: look before you trust r." },
    { stage: 3, ctx: "Heights are measured in inches, then converted to centimeters. r for height vs. weight was 0.75.", steps: [["in", "r after converting to cm: []", [0.75]]], answer: "Still 0.75", check: "Changing units doesn't change r ✓", tip: "Does r care about units?" },
    { stage: 3, ctx: "r = −0.95 between hours of video games and test scores.", steps: [["ch", "Which conclusion is justified?", [["Students who play more tend to score lower (strong negative association)", ""], ["Video games cause low scores", "Correlation alone doesn't show cause."], ["There's no relationship", "−0.95 is very strong."]]]], answer: "Strong negative association", check: "Correlation describes; it doesn't prove cause ✓", tip: "What does r allow you to say?" },
    { stage: 3, ctx: "Match each description to an r value: 0.98, 0.5, −0.6.", steps: [["ch", "\"Points fall in a fairly loose band going downhill\"", [["−0.6", ""], ["0.5", "Downhill means negative."], ["0.98", "That would be a tight uphill line."]]], ["ch", "\"Points nearly on a rising line\"", [["0.98", ""], ["0.5", "Nearly on a line means close to 1."]]]], answer: "−0.6 and 0.98", check: "Sign = direction, size = strength ✓", tip: "Last one: match them up." },
  ];
  Timeline.stepGame({
    slug: "s-id-c-8", title: "Guess r", firstMove: "Look at the direction and how tightly the points hug a line, then guess r between −1 and 1.",
    subtitle: "Interpret the correlation coefficient of a linear fit",
    stages: { 1: "Stage 1 · Guess the r", 2: "Stage 2 · Interpret r", 3: "Stage 3 · Limits of r" }, levels: LEVELS,
    help: { intro: "The correlation coefficient <b>r</b> runs from −1 to 1. Its sign shows direction; its size shows how close the points are to a straight line.",
      steps: ["Look at the scatter plot: uphill or downhill? Tight or loose?", "Guess r. Within 0.25 of the true value counts.", "Interpret r in words, and remember what it can't tell you.", "Fewer wrong answers means more stars."], note: "In class, technology computes r; here you build intuition for it." },
    hint: "Near ±1: tight line. Near 0: no linear trend.",
    guide: {
      summary: "A 12-level game for the correlation coefficient. Students estimate r from scatter plots (the true value is computed from the data), interpret computed values, compare strengths, and learn r's limits: it only measures linear association, doesn't depend on units, and doesn't imply causation.",
      also: "<span class='code'>AI.S-ID.C.9</span> correlation vs. causation.",
      practices: "MP2 Reason abstractly and quantitatively · MP5 Use appropriate tools strategically",
      goals: ["Interpret the correlation coefficient of a linear fit.", "Estimate r from a scatter plot and compare strengths of association.", "Recognize what r does not measure (curved patterns, causation)."],
      howItWorks: "Stage 1 levels show a scatter plot and ask for an estimate of r, accepted within 0.25 of the value computed from the data. Later levels interpret given r values, include a perfect line, a perfect curve with r ≈ 0, and a unit change.",
      stageNotes: { 1: { sees: "Strong, moderate and no associations.", builds: "Intuition for r." }, 2: { sees: "Negative trends, a perfect line, computed values.", builds: "Interpreting and comparing r." }, 3: { sees: "A U shape, unit changes, causation.", builds: "Limits of r." } },
      discussion: ["Why can a U-shaped pattern have r ≈ 0?", "Why doesn't converting inches to centimeters change r?", "Does r = −0.95 mean video games cause low scores?"],
      misconceptions: [["r near 0 means no relationship", "Level 9."], ["The sign shows strength", "Level 8."], ["High r proves causation", "Level 11."]],
      exitTicket: { items: ["Describe a scatter plot with r = −0.2.", "Which is stronger: r = 0.7 or r = −0.8?", "Give an example of a strong relationship with r ≈ 0."],
        answers: ["A weak, slightly downward cloud.", "−0.8 (|−0.8| > 0.7).", "Points on a U-shaped curve, like y = x² for x from −3 to 3."] },
    },
  });
})();
