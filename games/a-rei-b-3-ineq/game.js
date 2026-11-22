/* Seesaw · AI.A-REI.B.3 (inequalities) */
(function () {
  const A = window.Cartoon, Alg = window.Alg, M = Alg.MINUS;
  const FLIP = { "<": ">", ">": "<", "≤": "≥", "≥": "≤" };

  // sol: moves at par. Move = [op, n, unit] with op in + - * /
  const LEVELS = [
    { stage: 1, L: { x: 1, c: 3 }, R: { x: 0, c: 7 }, rel: "<", ans: ["<", 4], par: 1, sol: [["-", 3, "c"]],
      tip: "The seesaw shows which side is lighter. Get the box alone, then graph every number that works." },
    { stage: 1, L: { x: 1, c: -2 }, R: { x: 0, c: 5 }, rel: "≥", ans: ["≥", 7], par: 1, sol: [["+", 2, "c"]],
      tip: "≥ means \"greater than or equal to\". Adding or subtracting never changes the sign." },
    { stage: 1, L: { x: 2, c: 0 }, R: { x: 0, c: 10 }, rel: ">", ans: [">", 5], par: 1, sol: [["/", 2]],
      tip: "When you multiply or divide, you decide: does the sign stay the same, or flip?" },
    { stage: 1, L: { x: 3, c: 1 }, R: { x: 0, c: 13 }, rel: "≤", ans: ["≤", 4], par: 2, sol: [["-", 1, "c"], ["/", 3]],
      tip: "Two moves. Undo the adding before the multiplying." },
    { stage: 2, L: { x: -1, c: 0 }, R: { x: 0, c: 4 }, rel: "<", ans: [">", -4], par: 1, sol: [["/", -1]],
      tip: "A negative box. Divide by a negative number, and think hard about the sign." },
    { stage: 2, L: { x: -2, c: 0 }, R: { x: 0, c: 6 }, rel: "≥", ans: ["≤", -3], par: 1, sol: [["/", -2]],
      tip: "Test a number before you trust a sign." },
    { stage: 2, L: { x: -3, c: 2 }, R: { x: 0, c: 14 }, rel: ">", ans: ["<", -4], par: 2, sol: [["-", 2, "c"], ["/", -3]],
      tip: "Subtract first, then divide by the negative." },
    { stage: 2, L: { x: -1, c: 5 }, R: { x: 0, c: 2 }, rel: "≤", ans: ["≥", 3], par: 2, sol: [["-", 5, "c"], ["/", -1]],
      tip: "5 − x is the same as −x + 5." },
    { stage: 3, L: { x: 4, c: -3 }, R: { x: 1, c: 9 }, rel: ">", ans: [">", 4], par: 3, sol: [["-", 1, "x"], ["+", 3, "c"], ["/", 3]],
      tip: "Symbols only now. Get the x terms together first." },
    { stage: 3, L: { x: 2, c: 5 }, R: { x: 5, c: -7 }, rel: "≤", ans: ["≥", 4], par: 3, sol: [["-", 2, "x"], ["+", 7, "c"], ["/", 3]],
      tip: "If x ends up on the right, read the answer carefully when you graph it." },
    { stage: 3, L: { x: -1, c: 6 }, R: { x: 2, c: -3 }, rel: ">", ans: ["<", 3], par: 3, sol: [["+", 1, "x"], ["+", 3, "c"], ["/", 3]],
      tip: "Can you avoid dividing by a negative at all?" },
    { stage: 3, L: { x: -2, c: 7 }, R: { x: 1, c: -8 }, rel: "≥", ans: ["≤", 5], par: 3, sol: [["+", 2, "x"], ["+", 8, "c"], ["/", 3]],
      tip: "Last one. Two good paths: one flips the sign, one doesn't." },
  ];

  const copy = (s) => ({ x: s.x, c: s.c });
  const fmt = (L, R, rel) => Alg.fmtLin(L) + " " + rel + " " + Alg.fmtLin(R);
  const cmp = (a, b, rel) => (rel === "<" ? a < b : rel === ">" ? a > b : rel === "≤" ? a <= b : a >= b);
  const holds = (L, R, rel, x) => cmp(L.x * x + L.c, R.x * x + R.c, rel);
  const moveText = (m) => m[0] === "/" ? "÷ " + Alg.paren(m[1]) : m[0] === "*" ? "× " + Alg.paren(m[1])
    : (m[0] === "+" ? "+ " : M + " ") + (m[2] === "x" ? (m[1] === 1 ? "x" : m[1] + "x") : m[1]);
  const ansText = (a) => "x " + a[0] + " " + Alg.num(a[1]);

  function apply(L, R, m) {
    const [op, n, unit] = m;
    if (op === "/") {
      if (L.x % n || L.c % n || R.x % n || R.c % n) return "You can't divide " + Alg.fmtLin(L) + " and " + Alg.fmtLin(R) + " evenly by " + Alg.num(n) + ".";
      [L, R].forEach((s) => { s.x = s.x / n || 0; s.c = s.c / n || 0; });
    } else if (op === "*") {
      [L, R].forEach((s) => { s.x *= n; s.c *= n; });
    } else {
      const d = op === "+" ? n : -n;
      L[unit] += d; R[unit] += d;
    }
    return null;
  }

  GameShell.register({
    slug: "a-rei-b-3-ineq",
    title: "Seesaw",
    firstMove: "Get the box alone, then graph its solutions. Choose a move and apply it to both sides of the seesaw.",
    subtitle: "Solve linear inequalities and graph the answer",
    stages: { 1: "Stage 1 · Seesaw basics", 2: "Stage 2 · Flip or keep?", 3: "Stage 3 · Symbols only" },
    levels: LEVELS,
    help: {
      intro: "The seesaw is tipped: one side is lighter. Get the box <b>alone</b>, then graph every number that makes it true.",
      steps: [
        "Build a move: <b>+</b>, <b>−</b>, <b>×</b> or <b>÷</b>, a number, and <b>1</b> or <b><i>x</i></b>. It applies to both sides.",
        "After every <b>×</b> or <b>÷</b>, decide: does the inequality sign <b>stay</b> or <b>flip</b>?",
        "When <i>x</i> is alone, graph the answer: click the endpoint, choose an open or closed circle, and pick a direction.",
        "Solve in as few moves as you can to earn 3 stars.",
      ],
      note: "Red tiles are negative. If you're not sure about a sign, test a number in the inequality.",
    },

    load(lv, api) {
      const s = { L: copy(lv.L), R: copy(lv.R), rel: lv.rel, steps: 0, hist: [], log: [{ text: fmt(lv.L, lv.R, lv.rel), move: "Start" }],
        phase: "solve", pending: null, graph: { at: null, closed: null, dir: null } };
      const svg = api.svg("0 0 900 330", "Seesaw");
      const eq = api.h("div", { class: "stage-text" });
      const line = api.svg("0 0 900 120", "Number line");
      line.classList.add("hidden");
      api.stage.append(svg, eq, line);

      // controls
      let op = "-", unit = "c";
      const opSeg = api.seg([{ value: "+", label: "+", aria: "Add" }, { value: "-", label: M, aria: "Subtract" },
        { value: "*", label: "×", aria: "Multiply" }, { value: "/", label: "÷", aria: "Divide" }], op, (v) => { op = v; refresh(); }, "Operation");
      const amount = api.number(1, { "aria-label": "Amount" });
      const unitSeg = api.seg([{ value: "c", label: "1", aria: "Ones" }, { value: "x", label: "x", cls: "var", aria: "x" }], unit, (v) => { unit = v; refresh(); }, "Ones or x");
      const preview = api.h("span", { class: "preview", "aria-live": "polite" });
      const applyBtn = api.button("Apply to both sides", onApply, "primary");
      const undoBtn = api.button("Undo", onUndo);
      const keepBtn = api.button("", () => chooseSign(false), "primary");
      const flipBtn = api.button("", () => chooseSign(true), "primary");
      const signAsk = api.h("span", { class: "preview" }, "Does the sign stay or flip?");
      const circleSeg = api.seg([{ value: false, label: "○ open", aria: "Open circle" }, { value: true, label: "● closed", aria: "Closed circle" }], null,
        (v) => { s.graph.closed = v; draw(); }, "Circle");
      const dirSeg = api.seg([{ value: -1, label: "← left", aria: "Shade left" }, { value: 1, label: "right →", aria: "Shade right" }], null,
        (v) => { s.graph.dir = v; draw(); }, "Direction");
      const checkBtn = api.button("Check graph", checkGraph, "primary");
      const endpoint = api.h("select", { "aria-label": "Endpoint", on: { change: () => {
        s.graph.at = endpoint.value === "" ? null : Number(endpoint.value);
        draw();
      } } }, api.h("option", { value: "" }, "Choose endpoint"));
      for (let v = -10; v <= 10; v++) endpoint.appendChild(api.h("option", { value: v }, Alg.num(v)));
      const graphAsk = api.h("span", { class: "preview" }, "Set the endpoint, circle and direction.");
      const solveRow = [opSeg.el, amount, unitSeg.el, preview, applyBtn, undoBtn];
      const signRow = [signAsk, keepBtn, flipBtn];
      const graphRow = [graphAsk, endpoint, circleSeg.el, dirSeg.el, checkBtn];
      api.controls.append(...solveRow, ...signRow, ...graphRow);
      amount.addEventListener("input", refresh);
      svg.addEventListener("click", () => {});
      line.addEventListener("click", (e) => {
        const t = e.target.closest("[data-v]");
        if (!t || s.phase !== "graph") return;
        s.graph.at = Number(t.getAttribute("data-v"));
        draw();
      });

      function readMove() {
        const n = Number(amount.value);
        if (n === 0 && op === "*") return { err: "Multiplying both sides by zero would erase their order. Choose a nonzero multiplier." };
        if (n === 0 && op === "/") return { err: "You cannot divide by zero. Choose a nonzero divisor." };
        if (!Number.isInteger(n) || n === 0) return { err: "Choose a nonzero whole number so your move changes the seesaw." };
        if ((op === "/" || op === "*") && n === 1) return { err: (op === "/" ? "Dividing" : "Multiplying") + " by 1 doesn't change anything." };
        if ((op === "+" || op === "-") && n < 0) return { err: "Use a positive amount. The + and − buttons choose the direction." };
        return { m: [op, n, unit] };
      }
      function refresh() {

        const r = readMove();
        preview.innerHTML = r.err ? "" : "Move: <b>" + moveText(r.m) + "</b> on both sides";
        const show = (els, on) => els.forEach((e) => e.classList.toggle("hidden", !on));
        show(solveRow, s.phase === "solve" && !s.pending);
        show(signRow, s.phase === "solve" && !!s.pending);
        show(graphRow, s.phase === "graph");
        unitSeg.el.classList.toggle("hidden", s.phase !== "solve" || !!s.pending || op === "*" || op === "/");
        if (s.pending) {
          keepBtn.textContent = "Keep " + s.rel;
          flipBtn.textContent = "Flip to " + FLIP[s.rel];
        }
        undoBtn.disabled = !s.hist.length;
        api.meta("Par: " + lv.par + (lv.par === 1 ? " move" : " moves") + " · Moves so far: " + s.steps);
        draw();
      }

      function onApply() {
        const r = readMove();
        if (r.err) return api.msg(r.err, "bad");
        const L = copy(s.L), R = copy(s.R);
        const err = apply(L, R, r.m);
        if (err) return api.msg(err + " Try a different move.", "bad");
        if (r.m[0] === "*" || r.m[0] === "/") {
          s.pending = { m: r.m, L, R };
          api.msg("You " + (r.m[0] === "*" ? "multiplied" : "divided") + " both sides by " + Alg.num(r.m[1]) + ". Does " + s.rel + " stay the same, or flip?", "warn");
          refresh();
          keepBtn.focus();
          return;
        }
        commit(r.m, L, R, s.rel);
      }

      function chooseSign(flip) {
        const p = s.pending;
        const negative = p.m[1] < 0;
        if (flip !== negative) {
          // find a test value that is true before the move but false after the wrong choice
          const wrongRel = flip ? FLIP[s.rel] : s.rel;
          let t = null;
          for (let v = 0; v <= 30 && t === null; v++) for (const c of [v, -v]) {
            if (holds(s.L, s.R, s.rel, c) && !holds(p.L, p.R, wrongRel, c)) { t = c; break; }
          }
          const before = fmt(s.L, s.R, s.rel), after = fmt(p.L, p.R, wrongRel);
          const ev = (S, x) => Alg.num(S.x * x + S.c);
          api.msg("Test x = " + Alg.num(t) + ". Before: " + before + " gives " + ev(s.L, t) + " " + s.rel + " " + ev(s.R, t) + ", true. After: " + after +
            " gives " + ev(p.L, t) + " " + wrongRel + " " + ev(p.R, t) + ", false! " + (negative ? "Multiplying or dividing by a negative reverses the order, so the sign must flip."
              : "Multiplying or dividing by a positive keeps the order, so the sign stays."), "bad");
          return;
        }
        const rel = flip ? FLIP[s.rel] : s.rel;
        s.pending = null;
        commit(p.m, p.L, p.R, rel, flip);
      }

      function commit(m, L, R, rel, flipped) {
        s.hist.push({ L: copy(s.L), R: copy(s.R), rel: s.rel, log: s.log.length });
        s.L = L; s.R = R; s.rel = rel; s.steps++;
        s.log.push({ move: moveText(m) + " on both sides" + (flipped ? ", flip the sign" : ""), text: fmt(L, R, rel) });
        const xl = s.L.x === 1 && s.L.c === 0 && s.R.x === 0, xr = s.R.x === 1 && s.R.c === 0 && s.L.x === 0;
        const nl = (s.L.x === -1 && s.L.c === 0 && s.R.x === 0) || (s.R.x === -1 && s.R.c === 0 && s.L.x === 0);
        if (xl || xr) {
          s.phase = "graph";
          api.msg("x is alone: " + fmt(s.L, s.R, s.rel) + ". Now graph every number that works.", "good");
        } else if (nl) api.msg("Almost! You have " + M + "x, not x. What move turns it into x, and what happens to the sign?", "warn");
        else api.msg(flipped ? "Right: dividing or multiplying by a negative flips the sign." : "Move " + s.steps + " done.", flipped ? "good" : "");
        api.log(s.log);
        refresh();
      }

      function onUndo() {
        const prev = s.hist.pop();
        if (!prev) return;
        s.L = prev.L; s.R = prev.R; s.rel = prev.rel; s.steps--; s.log.length = prev.log;
        s.phase = "solve"; s.pending = null;
        api.msg("Undid your last move.");
        api.log(s.log.length > 1 ? s.log : null);
        refresh();
      }

      function checkGraph() {
        const g = s.graph;
        if (g.at === null || g.closed === null || g.dir === null) return api.msg("Pick the endpoint, the circle, and the direction first.", "warn");
        const [rel, k] = lv.ans;
        const wantClosed = rel === "≤" || rel === "≥";
        const wantDir = rel === ">" || rel === "≥" ? 1 : -1;
        if (g.at !== k) return api.msg("Check the endpoint. Read your last line: " + fmt(s.L, s.R, s.rel) + ".", "bad");
        if (g.closed !== wantClosed) return api.msg(wantClosed ? "Is x = " + Alg.num(k) + " itself a solution? With " + rel + " it is, so the circle should be closed."
          : "Is x = " + Alg.num(k) + " itself a solution? With " + rel + " it isn't, so the circle should be open.", "bad");
        if (g.dir !== wantDir) {
          const t = k + g.dir * 2;
          return api.msg("Test x = " + Alg.num(t) + " from your shaded side: it doesn't make " + fmt(lv.L, lv.R, lv.rel) + " true. Shade the other way.", "bad");
        }
        const t = k + wantDir * 1;
        const ev = (S) => Alg.num(S.x * t + S.c);
        s.phase = "done";
        refresh();
        api.win({ answer: ansText(lv.ans), lines: s.log, steps: s.steps, par: lv.par,
          check: "Test x = " + Alg.num(t) + ": " + ev(lv.L) + " " + lv.rel + " " + ev(lv.R) + " ✓" });
      }

      function draw() {
        const st = lv.stage;
        // seesaw tilt: left side down when left is "bigger"
        const big = s.rel === ">" || s.rel === "≥";
        const ang = (big ? -1 : 1) * 9;
        const cx = 450, py = 232;
        const mood = s.phase === "graph" || s.phase === "done" ? "joy" : s.pending ? "think" : "ok";
        let scene = A.backdrop(900, 330, { ground: 292 });
        scene += '<path d="M 450 236 L 400 292 L 500 292 Z" fill="#a47b52" ' + A.OUT + "/>";
        scene += '<g transform="rotate(' + ang + " " + cx + " " + py + ')">';
        scene += '<rect x="90" y="' + (py - 8) + '" width="720" height="16" rx="7" fill="#b98b5e" ' + A.OUT + "/>";
        if (st < 3) {
          scene += A.stack(A.sideTiles(s.L, { mystery: st === 1 }), 250, py - 10, 280);
          scene += A.stack(A.sideTiles(s.R, { mystery: st === 1 }), 650, py - 10, 280);
        } else {
          scene += A.card(160, py - 70, 180, 54) + A.text(250, py - 34, Alg.fmtLin(s.L), { size: 26, var: false });
          scene += A.card(560, py - 70, 180, 54) + A.text(650, py - 34, Alg.fmtLin(s.R), { size: 26, var: false });
        }
        scene += "</g>";
        scene += '<circle cx="450" cy="' + (py - 4) + '" r="26" fill="#fffdf7" ' + A.OUT + "/>" + A.text(450, py + 6, s.rel, { size: 30, var: false });
        scene += A.mascot(840, 300, mood, 0.8);
        svg.innerHTML = scene;
        svg.setAttribute("aria-label", "Seesaw. " + fmt(s.L, s.R, s.rel));
        eq.innerHTML = st === 1 && s.phase === "solve" ? "" : fmt(s.L, s.R, s.rel);
        eq.classList.toggle("hidden", st === 1 && s.phase === "solve");
        // number line
        line.classList.toggle("hidden", s.phase === "solve");
        if (s.phase !== "solve") {
          endpoint.value = s.graph.at === null ? "" : String(s.graph.at);
          const X = (v) => 60 + (v + 10) * 39;
          let nl = '<rect width="900" height="120" fill="#fffdf7"/>';
          nl += '<line x1="30" y1="60" x2="870" y2="60" stroke="' + A.INK + '" stroke-width="3"/>';
          nl += '<path d="M 870 60 l -12 -7 v 14 z M 30 60 l 12 -7 v 14 z" fill="' + A.INK + '"/>';
          const g = s.graph;
          if (g.at !== null && g.dir !== null) {
            const x0 = X(g.at), x1 = g.dir > 0 ? 862 : 38;
            nl += '<line x1="' + x0 + '" y1="60" x2="' + x1 + '" y2="60" stroke="#5a78b8" stroke-width="9" stroke-linecap="round"/>';
          }
          for (let v = -10; v <= 10; v++) {
            nl += '<line x1="' + X(v) + '" y1="50" x2="' + X(v) + '" y2="70" stroke="' + A.INK + '" stroke-width="2"/>';
            nl += A.text(X(v), 98, Alg.num(v), { size: 15, var: false });
            nl += '<rect class="hit" data-v="' + v + '" x="' + (X(v) - 19) + '" y="20" width="38" height="90" fill="transparent"><title>' + Alg.num(v) + "</title></rect>";
          }
          if (g.at !== null) {
            nl += '<circle cx="' + X(g.at) + '" cy="60" r="11" fill="' + (g.closed ? "#5a78b8" : "#fff") + '" stroke="' + A.INK + '" stroke-width="3" pointer-events="none"/>';
          }
          line.innerHTML = nl;
        }
      }

      api.msg("Build a move, then press Apply to both sides.");
      refresh();

      api.autoplay = () => {
        lv.sol.forEach((m) => {
          opSeg.buttons.find((b) => b._v === m[0]).click();
          amount.value = m[1];
          if (m[2]) unitSeg.buttons.find((b) => b._v === m[2]).click();
          refresh();
          applyBtn.click();
          if (s.pending) (m[1] < 0 ? flipBtn : keepBtn).click();
        });
        endpoint.value = String(lv.ans[1]);
        endpoint.dispatchEvent(new Event("change"));
        circleSeg.buttons.find((b) => b._v === (lv.ans[0] === "≤" || lv.ans[0] === "≥")).click();
        dirSeg.buttons.find((b) => b._v === (lv.ans[0] === ">" || lv.ans[0] === "≥" ? 1 : -1)).click();
        checkBtn.click();
        return { steps: s.steps, par: lv.par };
      };
    },

    guide: {
      evidence: "Ask the student to test a number inside the shaded ray and one outside it in the original inequality. Their checks should justify the direction and endpoint.",
      summary: "A 12-level game for solving linear inequalities. Students isolate x on a seesaw, decide whether the sign stays or flips after every × or ÷, and graph the solution on a number line.",
      scope: "This game covers linear inequalities; equations are covered by Balance Workshop.",
      also: "<span class='code'>AI.A-REI.A.1</span> justifying each step, through the sign check and test values.",
      practices: "MP3 Construct viable arguments · MP6 Attend to precision · MP7 Look for and make use of structure",
      goals: [
        "Solve linear inequalities in one variable, including with variables on both sides.",
        "Explain why multiplying or dividing by a negative number reverses the inequality sign, using a test value.",
        "Graph a solution set on a number line with the correct circle and direction, including when x ends up on the right side.",
      ],
      howItWorks: "Students build moves that apply to both sides. After every × or ÷ move, the game stops and asks whether the sign stays or flips; a wrong choice is refuted with a concrete test value. When x is alone, students graph the solution: endpoint, open or closed circle, and direction.",
      stageNotes: {
        1: { sees: "Mystery boxes on a tilted seesaw; the inequality is hidden until x is alone.", builds: "One- and two-step inequalities; ≤ and ≥ versus < and >." },
        2: { sees: "Algebra tiles, red negatives, and the live inequality.", builds: "When and why the sign flips." },
        3: { sees: "Symbols only.", builds: "Variables on both sides; choosing a path that avoids or uses a flip." },
      },
      discussion: [
        "Why does dividing by −2 flip the sign but dividing by 2 doesn't? Use a pair of numbers like 3 < 5 to explain.",
        "On level 10, x ends up on the right: 4 ≤ x. How do you graph that?",
        "Level 11 can be solved with or without dividing by a negative. Which path do you prefer, and why do both give the same answer?",
        "How does the circle (open or closed) connect to the symbol (< or ≤)?",
      ],
      misconceptions: [
        ["Never flipping the sign", "After ÷ or × by a negative, choosing \"keep\" is rejected with a test value that was true before the move and false after it."],
        ["Flipping the sign for any division", "Choosing \"flip\" after dividing by a positive is rejected the same way."],
        ["Reading 4 ≤ x as \"x ≤ 4\"", "The graph check tests a point from the shaded side against the original inequality."],
        ["Open and closed circles mixed up", "The game asks whether the endpoint itself is a solution."],
      ],
      exitTicket: {
        items: ["Solve and graph: <span class='math'>3x − 4 &lt; 11</span>", "Solve and graph: <span class='math'>−2x + 1 ≥ 9</span>",
          "Jordan solved <span class='math'>−5x &gt; 20</span> and got <span class='math'>x &gt; −4</span>. Use a test value to show the mistake, then fix it."],
        answers: ["x < 5: open circle at 5, shade left.", "x ≤ −4: subtract 1 (−2x ≥ 8), divide by −2 and flip. Closed circle at −4, shade left.",
          "Test x = 0 (which satisfies x > −4): −5(0) = 0 > 20 is false. Dividing by −5 flips the sign, so x < −4."],
      },
    },
    answerKey(lv) {
      let L = copy(lv.L), R = copy(lv.R), rel = lv.rel;
      const parts = lv.sol.map((m) => {
        apply(L, R, m);
        if ((m[0] === "/" || m[0] === "*") && m[1] < 0) rel = FLIP[rel];
        return moveText(m) + ((m[0] === "/" || m[0] === "*") && m[1] < 0 ? " (flip)" : "");
      });
      const ans = lv.ans;
      return { prompt: fmt(lv.L, lv.R, lv.rel), solution: parts.join(", ") + "; graph " + (ans[0] === "≤" || ans[0] === "≥" ? "closed" : "open") +
        " circle at " + Alg.num(ans[1]) + ", shade " + (ans[0] === ">" || ans[0] === "≥" ? "right" : "left"), answer: ansText(ans) };
    },
  });
})();
