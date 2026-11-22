/* Find the Bug · AI.A-REI.A.1 */
(function () {
  const M = "−";
  // Each level: start equation, worked lines [line, reason]. bug = index of the wrong line (or -1 = no bug).
  // fix = options for the corrected line (first is right). stage 2 levels: reasons to choose, no bug.
  const REASONS = {
    add: (n) => "Add " + n + " to both sides", sub: (n) => "Subtract " + n + " from both sides",
    mul: (n) => "Multiply both sides by " + n, div: (n) => "Divide both sides by " + n,
    dist: () => "Distributive property", comb: () => "Combine like terms",
  };
  const LEVELS = [
    { stage: 1, start: "x + 7 = 12", lines: [["x = 12 + 7", "Subtract 7 from both sides"], ["x = 19", "Simplify"]], bug: 0,
      fix: ["x = 12 − 7", "x = 7 − 12", "x + 7 = 5"], why: "Subtracting 7 on the left means subtracting 7 on the right too, not adding it.", answer: "x = 5",
      tip: "One line breaks the rules. Click it, then choose what it should have said." },
    { stage: 1, start: "3x = 21", lines: [["x = 21 − 3", "Divide both sides by 3"], ["x = 18", "Simplify"]], bug: 0,
      fix: ["x = 21 ÷ 3", "x = 21 · 3", "x = 3 ÷ 21"], why: "The reason says divide by 3, but the line subtracts 3.", answer: "x = 7",
      tip: "Compare each line with the reason written next to it." },
    { stage: 1, start: "2x + 5 = 17", lines: [["2x = 12", "Subtract 5 from both sides"], ["x = 12 − 2", "Divide both sides by 2"], ["x = 10", "Simplify"]], bug: 1,
      fix: ["x = 12 ÷ 2", "x = 12 · 2", "2x = 6"], why: "Dividing both sides by 2 turns 2x into x and 12 into 6.", answer: "x = 6",
      tip: "Check every line, not just the last one." },
    { stage: 1, start: "4(x − 2) = 20", lines: [["4x − 2 = 20", "Distributive property"], ["4x = 22", "Add 2 to both sides"], ["x = 5.5", "Divide both sides by 4"]], bug: 0,
      fix: ["4x − 8 = 20", "4x − 6 = 20", "x − 8 = 20"], why: "The 4 multiplies both terms in the parentheses: 4 · x and 4 · 2.", answer: "x = 7",
      tip: "Distributing is a step too. Did it reach every term?" },
    { stage: 2, start: "5x − 3 = 12", lines: [["5x = 15", ["add", 3], ["sub", 3], ["mul", 3], ["comb"]], ["x = 3", ["div", 5], ["sub", 5], ["mul", 5], ["dist"]]],
      answer: "x = 3", tip: "This solution is correct. Explain why each line follows from the one before it." },
    { stage: 2, start: "3(x + 4) = 27", lines: [["3x + 12 = 27", ["dist"], ["comb"], ["mul", 3], ["add", 4]], ["3x = 15", ["sub", 12], ["div", 12], ["sub", 27], ["comb"]], ["x = 5", ["div", 3], ["sub", 3], ["mul", 3], ["dist"]]],
      answer: "x = 5", tip: "Name the reason for each step." },
    { stage: 2, start: "6x + 2 = 2x + 18", lines: [["4x + 2 = 18", ["sub", "2x"], ["sub", 2], ["div", 2], ["comb"]], ["4x = 16", ["sub", 2], ["div", 2], ["sub", "4x"], ["add", 2]], ["x = 4", ["div", 4], ["sub", 4], ["mul", 4], ["comb"]]],
      answer: "x = 4", tip: "Variables on both sides. What happened to the 2x?" },
    { stage: 2, start: "x ÷ 3 + 1 = 5", lines: [["x ÷ 3 = 4", ["sub", 1], ["div", 3], ["add", 1], ["comb"]], ["x = 12", ["mul", 3], ["div", 3], ["add", 3], ["dist"]]],
      answer: "x = 12", tip: "What undoes dividing by 3?" },
    { stage: 3, start: "2(x + 3) = 4x − 2", lines: [["2x + 6 = 4x − 2", "Distributive property"], ["6 = 2x − 2", "Subtract 2x from both sides"], ["8 = 2x", "Add 2 to both sides"], ["4 = x", "Divide both sides by 2"]], bug: -1,
      answer: "x = 4", tip: "Some solutions are correct. If every line is right, say so." },
    { stage: 3, start: "7 − x = 10", lines: [["−x = 3", "Subtract 7 from both sides"], ["x = 3", "Divide both sides by −1"]], bug: 1,
      fix: ["x = −3", "x = 3", "−x = −3"], why: "Dividing −x by −1 gives x, and dividing 3 by −1 gives −3. Both sides change.", answer: "x = −3",
      tip: "Check the signs carefully." },
    { stage: 3, start: "5x + 4 = 3x − 8", lines: [["2x + 4 = −8", "Subtract 3x from both sides"], ["2x = −4", "Subtract 4 from both sides"], ["x = −2", "Divide both sides by 2"]], bug: 1,
      fix: ["2x = −12", "2x = 4", "2x = −8 − 4x"], why: "−8 − 4 is −12, not −4.", answer: "x = −6",
      tip: "Arithmetic slips count as bugs too." },
    { stage: 3, start: "3(2x − 1) = 2(x + 5) + 3", lines: [["6x − 3 = 2x + 10 + 3", "Distributive property"], ["6x − 3 = 2x + 13", "Combine like terms"], ["4x − 3 = 13", "Subtract 2x from both sides"], ["4x = 16", "Add 3 to both sides"], ["x = 4", "Divide both sides by 4"]], bug: -1,
      answer: "x = 4", tip: "Last one: a long solution. Is there a bug, or is it right?" },
  ];
  const reasonText = (r) => REASONS[r[0]](r[1]);

  function render(api, lv, hi, marks) {
    const list = api.h("ol", { class: "steps", "aria-label": "Worked solution" });
    list.appendChild(api.h("li", null, api.h("div", { class: "worked-line" }, lv.start, api.h("span", { class: "why" }, "Start"))));
    lv.lines.forEach((ln, k) => {
      const fixed = lv.bug >= 0 && marks["c" + lv.bug] === "right";
      if (fixed && k > lv.bug) return;
      const line = fixed && k === lv.bug ? lv.fix[0] : ln[0];
      const reason = lv.stage === 2 ? (marks[k] || "Reason: ?") : ln[1];
      const b = api.h("div", { class: "worked-line " + (k === hi ? "sel " : "") + (marks["c" + k] || "") }, line, api.h("span", { class: "why" }, reason));
      list.appendChild(api.h("li", null, b));
    });
    api.stage.innerHTML = "";
    api.stage.appendChild(api.h("div", { style: { padding: "8px" } }, list));
  }

  GameShell.register({
    slug: "a-rei-a-1",
    title: "Find the Bug",
    firstMove: "Find the first line that breaks the equation. Read two neighboring lines, then choose the line to fix.",
    subtitle: "Explain each step of a solution, and catch the step that breaks the rules",
    stages: { 1: "Stage 1 · Spot the bug", 2: "Stage 2 · Explain every step", 3: "Stage 3 · Bug or no bug?" },
    levels: LEVELS,
    help: {
      intro: "Each level shows a worked solution. Your job: check it the way a math teacher would.",
      steps: [
        "Read each line and the reason next to it. Does the line really follow from the line before?",
        "In stages 1 and 3, pick the line with the bug, then choose what that line should have said.",
        "In stage 2 the solution is correct: choose the reason that justifies each line.",
        "Some stage 3 solutions have no bug at all. If every line is right, say so.",
      ],
      note: "Fewer wrong guesses means more stars.",
    },
    load(lv, api) {
      const marks = {};
      render(api, lv, -1, marks);
      let steps;
      if (lv.stage === 2) {
        steps = lv.lines.map((ln, k) => {
          const opts = ln.slice(1).map((r, j) => ({ label: reasonText(r), ok: j === 0, why: "That reason doesn't turn \"" + (k ? lv.lines[k - 1][0] : lv.start) + "\" into \"" + ln[0] + "\". Compare the two lines." }));
          opts.sort((a, b) => a.label.localeCompare(b.label));
          return { type: "choice", prompt: "Why is line " + (k + 1) + " true? <b>" + ln[0] + "</b>", options: opts,
            onEnter: () => render(api, lv, k, marks),
            onDone: () => { marks[k] = reasonText(ln[1]); marks["c" + k] = "right"; render(api, lv, -1, marks); },
            done: (k ? lv.lines[k - 1][0] : lv.start) + " → " + ln[0] + ": " + reasonText(ln[1]) };
        });
      } else {
        const which = { type: "choice", ordered: true, prompt: "Which line has the bug?",
          options: lv.lines.map((ln, k) => ({ label: "Line " + (k + 1) + ": " + ln[0], ok: k === lv.bug,
            why: lv.bug === -1 ? "Look again: \"" + ln[0] + "\" follows from the line before with the reason \"" + ln[1] + "\"." : "Line " + (k + 1) + " is fine: \"" + ln[1] + "\" really does give \"" + ln[0] + "\"." })),
          onDone: () => { if (lv.bug >= 0) { marks["c" + lv.bug] = "wrong"; render(api, lv, lv.bug, marks); } } };
        if (lv.stage === 3) which.options.push({ label: "No bug: every line is correct", ok: lv.bug === -1, why: "There is a bug. Check each line against its reason." });
        which.done = lv.bug === -1 ? "Every line follows from the one before: no bug." : "Bug in line " + (lv.bug + 1) + ": " + lv.lines[lv.bug][0];
        steps = [which];
        if (lv.bug >= 0) {
          const opts = lv.fix.map((f, j) => ({ label: f, ok: j === 0, why: "That line doesn't follow from the reason \"" + lv.lines[lv.bug][1] + "\" either." }));
          opts.sort((a, b) => a.label.localeCompare(b.label));
          steps.push({ type: "choice", prompt: "What should line " + (lv.bug + 1) + " say? (" + lv.lines[lv.bug][1] + ")", options: opts,
            done: "Fixed line " + (lv.bug + 1) + ": " + lv.fix[0] + ". " + lv.why,
            onDone: () => { marks["c" + lv.bug] = "right"; render(api, lv, -1, marks); } });
          steps.push({ type: "input", prompt: "Finish the corrected solution: x = []", answers: [Number(lv.answer.replace(/^x = /, "").replace("−", "-"))],
            hint: "Redo the steps after the fixed line. What does x really equal?", done: "Correct answer: " + lv.answer });
        }
      }
      Steps.run(api, { steps, logTitle: "Your reasoning", result: () => ({ answer: lv.bug === -1 || lv.stage === 2 ? "No bug · " + lv.answer : lv.answer }) });
    },
    guide: {
      evidence: "Ask why the first incorrect line changes the solution. Look for a corrected line and the operation that justifies it.",
      summary: "A 12-level game about the logic of solving equations. Students find the line in a worked solution that breaks the rules, fix it, justify each line of correct solutions, and decide whether a solution method is valid.",
      practices: "MP3 Construct viable arguments and critique the reasoning of others · MP6 Attend to precision",
      goals: [
        "Explain each step in solving a linear equation as following from the previous step (properties of equality, distributive property, combining like terms).",
        "Identify an invalid step in a worked solution and correct it.",
        "Decide whether a complete solution method is valid, and justify the decision.",
      ],
      howItWorks: "Each level shows a worked solution with a reason next to every line. In stages 1 and 3 students pick the buggy line, choose the corrected line, and finish the solution. In stage 2 the solution is correct and students choose the reason for each line. Wrong picks get specific feedback and cost stars.",
      stageNotes: {
        1: { sees: "Short solutions with one bug each.", builds: "Matching each line to its stated reason." },
        2: { sees: "Correct solutions with the reasons hidden.", builds: "Naming the property that justifies each step." },
        3: { sees: "Longer solutions; some have no bug.", builds: "Judging a whole method; sign and arithmetic errors." },
      },
      discussion: [
        "In level 1 the student wrote x = 12 + 7. What might they have been thinking?",
        "Why is \"divide both sides by −1\" a legal step? What has to happen to both sides?",
        "How can you check a solution without re-reading every step?",
      ],
      misconceptions: [
        ["Doing the inverse operation on one side only", "Level 1's bug; the fix requires the same operation on both sides."],
        ["Distributing to the first term only", "Level 4: 4(x − 2) written as 4x − 2."],
        ["Changing the sign on one side when dividing by −1", "Level 10's bug."],
        ["Assuming every worked solution must contain an error", "Two stage 3 solutions are fully correct."],
      ],
      exitTicket: {
        items: ["Find and fix the bug: 3x − 4 = 11 → 3x = 7 → x = 7/3",
          "Give a reason for each step: 2(x + 1) = 10 → 2x + 2 = 10 → 2x = 8 → x = 4",
          "Priya says you can solve 5 − x = 2 by subtracting 5 from both sides to get x = −3. Is she right? Explain."],
        answers: ["3x = 7 should be 3x = 15 (add 4 to both sides), so x = 5.",
          "Distributive property; subtract 2 from both sides; divide both sides by 2.",
          "No. Subtracting 5 gives −x = −3, then dividing by −1 gives x = 3. Check: 5 − 3 = 2."],
      },
    },
    answerKey(lv) {
      if (lv.stage === 2) return { prompt: lv.start, solution: lv.lines.map((ln) => ln[0] + " (" + reasonText(ln[1]) + ")").join("; "), answer: lv.answer };
      if (lv.bug === -1) return { prompt: lv.start + " → " + lv.lines.map((l) => l[0]).join(" → "), solution: "No bug: every line is correct.", answer: lv.answer };
      return { prompt: lv.start + " → " + lv.lines.map((l) => l[0]).join(" → "), solution: "Bug in line " + (lv.bug + 1) + "; it should be " + lv.fix[0] + ". " + lv.why, answer: lv.answer };
    },
  });
})();
