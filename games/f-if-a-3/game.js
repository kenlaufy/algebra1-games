/* Turn by Turn · AI.F-IF.A.3 */
(function () {
  const M = "−";
  const dots = (pts, r) => ({ r, xlabel: "n (turn)", ylabel: "f(n)", series: [{ pts }], reveal: "start" });
  const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  const LEVELS = [
    { stage: 1, ctx: "A sequence: 3, 7, 11, 15, … Write it as a function: f(1) = 3, f(2) = 7, …", table: { colLabel: "n", cols: [1, 2, 3, 4, 5], rows: [{ label: "f(n)", values: [3, 7, 11, 15, 19] }], hideFrom: 4 },
      steps: [["in", "f(5) = []", [19], { hint: "Each turn adds the same amount." }], ["ch", "What is f(2.5)?", [["It doesn't exist: the inputs are turn numbers", ""], ["9, halfway between 7 and 11", "There's no turn 2.5. The domain is whole numbers."], ["0", "f(2.5) isn't defined at all."]]]],
      answer: "f(5) = 19; the domain is whole numbers", check: "A sequence is a function on the integers ✓", tip: "A sequence is a function whose inputs are turn numbers." },
    { stage: 1, ctx: "A recursive rule: f(1) = 2 and f(n + 1) = 3 · f(n).", table: { colLabel: "n", cols: [1, 2, 3, 4], rows: [{ label: "f(n)", values: [2, 6, 18, 54] }], hideFrom: 1 },
      steps: [["in", "f(2) = [], f(3) = [], f(4) = []", [6, 18, 54], { hint: "Each term is 3 times the one before." }]], answer: "2, 6, 18, 54", check: "54 = 3 × 18 ✓", tip: "Recursive means each term is built from the one before." },
    { stage: 1, ctx: "The Fibonacci sequence from the standard: f(0) = f(1) = 1, f(n + 1) = f(n) + f(n − 1).", table: { colLabel: "n", cols: [0, 1, 2, 3, 4, 5], rows: [{ label: "f(n)", values: [1, 1, 2, 3, 5, 8] }], hideFrom: 2 },
      steps: [["in", "f(2) = [], f(3) = [], f(4) = [], f(5) = []", [2, 3, 5, 8], { hint: "Add the two terms before." }]], answer: "1, 1, 2, 3, 5, 8", check: "8 = 5 + 3 ✓", tip: "Each term needs TWO earlier terms." },
    { stage: 1, ctx: "f(n) = 2n + 1 for n = 0, 1, 2, 3, 4.", chart: dots([[0, 1], [1, 3], [2, 5], [3, 7], [4, 9]], [-1, 6, 0, 11, 1, 1]),
      steps: [["ch", "What does the graph of this sequence look like?", [["Separate dots, one per turn", ""], ["A solid line", "There's nothing between the turns."], ["A curve", "It's dots, and they happen to line up."]]], ["in", "f(4) = []", [9]]],
      answer: "Dots at whole-number inputs", check: "The graph of a sequence is a set of points ✓", tip: "Graphs of sequences are dots." },
    { stage: 2, ctx: "f(1) = 100 and f(n + 1) = f(n) − 7.", table: { colLabel: "n", cols: [1, 2, 3, 4, 5, 6], rows: [{ label: "f(n)", values: [100, 93, 86, 79, 72, 65] }], hideFrom: 1 },
      steps: [["in", "f(6) = []", [65], { hint: "Subtract 7 five times." }]], answer: "f(6) = 65", check: "100 − 5·7 = 65 ✓", tip: "Counting down." },
    { stage: 2, ctx: "f(0) = 1 and f(n + 1) = 2 · f(n) + 1.", table: { colLabel: "n", cols: [0, 1, 2, 3, 4], rows: [{ label: "f(n)", values: [1, 3, 7, 15, 31] }], hideFrom: 1 },
      steps: [["in", "f(1) = [], f(2) = [], f(3) = [], f(4) = []", [3, 7, 15, 31], { hint: "Double, then add 1." }]], answer: "1, 3, 7, 15, 31", check: "31 = 2·15 + 1 ✓", tip: "Two operations per turn." },
    { stage: 2, ctx: "The sequence is 2, 6, 18, 54, …", steps: [["ch", "Which recursive rule fits?", [["f(1) = 2, f(n + 1) = 3 · f(n)", ""], ["f(1) = 2, f(n + 1) = f(n) + 4", "6 → 18 adds 12, not 4."], ["f(n) = 2n", "f(2) would be 4."]]], ["in", "f(5) = []", [162]]],
      answer: "f(n + 1) = 3f(n), f(5) = 162", check: "3 × 54 = 162 ✓", tip: "Find the rule from the terms." },
    { stage: 2, ctx: "f(n) = n² for n = 1, 2, 3, …", chart: dots([[1, 1], [2, 4], [3, 9], [4, 16]], [0, 5, 0, 18, 1, 2]),
      steps: [["in", "f(7) = []", [49]], ["ch", "Is 2.5 in the domain?", [["No: only whole-number turns", ""], ["Yes, f(2.5) = 6.25", "As a sequence, n counts turns: 1, 2, 3, …"]]]], answer: "f(7) = 49", check: "Domain: positive integers ✓", tip: "A sequence can grow quadratically too." },
    { stage: 3, ctx: "Fibonacci again: f(0) = f(1) = 1, f(n + 1) = f(n) + f(n − 1).", table: { colLabel: "n", cols: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], rows: [{ label: "f(n)", values: fib }], hideFrom: 6 },
      steps: [["in", "f(10) = []", [89], { hint: "Keep adding the last two terms: 13, 21, …" }]], answer: "f(10) = 89", check: "89 = 55 + 34 ✓", tip: "Recursion takes patience." },
    { stage: 3, ctx: "Stacking blocks: row n has n blocks. T(n) is the total in n rows: T(1) = 1, T(n) = T(n − 1) + n.", table: { colLabel: "n", cols: [1, 2, 3, 4, 5, 6], rows: [{ label: "T(n)", values: [1, 3, 6, 10, 15, 21] }], hideFrom: 3 },
      steps: [["in", "T(6) = []", [21]]], answer: "T(6) = 21", check: "1 + 2 + 3 + 4 + 5 + 6 = 21 ✓", tip: "A sequence from a picture." },
    { stage: 3, ctx: "f(0) = 5 and f(n) = f(n − 1) + 4. (This one starts at n = 0.)", steps: [["in", "f(3) = []", [17], { hint: "f(0) = 5, f(1) = 9, …" }], ["ch", "Written explicitly:", [["f(n) = 5 + 4n", ""], ["f(n) = 4 + 5n", "Check n = 0: f(0) should be 5."], ["f(n) = 5 + 4(n − 1)", "That starts at n = 1."]]]],
      answer: "f(n) = 5 + 4n", check: "f(3) = 5 + 12 = 17 ✓", tip: "Watch where the counting starts." },
    { stage: 3, ctx: "Which graph shows a sequence?", steps: [["ch", "A sequence's graph is…", [["Points at n = 1, 2, 3, … only", ""], ["A smooth curve through all real x", "That's a function on the real numbers."], ["A horizontal line", "That's a single output for every input."]]], ["ch", "Is every sequence a function?", [["Yes: each turn has exactly one value", ""], ["No: sequences aren't functions", "A sequence assigns exactly one term to each turn number, so it's a function."]]]],
      answer: "Sequences are functions on the integers", check: "Domain ⊆ integers ✓", tip: "Last one: what makes a sequence a function?" },
  ];
  Timeline.stepGame({
    slug: "f-if-a-3", title: "Turn by Turn", firstMove: "Find the next terms by following the rule one turn at a time.", subtitle: "Sequences are functions on the integers, sometimes defined recursively",
    stages: { 1: "Stage 1 · Sequences as functions", 2: "Stage 2 · Recursive rules", 3: "Stage 3 · Longer runs" }, levels: LEVELS,
    help: { intro: "A sequence is a function whose inputs are turn numbers: f(1) is the first term, f(2) the second, and so on.",
      steps: ["Read the rule: explicit (f(n) = …) or recursive (built from earlier terms).", "Fill in the missing terms or answer the question.", "The hidden table values appear when you finish.", "Fewer wrong answers means more stars."],
      note: "Some sequences start at n = 0, others at n = 1." },
    hint: "Apply the rule one turn at a time.",
    guide: {
      summary: "A 12-level game about sequences as functions on the integers. Students evaluate explicit and recursive rules, including the standard's Fibonacci example, recognize that the domain is whole numbers, and identify the graph of a sequence as separate points.",
      also: "<span class='code'>AI.F-BF.A.2</span> arithmetic and geometric sequences.",
      practices: "MP8 Look for and express regularity in repeated reasoning · MP6 Attend to precision",
      goals: ["Recognize that a sequence is a function whose domain is a subset of the integers.", "Evaluate terms from explicit and recursive definitions, including Fibonacci.", "Represent a sequence as a set of points and identify recursive rules from terms."],
      howItWorks: "Each level gives a sequence rule with a table (some cells hidden) or a dot graph. Students compute terms and answer questions about the domain and the graph.",
      stageNotes: { 1: { sees: "Arithmetic, geometric and Fibonacci sequences; a dot graph.", builds: "Function notation f(n); integer domain." }, 2: { sees: "Recursive rules with one or two operations.", builds: "Iterating rules; matching rules to terms." }, 3: { sees: "Fibonacci to f(10), triangular numbers, a sequence starting at 0.", builds: "Persistence; indexing; explicit vs. recursive." } },
      discussion: ["Why is f(2.5) undefined for a sequence?", "What do you need to know to start the Fibonacci sequence?", "Why does the starting index (0 or 1) change the explicit formula?"],
      misconceptions: [["Interpolating between terms", "Level 1 asks for f(2.5)."], ["Fibonacci adds only one previous term", "Level 3."], ["Off-by-one with n = 0", "Level 11."]],
      exitTicket: { items: ["f(1) = 4, f(n + 1) = f(n) + 6. Find f(5).", "f(0) = 3, f(n + 1) = 2f(n). Find f(4).", "Why is the graph of a sequence made of dots?"],
        answers: ["28", "48", "Only whole-number turns are inputs; there's nothing between them."] },
    },
  });
})();
