/* Guess the Next Number · AI.F-LE.A.1.a */
(function () {
  const M = "−";
  const tab = (xs, ys, hideFrom) => ({ colLabel: "x", cols: xs, rows: [{ label: "y", values: ys }], hideFrom });
  const KIND = (right) => [["Linear: equal differences", "Check the differences: are they all the same?"], ["Exponential: equal ratios", "Check the ratios: are they all the same?"], ["Neither", "Look again at the differences and the ratios."]]
    .map((o, i, all) => (i === right ? o : null)).filter(Boolean).concat([["Linear: equal differences", "The differences aren't all equal."], ["Exponential: equal ratios", "The ratios aren't all equal."], ["Neither", "One of the patterns does hold."]].filter((_, i) => i !== right));
  const LEVELS = [
    { stage: 1, ctx: "Equal steps in x. What happens to y?", table: tab([0, 1, 2, 3, 4], [3, 5, 7, 9, 11], 4),
      steps: [["in", "Differences: 5 − 3 = [], 7 − 5 = [], 9 − 7 = []", [2, 2, 2]], ["ch", "So y is…", KIND(0)], ["in", "Bet on the next value: y = []", [11]]], answer: "Linear: +2 each step", check: "9 + 2 = 11 ✓", tip: "Compute the differences between neighbours." },
    { stage: 1, ctx: "Equal steps in x.", table: tab([0, 1, 2, 3, 4], [2, 6, 18, 54, 162], 4),
      steps: [["in", "Ratios: 6 ÷ 2 = [], 18 ÷ 6 = [], 54 ÷ 18 = []", [3, 3, 3]], ["ch", "So y is…", KIND(1)], ["in", "Next value: y = []", [162]]], answer: "Exponential: ×3 each step", check: "54 × 3 = 162 ✓", tip: "When differences grow, try ratios." },
    { stage: 1, ctx: "Equal steps in x.", table: tab([0, 1, 2, 3, 4], [100, 80, 64, 51.2, 40.96], 4),
      steps: [["in", "Ratios: 80 ÷ 100 = [], 64 ÷ 80 = []", [0.8, 0.8]], ["ch", "So y is…", KIND(1)], ["in", "Next value: y = []", [40.96]]], answer: "Exponential: ×0.8 each step", check: "51.2 × 0.8 = 40.96 ✓", tip: "Shrinking can be exponential too." },
    { stage: 1, ctx: "Equal steps in x.", table: tab([0, 1, 2, 3, 4], [20, 17, 14, 11, 8], 4),
      steps: [["in", "Differences: [], [], []", [-3, -3, -3]], ["ch", "So y is…", KIND(0)], ["in", "Next value: y = []", [8]]], answer: "Linear: −3 each step", check: "11 − 3 = 8 ✓", tip: "Equal negative differences." },
    { stage: 2, ctx: "The x-values go up by 2 each time.", table: tab([0, 2, 4, 6], [5, 11, 17, 23]),
      steps: [["in", "Each step of 2 adds []", [6]], ["in", "So per 1 unit, y changes by []", [3]]], answer: "Equal differences of 6 per 2 units: slope 3", check: "Linear over equal intervals of any size ✓", tip: "Equal intervals don't have to be 1 unit." },
    { stage: 2, ctx: "The x-values go up by 2 each time.", table: tab([0, 2, 4, 6], [1, 9, 81, 729]),
      steps: [["in", "Each step of 2 multiplies by []", [9]], ["in", "So per 1 unit, the factor is []", [3]]], answer: "Equal ratios of 9 per 2 units: factor 3 per unit", check: "3 × 3 = 9 ✓", tip: "Equal factors over equal intervals." },
    { stage: 2, ctx: "Prove it for any line: f(x) = mx + b. Compare f(x + h) and f(x).",
      steps: [["ch", "f(x + h) − f(x) = m(x + h) + b − (mx + b) =", [["mh: the same for every x", ""], ["mx + mh", "The mx terms cancel."], ["h", "Keep the m: m(x + h) − mx = mh."]]]], answer: "f(x + h) − f(x) = mh", check: "Equal intervals h give equal differences mh ✓", tip: "Why do lines have equal differences?" },
    { stage: 2, ctx: "Prove it for any exponential: g(x) = a · bˣ. Compare g(x + h) and g(x).",
      steps: [["ch", "g(x + h) ÷ g(x) = a·bˣ⁺ʰ ÷ (a·bˣ) =", [["bʰ: the same for every x", ""], ["b", "Only when h = 1."], ["a·bʰ", "The a cancels too."]]]], answer: "g(x + h)/g(x) = bʰ", check: "Equal intervals h give equal factors bʰ ✓", tip: "Why do exponentials have equal ratios?" },
    { stage: 3, ctx: "Two runners start the same: A = 2x + 1 and B = 2ˣ.", table: { colLabel: "x", cols: [0, 1, 2, 3, 4], rows: [{ label: "A", values: [1, 3, 5, 7, 9] }, { label: "B", values: [1, 2, 4, 8, 16] }] },
      steps: [["ch", "Which one is exponential?", [["B: ratios of 2", ""], ["A", "A adds 2 each time."]]], ["in", "At x = 6: A = [] and B = []", [13, 64]]], answer: "A linear, B exponential", check: "2⁶ = 64 > 13 ✓", tip: "Close at first. Not for long." },
    { stage: 3, ctx: "Equal steps in x.", table: tab([0, 1, 2, 3, 4], [1, 2, 4, 7, 11], 4),
      steps: [["in", "Differences: [], [], []", [1, 2, 3]], ["ch", "So y is…", KIND(2)], ["in", "Following the pattern, the next difference is 4, so y = []", [11]]], answer: "Neither: differences grow by 1", check: "Ratios 2, 2, 1.75 aren't equal either ✓", tip: "Not every pattern is one of the two." },
    { stage: 3, ctx: "Equal steps in x.", table: tab([0, 1, 2, 3], [10, 12, 14.4, 17.28], 3),
      steps: [["in", "Differences: 2, 2.4, … The ratios are 12 ÷ 10 = [] and 14.4 ÷ 12 = []", [1.2, 1.2]], ["ch", "So y is…", KIND(1)], ["in", "Next value: []", [17.28]]], answer: "Exponential ×1.2 (looks almost linear at first)", check: "14.4 × 1.2 = 17.28 ✓", tip: "Small growth looks linear. Check ratios." },
    { stage: 3, ctx: "Equal steps in x.", table: tab([0, 1, 2, 3], [50, 45, 40.5, 36.45], 3),
      steps: [["in", "Differences: −5, []", [-4.5]], ["ch", "So y is…", KIND(1)], ["in", "Next value: []", [36.45]]], answer: "Exponential ×0.9", check: "40.5 × 0.9 = 36.45 ✓", tip: "Last one: decide carefully." },
  ];
  Timeline.stepGame({
    slug: "f-le-a-1-a", title: "Guess the Next Number", firstMove: "Subtract neighbouring values to find the differences, then decide what kind of growth it is.", subtitle: "Linear functions grow by equal differences; exponential functions by equal factors",
    stages: { 1: "Stage 1 · Differences or ratios?", 2: "Stage 2 · Prove it", 3: "Stage 3 · Look-alikes" }, levels: LEVELS,
    help: { intro: "Over equal steps in x, a <b>linear</b> function always adds the same amount and an <b>exponential</b> function always multiplies by the same factor.",
      steps: ["Compute differences (subtract neighbours) or ratios (divide neighbours).", "Decide: linear, exponential, or neither.", "Bet on the next value.", "Fewer wrong answers means more stars."], note: "Decimals are fine." },
    hint: "Subtract neighbouring values for differences; divide them for ratios.",
    guide: {
      summary: "A 12-level game showing that linear functions grow by equal differences and exponential functions by equal factors over equal intervals. Students compute differences and ratios from tables, classify functions, prove both facts algebraically, and handle look-alikes.",
      also: "<span class='code'>AI.F-LE.A.1.b</span> and <span class='code'>AI.F-LE.A.1.c</span>.",
      practices: "MP3 Construct viable arguments · MP7 Look for and make use of structure",
      goals: ["Prove that linear functions grow by equal differences over equal intervals.", "Prove that exponential functions grow by equal factors over equal intervals.", "Classify tables, including intervals other than 1 and sequences that are neither."],
      howItWorks: "Each level shows a table. Students enter differences or ratios, classify the function, and predict the next value (hidden until solved). Stage 2 uses intervals of 2 and two algebraic proofs.",
      stageNotes: { 1: { sees: "Clear linear and exponential tables.", builds: "Differences vs. ratios." }, 2: { sees: "Intervals of 2; general f(x) = mx + b and g(x) = a·bˣ.", builds: "The proofs f(x + h) − f(x) = mh and g(x + h)/g(x) = bʰ." }, 3: { sees: "Look-alikes, a neither, slow growth.", builds: "Careful classification." } },
      discussion: ["Why does f(x + h) − f(x) not depend on x for a line?", "10, 12, 14.4 looks almost linear. How can you tell it isn't?", "Is 1, 2, 4, 7, 11 linear, exponential, or neither?"],
      misconceptions: [["Growing differences means exponential", "Level 10."], ["Small percent growth is linear", "Level 11."], ["Equal intervals must be 1 unit", "Stage 2."]],
      exitTicket: { items: ["Is 7, 12, 17, 22 linear or exponential? Next term?", "Is 3, 6, 12, 24 linear or exponential? Next term?", "Show that f(x) = 5x − 2 grows by equal differences."],
        answers: ["Linear (+5); 27", "Exponential (×2); 48", "f(x + h) − f(x) = 5h, the same for every x."] },
    },
  });
})();
