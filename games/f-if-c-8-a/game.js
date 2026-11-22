/* Pick the Form · AI.F-IF.C.8.a */
(function () {
  const Alg = window.Alg, M = Alg.MINUS;
  const FORMS = { s: "Standard form", f: "Factored form", v: "Vertex form" };
  const WHY = {
    s: "Standard form shows the y-intercept (the constant) right away.",
    f: "Factored form shows the zeros: set each factor equal to 0.",
    v: "Vertex form shows the maximum or minimum and the line of symmetry.",
  };
  // q: [question, form key, answer template, answers, unordered?]
  const LEVELS = [
    { stage: 1, ctx: "A rocket's height: h(t)", forms: { s: "−5t² + 20t + 25", f: "−5(t − 5)(t + 1)", v: "−5(t − 2)² + 45" },
      qs: [["What's the rocket's maximum height?", "v", "Maximum height: [] m", [45]], ["When does it hit the ground?", "f", "t = [] s", [5]]], tip: "Three forms, one function. Pick the form that answers each question fastest." },
    { stage: 1, ctx: "Daily profit at price x: P(x)", forms: { s: "−x² + 14x − 40", f: "−(x − 4)(x − 10)", v: "−(x − 7)² + 9" },
      qs: [["Which prices give zero profit?", "f", "x = [] or x = []", [4, 10], true], ["What's the best price, and the profit there?", "v", "Price $[], profit []", [7, 9]]], tip: "Zero profit and best profit: different forms." },
    { stage: 1, ctx: "y = f(x)", forms: { s: "x² − 6x + 8", f: "(x − 2)(x − 4)", v: "(x − 3)² − 1" },
      qs: [["Where does the graph cross the y-axis?", "s", "y = []", [8]], ["What's the line of symmetry?", "v", "x = []", [3]]], tip: "The y-intercept and the axis of symmetry." },
    { stage: 1, ctx: "Area of a pen with width w: A(w)", forms: { s: "−2w² + 40w", f: "−2w(w − 20)", v: "−2(w − 10)² + 200" },
      qs: [["What's the largest area?", "v", "A = []", [200]], ["Which widths give zero area?", "f", "w = [] or w = []", [0, 20], true]], tip: "A fencing problem." },
    { stage: 2, ctx: "y = x² − 2x − 15", make: ["Factor it: (x + [])(x + [])", [-5, 3], true], qs: [["So the zeros are", null, "x = [] or x = []", [5, -3], true]], tip: "Only standard form is given. Make the form you need." },
    { stage: 2, ctx: "y = x² + 8x + 12", make: ["Complete the square: (x + [])² + []", [4, -4]], qs: [["So the minimum is", null, "y = [] at x = []", [-4, -4]]], tip: "Completing the square reveals the minimum." },
    { stage: 2, ctx: "A ball's height: h(t) = −16t² + 64t", make: ["Factor: −16t(t + [])", [-4]], qs: [["When does it land?", null, "t = []", [4]], ["Halfway between the zeros is the top. Max height h(2) = []", null, "[]", [64]]], tip: "Factor, then use symmetry." },
    { stage: 2, ctx: "y = 2x² − 8x + 3", make: ["Vertex form: 2(x + [])² + []", [-2, -5]], qs: [["So the minimum is", null, "y = []", [-5]]], tip: "Factor the 2 out of the x terms first." },
    { stage: 3, ctx: "A ball's height: h(t) = −5(t − 1)(t − 7)", qs: [["When is it on the ground?", null, "t = [] and t = []", [1, 7], true], ["The highest point is halfway between: t = []", null, "[]", [4]], ["Max height h(4) = []", null, "[]", [45]]],
      tip: "Use symmetry instead of expanding." },
    { stage: 3, ctx: "Revenue at price p: R(p) = −10(p − 15)² + 2250", qs: [["The best price is $[] for revenue $[]", null, "[] []", [15, 2250]]],
      extra: { c: "Do p = $10 and p = $20 give the same revenue?", o: [["Yes: they're the same distance from 15", ""], ["No: $20 is a higher price", "Vertex form is symmetric about p = 15: (10 − 15)² = (20 − 15)²."]] }, tip: "Symmetry in context." },
    { stage: 3, ctx: "A rocket's height, in any form you like.", match: [["When is the height 0?", "f"], ["When is it highest?", "v"], ["What height did it start at (t = 0)?", "s"]], tip: "Match each question to the best form." },
    { stage: 3, ctx: "An arch: y = −0.5(x − 4)² + 8 (meters)", qs: [["The arch is [] m tall", null, "[]", [8]], ["It touches the ground at x = [] and x = []", null, "[] []", [0, 8], true], ["So it's [] m wide at the base", null, "[]", [8]]],
      tip: "Last one: tall and wide." },
  ];

  GameShell.register({
    slug: "f-if-c-8-a",
    title: "Pick the Form",
    firstMove: "The rocket question asks how high it gets. Choose the form that shows the peak, then enter the height in meters.",
    subtitle: "Use factoring and completing the square to reveal key features of quadratics",
    stages: { 1: "Stage 1 · Pick the best form", 2: "Stage 2 · Make the form you need", 3: "Stage 3 · Interpret in context" },
    levels: LEVELS,
    help: {
      intro: "A quadratic can be written three ways. Each form shows something at a glance.",
      steps: [
        "<b>Standard</b> ax² + bx + c shows the y-intercept c.",
        "<b>Factored</b> a(x − p)(x − q) shows the zeros p and q.",
        "<b>Vertex</b> a(x − h)² + k shows the maximum or minimum k at x = h, and the line of symmetry x = h.",
        "Pick the form, then answer. Fewer wrong picks means more stars.",
      ],
      note: "In stage 2 you'll make the form yourself by factoring or completing the square.",
    },
    load(lv, api) {
      api.stage.appendChild(api.h("div", { class: "stage-text", style: { fontSize: "22px" } }, lv.ctx));
      if (lv.forms) {
        const grid = api.h("div", { class: "choices", style: { padding: "0 10px 10px" } });
        Object.keys(FORMS).forEach((k) => grid.appendChild(api.h("div", { class: "choice", style: { cursor: "default" } }, api.h("div", { class: "preview" }, FORMS[k]), api.h("div", { style: { fontSize: "22px" } }, lv.forms[k]))));
        api.stage.appendChild(grid);
      }
      const steps = [];
      if (lv.make) steps.push({ type: "input", prompt: lv.make[0], answers: lv.make[1], unordered: !!lv.make[2], hint: "Multiply your answer back out to check it." });
      (lv.qs || []).forEach((q) => {
        if (q[1]) steps.push({ type: "choice", prompt: q[0] + " Which form shows it fastest?", options: Object.keys(FORMS).map((k) => ({ label: FORMS[k] + ": " + lv.forms[k], ok: k === q[1], why: WHY[k] })), done: q[0] + " → " + FORMS[q[1]] });
        steps.push({ type: "input", prompt: q[1] ? q[2] : (q[0].includes("[]") ? q[0] : q[0] + ": " + q[2]), answers: q[3], unordered: !!q[4], hint: q[1] ? WHY[q[1]] : "Use the form you have, and symmetry." });
      });
      if (lv.extra) steps.push({ type: "choice", prompt: lv.extra.c, options: lv.extra.o.map((o, k) => ({ label: o[0], ok: k === 0, why: o[1] })) });
      if (lv.match) lv.match.forEach((m) => steps.push({ type: "choice", prompt: m[0], options: Object.keys(FORMS).map((k) => ({ label: FORMS[k], ok: k === m[1], why: WHY[k] })), done: m[0] + " → " + FORMS[m[1]] }));
      Steps.run(api, { steps, logTitle: "Your work", result: () => ({ answer: "Right form, right answer", check: "Factored → zeros · Vertex → max/min and symmetry · Standard → y-intercept ✓" }) });
    },
    guide: {
      summary: "A 12-level game about the forms of a quadratic. Students choose which form (standard, factored, vertex) answers a question fastest, produce factored and vertex forms themselves, and interpret zeros, maximums and symmetry in context.",
      also: "<span class='code'>AI.A-SSE.B.3.a</span> and <span class='code'>AI.A-SSE.B.3.b</span>.",
      practices: "MP7 Look for and make use of structure · MP4 Model with mathematics",
      evidence: "Ask for the rocket’s peak height and landing time. Have the student choose a form for each question and explain what its numbers tell them.",
      goals: [
        "Use factoring to show the zeros of a quadratic function and interpret them in context.",
        "Use completing the square to show the maximum or minimum and the line of symmetry.",
        "Choose the most useful form for a question.",
      ],
      howItWorks: "Stage 1 shows all three forms of a quadratic in context and asks students to choose the form that answers each question, then answer it. Stage 2 gives only standard form; students factor or complete the square first. Stage 3 interprets factored and vertex forms using symmetry, and asks students to match questions to forms.",
      stageNotes: {
        1: { sees: "Rocket, profit, a plain function and a fenced pen in three forms.", builds: "Which form shows which feature." },
        2: { sees: "Standard form only.", builds: "Producing factored and vertex forms." },
        3: { sees: "Factored and vertex forms in context.", builds: "Symmetry: the vertex is halfway between the zeros." },
      },
      discussion: [
        "Why does the vertex lie halfway between the zeros?",
        "In the revenue level, what does the symmetry mean for setting prices?",
        "If you only need the y-intercept, which form is fastest? Why?",
      ],
      misconceptions: [
        ["Reading zeros from vertex form", "Wrong form picks are explained."],
        ["Sign errors reading (x − 5)", "Answers are checked numerically."],
        ["Forgetting the leading coefficient when completing the square", "Level 8."],
      ],
      exitTicket: {
        items: ["For y = (x + 1)(x − 7), find the zeros and the line of symmetry.", "Write y = x² − 10x + 21 in vertex form and give its minimum.", "Which form would you use to find when a thrown ball lands? Why?"],
        answers: ["Zeros −1 and 7; symmetry x = 3.", "(x − 5)² − 4; minimum −4 at x = 5.", "Factored form: its zeros are the times when the height is 0."],
      },
    },
    answerKey(lv) {
      const fill = (tpl, ans) => { let k = 0; return tpl.replace(/\[\]/g, () => Alg.num(ans[k++])); };
      const parts = [];
      if (lv.make) parts.push(fill(lv.make[0], lv.make[1]));
      (lv.qs || []).forEach((q) => parts.push((q[1] ? FORMS[q[1]] + ": " : "") + fill(q[1] ? q[2] : q[0].includes("[]") ? q[0] : q[2], q[3])));
      if (lv.extra) parts.push(lv.extra.o[0][0]);
      if (lv.match) lv.match.forEach((m) => parts.push(m[0] + " " + FORMS[m[1]]));
      return { prompt: lv.ctx + (lv.forms ? " = " + lv.forms.s : ""), solution: parts.join("; "), answer: parts[parts.length - 1] };
    },
  });
})();
