/* Pick the Statistic · AI.S-ID.A.2 */
(function () {
  const D = window.DataLab;
  const dp = (data, o) => ({ vb: "0 0 900 260", html: D.dotPlot(data, o), label: "Dot plot" });
  const LEVELS = [
    { stage: 1, ctx: "Two archers' scores. A: 70, 72, 74, 76, 78. B: 60, 67, 74, 81, 88.", steps: [["in", "Mean of A = [], mean of B = []", [74, 74]], ["in", "Standard deviation (2 decimal places): A ≈ [], B ≈ []", [2.83, 9.9], { tol: 0.005, hint: "SD = square root of the average squared distance from the mean." }],
      ["ch", "Which archer is more consistent?", [["A: smaller standard deviation", ""], ["B", "B's scores are spread much wider."], ["The same: equal means", "Equal centers can have very different spreads."]]]], answer: "Same center, A less spread", check: "SD 2.83 vs 9.90 ✓", tip: "Symmetric data: compare means and standard deviations." },
    { stage: 1, ctx: "Monthly pay at a small company (thousands of $): 2, 2, 3, 3, 3, 4, 4, 40.", pic: dp([2, 2, 3, 3, 3, 4, 4, 40], { min: 0, max: 42, step: 6, label: "pay (thousands of $)" }),
      steps: [["ch", "Which center describes a typical worker?", [["The median, because one huge value skews the data", ""], ["The mean", "The owner's 40 drags the mean up to 7.6, more than anyone else earns except the owner."]]], ["in", "Median = [] thousand", [3]]], answer: "Median 3", check: "Mean 7.625 vs median 3 ✓", tip: "Skewed data: medians." },
    { stage: 1, ctx: "Data: 20, 22, 23, 25, 26, 28, 30, 95", steps: [["in", "Median = []", [25.5]], ["in", "Q1 = [] and Q3 = [], so IQR = []", [22.5, 29, 6.5]]], answer: "Median 25.5, IQR 6.5", check: "The 95 doesn't change the IQR much ✓", tip: "Median and IQR resist outliers." },
    { stage: 1, ctx: "Two box plots of commute times.", pic: { vb: "0 0 900 270", html: D.boxPlot([{ data: [5, 8, 10, 12, 15, 18, 40], label: "Bus" }, { data: [12, 14, 15, 16, 17, 18, 20], label: "Bike", color: "#f2c98a" }], { min: 0, max: 42, step: 6, label: "minutes" }), label: "Two box plots" },
      steps: [["in", "Medians: bus [], bike []", [12, 16]], ["in", "IQRs: bus [], bike []", [10, 4]], ["ch", "Fair summary:", [["The bus is usually faster but much less predictable", ""], ["The bike is faster", "The bike's median is higher."], ["They're the same", "Medians and IQRs differ."]]]], answer: "Bus: lower median, bigger IQR", check: "Center and spread tell different stories ✓", tip: "Compare center AND spread." },
    { stage: 2, ctx: "Which statistics fit which shape?", steps: [["ch", "For roughly symmetric data without outliers, which pair measures center using every value?", [["Mean and standard deviation", ""], ["Only the maximum", "That ignores most of the data."], ["Median and IQR only", "The median uses the middle position. The mean uses every value."]]],
      ["ch", "For strongly skewed data or data with outliers, use…", [["Median and IQR", ""], ["Mean and standard deviation", "Both get pulled by extreme values."]]]], answer: "Symmetric → mean/SD; skewed → median/IQR", check: "Match the statistic to the shape ✓", tip: "The rule of thumb." },
    { stage: 2, ctx: "Data: 2, 4, 4, 4, 5, 5, 7, 9", steps: [["in", "Mean = []", [5]], ["in", "Standard deviation = []", [2], { hint: "Squared distances from 5: 9, 1, 1, 1, 0, 0, 4, 16. Average them, then take the square root." }]], answer: "Mean 5, SD 2", check: "√(32 ÷ 8) = 2 ✓", tip: "Compute a standard deviation." },
    { stage: 2, ctx: "Points per game. Team A: 10, 12, 14, 16, 18. Team B: 13, 14, 14, 14, 15.", steps: [["in", "Means: A [], B []", [14, 14]], ["in", "SDs (2 decimal places): A ≈ [], B ≈ []", [2.83, 0.63], { tol: 0.005 }], ["ch", "More consistent team:", [["B", ""], ["A", "A's points vary much more."]]]], answer: "B (SD 0.63)", check: "Same mean, smaller SD ✓", tip: "Consistency is about spread." },
    { stage: 2, ctx: "A histogram of house prices has a long tail to the right.", pic: { vb: "0 0 900 300", html: D.histogram([180, 190, 200, 205, 210, 215, 220, 230, 240, 260, 300, 380, 520], { min: 150, max: 550, width: 50, label: "price (thousands of $)" }), label: "Histogram" },
      steps: [["ch", "Best center and spread for this data:", [["Median and IQR", ""], ["Mean and SD", "The long right tail pulls the mean and SD up."]]], ["ch", "The mean is probably…", [["Greater than the median", ""], ["Less than the median", "A right tail pulls the mean up."], ["Equal to the median", "For right-skewed data, the mean is often higher because it is pulled toward the high values."]]]], answer: "Median and IQR; mean > median", check: "Right skew pulls the mean right ✓", tip: "Read the shape first." },
    { stage: 3, ctx: "Pick a free-throw shooter for the last shot. A's recent makes (out of 20): 12, 14, 15, 13, 16. B's: 6, 20, 8, 20, 16. Both average 14.",
      steps: [["in", "Ranges: A [], B []", [4, 14]], ["ch", "Who do you pick?", [["A: same average, far more consistent", ""], ["B: higher maximum", "B is wildly inconsistent."]]]], answer: "A", check: "Spread matters when averages tie ✓", tip: "Use spread to decide." },
    { stage: 3, ctx: "Town X home prices (thousands): 150, 160, 170, 180, 900. Town Y: 200, 210, 220, 230, 240.", steps: [["in", "Medians: X [], Y []", [170, 220]], ["in", "Means: X [], Y []", [312, 220]], ["ch", "Which town has the lower median home price?", [["Town X (lower median)", ""], ["Town Y (lower mean)", "X's mean is inflated by one mansion."]]]], answer: "Town X", check: "Median 170 < 220 ✓", tip: "Don't let one mansion fool you." },
    { stage: 3, ctx: "Shapes and centers.", steps: [["ch", "Skewed right data usually has…", [["mean > median", ""], ["mean < median", "That's skewed left."], ["mean = median", "That's symmetric."]]], ["ch", "Symmetric data usually has…", [["mean ≈ median", ""], ["mean much bigger", "No tail pulls it."]]]], answer: "Right skew: mean > median", check: "Tails pull the mean ✓", tip: "Connect shape to center." },
    { stage: 3, ctx: "Class 1 test scores: median 78, IQR 10. Class 2: median 78, IQR 25.", steps: [["ch", "Best comparison:", [["Same typical score, but Class 2's scores are much more spread out", ""], ["Class 2 did better", "The medians are equal."], ["The classes are identical", "Their spreads differ a lot."]]]], answer: "Same center, different spread", check: "Always report both ✓", tip: "Last one: write the comparison." },
  ];
  Timeline.stepGame({
    slug: "s-id-a-2", title: "Pick the Statistic", firstMove: "Look at the shape first. Then compute the center and spread that fit it.",
    subtitle: "Compare center and spread using statistics that fit the shape of the data",
    stages: { 1: "Stage 1 · Compute and compare", 2: "Stage 2 · Match statistic to shape", 3: "Stage 3 · Decide" }, levels: LEVELS,
    help: { intro: "Symmetric data: use the <b>mean</b> and <b>standard deviation</b>. Skewed data or outliers: use the <b>median</b> and <b>IQR</b>.",
      steps: ["Look at the shape: symmetric, skewed, outliers?", "Compute the statistics asked for.", "Compare centers AND spreads.", "Fewer wrong answers means more stars."], note: "Standard deviation here is the population standard deviation." },
    hint: "Check the shape, then compute.",
    guide: {
      summary: "A 12-level game for comparing data sets with appropriate statistics: means and standard deviations for symmetric data, medians and IQRs for skewed data, and using both center and spread to make decisions.",
      also: "<span class='code'>AI.S-ID.A.3</span> outliers and shape.",
      practices: "MP5 Use appropriate tools strategically · MP3 Construct viable arguments",
      goals: ["Use statistics appropriate to the shape of the data to compare center and spread.", "Compute median, IQR, mean and standard deviation.", "Make decisions using both center and spread."],
      howItWorks: "Levels show data as lists, dot plots, box plots or histograms. Students compute statistics, choose the right ones for the shape, and compare.",
      stageNotes: { 1: { sees: "Archers, pay, commutes.", builds: "Computing and comparing." }, 2: { sees: "Rules of thumb; an SD calculation; consistency.", builds: "Matching statistics to shape." }, 3: { sees: "Picking a shooter; towns; comparisons.", builds: "Decisions with center and spread." } },
      discussion: ["Why does one huge salary affect the mean more than the median?", "Two teams have the same mean. How else can they differ?", "When would you report the mean even if there's an outlier?"],
      misconceptions: [["Equal means = equal data", "Levels 1, 7, 9."], ["Mean as the default", "Levels 2, 8, 10."], ["Ignoring spread", "Level 12."]],
      exitTicket: { items: ["Data: 3, 4, 4, 5, 6, 30. Mean or median? Why?", "Find the IQR of 1, 3, 5, 7, 9, 11.", "A: mean 50, SD 2. B: mean 50, SD 12. Compare."],
        answers: ["Median (4.5): the 30 skews the mean (8.67).", "Q1 = 3, Q3 = 9, IQR = 6.", "Same center; B is much more spread out."] },
    },
  });
})();
