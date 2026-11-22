/* Zero Link · AI.A-SSE.B.3.a */
(function () {
  const A = window.Cartoon, Alg = window.Alg, M = Alg.MINUS;
  // P: coefficients [a, b, c]; fac: factor template + answers; zeros; v: variable letter
  const LEVELS = [
    { stage: 1, P: [1, -5, 6], fac: ["(x + [])(x + [])", [-2, -3], true], zeros: [2, 3], tip: "Factor, then predict where the graph meets the x-axis." },
    { stage: 1, P: [1, 1, -12], fac: ["(x + [])(x + [])", [4, -3], true], zeros: [3, -4], tip: "Each factor equals zero at one x-value." },
    { stage: 1, P: [1, 0, -9], fac: ["(x + [])(x + [])", [3, -3], true], zeros: [3, -3], tip: "No x term. What kind of expression is this?" },
    { stage: 1, P: [1, 6, 8], fac: ["(x + [])(x + [])", [2, 4], true], zeros: [-2, -4], tip: "Both numbers positive. Where are the zeros?" },
    { stage: 2, P: [1, 4, -5], given: "(x " + M + " 1)(x + 5)", zeros: [1, -5], tip: "Already factored! Just find the zeros. Careful with the signs." },
    { stage: 2, P: [1, -4, 0], fac: ["x(x + [])", [-4]], zeros: [0, 4], tip: "No constant term. Take out the common factor x." },
    { stage: 2, P: [2, -2, -12], fac: ["2(x + [])(x + [])", [-3, 2], true], zeros: [3, -2], tip: "Take out the 2 first. Does it change the zeros?" },
    { stage: 2, P: [-1, 2, 8], fac: [M + "(x + [])(x + [])", [-4, 2], true], zeros: [4, -2], tip: "This parabola opens down. Factor out −1 first." },
    { stage: 3, P: [-5, 20, 0], v: "t", context: "A ball's height is h = −5t² + 20t meters after t seconds.", fac: [M + "5t(t + [])", [-4]], zeros: [0, 4],
      final: ["The ball lands when h = 0 again, at t = [] seconds", [4]], tip: "The zeros tell you when the ball is on the ground." },
    { stage: 3, P: [1, -10, 25], fac: ["(x + [])²", [-5]], zeros: [5], tip: "Two equal factors. How many zeros?" },
    { stage: 3, P: [2, 5, -3], fac: ["(2x + [])(x + [])", [-1, 3]], zeros: [0.5, -3], tip: "A zero can be a fraction. Points snap to halves." },
    { stage: 3, P: [1, 2, -15], fac: ["(x + [])(x + [])", [5, -3], true], zeros: [-5, 3], tip: "Last one: factor and mark both zeros." },
  ];
  const vOf = (lv) => lv.v || "x";
  const pstr = (lv) => Alg.fmtPoly(lv.P, vOf(lv));
  const fx = (lv, x) => Alg.polyEval(lv.P, x);
  const zeroText = (lv) => lv.zeros.map((z) => vOf(lv) + " = " + Alg.num(z)).join(" and ");
  const facText = (lv) => {
    if (lv.given) return lv.given;
    let k = 0;
    return lv.fac[0].replace(/\+ \[\]/g, () => { const n = lv.fac[1][k++]; return n < 0 ? M + " " + Math.abs(n) : "+ " + n; });
  };

  function graph(lv, marks, reveal, t) {
    const W = 900, H = 340, X0 = 450, sx = 50;
    const xs = [];
    for (let x = -8; x <= 8.0001; x += 0.1) xs.push(x);
    const vx = -lv.P[1] / (2 * lv.P[0]), vy = fx(lv, vx);
    const ax = vy < 0 ? 110 : 280;               // put the x-axis where the vertex stays on screen
    const span = Math.max(Math.abs(vy), 4);
    const sy = 160 / span;
    const Y = (y) => ax - y * sy;
    let s = '<rect width="' + W + '" height="' + H + '" rx="12" fill="#fffdf7"/>';
    s += '<defs><clipPath id="plot"><rect x="20" y="10" width="860" height="320"/></clipPath></defs>';
    for (let x = -8; x <= 8; x++) {
      s += '<line x1="' + (X0 + x * sx) + '" y1="20" x2="' + (X0 + x * sx) + '" y2="320" stroke="#e9e1cc" stroke-width="1"/>';
      s += A.text(X0 + x * sx, ax + 26, Alg.num(x), { size: 14, var: false });
      s += '<line x1="' + (X0 + x * sx) + '" y1="' + (ax - 6) + '" x2="' + (X0 + x * sx) + '" y2="' + (ax + 6) + '" stroke="#23262d" stroke-width="2"/>';
    }
    s += '<line x1="20" y1="' + ax + '" x2="880" y2="' + ax + '" stroke="#23262d" stroke-width="3"/>';
    s += '<line x1="' + X0 + '" y1="15" x2="' + X0 + '" y2="325" stroke="#23262d" stroke-width="2"/>';
    s += A.text(870, ax - 10, vOf(lv), { size: 18 });
    if (reveal) {
      const n = Math.max(2, Math.round(xs.length * t));
      const pts = xs.slice(0, n).map((x) => (X0 + x * sx).toFixed(1) + "," + Y(fx(lv, x)).toFixed(1)).join(" ");
      s += '<polyline clip-path="url(#plot)" points="' + pts + '" fill="none" stroke="#5a78b8" stroke-width="5" stroke-linejoin="round"/>';
    }
    marks.forEach((m) => {
      const ok = reveal && lv.zeros.some((z) => Alg.close(z, m));
      s += '<circle cx="' + (X0 + m * sx) + '" cy="' + ax + '" r="11" fill="' + (reveal ? (ok ? "#3f7d4c" : "#c8553d") : "#e7b84a") + '" stroke="#23262d" stroke-width="3" pointer-events="none"/>';
      if (reveal) s += A.text(X0 + m * sx, ax + 6, ok ? "✓" : "×", { size: 18, fill: "#fff", var: false });
    });
    for (let x = -8; x <= 8.0001; x += 0.5) s += '<rect class="hit" data-x="' + x + '" x="' + (X0 + x * sx - 12) + '" y="' + (ax - 40) + '" width="24" height="80" fill="transparent"/>';
    return s;
  }

  GameShell.register({
    slug: "a-sse-b-3-a",
    title: "Zero Link",
    firstMove: "Find where the graph meets the axis. Factor if needed, mark each predicted zero, then check the graph.",
    subtitle: "Factor a quadratic to reveal where its graph meets the axis",
    stages: { 1: "Stage 1 · Factor and predict", 2: "Stage 2 · Signs, common factors, opening down", 3: "Stage 3 · Contexts, doubles and fractions" },
    levels: LEVELS,
    help: {
      intro: "The factored form of a quadratic tells you its <b>zeros</b>: the x-values where the graph meets the x-axis.",
      steps: [
        "Factor the expression by filling in the blanks.",
        "Click the x-axis where you think the zeros are (click again to remove a mark).",
        "Press <b>Check</b>. The real graph draws itself: each mark gets a check or a cross.",
        "Fewer wrong answers means more stars.",
      ],
      note: "If (x − 3) is a factor, the zero is at x = 3, not −3.",
    },
    load(lv, api) {
      const svg = api.svg("0 0 900 340", "Coordinate grid");
      const head = api.h("div", { class: "stage-text", style: { fontSize: "28px" } }, (lv.context ? "" : "") + "f(" + vOf(lv) + ") = " + (lv.given || pstr(lv)));
      if (lv.context) api.stage.appendChild(api.h("div", { class: "preview", style: { textAlign: "center", paddingTop: "8px" } }, lv.context));
      api.stage.append(head, svg);
      let marks = [], reveal = false, t = 0, armed = false;
      const draw = () => { svg.innerHTML = graph(lv, marks, reveal, t); };
      svg.addEventListener("click", (e) => {
        const hit = e.target.closest("[data-x]");
        if (hit && armed) toggleMark(Number(hit.getAttribute("data-x")));
      });
      const marked = api.h("span", { class: "preview", role: "status" });
      function toggleMark(x) {
        const k = marks.findIndex((m) => Alg.close(m, x));
        if (k >= 0) marks.splice(k, 1); else marks.push(x);
        reveal = false; draw();
        marked.textContent = marks.length ? "Marked: " + marks.slice().sort((a, b) => a - b).map(Alg.num).join(", ") : "No points marked.";
      }
      draw();
      const steps = [];
      if (lv.fac) {
        steps.push({ type: "input", prompt: "Factor: " + pstr(lv) + " = " + lv.fac[0].replace(/x/g, vOf(lv) === "t" ? "t" : "x"), answers: lv.fac[1], unordered: !!lv.fac[2],
          accept: (vals) => {
            // build the polynomial from the template and compare
            let k = 0;
            const filled = lv.fac[0].replace(/\[\]/g, () => vals[k++]);
            const ok = lv.fac[1].length === vals.length && (lv.fac[2] ? sameSet(vals, lv.fac[1]) : vals.every((v, i) => Alg.close(v, lv.fac[1][i])));
            return ok ? true : "Multiply your factors back out: does " + filled.replace(/\+ -/g, "− ") + " give " + pstr(lv) + "? Check the numbers' product and sum.";
          }, done: "Factored: " + pstr(lv) + " = " + facText(lv) });
      }
      steps.push({ type: "click", prompt: "Mark each zero on the axis or choose a value below. Mark it again to remove it.", button: "Check",
        controls: () => {
          const select = api.h("select", { "aria-label": "Axis value" });
          for (let x = -8; x <= 8; x += 0.5) select.appendChild(api.h("option", { value: x }, Alg.num(x)));
          select.value = "0";
          return api.h("div", { class: "plot-controls" }, select, api.button("Mark / unmark", () => toggleMark(Number(select.value))), marked);
        },
        onEnter: () => { armed = true; },
        check: () => {
          if (!marks.length) return "Mark a value that makes one factor equal zero, then check.";
          reveal = true;
          api.tween(0, 1, 700, (v) => { t = v; draw(); });
          const right = sameSet(marks, lv.zeros);
          if (right) { armed = false; return true; }
          const extra = marks.filter((m) => !lv.zeros.some((z) => Alg.close(z, m)));
          if (extra.length) return "The graph is off the axis at " + vOf(lv) + " = " + extra.map(Alg.num).join(", ") + ". Set each factor equal to 0: if a factor is (" + vOf(lv) + " − 3), then " + vOf(lv) + " = 3.";
          return lv.zeros.length > marks.length ? "One more input makes a factor zero. Check each factor separately." : "Check your marks against the graph.";
        },
        autoplay: () => { [...marks].forEach(toggleMark); lv.zeros.forEach(toggleMark); }, done: "Zeros at " + zeroText(lv) });
      if (lv.final) steps.push({ type: "input", prompt: lv.final[0], answers: lv.final[1], hint: "The ball is on the ground when the height is 0." });
      Steps.run(api, { steps, logTitle: "Your work", result: () => ({ answer: "Zeros: " + zeroText(lv), check: "Check: f(" + Alg.num(lv.zeros[0]) + ") = " + Alg.num(fx(lv, lv.zeros[0])) + " ✓" }) });
    },
    guide: {
      evidence: "Ask which factor becomes zero at each mark. For a repeated factor, the student should predict one point of contact and explain why.",
      summary: "A 12-level game linking factored form to zeros. Students factor a quadratic, predict its zeros by marking the x-axis, and then watch the real graph draw through (or miss) their marks.",
      also: "<span class='code'>AI.F-IF.C.8.a</span> using factoring to show the zeros of a quadratic function.",
      practices: "MP7 Look for and make use of structure · MP2 Reason abstractly and quantitatively",
      goals: [
        "Factor a quadratic expression to reveal the zeros of the function it defines.",
        "Explain why the zero of the factor (x − a) is x = a (zero-product property).",
        "Handle common factors, a negative leading coefficient, a double zero, and a fractional zero.",
      ],
      howItWorks: "Each level gives a quadratic. Students fill in a factor template, then click the x-axis where they predict the zeros. Pressing Check draws the actual parabola; correct marks turn green and incorrect marks red, with feedback about sign errors.",
      stageNotes: {
        1: { sees: "Monic quadratics.", builds: "Factor pairs; reading zeros from factors." },
        2: { sees: "An already-factored form, a common factor, a factor of 2, and a parabola opening down.", builds: "Signs; constant factors don't change the zeros." },
        3: { sees: "A projectile context, a perfect square, and a fractional zero.", builds: "Interpreting zeros; double zeros; 2x − 1 = 0." },
      },
      discussion: [
        "Why does (x − 1)(x + 5) have zeros at 1 and −5, not −1 and 5?",
        "Level 7: does factoring out the 2 change where the graph crosses the axis? Why not?",
        "Level 10 has only one zero. What does the graph look like there?",
      ],
      misconceptions: [
        ["Reading the zero of (x − 3) as −3", "Wrong marks turn red and the feedback explains setting the factor equal to 0."],
        ["Forgetting the zero from a common factor x", "Level 6 requires marking x = 0."],
        ["Thinking a constant factor changes the zeros", "Level 7's graph shows the same crossings."],
        ["Only integers can be zeros", "Level 11 has a zero at x = ½."],
      ],
      exitTicket: {
        items: ["Factor and give the zeros: x² − 3x − 10", "What are the zeros of f(x) = 3(x + 4)(x − 1)?", "A ball's height is h = −5t² + 15t. When does it land?"],
        answers: ["(x − 5)(x + 2); zeros 5 and −2.", "x = −4 and x = 1 (the 3 doesn't change the zeros).", "−5t(t − 3) = 0, so t = 3 seconds."],
      },
    },
    answerKey(lv) {
      return { prompt: "f(" + vOf(lv) + ") = " + (lv.given || pstr(lv)), solution: (lv.given ? "Already factored" : "Factor: " + facText(lv)) + "; set each factor equal to 0" + (lv.final ? "; lands at t = 4" : ""),
        answer: zeroText(lv) };
    },
  });
  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    const left = b.slice();
    return a.every((v) => { const k = left.findIndex((w) => Alg.close(v, w, 1e-9)); if (k < 0) return false; left.splice(k, 1); return true; });
  }
})();
