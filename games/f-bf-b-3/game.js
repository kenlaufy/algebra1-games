/* Shadow Match · AI.F-BF.B.3 */
(function () {
  const Alg = window.Alg, M = Alg.MINUS;
  const BASE = {
    sq: { text: "x²", f: (x) => x * x }, abs: { text: "|x|", f: (x) => Math.abs(x) }, exp: { text: "2ˣ", f: (x) => Math.pow(2, x) }, lin: { text: "x", f: (x) => x },
  };
  const T = {
    add: { label: "f(x) + k", apply: (f, k) => (x) => f(x) + k }, mul: { label: "k · f(x)", apply: (f, k) => (x) => k * f(x) },
    shift: { label: "f(x + k)", apply: (f, k) => (x) => f(x + k) }, scale: { label: "f(kx)", apply: (f, k) => (x) => f(k * x) },
  };
  // target: list of [type, k] applied in order
  const LEVELS = [
    { stage: 1, base: "sq", target: [["add", 3]], tip: "The shadow is the same shape, moved. Which transformation and which k?" },
    { stage: 1, base: "abs", target: [["add", -2]], tip: "Down is a negative k." },
    { stage: 1, base: "sq", target: [["mul", 2]], tip: "Narrower: every output doubled." },
    { stage: 1, base: "abs", target: [["mul", 0.5]], tip: "Wider: every output halved." },
    { stage: 2, base: "sq", target: [["shift", 2]], tip: "Sideways! Careful: which way does f(x + 2) move?" },
    { stage: 2, base: "abs", target: [["shift", -3]], tip: "Moved right 3. What's k in f(x + k)?" },
    { stage: 2, base: "exp", target: [["scale", 2]], tip: "Steeper, but still through (0, 1)." },
    { stage: 2, base: "exp", target: [["add", -4]], tip: "The floor moved too." },
    { stage: 3, base: "abs", target: [["mul", -1]], tip: "Upside down: what k flips a graph?" },
    { stage: 3, base: "sq", target: [["shift", -1], ["add", 2]], tip: "Two moves this time: sideways, then up. Make the first move, then the second." },
    { stage: 3, base: "exp", target: [["shift", 3]], tip: "Exponentials can shift sideways too." },
    { stage: 3, base: "abs", target: [["shift", 2], ["mul", 3]], tip: "Last one: shift, then stretch." },
  ];
  const compose = (base, list) => list.reduce((f, [t, k]) => T[t].apply(f, k), BASE[base].f);
  const same = (f, g, a, b) => { for (let x = a; x <= b; x += 0.25) { const u = f(x), v = g(x); if (Math.abs(u) > 60 && Math.abs(v) > 60) continue; if (!Alg.close(u, v, 1e-6)) return false; } return true; };
  const describe = ([t, k]) => t === "add" ? (k > 0 ? "up " + k : "down " + -k) : t === "mul" ? (k < 0 ? "flip" + (k !== -1 ? " and stretch by " + -k : "") : k > 1 ? "stretch by " + k : "squash by " + k)
    : t === "shift" ? (k > 0 ? "left " + k : "right " + -k) : (k > 1 ? "squeeze sideways by " + k : "stretch sideways");

  GameShell.register({
    slug: "f-bf-b-3",
    title: "Shadow Match",
    subtitle: "Transform graphs with f(x) + k, k·f(x), f(x + k) and f(kx)",
    stages: { 1: "Stage 1 · Up, down, stretch", 2: "Stage 2 · Sideways", 3: "Stage 3 · Flips and combos" },
    levels: LEVELS,
    help: {
      intro: "The gray shadow is a transformed copy of f. Make the blue graph cover it exactly.",
      steps: [
        "Choose a transformation: f(x) + k, k · f(x), f(x + k) or f(kx).",
        "Type k and press <b>Cast</b>. The blue graph changes.",
        "If it covers the shadow, you win. Some levels need two moves.",
        "Fewer wrong casts means more stars.",
      ],
      note: "f(x + 2) moves LEFT 2: the graph reaches each output 2 units earlier.",
    },
    load(lv, api) {
      const P = Plane.create({ xmin: -6, xmax: 6, ymin: -6, ymax: 10 });
      const B = BASE[lv.base];
      api.stage.appendChild(api.h("div", { class: "stage-text", style: { fontSize: "24px" } }, "f(x) = " + B.text));
      const svg = api.svg("0 0 900 460", "Graph and its shadow");
      api.stage.appendChild(svg);
      const target = compose(lv.base, lv.target);
      let moves = [], mistakes = 0, type = null;
      const cur = () => moves.reduce((f, [t, k]) => T[t].apply(f, k), B.f);
      function draw(preview) {
        let s = P.grid();
        s += P.curve(target, { color: "#9a9284", width: 14 });
        s += P.curve(B.f, { color: "#c8c0b0", width: 2, dash: "5 5" });
        s += P.curve(preview || cur(), { color: "#5a78b8", width: 4.5 });
        svg.innerHTML = s;
      }
      draw();
      const seg = api.seg(Object.keys(T).map((k) => ({ value: k, label: T[k].label })), null, (v) => { type = v; }, "Transformation");
      const kIn = api.number("", { "aria-label": "k", step: "any", inputmode: "decimal" });
      kIn.type = "text";
      const cast = api.button("Cast", onCast, "primary");
      const undo = api.button("Undo", () => { moves.pop(); draw(); api.msg("Undid your last move."); });
      api.controls.append(seg.el, api.h("span", { class: "lbl" }, "k ="), kIn, cast, undo);
      api.meta("Moves needed: " + lv.target.length);
      api.msg("Pick a transformation and k, then cast.");
      function onCast() {
        const k = Alg.parseNum(kIn.value);
        if (!type) return api.msg("Choose a transformation first.", "warn");
        if (Number.isNaN(k)) return api.msg("Type a number for k.", "warn");
        if ((type === "mul" || type === "scale") && k === 0) return api.msg("k = 0 would squash the graph flat.", "warn");
        moves.push([type, k]);
        const g = cur();
        draw();
        if (same(g, target, -6, 6)) {
          return api.win({ answer: moves.map((m) => T[m[0]].label.replace("k", Alg.num(m[1]))).join(", then "),
            stars: mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1, note: mistakes ? mistakes + (mistakes === 1 ? " wrong cast." : " wrong casts.") : "Perfect match!",
            lines: moves.map((m) => T[m[0]].label.replace("k", Alg.num(m[1])) + ": " + describe(m)), check: "The blue graph covers the shadow everywhere ✓" });
        }
        // in two-move levels the moves are one horizontal and one vertical, so any order works
        const remaining = lv.target.filter((tm) => !moves.slice(0, -1).some((m) => m[0] === tm[0] && Alg.close(m[1], tm[1])));
        const last = moves[moves.length - 1];
        if (moves.length < lv.target.length && remaining.some((tm) => tm[0] === last[0] && Alg.close(tm[1], last[1]))) {
          return api.msg("Good move. Now the other one.", "good");
        }
        mistakes++;
        const [t1, k1] = last;
        moves.pop();
        draw();
        const tgt = remaining.find((tm) => tm[0] === t1) || remaining[0];
        let hint = "That gives a different graph.";
        if (t1 === "shift" && tgt[0] === "shift" && k1 === -tgt[1]) hint = "Right idea, wrong direction: f(x + k) moves LEFT when k is positive.";
        else if (t1 === tgt[0]) hint = "Right transformation. Adjust k.";
        else if (t1 === "add" && tgt[0] === "shift") hint = "Up and down won't do it: the shadow moved sideways.";
        else if (t1 === "shift" && tgt[0] === "add") hint = "Sideways won't do it: the shadow moved up or down.";
        api.msg(hint + " (Undone.)", "bad");
      }
      api.autoplay = () => {
        lv.target.forEach(([t, k]) => { seg.buttons.find((b) => b._v === t).click(); kIn.value = k; cast.click(); });
        return {};
      };
    },
    guide: {
      summary: "A 12-level game for transformations of graphs. Students choose among f(x) + k, k·f(x), f(x + k) and f(kx) and a value of k to make a graph match a shadow, for x², |x| and 2ˣ, including reflections and two-step combinations.",
      also: "<span class='code'>AI.F-IF.C.7.b</span> absolute value graphs and <span class='code'>AI.F-IF.C.7.e</span> exponential graphs.",
      practices: "MP7 Look for and make use of structure · MP5 Use appropriate tools strategically",
      goals: [
        "Identify the effect on a graph of f(x) + k, k·f(x), f(x + k) and f(kx), for positive and negative k.",
        "Find k given a graph and its transformed image.",
        "Combine two transformations.",
      ],
      howItWorks: "The gray shadow is the target; the blue curve is the student's current graph. Students choose a transformation and k and press Cast. A wrong cast is undone with targeted feedback (for example, the sign trap of f(x + k)). Any transformation that produces exactly the shadow is accepted.",
      stageNotes: {
        1: { sees: "Vertical shifts and stretches of x² and |x|.", builds: "f(x) + k and k·f(x)." },
        2: { sees: "Horizontal shifts and scaling, exponential shifts.", builds: "f(x + k) direction; f(kx)." },
        3: { sees: "A reflection and two-move combinations.", builds: "k = −1; composing transformations." },
      },
      discussion: [
        "Why does f(x + 2) move the graph left instead of right?",
        "For y = x², is 4f(x) the same as f(2x)? Why can both match some shadows?",
        "What does y = 2ˣ − 4 do to the asymptote?",
      ],
      misconceptions: [
        ["f(x + k) moves right for positive k", "Specific feedback when the direction is reversed."],
        ["Confusing vertical and horizontal changes", "Feedback when an up/down move is used for a sideways shadow, and vice versa."],
        ["Order doesn't matter in combinations", "Two-move levels check after each move."],
      ],
      exitTicket: {
        items: ["Describe the graph of y = (x − 4)² + 1 compared with y = x².", "g(x) = f(x + 3) where f(x) = |x|. Where is the corner of g?", "What k makes k·2ˣ pass through (0, 5)?"],
        answers: ["Right 4 and up 1.", "At x = −3.", "k = 5."],
      },
    },
    answerKey(lv) {
      return { prompt: "f(x) = " + BASE[lv.base].text, solution: lv.target.map((m) => T[m[0]].label.replace("k", Alg.num(m[1])) + " (" + describe(m) + ")").join(", then "), answer: lv.target.map((m) => T[m[0]].label.replace("k", Alg.num(m[1]))).join(" then ") };
    },
  });
})();
