/* Drone Route · AI.A-CED.A.2 */
(function () {
  const A = window.Cartoon, Alg = window.Alg, M = Alg.MINUS;
  // form: lin (y = m x + b), std (a x + b y = c), exp (y = a·b^x), quad (y = x² + k x)
  const LEVELS = [
    { stage: 1, form: "lin", v: ["x", "y"], pts: [[0, 1], [1, 3], [2, 5]], r: [-1, 6, -2, 14, 1, 2], ans: [2, 1], tip: "Write an equation whose graph passes through every checkpoint. Then fly!" },
    { stage: 1, form: "lin", v: ["x", "y"], pts: [[0, -2], [2, 2], [4, 6]], r: [-1, 6, -4, 8, 1, 1], ans: [2, -2], tip: "Where does the route cross the y-axis? How steep is it?" },
    { stage: 1, form: "lin", v: ["x", "y"], pts: [[0, 5], [2, 4], [4, 3]], r: [-1, 8, -1, 7, 1, 1], ans: [-0.5, 5], tip: "A gentle downhill. The slope can be a fraction or decimal." },
    { stage: 1, form: "lin", v: ["x", "y"], pts: [[-2, 7], [0, 3], [3, -3]], r: [-4, 5, -5, 9, 1, 1], ans: [-2, 3], tip: "Checkpoints on both sides of the y-axis." },
    { stage: 2, form: "lin", v: ["d", "C"], units: ["miles", "dollars"], context: "A taxi charges $3 plus $2 per mile. C is the cost for a ride of d miles.",
      pts: [[1, 5], [4, 11], [8, 19]], scale: { y: [1, 5, 50] }, ans: [2, 3], tip: "Real situations need labels and a sensible scale. Pick the y-axis scale first." },
    { stage: 2, form: "lin", v: ["t", "C"], units: ["texts", "dollars"], context: "A phone plan costs $20 per month plus $0.10 per text. C is the monthly cost for t texts.",
      pts: [[100, 30], [300, 50], [500, 70]], scale: { x: [10, 50, 100], y: [1, 10, 100] }, ans: [0.1, 20], tip: "Both axes need a scale this time." },
    { stage: 2, form: "lin", v: ["t", "h"], units: ["hours", "cm"], context: "A candle is 24 cm tall and burns 3 cm every hour. h is its height after t hours.",
      pts: [[2, 18], [5, 9], [8, 0]], scale: { y: [1, 3, 10] }, ans: [-3, 24], tip: "The height goes down. What does that do to the slope?" },
    { stage: 2, form: "lin", v: ["w", "S"], units: ["weeks", "dollars"], context: "You start with $50 and save $15 every week. S is your savings after w weeks.",
      pts: [[2, 80], [6, 140], [10, 200]], scale: { y: [10, 25, 100] }, ans: [15, 50], tip: "Pick the scale that fits all the checkpoints and still spreads them out." },
    { stage: 3, form: "std", v: ["x", "y"], units: ["pencils", "pens"], context: "Pencils cost $2 and pens cost $3. You spend exactly $12 on x pencils and y pens.",
      pts: [[0, 4], [3, 2], [6, 0]], r: [0, 8, 0, 6, 1, 1], ans: [2, 3, 12], tip: "Two quantities that share a budget: write it as ax + by = c." },
    { stage: 3, form: "exp", v: ["x", "y"], units: ["hours", "bacteria"], context: "A dish starts with 3 bacteria and the number doubles every hour.",
      pts: [[0, 3], [1, 6], [3, 24]], r: [0, 5, 0, 60, 1, 10], ans: [3, 2], tip: "Doubling isn't adding. Use the form y = a · b^x." },
    { stage: 3, form: "quad", v: ["w", "A"], units: ["width (m)", "area (m²)"], context: "A rectangle's length is 2 m more than its width w. A is its area.",
      pts: [[1, 3], [2, 8], [4, 24]], r: [0, 6, 0, 40, 1, 5], ans: [2], tip: "Area = width × length = w(w + 2). Multiply it out." },
    { stage: 3, form: "std", v: ["l", "w"], units: ["length (m)", "width (m)"], context: "A rectangle has a perimeter of 20 m. l is its length and w its width.",
      pts: [[2, 8], [5, 5], [8, 2]], r: [0, 11, 0, 11, 1, 1], ans: [2, 2, 20], tip: "Last one: perimeter means adding all four sides." },
  ];
  const tmpl = (lv) => {
    const [x, y] = lv.v;
    return lv.form === "lin" ? y + " = []" + x + " + []" : lv.form === "std" ? "[]" + x + " + []" + y + " = []" : lv.form === "exp" ? y + " = [] · []<sup>" + x + "</sup>" : y + " = " + x + "² + []" + x;
  };
  function fnOf(lv, v) {
    if (lv.form === "lin") return (x) => v[0] * x + v[1];
    if (lv.form === "exp") return (x) => v[0] * Math.pow(v[1], x);
    if (lv.form === "quad") return (x) => x * x + v[0] * x;
    return v[1] !== 0 ? (x) => (v[2] - v[0] * x) / v[1] : null;
  }
  const hits = (lv, v, pt) => lv.form === "std" ? Alg.close(v[0] * pt[0] + v[1] * pt[1], v[2], 1e-6) : Alg.close(fnOf(lv, v)(pt[0]), pt[1], 1e-6);
  function eqText(lv, v) {
    const [x, y] = lv.v;
    if (lv.form === "lin") return y + " = " + Alg.fmtTerms([{ coef: v[0], body: x }, { coef: v[1], body: "" }]);
    if (lv.form === "std") return Alg.fmtTerms([{ coef: v[0], body: x }, { coef: v[1], body: y }]) + " = " + Alg.num(v[2]);
    if (lv.form === "exp") return y + " = " + Alg.num(v[0]) + " · " + Alg.num(v[1]) + "^" + x;
    return y + " = " + Alg.fmtTerms([{ coef: 1, body: x + "²" }, { coef: v[0], body: x }]);
  }
  const best = (opts, max) => opts.find((o) => o * 10 >= max - 1e-9);

  function drone(X, Y) {
    return '<g transform="translate(' + X + " " + Y + ')" pointer-events="none">' +
      '<line x1="-26" y1="-12" x2="26" y2="-12" stroke="#23262d" stroke-width="3"/>' +
      '<ellipse cx="-26" cy="-14" rx="12" ry="3" fill="#c3d9ea" stroke="#23262d" stroke-width="2"/><ellipse cx="26" cy="-14" rx="12" ry="3" fill="#c3d9ea" stroke="#23262d" stroke-width="2"/>' +
      '<rect x="-16" y="-10" width="32" height="18" rx="8" fill="#e7b84a" stroke="#23262d" stroke-width="3"/><circle cx="0" cy="-1" r="4" fill="#23262d"/></g>';
  }

  GameShell.register({
    slug: "a-ced-a-2",
    title: "Drone Route",
    subtitle: "Create equations in two variables and graph them with labels and scales",
    stages: { 1: "Stage 1 · Lines through checkpoints", 2: "Stage 2 · Real situations, real scales", 3: "Stage 3 · Other kinds of equations" },
    levels: LEVELS,
    help: {
      intro: "The drone flies along the graph of your equation. Make it pass through <b>every checkpoint</b>.",
      steps: [
        "In stage 2, first choose axis scales so every checkpoint fits on the screen without being squished.",
        "Fill in the equation. Use decimals or fractions if you need them.",
        "Press <b>Fly!</b> Checkpoints turn green when the drone hits them.",
        "Fewer missed flights and wrong scales means more stars.",
      ],
      note: "Equations can be lines, but also ax + by = c, exponentials y = a · bˣ, and quadratics.",
    },
    load(lv, api) {
      let mistakes = 0, sx = lv.r ? lv.r[4] : 1, sy = lv.r ? lv.r[5] : 1;
      const needX = lv.scale && lv.scale.x, needY = lv.scale && lv.scale.y;
      let phase = needX ? "sx" : needY ? "sy" : "eq";
      if (lv.scale) { sx = needX ? null : 1; sy = needY ? null : 1; }
      if (lv.context) api.stage.appendChild(api.h("div", { class: "preview", style: { textAlign: "center", padding: "8px 8px 0", fontSize: "18px", color: "var(--ink)" } }, lv.context));
      const svg = api.svg("0 0 900 460", "Graph with checkpoints");
      api.stage.appendChild(svg);
      let flown = null, t = 0;
      const vals = () => lv.ans;
      function plane() {
        if (lv.r) return Plane.create({ xmin: lv.r[0], xmax: lv.r[1], ymin: lv.r[2], ymax: lv.r[3], xstep: lv.r[4], ystep: lv.r[5], xlabel: lab(0), ylabel: lab(1) });
        const X = sx || (needX ? lv.scale.x[lv.scale.x.length - 1] : 1), Y = sy || lv.scale.y[lv.scale.y.length - 1];
        return Plane.create({ xmin: 0, xmax: X * 10, ymin: 0, ymax: Y * 10, xstep: X, ystep: Y, xtick: X * 2, ytick: Y * 2, xlabel: lab(0), ylabel: lab(1) });
      }
      function lab(i) { return lv.v[i] + (lv.units ? " (" + lv.units[i] + ")" : ""); }
      function draw() {
        const P = plane();
        let s = P.grid();
        if (flown) {
          const f = fnOf(lv, flown);
          if (f) {
            s += P.curve(f, { upto: t });
            const xe = P.xmin + (P.xmax - P.xmin) * t;
            const ye = f(xe);
            if (Number.isFinite(ye)) s += drone(P.X(xe), Math.max(P.box.T + 10, Math.min(P.box.B - 4, P.Y(ye))));
          } else s += P.seg(flown[2] / flown[0], P.ymin, flown[2] / flown[0], P.ymax, { color: "#5a78b8", width: 4.5 });
        }
        lv.pts.forEach((pt) => {
          const ok = flown && t >= 1 && hits(lv, flown, pt);
          const off = pt[0] > P.xmax || pt[1] > P.ymax;
          if (!off) s += P.point(pt[0], pt[1], { fill: flown && t >= 1 ? (ok ? "#3f7d4c" : "#c8553d") : "#e7b84a", r: 11, label: "(" + Alg.num(pt[0]) + ", " + Alg.num(pt[1]) + ")" });
        });
        svg.innerHTML = s;
      }
      function controls() {
        api.controls.innerHTML = "";
        if (phase === "sx" || phase === "sy") {
          const axis = phase === "sx" ? "x" : "y";
          const opts = lv.scale[axis];
          const seg = api.seg(opts.map((o) => ({ value: o, label: String(o) })), null, (v) => pickScale(axis, v), axis + "-axis scale");
          api.controls.append(api.h("span", { class: "preview", html: "Each " + axis + "-axis grid line is worth:" }), seg.el,
            api.h("span", { class: "preview" }, lv.units ? lv.units[axis === "x" ? 0 : 1] : ""));
          api.autoplay = () => { seg.buttons.find((b) => b._v === best(opts, Math.max(...lv.pts.map((p) => p[axis === "x" ? 0 : 1])))).click(); return api.autoplay(); };
          return;
        }
        const row = api.h("div", { class: "coef-row", style: { margin: 0, textAlign: "left" } });
        const parts = tmpl(lv).split("[]");
        const inputs = [];
        parts.forEach((p, k) => {
          row.appendChild(api.h("span", { html: p.replace(/\b([a-zA-Z])\b/g, "<i>$1</i>") }));
          if (k < parts.length - 1) { const f = api.h("input", { type: "text", inputmode: "decimal", "aria-label": "Box " + (k + 1) }); inputs.push(f); row.appendChild(f); }
        });
        const fly = api.button("Fly!", () => onFly(inputs), "primary");
        inputs.forEach((f) => f.addEventListener("keydown", (e) => { if (e.key === "Enter") fly.click(); }));
        api.controls.append(row, fly);
        api.autoplay = () => { inputs.forEach((f, k) => (f.value = vals()[k])); fly.click(); return {}; };
      }
      function pickScale(axis, v) {
        const coord = axis === "x" ? 0 : 1;
        const max = Math.max(...lv.pts.map((p) => p[coord]));
        const right = best(lv.scale[axis], max);
        if (axis === "x") sx = v; else sy = v;
        draw();
        if (v * 10 < max) { mistakes++; return api.msg("With " + v + " per grid line the " + axis + "-axis only reaches " + v * 10 + ", so a checkpoint is off the screen. Try a bigger scale.", "bad"); }
        if (v !== right) { mistakes++; return api.msg("Everything fits, but the checkpoints are squeezed into a corner. Pick a scale that spreads them across the screen.", "warn"); }
        api.msg("Good scale: every checkpoint fits and they're spread out.", "good");
        phase = phase === "sx" && needY ? "sy" : "eq";
        controls();
        if (phase === "eq") api.msg("Now write the equation for " + lv.v[1] + " in terms of " + lv.v[0] + ".", "good");
      }
      function onFly(inputs) {
        const v = inputs.map((f) => Alg.parseNum(f.value));
        if (v.some(Number.isNaN)) return api.msg("Fill every box with a number (decimals and fractions like 1/2 are fine).", "warn");
        if (lv.form === "std" && v[0] === 0 && v[1] === 0) return api.msg("At least one coefficient must be nonzero.", "warn");
        flown = v; t = 0;
        api.tween(0, 1, 1200, (u) => { t = u; draw(); }, () => {
          const missed = lv.pts.filter((pt) => !hits(lv, v, pt));
          if (missed.length) {
            mistakes++;
            const pt = missed[0];
            const f = fnOf(lv, v);
            const got = lv.form === "std" ? Alg.num(Alg.round(v[0] * pt[0] + v[1] * pt[1], 4)) + " (it should be " + Alg.num(v[2]) + ")"
              : Alg.num(Alg.round(f(pt[0]), 4));
            api.msg("Missed (" + Alg.num(pt[0]) + ", " + Alg.num(pt[1]) + "): when " + lv.v[0] + " = " + Alg.num(pt[0]) + ", your equation gives " +
              (lv.form === "std" ? "a left side of " : lv.v[1] + " = ") + got + ".", "bad");
            return;
          }
          api.win({ answer: eqText(lv, v), stars: mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1,
            note: mistakes === 0 ? "Every checkpoint on the first try!" : mistakes + (mistakes === 1 ? " miss" : " misses") + " along the way.",
            lines: [(lv.scale ? "Scales: " + (needX ? sx + " per grid line on the x-axis, " : "") + (needY ? sy + " per grid line on the y-axis" : "") : "Route: " + eqText(lv, v)), "Equation: " + eqText(lv, v)],
            check: "Checkpoints: " + lv.pts.map((p) => "(" + Alg.num(p[0]) + ", " + Alg.num(p[1]) + ")").join(", ") + " all satisfy " + eqText(lv, v) + " ✓" });
        });
      }
      api.meta("Fewer misses, more stars");
      api.msg(phase === "eq" ? "Fill in the equation, then press Fly!" : "First, choose a scale for the axes.");
      draw();
      controls();
    },
    guide: {
      summary: "A 12-level game for creating equations in two variables. Students write the equation of a drone's route through checkpoints, choose axis scales and labels for real situations, and work with standard-form, exponential and quadratic equations.",
      also: "<span class='code'>AI.N-Q.A.1</span> choosing and interpreting the scale in graphs.",
      practices: "MP4 Model with mathematics · MP6 Attend to precision",
      goals: [
        "Create an equation in two variables from points or from a verbal description.",
        "Choose axis scales that fit the data and label axes with quantities and units.",
        "Represent relationships with lines (slope-intercept and standard form), an exponential, and a quadratic.",
      ],
      howItWorks: "Each level shows checkpoints on a coordinate grid. Students fill in an equation template and press Fly; the drone follows the graph and each checkpoint turns green or red, with feedback about the first miss. In stage 2 students first choose the value of each grid line from three options: too small hides checkpoints, too big squeezes them.",
      stageNotes: {
        1: { sees: "Checkpoints on a plain grid; y = mx + b.", builds: "Slope and intercept from points." },
        2: { sees: "Taxi, phone plan, candle and savings contexts with units.", builds: "Writing equations from words; choosing scales and labels." },
        3: { sees: "A shared budget, doubling bacteria, rectangle area and perimeter.", builds: "Standard form, exponential and quadratic models." },
      },
      discussion: [
        "In the phone-plan level, why does the x-axis need a scale of 50 texts per grid line?",
        "How does the equation for the candle show that it burns down?",
        "Why is 2x + 3y = 12 a better way to write the pencil-and-pen budget than y = −(2/3)x + 4? Is it the same line?",
      ],
      misconceptions: [
        ["Swapping slope and intercept", "The flight misses and the feedback shows the computed value at a checkpoint."],
        ["Using an additive model for doubling", "The exponential level's checkpoints can't be hit by a line."],
        ["Choosing scales that hide or squash data", "Scale choices get specific feedback."],
      ],
      exitTicket: {
        items: ["A gym charges $25 to join plus $10 per month. Write an equation for the cost C after m months.", "Tickets cost $4 for kids (k) and $7 for adults (a). Write an equation for spending exactly $56.", "What y-axis scale would you choose to graph C for m = 0 to 12?"],
        answers: ["C = 10m + 25", "4k + 7a = 56", "C reaches 145, so about 20 dollars per grid line (10 lines reach 200)."],
      },
    },
    answerKey(lv) {
      const sc = lv.scale ? "Scale: " + Object.keys(lv.scale).map((ax) => ax + " = " + best(lv.scale[ax], Math.max(...lv.pts.map((p) => p[ax === "x" ? 0 : 1]))) + " per grid line").join(", ") + "; " : "";
      return { prompt: (lv.context || "Through " + lv.pts.map((p) => "(" + Alg.num(p[0]) + ", " + Alg.num(p[1]) + ")").join(", ")), solution: sc + "write " + eqText(lv, lv.ans), answer: eqText(lv, lv.ans) };
    },
  });
})();
