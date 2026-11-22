/* Laser Intercept · AI.A-REI.C.7 */
(function () {
  const Alg = window.Alg, M = Alg.MINUS;
  // target: { q: [a, b, c] parabola y = ax² + bx + c } or { circle: r2 }; laser: [m, k] y = m x + k
  const LEVELS = [
    { stage: 1, q: [1, 0, 0], laser: [1, 2], hits: [[-1, 1], [2, 4]], r: [-4, 4, -2, 10], tip: "The target flies along the parabola. Click every point where the laser crosses its path." },
    { stage: 1, q: [1, 0, -4], laser: [2, -1], hits: [[3, 5], [-1, -3]], r: [-4, 5, -5, 8], tip: "Click both crossings." },
    { stage: 1, q: [-1, 0, 6], laser: [1, 0], hits: [[2, 2], [-3, -3]], r: [-5, 4, -5, 8], tip: "This path is upside down." },
    { stage: 1, q: [1, -2, 0], laser: [0, 3], hits: [[3, 3], [-1, 3]], r: [-3, 5, -2, 8], tip: "A flat laser beam." },
    { stage: 2, q: [1, 0, 1], laser: [2, 1], hits: [[0, 1], [2, 5]], r: [-3, 4, -2, 10], alg: [[1, -2, 0]], tip: "Hidden path! Solve with algebra: set the two expressions for y equal." },
    { stage: 2, q: [1, -3, 0], laser: [1, -3], hits: [[1, -2], [3, 0]], r: [-2, 5, -4, 6], alg: [[1, -4, 3]], tip: "Set them equal and move everything to one side." },
    { stage: 2, q: [1, 0, 2], laser: [2, 1], hits: [[1, 3]], r: [-3, 4, -2, 10], alg: [[1, -2, 1]], tip: "How many times does this laser touch the path?" },
    { stage: 2, q: [1, 0, 4], laser: [1, 0], hits: [], r: [-3, 4, -2, 10], alg: [[1, -1, 4]], tip: "Does the laser hit at all?" },
    { stage: 3, q: [1, 0, 0], laser: [2, null], aim: { x: 3, k: 3 }, hits: [[3, 9], [-1, 1]], r: [-3, 5, -2, 12], tip: "Aim the laser y = 2x + b so it hits the target at x = 3. Where else does it cross?" },
    { stage: 3, circle: 25, laser: [1, 1], hits: [[3, 4], [-4, -3]], r: [-7, 7, -6, 6], tip: "A circular path: x² + y² = 25. Substitute the line into the circle." },
    { stage: 3, circle: 10, laser: [3, 0], hits: [[1, 3], [-1, -3]], r: [-5, 5, -5, 5], tip: "Substitute y = 3x into x² + y² = 10." },
    { stage: 3, circle: 3, laser: [-3, 0], hits: [[Math.sqrt(0.3), -3 * Math.sqrt(0.3)], [-Math.sqrt(0.3), 3 * Math.sqrt(0.3)]], approx: true, r: [-3, 3, -3, 3],
      tip: "The example from the standard: y = −3x and x² + y² = 3. Answers to 2 decimal places." },
  ];
  const lineText = (lv) => "y = " + Alg.fmtTerms([{ coef: lv.laser[0], body: "x" }, { coef: lv.laser[1] == null ? 0 : lv.laser[1], body: "" }]).replace(/^0$/, "0") + (lv.laser[1] == null ? " + b" : "");
  const pathText = (lv) => lv.circle ? "x² + y² = " + lv.circle : "y = " + Alg.fmtPoly(lv.q);
  const pt = (p) => "(" + Alg.num(Alg.round(p[0], 2)) + ", " + Alg.num(Alg.round(p[1], 2)) + ")";

  GameShell.register({
    slug: "a-rei-c-7",
    title: "Laser Intercept",
    firstMove: "Tap every place the straight laser meets the curved path, then press Fire. Look on both sides of the curve.",
    subtitle: "Solve a linear–quadratic system with graphs and algebra",
    stages: { 1: "Stage 1 · Read the hits", 2: "Stage 2 · Solve with algebra", 3: "Stage 3 · Aim, and circles" },
    levels: LEVELS,
    help: {
      intro: "A target moves along a curved path; your laser is a straight line. The <b>hits</b> are the solutions of the system.",
      steps: [
        "Stage 1: click every point where the laser crosses the path, then press <b>Fire</b>.",
        "Stage 2: the path is hidden. Set the two expressions for y equal, solve the quadratic, then find y.",
        "A laser can cross twice, touch once, or miss completely.",
        "Stage 3: aim the laser, and solve with circular paths.",
      ],
      note: "Fewer wrong answers means more stars.",
    },
    load(lv, api) {
      let b = lv.laser[1];
      const P = Plane.create({ xmin: lv.r[0], xmax: lv.r[1], ymin: lv.r[2], ymax: lv.r[3], xstep: 1, ystep: 1, ytick: lv.r[3] - lv.r[2] > 12 ? 2 : 1 });
      const head = api.h("div", { class: "stage-text", style: { fontSize: "24px" } });
      const svg = api.svg("0 0 900 460", "Path and laser");
      api.stage.append(head, svg);
      let marks = [], showPath = lv.stage !== 2, showHits = false;
      const f = (x) => lv.q[0] * x * x + lv.q[1] * x + lv.q[2];
      function draw() {
        head.textContent = "Path: " + pathText(lv) + "    Laser: " + (b == null ? lineText(lv) : "y = " + Alg.fmtTerms([{ coef: lv.laser[0], body: "x" }, { coef: b, body: "" }]));
        let s = P.grid();
        if (showPath) {
          if (lv.circle) { const R = Math.sqrt(lv.circle); s += P.curve((x) => Math.sqrt(Math.max(0, lv.circle - x * x)), { from: -R, to: R, color: "#6b8f5e" }) + P.curve((x) => -Math.sqrt(Math.max(0, lv.circle - x * x)), { from: -R, to: R, color: "#6b8f5e" }); }
          else s += P.curve(f, { color: "#6b8f5e" });
        }
        if (b != null) s += P.curve((x) => lv.laser[0] * x + b, { color: "#c8553d", width: 3.5, dash: "14 6" });
        if (showHits) lv.hits.forEach((h) => (s += P.point(h[0], h[1], { fill: "#e7b84a", r: 13, label: pt(h) })));
        marks.forEach((m) => (s += P.point(m[0], m[1], { fill: showHits ? "#3f7d4c" : "#fbe7a8", r: 9 })));
        s += P.hitArea();
        svg.innerHTML = s;
      }
      const selection = api.h("p", { class: "preview", role: "status" });
      function showSelection() {
        selection.textContent = marks.length ? "Marked: " + marks.map(pt).join(", ") : "No points marked.";
      }
      function togglePoint(x, y) {
        if (showHits) return;
        const k = marks.findIndex(m => m[0] === x && m[1] === y);
        if (k >= 0) marks.splice(k, 1); else marks.push([x, y]);
        draw();
        showSelection();
        api.msg("");
      }
      svg.addEventListener("click", (e) => {
        if (!e.target.closest("[data-plane]") || lv.stage !== 1) return;
        const q = P.fromEvent(e, svg, 1, 1);
        togglePoint(q.x, q.y);
      });
      draw();
      const steps = [];
      const same = (a, c) => a.length === c.length && a.every((p) => c.some((q) => Alg.close(p[0], q[0], 1e-6) && Alg.close(p[1], q[1], 1e-6)));
      if (lv.stage === 1) {
        steps.push({ type: "click", button: "Fire", prompt: "Mark every crossing. Select a marked point again to remove it.",
          controls: () => {
            const x = api.number("", { "aria-label": "x coordinate", inputmode: "numeric" });
            const y = api.number("", { "aria-label": "y coordinate", inputmode: "numeric" });
            const mark = () => {
              const a = Alg.parseNum(x.value), b = Alg.parseNum(y.value);
              if (!Number.isInteger(a) || !Number.isInteger(b) || a < P.xmin || a > P.xmax || b < P.ymin || b > P.ymax) {
                api.msg("Enter two whole-number coordinates within the grid.", "warn");
                return;
              }
              togglePoint(a, b);
            };
            [x, y].forEach(field => field.addEventListener("keydown", e => { if (e.key === "Enter") mark(); }));
            showSelection();
            return api.h("div", null, api.h("div", { class: "row" },
              api.h("label", null, "x ", x), api.h("label", null, "y ", y), api.button("Mark or remove point", mark)), selection);
          },
          check: () => {
            if (!marks.length) return "Mark a point on the graph or enter its coordinates first.";
            if (same(marks, lv.hits)) { showHits = true; draw(); return true; }
            const bad = marks.find((m) => !lv.hits.some((h) => h[0] === m[0] && h[1] === m[1]));
            if (bad) return pt(bad) + " isn't on both: the path gives y = " + Alg.num(f(bad[0])) + " and the laser gives y = " + Alg.num(lv.laser[0] * bad[0] + b) + " at x = " + Alg.num(bad[0]) + ".";
            return "There are " + lv.hits.length + " crossings. You've marked " + marks.length + ".";
          }, autoplay: () => { marks = lv.hits.map((h) => h.slice()); }, done: "Hits at " + lv.hits.map(pt).join(" and ") });
      } else if (lv.stage === 2) {
        const qd = lv.alg[0];
        steps.push({ type: "input", prompt: "Set " + pathText(lv).slice(4) + " = " + lineText(lv).slice(4) + " and move everything left: x² + []x + [] = 0", answers: [qd[1], qd[2]],
          hint: "Subtract the laser's expression from both sides.", done: Alg.fmtPoly(qd) + " = 0" });
        const disc = qd[1] * qd[1] - 4 * qd[0] * qd[2];
        steps.push({ type: "choice", prompt: "The discriminant b² − 4ac = " + Alg.num(disc) + ". So the laser…", options: [
          { label: "hits twice", ok: disc > 0, why: disc === 0 ? "A discriminant of 0 means exactly one solution: the laser just touches." : "A negative discriminant means no real solutions." },
          { label: "just touches once", ok: disc === 0, why: disc > 0 ? "Positive discriminant: two real solutions." : "Negative discriminant: no real solutions." },
          { label: "misses completely", ok: disc < 0, why: disc > 0 ? "Positive discriminant: two real solutions." : "Zero means one solution." }],
          onDone: () => { showPath = true; draw(); } });
        if (lv.hits.length === 2) {
          steps.push({ type: "input", prompt: "Solve: x = [] or x = []", answers: lv.hits.map((h) => h[0]), unordered: true, hint: "Factor " + Alg.fmtPoly(qd) + " or use the quadratic formula." });
          steps.push({ type: "input", prompt: "Use the laser to find y: at x = " + Alg.num(lv.hits[0][0]) + ", y = []; at x = " + Alg.num(lv.hits[1][0]) + ", y = []", answers: lv.hits.map((h) => h[1]),
            hint: "Plug each x into " + lineText(lv) + ".", onDone: () => { showHits = true; draw(); } });
        } else if (lv.hits.length === 1) {
          steps.push({ type: "input", prompt: "The touching point: x = [], y = []", answers: lv.hits[0], hint: Alg.fmtPoly(qd) + " is a perfect square.", onDone: () => { showHits = true; draw(); } });
        }
      } else if (lv.aim) {
        steps.push({ type: "input", prompt: "The target is at x = 3, y = 9. Choose b so 2(3) + b = 9: b = []", answers: [3], hint: "Solve 6 + b = 9.", onDone: () => { b = 3; draw(); } });
        steps.push({ type: "input", prompt: "Where else does y = 2x + 3 cross y = x²? x² − 2x − 3 = 0, so the other hit is at x = [], y = []", answers: [-1, 1], hint: "Factor: (x − 3)(x + 1) = 0.", onDone: () => { showHits = true; draw(); } });
      } else {
        const m = lv.laser[0];
        const A2 = 1 + m * m;
        steps.push({ type: "input", prompt: "Substitute y = " + Alg.fmtTerms([{ coef: m, body: "x" }, { coef: lv.laser[1], body: "" }]) + " into x² + y² = " + lv.circle + ". Simplified: []x² + []x + [] = 0",
          answers: [A2, 2 * m * lv.laser[1], lv.laser[1] * lv.laser[1] - lv.circle], hint: "Expand (" + Alg.fmtTerms([{ coef: m, body: "x" }, { coef: lv.laser[1], body: "" }]) + ")², add x², then subtract " + lv.circle + ".",
          accept: (v) => { const k = v[0] / A2; return k !== 0 && Alg.close(v[1], 2 * m * lv.laser[1] * k) && Alg.close(v[2], (lv.laser[1] * lv.laser[1] - lv.circle) * k) ? true : "Expand the square carefully, then collect the x² terms."; } });
        if (lv.approx) {
          steps.push({ type: "input", prompt: "x² = 0.3, so x ≈ [] or x ≈ [] (2 decimal places)", answers: [0.55, -0.55], unordered: true,
            hint: "√0.3 is about 0.548. Round to two decimal places and include the negative root." });
          steps.push({ type: "input", prompt: "Use x = ±√0.3 in y = −3x before rounding. The hits are about (0.55, []) and (−0.55, [])", answers: [-1.64, 1.64],
            hint: "Multiply √0.3 and −√0.3 by −3, then round each result to two decimal places.", onDone: () => { showHits = true; draw(); } });
        } else {
          steps.push({ type: "input", prompt: "Solve for x: x = [] or x = []", answers: lv.hits.map((h) => h[0]), unordered: true, hint: "Divide by the common factor, then factor." });
          steps.push({ type: "input", prompt: "Find y on the laser: hits at (" + Alg.num(lv.hits[0][0]) + ", []) and (" + Alg.num(lv.hits[1][0]) + ", [])", answers: lv.hits.map((h) => h[1]), onDone: () => { showHits = true; draw(); } });
        }
      }
      Steps.run(api, { steps, logTitle: "Your work", result: () => ({ answer: lv.hits.length ? lv.hits.map(pt).join(" and ") : "No intersection: the laser misses",
        check: lv.hits.length ? "Each hit is on the laser and on the path ✓" : "x² − x + 4 = 0 has a negative discriminant, so the line and parabola never meet ✓" }) });
    },
    guide: {
      summary: "A 12-level game for systems with one linear and one quadratic equation. Students read crossings from graphs, solve by setting expressions equal, use the discriminant to predict two, one or zero intersections, aim a line, and solve line–circle systems including the standard's own example.",
      also: "<span class='code'>AI.A-REI.B.4.b</span> solving quadratic equations.",
      practices: "MP5 Use appropriate tools strategically · MP7 Look for and make use of structure",
      evidence: "Ask how many hits a line can make on a parabola. Have the student sketch a crossing, a touch, and a miss and connect each to the number of solutions.",
      goals: [
        "Solve a system of a linear and a quadratic equation graphically and algebraically.",
        "Predict the number of intersections from the discriminant.",
        "Solve a line–circle system by substitution.",
      ],
      howItWorks: "Stage 1 shows the parabola and the laser; students click every crossing. Stage 2 hides the parabola: students set the expressions equal, read the discriminant, solve for x and then y, and the path appears to confirm. Stage 3 asks students to aim the laser through a target, then solves with circles, ending with y = −3x and x² + y² = 3 from the Massachusetts standard.",
      stageNotes: {
        1: { sees: "Parabola and line drawn.", builds: "Intersections as solutions." },
        2: { sees: "Hidden path; two hits, one touch, one miss.", builds: "Setting equal; discriminant; finding y." },
        3: { sees: "Aiming; circles.", builds: "Substitution into x² + y² = r²; decimal approximations." },
      },
      discussion: [
        "Why must a solution of the system lie on both graphs?",
        "What does a discriminant of 0 look like on the graph?",
        "In the circle levels, why do you substitute the line into the circle and not the other way around?",
      ],
      misconceptions: [
        ["Finding x but not y", "Every level with hits asks for both coordinates."],
        ["Every line meets a parabola twice", "Levels 7 and 8."],
        ["Squaring (x + 1) as x² + 1", "Circle-level feedback says to expand the square carefully."],
      ],
      exitTicket: {
        items: ["Solve: y = x² − 1 and y = x + 1", "How many solutions: y = x² + 3 and y = 2x?", "Solve: x² + y² = 20 and y = 2x"],
        answers: ["x² − x − 2 = 0: (2, 3) and (−1, 0)", "x² − 2x + 3 = 0, discriminant −8: none", "5x² = 20: (2, 4) and (−2, −4)"],
      },
    },
    answerKey(lv) {
      return { prompt: pathText(lv) + " and " + lineText(lv), solution: lv.circle ? "Substitute the line into the circle and solve" : lv.aim ? "b = 3; x² − 2x − 3 = 0" : "Set equal: " + (lv.alg ? Alg.fmtPoly(lv.alg[0]) + " = 0" : "read the crossings"),
        answer: lv.hits.length ? lv.hits.map(pt).join(", ") : "no intersection" };
    },
  });
})();
