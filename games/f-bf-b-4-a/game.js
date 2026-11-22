/* Reverse Machine · AI.F-BF.B.4.a */
(function () {
  const LEVELS = [
    { stage: 1, ctx: "Machine <b>f(x) = x + 5</b> adds 5. Build the machine that undoes it.", steps: [["in", "f⁻¹(x) = x + []", [-5]]], answer: "f⁻¹(x) = x − 5", check: "Subtracting 5 undoes adding 5 ✓", tip: "Do the opposite operation." },
    { stage: 1, ctx: "Machine <b>f(x) = 3x</b> triples its input.", steps: [["in", "f⁻¹(x) = []x  (a fraction like 1/3 is fine)", [1 / 3], { tol: 0.01 }]], answer: "f⁻¹(x) = x/3", check: "Dividing by 3 undoes tripling ✓", tip: "Undo multiplying." },
    { stage: 1, ctx: "Machine <b>f(x) = 2x + 1</b>: multiply by 2, then add 1.", steps: [["in", "f(3) = [] · f⁻¹(7) = []", [7, 3]], ["ch", "To undo f, you…", [["subtract 1 first, then divide by 2", ""], ["divide by 2 first, then subtract 1", "Undo the last step first, like taking off socks after shoes."]]]], answer: "Undo in reverse order", check: "7 − 1 = 6, 6 ÷ 2 = 3 ✓", tip: "Order matters when undoing." },
    { stage: 1, ctx: "Machine <b>f(x) = 2x + 1</b>.", steps: [["in", "f⁻¹(x) = (x − []) / []", [1, 2]]], answer: "f⁻¹(x) = (x − 1)/2", check: "f⁻¹(f(3)) = (7 − 1)/2 = 3 ✓", tip: "Write the reverse machine." },
    { stage: 2, ctx: "Machine <b>f(x) = 4x − 6</b> printed 10.", steps: [["in", "Solve f(x) = 10: x = []", [4]]], answer: "x = 4", check: "4(4) − 6 = 10 ✓", tip: "Solving f(x) = c is running f backward." },
    { stage: 2, ctx: "Machine <b>f(x) = (x + 3)/2</b>. Swap x and y in y = (x + 3)/2 and solve for y.", steps: [["in", "f⁻¹(x) = []x − []", [2, 3]]], answer: "f⁻¹(x) = 2x − 3", check: "x = (y + 3)/2 → 2x = y + 3 → y = 2x − 3 ✓", tip: "The swap-and-solve method." },
    { stage: 2, ctx: "Machine <b>f(x) = 5 − x</b>.", steps: [["in", "f⁻¹(x) = [] − x", [5]], ["ch", "Notice anything?", [["It's its own inverse", ""], ["It has no inverse", "Swap and solve: x = 5 − y gives y = 5 − x."]]]], answer: "f⁻¹(x) = 5 − x", check: "f(f(2)) = f(3) = 2 ✓", tip: "A machine that undoes itself." },
    { stage: 2, ctx: "Machine <b>f(x) = 0.5x + 4</b>.", steps: [["in", "f⁻¹(x) = []x − []", [2, 8]]], answer: "f⁻¹(x) = 2x − 8", check: "x = 0.5y + 4 → y = 2(x − 4) = 2x − 8 ✓", tip: "Undo halving by doubling." },
    { stage: 3, ctx: "The graph of <b>f(x) = 2x + 1</b> (blue) and the line y = x (dashed). The point (1, 3) is on f.", chart: { r: [-2, 8, -2, 8, 1, 1], series: [{ f: (x) => 2 * x + 1, always: true }, { f: (x) => x, color: "#999", dash: "6 5", always: true }, { f: (x) => (x - 1) / 2, color: "#c8553d" }], marks: [[1, 3, "(1, 3)"], [3, 1, "(3, ?)"]], reveal: "end" }, steps: [["in", "The matching point on f⁻¹ is (3, [])", [1]], ["ch", "The graph of f⁻¹ is…", [["the reflection of f over the line y = x", ""], ["the reflection of f over the x-axis", "Inverses swap x and y, which reflects over y = x."]]]], answer: "(3, 1); reflect over y = x", check: "Swapping coordinates ✓", tip: "Inverses on a graph." },
    { stage: 3, ctx: "Converting Celsius to Fahrenheit: <b>F = 1.8C + 32</b>.", steps: [["in", "Undo it: C = (F − []) / []", [32, 1.8]], ["in", "Water boils at 212 °F, which is [] °C", [100]]], answer: "C = (F − 32)/1.8; 100 °C", check: "180 ÷ 1.8 = 100 ✓", tip: "A real reverse machine." },
    { stage: 3, ctx: "A taxi fare is <b>f(m) = 2m + 3</b> dollars for m miles.", steps: [["in", "f⁻¹(15) = []", [6]], ["ch", "f⁻¹(15) = 6 means…", [["A $15 fare is a 6-mile ride", ""], ["A 15-mile ride costs $6", "The inverse takes dollars in and gives miles out."]]]], answer: "$15 buys 6 miles", check: "2(6) + 3 = 15 ✓", tip: "What do inverse inputs and outputs mean?" },
    { stage: 3, ctx: "Machine <b>f(x) = 3x − 3</b>.", chart: { r: [-4, 8, -4, 8, 1, 1], series: [{ f: (x) => 3 * x - 3, always: true }, { f: (x) => x, color: "#999", dash: "6 5", always: true }, { f: (x) => x / 3 + 1, color: "#c8553d" }], reveal: "end" }, steps: [["in", "f⁻¹(x) = []x + []", [1 / 3, 1], { tol: 0.01 }]], answer: "f⁻¹(x) = x/3 + 1", check: "x = 3y − 3 → y = (x + 3)/3 ✓", tip: "Last one: write it, then see it reflected." },
  ];
  Timeline.stepGame({
    slug: "f-bf-b-4-a", title: "Reverse Machine", firstMove: "List what the machine does in order, then undo each step in reverse order.",
    subtitle: "Find inverse functions algebraically and graphically",
    stages: { 1: "Stage 1 · Undo the machine", 2: "Stage 2 · Swap and solve", 3: "Stage 3 · Graphs and context" }, levels: LEVELS,
    help: { intro: "An <b>inverse function</b> f⁻¹ undoes f: if f(3) = 7, then f⁻¹(7) = 3.",
      steps: ["Undo each step of f, last step first.", "Or swap x and y and solve for y.", "On a graph, f⁻¹ is f reflected over the line y = x.", "Fewer wrong answers means more stars."], note: "Fractions like 1/3 are accepted." },
    hint: "Undo the steps in reverse order.",
    guide: {
      summary: "A 12-level game about inverses of linear functions: undoing operations in reverse order, solving f(x) = c, the swap-and-solve method, reflections over y = x, and inverses in context (temperature, taxi fares).",
      also: "<span class='code'>AI.F-IF.A.2</span> notation; <span class='code'>AI.A-REI.B.3</span> solving linear equations.",
      practices: "MP7 Look for and make use of structure · MP8 Look for regularity in repeated reasoning",
      goals: ["Solve f(x) = c for a linear function.", "Write an expression for the inverse of a linear function.", "Recognize the graph of an inverse as a reflection over y = x and interpret inverses in context."],
      howItWorks: "Students fill in parts of inverse formulas and check them with numbers. Graph levels reveal f⁻¹ in red after the answer; context levels ask what the inverse's input and output mean.",
      stageNotes: { 1: { sees: "Add, multiply, two-step machines.", builds: "Undoing in reverse order." }, 2: { sees: "Solving, swap and solve, a self-inverse.", builds: "Algebraic inverses." }, 3: { sees: "Reflections, °F to °C, taxi fares.", builds: "Graphs and meaning." } },
      discussion: ["Why must you undo the last step first?", "Why does swapping x and y reflect a graph over y = x?", "What are the input and output units of a taxi fare's inverse?"],
      misconceptions: [["Undoing in the same order", "Level 3."], ["f⁻¹(x) means 1/f(x)", "Level 4's check."], ["Reflecting over the x-axis", "Level 9."]],
      exitTicket: { items: ["Find the inverse of f(x) = 4x + 8.", "f(2) = 9. What is f⁻¹(9)?", "Describe how the graphs of f and f⁻¹ are related."],
        answers: ["f⁻¹(x) = (x − 8)/4 = x/4 − 2", "2", "They are reflections of each other over y = x."] },
    },
  });
})();
