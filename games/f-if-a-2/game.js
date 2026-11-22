/* Assembly Line · AI.F-IF.A.2 */
(function () {
  const LEVELS = [
    { stage: 1, ctx: "Machine <b>f(x) = 3x + 2</b>. Feed it 4.", steps: [["in", "f(4) = []", [14]]], answer: "f(4) = 14", check: "3(4) + 2 = 14 ✓", tip: "Replace x with the input." },
    { stage: 1, ctx: "Machine <b>g(x) = x² − 1</b>. Feed it −3.", steps: [["in", "g(−3) = []", [8]]], answer: "g(−3) = 8", check: "(−3)² − 1 = 9 − 1 = 8 ✓", tip: "Careful with negative inputs: (−3)² = 9." },
    { stage: 1, ctx: "Machine <b>h(x) = 10 − 2x</b>.", steps: [["in", "h(0) = [] · h(5) = []", [10, 0]]], answer: "h(0) = 10, h(5) = 0", check: "10 − 0 = 10; 10 − 10 = 0 ✓", tip: "Two inputs." },
    { stage: 1, ctx: "Assembly line: the output of <b>f(x) = 2x + 1</b> is fed back into f.", steps: [["in", "f(1) = [] · f(f(1)) = []", [3, 7]]], answer: "f(f(1)) = 7", check: "f(1) = 3, then f(3) = 7 ✓", tip: "Work from the inside out." },
    { stage: 2, ctx: "Machine <b>f(x) = 4x − 3</b> printed 13.", steps: [["in", "Solve f(x) = 13: x = []", [4]]], answer: "x = 4", check: "4(4) − 3 = 13 ✓", tip: "Now run the machine backward." },
    { stage: 2, ctx: "A machine's table:", table: { colLabel: "x", cols: [1, 2, 3, 4], rows: [{ label: "f(x)", values: [4, 7, 10, 13] }] }, steps: [["in", "f(3) = []", [10]], ["in", "f(x) = 13 when x = []", [4]]], answer: "f(3) = 10; f(4) = 13", check: "Read across the table ✓", tip: "Notation with a table." },
    { stage: 2, ctx: "A machine's graph.", chart: { r: [-1, 6, -1, 9, 1, 1], series: [{ f: (x) => 0.5 * (x - 2) * (x - 2) + 1, always: true }], marks: [[2, 1, ""], [4, 3, ""]] }, steps: [["in", "f(2) = [] · f(4) = []", [1, 3]], ["in", "f(0) = []", [3]]], answer: "f(2) = 1, f(4) = 3, f(0) = 3", check: "Read up from x to the curve ✓", tip: "Notation with a graph." },
    { stage: 2, ctx: "Machine <b>f(x) = 2x + 5</b>. Feed it a + 1.", steps: [["in", "f(a + 1) = []a + []", [2, 7]]], answer: "f(a + 1) = 2a + 7", check: "2(a + 1) + 5 = 2a + 7 ✓", tip: "The input can be an expression." },
    { stage: 3, ctx: "<b>C(n) = 8n + 5</b> is the cost in dollars of n concert tickets (with a $5 fee).", steps: [["in", "C(10) = []", [85]], ["ch", "C(10) = 85 means…", [["10 tickets cost $85", ""], ["85 tickets cost $10", "The input is tickets; the output is cost."], ["Each ticket costs $85", "It's the total for 10 tickets."]]]], answer: "10 tickets cost $85", check: "80 + 5 = 85 ✓", tip: "Notation in context." },
    { stage: 3, ctx: "h(t) is the height in feet of a ball t seconds after it's thrown. You read: <b>h(2) = 30</b>.", steps: [["ch", "This means…", [["After 2 seconds, the ball is 30 feet high", ""], ["After 30 seconds, the ball is 2 feet high", "The input is time, inside the parentheses."], ["h times 2 equals 30", "h(2) is notation, not multiplication."]]]], answer: "At t = 2 s, height = 30 ft", check: "Input = time; output = height ✓", tip: "Read the statement." },
    { stage: 3, ctx: "A pizza cools: <b>T(m) = 200 − 5m</b> °F after m minutes.", steps: [["in", "Solve T(m) = 70: m = []", [26]], ["ch", "So…", [["After 26 minutes, the pizza is 70 °F", ""], ["After 70 minutes, it is 26 °F", "Here 70 is the output."]]]], answer: "m = 26", check: "200 − 130 = 70 ✓", tip: "Solve, then interpret." },
    { stage: 3, ctx: "A town's population is <b>P(t) = 1000 + 50t</b>, t years from now.", steps: [["in", "P(5) = [] · P(10) = []", [1250, 1500]], ["ch", "P(10) − P(5) = 250 means…", [["The town grows by 250 people from year 5 to year 10", ""], ["The town has 250 people", "It's a difference between two outputs."]]]], answer: "250 more people in those 5 years", check: "1500 − 1250 = 250 ✓", tip: "Last one: compare two outputs." },
  ];
  Timeline.stepGame({
    slug: "f-if-a-2", title: "Assembly Line", firstMove: "Replace every x in the rule with the input, then calculate.",
    subtitle: "Use function notation, evaluate functions, and interpret them in context",
    stages: { 1: "Stage 1 · Run the machines", 2: "Stage 2 · Tables, graphs, expressions", 3: "Stage 3 · What does f(3) mean?" }, levels: LEVELS,
    help: { intro: "<b>f(x)</b> means the output of machine f when you feed it x. f(4) means: replace x with 4.",
      steps: ["Evaluate f at numbers and expressions.", "Read f(x) from tables and graphs.", "Solve f(x) = c by running the machine backward.", "Say what a statement like h(2) = 30 means in context."], note: "f(2) is not f times 2." },
    hint: "Replace x with the input.",
    guide: {
      summary: "A 12-level game for function notation: evaluating functions at numbers and expressions, chaining machines, reading notation from tables and graphs, solving f(x) = c, and interpreting statements like h(2) = 30 in context.",
      also: "<span class='code'>AI.F-IF.A.1</span> functions; <span class='code'>AI.A-REI.B.3</span> solving equations.",
      practices: "MP2 Reason abstractly and quantitatively · MP6 Attend to precision",
      goals: ["Evaluate functions for inputs in their domains, including expressions.", "Use function notation with tables and graphs.", "Interpret statements that use function notation in context."],
      howItWorks: "Each level gives a function as a rule, table or graph. Students type outputs or inputs and choose interpretations; distractors swap input and output or read f(2) as multiplication.",
      stageNotes: { 1: { sees: "Rules with positive and negative inputs; an assembly line.", builds: "Evaluating; composition." }, 2: { sees: "Solving f(x) = c, tables, graphs, f(a + 1).", builds: "Notation across representations." }, 3: { sees: "Tickets, a ball, pizza, population.", builds: "Interpreting notation in context." } },
      discussion: ["What's the difference between f(x) = 13 and f(13)?", "Why is h(2) not h times 2?", "What does P(10) − P(5) tell you?"],
      misconceptions: [["(−3)² = −9", "Level 2."], ["Swapping input and output", "Levels 9 to 11."], ["f(a + 1) = f(a) + 1", "Level 8."]],
      exitTicket: { items: ["f(x) = 5 − x². Find f(−2).", "If f(x) = 3x + 1, solve f(x) = 22.", "d(t) is the distance in miles after t hours. Interpret d(3) = 150."],
        answers: ["1", "x = 7", "After 3 hours, you've gone 150 miles."] },
    },
  });
})();
