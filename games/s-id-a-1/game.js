/* Draw, Then Look · AI.S-ID.A.1 */
(function () {
  const D = window.DataLab;
  const dots = (data, o) => ({ vb: "0 0 900 260", html: D.dotPlot([], o), after: D.dotPlot(data, o), label: "Dot plot" });
  const hist = (data, o) => ({ vb: "0 0 900 300", html: D.histogram([], Object.assign({ ymax: o.ymax }, o)), after: D.histogram(data, o), label: "Histogram" });
  const box = (data, o, before) => {
    const bh = 30 + 90 + 60;
    return { vb: "0 0 900 " + (before ? 260 : bh), html: before ? D.dotPlot(data, o) : D.boxPlot([{ data }], o), after: D.boxPlot([{ data }], o), label: "Box plot" };
  };
  const SHAPES = (right) => [["Piled up in the middle, fairly symmetric", "Look for where most values are and whether one side has a long tail."], ["Skewed right: a long tail toward bigger values", "Is there a long tail of large values?"], ["Skewed left: a long tail toward smaller values", "Is there a long tail of small values?"]]
    .map((o, i) => [o[0], i === right ? "" : o[1]]).sort((a, b) => (a[1] === "" ? -1 : b[1] === "" ? 1 : 0));
  const d1 = [6, 7, 7, 8, 8, 8, 9, 9, 10], d2 = [0, 0, 1, 1, 1, 1, 2, 2, 3, 5];
  const d3 = [142, 145, 148, 151, 152, 155, 156, 158, 159, 161, 163, 166, 172], d4 = [1, 2, 2, 3, 3, 3, 4, 4, 5, 7, 9, 12, 15];
  const d5 = [2, 4, 5, 7, 8, 9, 12], d6 = [10, 12, 13, 15, 18, 20, 21, 25], d7 = [3, 5, 6, 6, 7, 8, 9, 11, 14], d12 = [1, 2, 2, 3, 3, 4, 5, 6, 8];
  const LEVELS = [
    { stage: 1, ctx: "Quiz scores: 6, 7, 7, 8, 8, 8, 9, 9, 10", pic: dots(d1, { min: 5, max: 11, label: "quiz score" }),
      steps: [["ch", "Predict the shape of the dot plot:", SHAPES(0)], ["in", "How many dots are stacked at 8? []", [3]], ["in", "The tallest stack is at []", [8]]], answer: "Symmetric, centered at 8", check: "Dot plots show every value ✓", tip: "Predict the plot before it appears." },
    { stage: 1, ctx: "Number of siblings: 0, 0, 1, 1, 1, 1, 2, 2, 3, 5", pic: dots(d2, { min: 0, max: 6, label: "siblings" }),
      steps: [["ch", "Predict the shape:", SHAPES(1)], ["in", "How many dots are stacked at 1? []", [4]]], answer: "Skewed right", check: "A tail toward 3 and 5 ✓", tip: "Where's the tail?" },
    { stage: 1, ctx: "Heights (cm): 142, 145, 148, 151, 152, 155, 156, 158, 159, 161, 163, 166, 172. Histogram bins: 140–150, 150–160, 160–170, 170–180.", pic: hist(d3, { min: 140, max: 180, width: 10, label: "height (cm)", ymax: 7 }),
      steps: [["in", "Bar heights: [], [], [], []", [3, 6, 3, 1], { hint: "Count the values in each bin. A value on a boundary like 150 goes in the bin that starts there." }]], answer: "3, 6, 3, 1", check: "13 values in all ✓", tip: "A histogram counts values in each bin." },
    { stage: 1, ctx: "Wait times (min): 1, 2, 2, 3, 3, 3, 4, 4, 5, 7, 9, 12, 15. Bins: 0–4, 4–8, 8–12, 12–16.", pic: hist(d4, { min: 0, max: 16, width: 4, label: "wait (min)", ymax: 7 }),
      steps: [["in", "Bar heights: [], [], [], []", [6, 4, 1, 2]], ["ch", "Shape:", SHAPES(1)]], answer: "6, 4, 1, 2: skewed right", check: "Most waits are short ✓", tip: "Bins first, then shape." },
    { stage: 2, ctx: "Data: 2, 4, 5, 7, 8, 9, 12", pic: box(d5, { min: 0, max: 14, label: "value" }, true),
      steps: [["in", "Five-number summary: min [], Q1 [], median [], Q3 [], max []", [2, 4, 7, 9, 12], { hint: "Median of all 7 values; Q1 is the median of the lower half (2, 4, 5); Q3 of the upper half (8, 9, 12)." }]],
      answer: "2, 4, 7, 9, 12", check: "The box spans Q1 to Q3 ✓", tip: "A box plot is built from five numbers." },
    { stage: 2, ctx: "Data: 10, 12, 13, 15, 18, 20, 21, 25", pic: box(d6, { min: 8, max: 26, step: 2, label: "value" }, true),
      steps: [["in", "Min [], Q1 [], median [], Q3 [], max []", [10, 12.5, 16.5, 20.5, 25], { hint: "Even count: the median is halfway between 15 and 18. Each half has 4 values." }]], answer: "10, 12.5, 16.5, 20.5, 25", check: "Halves of 4 ✓", tip: "An even number of values." },
    { stage: 2, ctx: "Read the box plot.", pic: { vb: "0 0 900 180", html: D.boxPlot([{ data: d7 }], { min: 0, max: 16, step: 2, label: "value" }), label: "Box plot" },
      steps: [["in", "Median = []", [7]], ["in", "IQR = Q3 − Q1 = []", [4.5]]], answer: "Median 7, IQR 4.5", check: "Q1 = 5.5, Q3 = 10 ✓", tip: "Reading a box plot." },
    { stage: 2, ctx: "Three displays: dot plot, histogram, box plot.", steps: [["ch", "Which display shows every individual value?", [["The dot plot", ""], ["The histogram", "It shows counts in bins, not individual values."], ["The box plot", "It shows only five numbers."]]],
      ["ch", "Which shows the median directly?", [["The box plot", ""], ["The histogram", "You can't read the exact median from bins."], ["Neither", "The line in the box is the median."]]]], answer: "Dot plot: values; box plot: median", check: "Each display shows different things ✓", tip: "Know your displays." },
    { stage: 3, ctx: "You have 200 test scores from 0 to 100.", steps: [["ch", "Best display to see the overall shape?", [["A histogram", ""], ["A dot plot", "200 dots would be a crowded mess."], ["A list of numbers", "Hard to see any shape."]]]], answer: "Histogram", check: "Histograms handle large data sets ✓", tip: "Choose a display." },
    { stage: 3, ctx: "Two classes' scores.", pic: { vb: "0 0 900 270", html: D.boxPlot([{ data: [55, 62, 68, 70, 74, 78, 81, 85, 92], label: "Class A" }, { data: [65, 70, 72, 73, 75, 76, 78, 80, 82], label: "Class B", color: "#f2c98a" }], { min: 50, max: 95, step: 5, label: "score" }), label: "Two box plots" },
      steps: [["ch", "Which class's scores are more spread out?", [["Class A: wider box and whiskers", ""], ["Class B", "B's box and whiskers are narrower."], ["The same", "Compare the widths."]]]], answer: "Class A", check: "Box plots make spreads easy to compare ✓", tip: "Box plots compare groups." },
    { stage: 3, ctx: "A histogram has bins 0–10: 4, 10–20: 7, 20–30: 3.", steps: [["ch", "Can you find the exact median from this histogram?", [["No, only which bin it's in (10–20)", ""], ["Yes, it's 15", "The values inside a bin are unknown."], ["Yes, it's 7", "7 is a count, not a data value."]]]], answer: "Only the bin: 10–20", check: "The 7th value is in the second bin ✓", tip: "What a histogram hides." },
    { stage: 3, ctx: "Data: 1, 2, 2, 3, 3, 4, 5, 6, 8. Build the box plot.", pic: box(d12, { min: 0, max: 9, label: "value" }, true),
      steps: [["in", "Min [], Q1 [], median [], Q3 [], max []", [1, 2, 3, 5.5, 8]]], answer: "1, 2, 3, 5.5, 8", check: "Box from 2 to 5.5 ✓", tip: "Last one: from dots to a box." },
  ];
  Timeline.stepGame({
    slug: "s-id-a-1", title: "Draw, Then Look", firstMove: "Predict what the plot will look like, then fill in the counts or the five-number summary.",
    subtitle: "Represent data with dot plots, histograms and box plots",
    stages: { 1: "Stage 1 · Dot plots and histograms", 2: "Stage 2 · Box plots", 3: "Stage 3 · Choose the display" }, levels: LEVELS,
    help: { intro: "Predict, then look. Each plot shows data on a number line in its own way.",
      steps: ["Dot plot: one dot per value. Histogram: bars count values in bins. Box plot: min, Q1, median, Q3, max.", "Predict the shape or fill in the numbers.", "The real plot appears when you finish.", "Fewer wrong answers means more stars."], note: "Q1 and Q3 are the medians of the lower and upper halves." },
    hint: "Count carefully, or find the medians of the halves.",
    guide: {
      summary: "A 12-level game for representing data on the number line with dot plots, histograms and box plots. Students predict shapes, count bins, compute five-number summaries, read box plots, and choose displays for different purposes.",
      also: "<span class='code'>AI.S-ID.A.2</span> comparing center and spread.",
      practices: "MP5 Use appropriate tools strategically · MP6 Attend to precision",
      goals: ["Represent data with dot plots, histograms and box plots.", "Compute the five-number summary and read it from a box plot.", "Choose a display that suits the data and the question."],
      howItWorks: "Each level gives a data set and an empty or partial display. Students predict the shape, enter bin counts or five-number summaries, and the finished plot appears. Stage 3 compares displays.",
      stageNotes: { 1: { sees: "Dot plots and histograms.", builds: "Shape; counting bins." }, 2: { sees: "Box plots from data and on their own.", builds: "Quartiles; IQR." }, 3: { sees: "Choosing displays; comparing two classes.", builds: "Strengths and limits of each display." } },
      discussion: ["What can a dot plot show that a box plot can't?", "Why can't you find the exact median from a histogram?", "How do box plots make comparing two groups easy?"],
      misconceptions: [["Boundary values counted twice", "Level 3 hint."], ["Q1 as the 25th value instead of the lower-half median", "Levels 5–6."], ["Histogram bar height as a data value", "Level 11."]],
      exitTicket: { items: ["Make a dot plot of 2, 3, 3, 4, 4, 4, 5.", "Find the five-number summary of 1, 3, 4, 6, 7, 9, 10, 12.", "Which display would you use for 500 commute times?"],
        answers: ["Stacks: 2 (1), 3 (2), 4 (3), 5 (1).", "1, 3.5, 6.5, 9.5, 12", "A histogram (or box plot)."] },
    },
  });
})();
