/* Stacked Scales · AI.A-REI.C.5 */
(function () {
  const A = window.Cartoon, Alg = window.Alg, M = Alg.MINUS;
  // equations: [a, b, c] meaning ax + by = c. sol: moves. move = ["mul", eq, k] or ["add", eq, k] (replace eq with eq + k·other)
  const LEVELS = [
    { stage: 1, E: [[1, 1, 7], [1, -1, 1]], s: [4, 3], par: 1, sol: [["add", 0, 1]], tip: "Stack scale 2 onto scale 1. What happens to the y tiles?" },
    { stage: 1, E: [[2, 1, 9], [-2, 3, 3]], s: [3, 3], par: 1, sol: [["add", 0, 1]], tip: "Which tiles cancel when you stack these?" },
    { stage: 1, E: [[1, 2, 8], [1, 1, 5]], s: [2, 3], par: 1, sol: [["add", 0, -1]], tip: "Adding won't cancel anything here. Try taking one scale away (k = −1)." },
    { stage: 1, E: [[3, 1, 10], [1, 1, 4]], s: [3, 1], par: 1, sol: [["add", 0, -1]], tip: "Which variable is easiest to get rid of?" },
    { stage: 2, E: [[1, 2, 7], [3, -1, 7]], s: [3, 2], par: 1, sol: [["add", 0, 2]], tip: "Stack two copies of scale 2 (k = 2) so the y tiles cancel." },
    { stage: 2, E: [[2, 3, 12], [1, 1, 5]], s: [3, 2], par: 1, sol: [["add", 0, -2]], tip: "Take away two copies of scale 2." },
    { stage: 2, E: [[4, -1, 5], [1, 2, 8]], s: [2, 3], par: 1, sol: [["add", 1, 2]], tip: "This time, replace scale 2." },
    { stage: 2, E: [[5, 2, 16], [1, -1, -1]], s: [2, 3], par: 1, sol: [["add", 0, 2]], tip: "Negative ones on the right. Same idea." },
    { stage: 3, E: [[3, 2, 13], [2, 3, 12]], s: [3, 2], par: 2, sol: [["mul", 0, 2], ["add", 0, -3]], tip: "No single multiple works. Resize one scale first (×), then stack." },
    { stage: 3, E: [[4, 3, 24], [3, -2, 1]], s: [3, 4], par: 2, sol: [["mul", 0, 2], ["add", 0, 3]], tip: "Plan two moves: make the y coefficients opposites." },
    { stage: 3, E: [[2, -5, -11], [3, 2, 12]], s: [2, 3], par: 2, sol: [["mul", 0, 2], ["add", 0, 5]], tip: "Bigger numbers. Same plan." },
    { stage: 3, E: [[5, -3, 2], [2, 4, 6]], s: [1, 1], par: 2, sol: [["mul", 0, 4], ["add", 0, 3]], tip: "Last one. Two moves is par." },
  ];
  const fmt = (e) => Alg.fmtTerms([{ coef: e[0], body: "x" }, { coef: e[1], body: "y" }]) + " = " + Alg.num(e[2]);
  const moveText = (m) => m[0] === "mul" ? "Multiply equation " + (m[1] + 1) + " by " + Alg.num(m[2]) : "Replace equation " + (m[1] + 1) + " with (equation " + (m[1] + 1) + ") + " + Alg.paren(m[2]) + " × (equation " + (2 - m[1]) + ")";
  function applyMove(E, m) {
    const out = E.map((e) => e.slice());
    if (m[0] === "mul") out[m[1]] = out[m[1]].map((v) => v * m[2]);
    else { const o = E[1 - m[1]]; out[m[1]] = out[m[1]].map((v, i) => v + m[2] * o[i]); }
    return out;
  }

  function tilesFor(e) {
    const specs = [];
    const add = (n, pos, neg, opts) => {
      const k = Math.abs(n);
      if (k > 9) specs.push(A.tileSpec(n > 0 ? pos : neg, Object.assign({ many: k }, opts)));
      else for (let i = 0; i < k; i++) specs.push(A.tileSpec(n > 0 ? pos : neg, opts));
    };
    add(e[0], "x", "nx", {});
    add(e[1], "x", "nx", { letter: "y", fill: e[1] > 0 ? "#6b8f5e" : undefined });
    return specs;
  }
  function unitTiles(c) {
    const specs = [], k = Math.abs(c);
    if (k > 16) specs.push(A.tileSpec(c > 0 ? "u" : "nu", { many: k }));
    else for (let i = 0; i < k; i++) specs.push(A.tileSpec(c > 0 ? "u" : "nu"));
    return specs;
  }

  GameShell.register({
    slug: "a-rei-c-5",
    title: "Stacked Scales",
    subtitle: "Solve systems by stacking balanced scales (elimination)",
    stages: { 1: "Stage 1 · Stack or take away", 2: "Stage 2 · Stack several copies", 3: "Stage 3 · Resize, then stack" },
    levels: LEVELS,
    help: {
      intro: "Each equation is a balanced scale. Stacking one balanced scale on another keeps it balanced, so the new equation has the <b>same solutions</b>.",
      steps: [
        "<b>Stack</b>: replace an equation with itself plus k copies of the other (k can be negative to take copies away).",
        "<b>Resize</b>: multiply an equation by a number (both sides).",
        "Make one variable disappear from an equation, then solve for both variables.",
        "Reach a one-variable equation in as few moves as you can for 3 stars.",
      ],
      note: "Blue tiles are x, green tiles are y, yellow are ones; red tiles are negative.",
    },
    load(lv, api) {
      const s = { E: lv.E.map((e) => e.slice()), steps: 0, hist: [], log: [{ move: "Start", text: fmt(lv.E[0]) + "; " + fmt(lv.E[1]) }], phase: "move" };
      const svg = api.svg("0 0 900 520", "Two balance scales");
      const eqs = api.h("div", { class: "stage-text", style: { fontSize: "26px", lineHeight: "1.5" } });
      api.stage.append(svg, eqs);
      let kind = "add", target = 0;
      const kindSeg = api.seg([{ value: "add", label: "Stack" }, { value: "mul", label: "Resize" }], kind, (v) => { kind = v; refresh(); }, "Move type");
      const tSeg = api.seg([{ value: 0, label: "Eq 1" }, { value: 1, label: "Eq 2" }], target, (v) => { target = v; refresh(); }, "Which equation changes");
      const k = api.number(1, { "aria-label": "Multiplier k" });
      k.addEventListener("input", refresh);
      const preview = api.h("span", { class: "preview" });
      const go = api.button("Apply", onApply, "primary");
      const undo = api.button("Undo", onUndo);
      api.controls.append(kindSeg.el, tSeg.el, api.h("span", { class: "lbl" }, "k ="), k, preview, go, undo);

      function draw(mood) {
        let sc = A.backdrop(900, 520, { ground: 500, clouds: false });
        [0, 1].forEach((i) => {
          const e = s.E[i];
          const yOff = i * 250;
          sc += '<g transform="translate(0 ' + yOff + ')">' +
            A.scale({ cx: 450, cy: 40, arm: 280, rope: 150, groundY: 238, hit: false, left: tilesFor(e), right: unitTiles(e[2]) }) +
            A.text(60, 40, "Eq " + (i + 1), { size: 22, var: false, anchor: "start" }) + "</g>";
        });
        sc += A.mascot(820, 500, mood || "ok", 0.8);
        svg.innerHTML = sc;
        svg.setAttribute("aria-label", "Equation 1: " + fmt(s.E[0]) + ". Equation 2: " + fmt(s.E[1]) + ".");
        eqs.innerHTML = "1: " + fmt(s.E[0]) + "<br>2: " + fmt(s.E[1]);
      }
      function readK() { const v = Number(k.value); return Number.isInteger(v) && v !== 0 ? v : null; }
      function refresh() {
        const v = readK();
        preview.innerHTML = v === null ? "k must be a whole number, not 0." : "<b>" + moveText([kind, target, v]) + "</b>";
        go.disabled = v === null || s.phase !== "move";
        undo.disabled = !s.hist.length || s.phase !== "move";
        api.meta("Par: " + lv.par + (lv.par === 1 ? " move" : " moves") + " · Moves so far: " + s.steps);
        draw();
      }
      function onApply() {
        const v = readK();
        if (v === null) return;
        if (kind === "mul" && v === 1) return api.msg("Multiplying by 1 changes nothing.", "warn");
        const m = [kind, target, v];
        s.hist.push(s.E.map((e) => e.slice()));
        s.E = applyMove(s.E, m);
        s.steps++;
        s.log.push({ move: moveText(m), text: fmt(s.E[0]) + "; " + fmt(s.E[1]) });
        api.log(s.log, "Your moves");
        const one = s.E.findIndex((e) => (e[0] === 0) !== (e[1] === 0));
        if (one >= 0) return solvePhase(one);
        if (s.E.some((e) => e[0] === 0 && e[1] === 0)) api.msg("Both variables vanished from an equation. That's still balanced, but it doesn't help. Undo and try a different k.", "warn");
        else api.msg("Still balanced, because you stacked balanced scales. Keep going until one variable disappears.");
        refresh();
      }
      function onUndo() {
        const p = s.hist.pop();
        if (!p) return;
        s.E = p; s.steps--; s.log.pop();
        api.log(s.log.length > 1 ? s.log : null);
        refresh();
      }
      function solvePhase(i) {
        s.phase = "solve";
        refresh();
        draw("joy");
        const e = s.E[i];
        const first = e[0] !== 0 ? "x" : "y", second = first === "x" ? "y" : "x";
        const val = first === "x" ? lv.s[0] : lv.s[1], val2 = first === "x" ? lv.s[1] : lv.s[0];
        api.msg("One variable is gone from equation " + (i + 1) + ": " + fmt(e) + ". Now solve.", "good");
        api.controls.innerHTML = "";
        const moves = s.steps;
        Steps.run(api, {
          steps: [
            { type: "input", prompt: fmt(e) + ", so " + first + " = []", answers: [val], hint: "Divide both sides by the coefficient of " + first + "." },
            { type: "input", prompt: "Substitute " + first + " = " + Alg.num(val) + " into an original equation: " + second + " = []", answers: [val2], hint: "Use equation 2 from the start: " + fmt(lv.E[1]) + "." },
          ],
          logTitle: "Your moves",
          result: () => ({ answer: "x = " + Alg.num(lv.s[0]) + ", y = " + Alg.num(lv.s[1]), steps: moves, par: lv.par, stars: undefined, note: undefined,
            lines: s.log.map((l) => (l.move ? l.move + ": " : "") + l.text),
            check: "(" + Alg.num(lv.s[0]) + ", " + Alg.num(lv.s[1]) + ") balances the original scales and every stacked one: " +
              s.E.map((q) => Alg.num(q[0] * lv.s[0] + q[1] * lv.s[1]) + " = " + Alg.num(q[2])).join(", ") + " ✓" }),
        });
      }
      api.msg("Choose Stack or Resize, which equation changes, and k. Then apply.");
      refresh();
      const myAuto = () => {
        lv.sol.forEach((m) => {
          kindSeg.buttons.find((b) => b._v === m[0]).click();
          tSeg.buttons.find((b) => b._v === m[1]).click();
          k.value = m[2];
          refresh();
          go.click();
        });
        if (api.autoplay !== myAuto) api.autoplay(); // the solving steps installed their own autoplay
        return { steps: s.steps, par: lv.par };
      };
      api.autoplay = myAuto;
    },
    guide: {
      summary: "A 12-level game for the elimination method. Each equation is a balanced scale; students replace one equation with the sum of it and a multiple of the other until a variable disappears, then solve. The win screen shows that the solution balances every new scale.",
      also: "<span class='code'>AI.A-REI.C.6</span> solving systems of linear equations exactly.",
      practices: "MP3 Construct viable arguments · MP7 Look for and make use of structure",
      goals: [
        "Explain why replacing one equation by its sum with a multiple of the other produces a system with the same solutions.",
        "Choose multipliers that eliminate a variable, including resizing an equation first.",
        "Solve the resulting one-variable equation and substitute back.",
      ],
      howItWorks: "Two scales show ax + by on the left and the constant on the right with tiles (blue x, green y, yellow ones, red negatives). Moves are Stack (replace an equation with itself plus k copies of the other) and Resize (multiply an equation by k). When a variable disappears, students solve for both values. Stars compare the number of moves with par.",
      stageNotes: {
        1: { sees: "Systems where adding or subtracting once eliminates a variable.", builds: "Why stacking balanced scales keeps balance." },
        2: { sees: "Systems needing k = ±2.", builds: "Choosing a multiplier; replacing either equation." },
        3: { sees: "Systems needing a resize first (symbols only for larger numbers).", builds: "Planning two moves; least common multiples." },
      },
      discussion: [
        "If two scales are balanced, why is the stack of both still balanced?",
        "Why does the new system have exactly the same solutions as the old one? Could it gain or lose a solution?",
        "In level 9, why can't one Stack move eliminate a variable with whole-number k?",
      ],
      misconceptions: [
        ["Adding equations that don't cancel anything", "The scales update and the variable is still there; the move counter shows the cost."],
        ["Multiplying only one side of an equation", "Resize always multiplies both sides; the scale stays balanced."],
        ["Stopping after finding one variable", "The game requires the second value by substitution."],
      ],
      exitTicket: {
        items: ["Solve by elimination: x + 3y = 11 and x − y = 3", "Solve: 2x + 5y = 1 and 3x − 2y = 11", "Explain why adding two true equations gives another true equation."],
        answers: ["Subtract: 4y = 8, y = 2, x = 5.", "×3 and ×(−2), or similar: x = 3, y = −1.", "If a = b and c = d, then a + c = b + d: equal amounts added to both sides keep them equal."],
      },
    },
    answerKey(lv) {
      let E = lv.E;
      lv.sol.forEach((m) => (E = applyMove(E, m)));
      return { prompt: fmt(lv.E[0]) + "; " + fmt(lv.E[1]), solution: lv.sol.map(moveText).join("; ") + " → " + E.map(fmt).join("; "),
        answer: "x = " + Alg.num(lv.s[0]) + ", y = " + Alg.num(lv.s[1]) };
    },
  });
})();
