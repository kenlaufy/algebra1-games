/* Energy Strategy · AI.A-REI.B.4.b */
(function () {
  const A = window.Cartoon, M = "−";
  const METHODS = {
    I: { name: "Inspection", cost: 1 },
    R: { name: "Square roots", cost: 2 },
    F: { name: "Factoring", cost: 3 },
    C: { name: "Complete the square", cost: 4 },
    Q: { name: "Quadratic formula", cost: 5 },
  };
  const WHY = {
    I: "Inspection only works when you can just see the answer, like x² = 49.",
    R: "Square roots need the equation to look like (something)² = number. This one has an x term in the way.",
    F: "This one doesn't factor with whole numbers. Try another method.",
  };
  const TWO = "x = [] or x = []", RAD = "x = [] ± √[]", CPX = "x = [] ± []i", QF = "x = ([] ± √[]) / []";
  // work: what each valid method looks like for this equation; cBig = completing the square is extra costly (a ≠ 1 or odd b)
  const LEVELS = [
    { stage: 1, eq: "x² = 49", work: { I: "7² = 49 and (−7)² = 49", R: "x = ±√49", F: "x² − 49 = (x − 7)(x + 7) = 0", C: "(x + 0)² = 49, so x = ±7", Q: "a = 1, b = 0, c = −49: x = ±√196 / 2" },
      ans: [TWO, [7, -7], true], answer: "x = 7 or x = −7", tip: "Pick the cheapest method that works. Every method has an energy cost." },
    { stage: 1, eq: "x² " + M + " 16 = 0", work: { R: "x² = 16, so x = ±√16", F: "(x − 4)(x + 4) = 0", C: "x² = 16", Q: "b² − 4ac = 64" },
      ans: [TWO, [4, -4], true], answer: "x = 4 or x = −4", tip: "No x term. What's cheapest?" },
    { stage: 1, eq: "(x " + M + " 3)² = 25", work: { R: "x − 3 = ±5", F: "x² − 6x − 16 = (x − 8)(x + 2) = 0", C: "It's already (x − 3)² = 25", Q: "x² − 6x − 16 = 0, b² − 4ac = 100" },
      ans: [TWO, [8, -2], true], answer: "x = 8 or x = −2", tip: "This one's already in a special shape." },
    { stage: 1, eq: "x² + 5x + 6 = 0", cBig: true, work: { F: "(x + 2)(x + 3) = 0", C: "(x + 2.5)² = 0.25", Q: "b² − 4ac = 1, x = (−5 ± 1)/2" },
      ans: [TWO, [-2, -3], true], answer: "x = −2 or x = −3", tip: "Now there's an x term." },
    { stage: 2, eq: "x² " + M + " 2x " + M + " 15 = 0", work: { F: "(x − 5)(x + 3) = 0", C: "(x − 1)² = 16", Q: "b² − 4ac = 64, x = (2 ± 8)/2" },
      ans: [TWO, [5, -3], true], answer: "x = 5 or x = −3", tip: "Does it factor?" },
    { stage: 2, eq: "x² + 6x + 2 = 0", work: { C: "x² + 6x + 9 = 7, so (x + 3)² = 7", Q: "b² − 4ac = 28, x = (−6 ± √28)/2" },
      ans: [RAD, [-3, 7]], answer: "x = −3 ± √7", tip: "Try factoring in your head first. If it fails, what's next cheapest?" },
    { stage: 2, eq: "2x² + 3x " + M + " 2 = 0", cBig: true, work: { F: "(2x − 1)(x + 2) = 0", C: "x² + 1.5x = 1 … (x + 0.75)² = 1.5625", Q: "b² − 4ac = 25, x = (−3 ± 5)/4" },
      ans: [TWO, [0.5, -2], true], answer: "x = 1/2 or x = −2", tip: "The leading coefficient is 2. Completing the square costs extra when a ≠ 1." },
    { stage: 2, eq: "3x² + 5x + 1 = 0", cBig: true, work: { C: "x² + (5/3)x = −1/3 …", Q: "a = 3, b = 5, c = 1: b² − 4ac = 25 − 12 = 13" },
      ans: [QF, [-5, 13, 6]], answer: "x = (−5 ± √13)/6", tip: "Ugly numbers. Which method doesn't care?" },
    { stage: 3, eq: "x² + 9 = 0", work: { R: "x² = −9, so x = ±√(−9) = ±3i", C: "x² = −9", Q: "b² − 4ac = −36" },
      ans: [CPX, [0, 3]], answer: "x = ±3i", tip: "No real solutions. Write the answers as a ± bi, where i = √(−1)." },
    { stage: 3, eq: "x² + 2x + 5 = 0", work: { C: "x² + 2x + 1 = −4, so (x + 1)² = −4 and x + 1 = ±2i", Q: "b² − 4ac = −16, x = (−2 ± 4i)/2" },
      ans: [CPX, [-1, 2]], answer: "x = −1 ± 2i", tip: "Is the discriminant negative?" },
    { stage: 3, eq: "x² " + M + " 4x + 13 = 0", work: { C: "(x − 2)² = −9, so x − 2 = ±3i", Q: "b² − 4ac = −36, x = (4 ± 6i)/2" },
      ans: [CPX, [2, 3]], answer: "x = 2 ± 3i", tip: "Same idea, different numbers." },
    { stage: 3, eq: "2x² " + M + " 2x + 1 = 0", cBig: true, work: { C: "x² − x = −1/2 …", Q: "b² − 4ac = 4 − 8 = −4, x = (2 ± 2i)/4" },
      ans: [CPX, [0.5, 0.5]], answer: "x = 1/2 ± (1/2)i", tip: "Last one. Choose wisely." },
  ];
  const cost = (lv, k) => (k === "C" && lv.cBig ? 6 : METHODS[k].cost);
  const cheapest = (lv) => Object.keys(lv.work).sort((a, b) => cost(lv, a) - cost(lv, b))[0];

  function battery(left, total, mood) {
    let s = A.backdrop(900, 160, { ground: 140, clouds: false });
    s += '<rect x="250" y="40" width="380" height="80" rx="14" fill="#fffdf7" ' + A.OUT + '/><rect x="630" y="62" width="16" height="36" rx="4" fill="#23262d"/>';
    for (let i = 0; i < total; i++) {
      s += '<rect x="' + (262 + i * 60) + '" y="52" width="52" height="56" rx="6" fill="' + (i < left ? "#3f7d4c" : "#ebe3d0") + '" stroke="#23262d" stroke-width="2"/>';
    }
    s += A.text(440, 150, "Energy: " + left + " of " + total, { size: 18, var: false });
    s += A.mascot(790, 140, mood, 0.8);
    return s;
  }

  GameShell.register({
    slug: "a-rei-b-4-b",
    title: "Energy Strategy",
    subtitle: "Choose the best method to solve each quadratic equation",
    stages: { 1: "Stage 1 · Special shapes", 2: "Stage 2 · Factor or not?", 3: "Stage 3 · Complex solutions" },
    levels: LEVELS,
    help: {
      intro: "Every method works on some equations, but they cost different amounts of energy. Pick the <b>cheapest method that works</b>, then solve.",
      steps: [
        "Costs: inspection 1, square roots 2, factoring 3, completing the square 4 (6 if a ≠ 1 or b is odd), quadratic formula 5.",
        "Choose a method. If it can't work on this equation, you'll find out why.",
        "Use the work shown to finish solving.",
        "3 stars: cheapest method and a correct answer first try.",
      ],
      note: "When there are no real solutions, write them as a ± bi, where i = √(−1).",
    },
    load(lv, api) {
      const svg = api.svg("0 0 900 160", "Energy battery");
      const view = api.h("div", { class: "stage-text" }, lv.eq);
      const workLine = api.h("div", { class: "preview", style: { textAlign: "center", fontSize: "20px", padding: "4px 0 10px" } });
      api.stage.append(view, svg, workLine);
      let left = 6, chosen = null;
      svg.innerHTML = battery(left, 6, "think");
      const methodOpts = Object.keys(METHODS).map((k) => ({
        label: METHODS[k].name + " · " + cost(lv, k) + " energy", ok: !!lv.work[k],
        why: WHY[k] || "That method can't be used here.", key: k }));
      const steps = [
        { type: "choice", prompt: "Which method?", options: methodOpts,
          onDone: () => {
            // which one did they pick? the one marked right
            const picked = [...api.controls.querySelectorAll(".choice.right")].pop();
            chosen = methodOpts.find((o) => picked && picked.innerHTML === o.label).key;
            left = 6 - cost(lv, chosen);
            svg.innerHTML = battery(Math.max(0, left), 6, chosen === cheapest(lv) ? "joy" : "ok");
            workLine.innerHTML = METHODS[chosen].name + ": " + lv.work[chosen];
          }, done: "" },
        { type: "input", prompt: lv.ans[0], answers: lv.ans[1], unordered: !!lv.ans[2],
          hint: lv.ans[0] === CPX ? "Write the answer as a ± bi: the real part, then the number in front of i." : "Finish solving with the work shown. Fractions like 1/2 are fine.",
          done: lv.answer },
      ];
      // make the autoplay pick the cheapest valid method
      methodOpts.forEach((o) => { if (o.ok && o.key !== cheapest(lv)) o.ok = "alt"; });
      steps[0].options = methodOpts.map((o) => ({ label: o.label, ok: !!o.ok, why: o.why, _cheap: o.key === cheapest(lv) }));
      const run = Steps.run(api, { steps, logTitle: "Your work", result: () => {
        const best = chosen === cheapest(lv);
        const stars = Math.max(1, 3 - (best ? 0 : 1) - Math.min(2, run.mistakes));
        return { answer: lv.answer, stars, note: (best ? "Cheapest method: " : "It worked, but " + METHODS[cheapest(lv)].name.toLowerCase() + " was cheaper. ") + METHODS[chosen].name + " used " + cost(lv, chosen) + " energy.",
          lines: [lv.eq + ": " + METHODS[chosen].name + " (" + cost(lv, chosen) + " energy)", lv.work[chosen], lv.answer],
          check: "Cheapest method for this one: " + METHODS[cheapest(lv)].name + " (" + cost(lv, cheapest(lv)) + " energy)" };
      } });
      // autoplay: choose the cheapest option rather than the first valid one
      const auto = api.autoplay;
      api.autoplay = () => {
        const b = [...api.controls.querySelectorAll(".choice")].find((x) => x.innerHTML === METHODS[cheapest(lv)].name + " · " + cost(lv, cheapest(lv)) + " energy");
        b.click();
        return auto();
      };
    },
    guide: {
      summary: "A 12-level game about choosing a method for quadratic equations. Each method costs energy; students pick the cheapest one that fits the equation's form, then solve, including complex solutions written as a ± bi.",
      also: "<span class='code'>AI.A-REI.B.4.a</span> completing the square and the quadratic formula.",
      practices: "MP5 Use appropriate tools strategically · MP7 Look for and make use of structure",
      goals: [
        "Solve quadratic equations by inspection, square roots, factoring, completing the square and the quadratic formula.",
        "Choose a method that fits the initial form of the equation.",
        "Recognize when solutions are non-real and write them as a ± bi.",
      ],
      howItWorks: "Each level shows one equation. Students choose a method; methods that can't work (for example square roots when there's an x term) are rejected with a reason. The game shows the first line of work for the chosen method, and students finish solving. Stars reward choosing the cheapest valid method and answering correctly.",
      stageNotes: {
        1: { sees: "x² = 49, x² − 16 = 0, (x − 3)² = 25, a factorable trinomial.", builds: "Recognizing special forms." },
        2: { sees: "Factorable and non-factorable trinomials; a ≠ 1.", builds: "Deciding when to factor, complete the square, or use the formula." },
        3: { sees: "Equations with negative discriminants.", builds: "Writing complex solutions a ± bi." },
      },
      discussion: [
        "Why is the quadratic formula never the cheapest when an equation factors nicely?",
        "How can you tell quickly whether a trinomial factors over the integers? (Hint: the discriminant.)",
        "What does a negative discriminant say about the graph of y = ax² + bx + c?",
      ],
      misconceptions: [
        ["Using square roots when there's an x term", "The method is rejected with an explanation."],
        ["x² = −9 has no solutions at all", "Stage 3 introduces i and writes ±3i."],
        ["Always reaching for the formula", "Stars and the energy meter reward the cheapest valid method."],
      ],
      exitTicket: {
        items: ["Which method is quickest for (x + 1)² = 36? Solve it.", "Solve by factoring: x² − x − 12 = 0", "Solve: x² + 4x + 8 = 0"],
        answers: ["Square roots: x + 1 = ±6, so x = 5 or x = −7.", "(x − 4)(x + 3) = 0: x = 4 or x = −3.", "(x + 2)² = −4, so x = −2 ± 2i."],
      },
    },
    answerKey(lv) {
      const k = cheapest(lv);
      return { prompt: lv.eq, solution: METHODS[k].name + " (" + cost(lv, k) + " energy): " + lv.work[k], answer: lv.answer };
    },
  });
})();
