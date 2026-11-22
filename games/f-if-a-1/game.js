/* Machine Inspector · AI.F-IF.A.1 */
(function () {
  // mapping diagram: inputs in a left bubble, outputs in a right bubble, one arrow per pair
  function map(pairs, bad) {
    const ins = [...new Set(pairs.map((p) => p[0]))], outs = [...new Set(pairs.map((p) => p[1]))].sort((a, b) => a - b);
    const y = (i, n) => 150 + (i - (n - 1) / 2) * 56;
    let s = '<defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#3a3a3a"/></marker></defs>';
    s += '<ellipse cx="250" cy="150" rx="95" ry="130" fill="#fff8e6" stroke="#3a3a3a" stroke-width="3"/><ellipse cx="650" cy="150" rx="95" ry="130" fill="#eef4ff" stroke="#3a3a3a" stroke-width="3"/>';
    s += '<text x="250" y="292" text-anchor="middle" font-size="20" font-weight="800">inputs</text><text x="650" y="292" text-anchor="middle" font-size="20" font-weight="800">outputs</text>';
    pairs.forEach(([a, b]) => {
      const y1 = y(ins.indexOf(a), ins.length), y2 = y(outs.indexOf(b), outs.length);
      s += '<line x1="285" y1="' + y1 + '" x2="612" y2="' + y2 + '" stroke="' + (bad && bad.includes(a) ? "#c8553d" : "#3a3a3a") + '" stroke-width="3" marker-end="url(#arr)"/>';
    });
    ins.forEach((a, i) => (s += '<text x="250" y="' + (y(i, ins.length) + 8) + '" text-anchor="middle" font-size="26" font-weight="800">' + a + "</text>"));
    outs.forEach((b, i) => (s += '<text x="650" y="' + (y(i, outs.length) + 8) + '" text-anchor="middle" font-size="26" font-weight="800">' + b + "</text>"));
    return { vb: "0 0 900 300", label: "Mapping diagram", html: s };
  }
  const YES = (why) => [["Yes, it's a function", ""], ["No", why]];
  const NO = (why) => [["No, it's not a function", ""], ["Yes", why]];
  const LEVELS = [
    { stage: 1, ctx: "Inspect this machine. Each arrow sends an input to an output.", pic: map([[1, 4], [2, 5], [3, 6]]), steps: [["ch", "Is it a function?", YES("Every input has exactly one output.")]], answer: "Function", check: "One output per input ✓", tip: "A function gives each input exactly one output." },
    { stage: 1, ctx: "Inspect this machine.", pic: map([[1, 4], [1, 7], [2, 5]]), steps: [["ch", "Is it a function?", NO("Input 1 gives two outputs, 4 and 7.")], ["in", "The broken input is []", [1]]], answer: "Not a function: 1 → 4 and 1 → 7", check: "An input with two outputs breaks the rule ✓", tip: "Find the broken machine." },
    { stage: 1, ctx: "Inspect this machine.", pic: map([[1, 5], [2, 5], [3, 5]]), steps: [["ch", "Is it a function?", YES("Different inputs may share an output; each input still has only one.")]], answer: "Function (outputs can repeat)", check: "Repeated outputs are fine ✓", tip: "A tricky one." },
    { stage: 1, ctx: "Ordered pairs: (2, 3), (4, 5), (2, 6), (7, 3).", steps: [["ch", "Is this relation a function?", NO("Input 2 appears with two outputs, 3 and 6.")], ["in", "The input with two outputs: []", [2]]], answer: "Not a function", check: "(2, 3) and (2, 6) ✓", tip: "Look for repeated inputs." },
    { stage: 2, ctx: "The graph of y = x².", chart: { r: [-4, 4, -1, 10, 1, 1, 1, 2], series: [{ f: (x) => x * x, always: true }] }, steps: [["ch", "Vertical line test: is it a function?", YES("Every vertical line hits the curve at most once.")]], answer: "Function", check: "Passes the vertical line test ✓", tip: "Imagine sliding a vertical line across." },
    { stage: 2, ctx: "The graph of a circle, x² + y² = 16.", chart: { r: [-5, 5, -5, 5, 1, 1], series: [{ f: (x) => Math.sqrt(Math.max(0, 16 - x * x)), from: -4, to: 4, always: true }, { f: (x) => -Math.sqrt(Math.max(0, 16 - x * x)), from: -4, to: 4, always: true }] }, steps: [["ch", "Is y a function of x?", NO("The line x = 0 hits the circle twice, at y = 4 and y = −4.")], ["in", "When x = 0, y = 4 or y = []", [-4]]], answer: "Not a function", check: "One input, two outputs ✓", tip: "Does any vertical line hit twice?" },
    { stage: 2, ctx: "The points (3, −2), (3, 0), (3, 1), (3, 4) all lie on a vertical line.", chart: { r: [-1, 6, -3, 5, 1, 1], series: [{ pts: [[3, -2], [3, 0], [3, 1], [3, 4]], always: true }] }, steps: [["ch", "Is it a function?", NO("Input 3 has four outputs.")]], answer: "Not a function", check: "A vertical line fails the test ✓", tip: "The worst machine." },
    { stage: 2, ctx: "The graph of f(x) = |x|.", chart: { r: [-5, 5, -1, 6, 1, 1], series: [{ f: (x) => Math.abs(x), always: true }] }, steps: [["ch", "Is it a function?", YES("Each x has one y, even though y = 2 comes from x = 2 and x = −2.")], ["in", "f(−2) = []", [2]]], answer: "Function; f(−2) = 2", check: "|−2| = 2 ✓", tip: "Read an output from the graph." },
    { stage: 3, ctx: "f = {(−1, 3), (0, 1), (2, 5)}.", steps: [["in", "Domain (inputs): [], [], []", [-1, 0, 2], { unordered: true }], ["in", "Range (outputs): [], [], []", [3, 1, 5], { unordered: true }], ["in", "f(0) = []", [1]]], answer: "Domain {−1, 0, 2}; range {1, 3, 5}", check: "f(0) is the output for input 0 ✓", tip: "Domain, range and notation." },
    { stage: 3, ctx: "A class list matches each student to their height. Two students are both 160 cm tall.", steps: [["ch", "Student → height: is it a function?", YES("Each student has one height.")], ["ch", "Height → student: is it a function?", NO("160 cm goes to two students.")]], answer: "Student → height yes; height → student no", check: "Direction matters ✓", tip: "Which way does the machine run?" },
    { stage: 3, ctx: "f(x) = 2x − 1.", chart: { r: [-1, 6, -2, 10, 1, 1, 1, 2], series: [{ f: (x) => 2 * x - 1 }], marks: [[4, 7, "(4, f(4))"]], reveal: "end" }, steps: [["in", "The point (4, f(4)) is on the graph. f(4) = []", [7]], ["ch", "The graph of f is the graph of…", [["y = 2x − 1", ""], ["x = 2y − 1", "The input is x; the output is y = f(x)."]]]], answer: "f(4) = 7", check: "2(4) − 1 = 7 ✓", tip: "Notation and graphs." },
    { stage: 3, ctx: "Two machines: one sends each person to their birthday; the other sends each birthday to a person.", steps: [["ch", "Person → birthday:", YES("Everyone has exactly one birthday.")], ["ch", "Birthday → person:", NO("Many people share a birthday.")]], answer: "Only person → birthday is a function", check: "Exactly one output per input ✓", tip: "Last inspection." },
  ];
  Timeline.stepGame({
    slug: "f-if-a-1", title: "Machine Inspector", firstMove: "Check every input: if any input has two different outputs, the machine is broken.",
    subtitle: "Understand functions, domain, range and f(x)",
    stages: { 1: "Stage 1 · Inspect machines", 2: "Stage 2 · Graphs", 3: "Stage 3 · Domain, range and notation" }, levels: LEVELS,
    help: { intro: "A <b>function</b> assigns each input exactly one output. The inputs form the <b>domain</b>; the outputs form the <b>range</b>.",
      steps: ["Look for an input with two different outputs.", "On graphs, use the vertical line test.", "Read f(x) as the output for input x.", "Fewer wrong answers means more stars."], note: "Different inputs can share an output." },
    hint: "Each input gets exactly one output.",
    guide: {
      summary: "A 12-level game about the definition of a function. Students inspect mapping diagrams, ordered pairs, graphs and real situations to find inputs with more than one output, then use domain, range and f(x) notation.",
      also: "<span class='code'>AI.F-IF.A.2</span> function notation.",
      practices: "MP6 Attend to precision · MP7 Look for and make use of structure",
      goals: ["Decide whether a relation is a function from diagrams, pairs, graphs and contexts.", "Identify domain and range.", "Interpret f(x) as the output for input x, and the graph of f as y = f(x)."],
      howItWorks: "Each level shows a relation (a mapping diagram, list, graph or description). Students decide whether it is a function and identify the problem input; later levels ask for domain, range and f(x).",
      stageNotes: { 1: { sees: "Mapping diagrams and ordered pairs.", builds: "The one-output rule; repeated outputs are fine." }, 2: { sees: "Parabola, circle, vertical line, |x|.", builds: "The vertical line test." }, 3: { sees: "Sets, class lists, graphs, birthdays.", builds: "Domain, range, notation, direction." } },
      discussion: ["Why is a machine that sends 1, 2 and 3 all to 5 still a function?", "Why does the vertical line test work?", "Why is student → height a function but height → student not?"],
      misconceptions: [["Repeated outputs break a function", "Level 3."], ["Every graph is a function", "Levels 6 and 7."], ["Direction doesn't matter", "Levels 10 and 12."]],
      exitTicket: { items: ["Is {(1, 2), (2, 2), (3, 4)} a function? Why?", "Name a graph that fails the vertical line test.", "If f(5) = 9, what point is on the graph of f?"],
        answers: ["Yes: each input has one output.", "A circle (or a vertical line, or a sideways parabola).", "(5, 9)."] },
    },
  });
})();
