/* Meeting Point · AI.A-REI.D.11 */
(function () {
  const Alg = window.Alg, M = Alg.MINUS;
  // f, g with display text; range [a, b] for the first table; exact: integer solution; root: true crossing (for approximations)
  const LEVELS = [
    { stage: 1, ft: "2x + 1", gt: "x + 4", f: (x) => 2 * x + 1, g: (x) => x + 4, a: 0, b: 6, exact: 3, tip: "Two runners, two routes. Find the x where they're at the same height: f(x) = g(x)." },
    { stage: 1, ft: "3x " + M + " 2", gt: M + "x + 10", f: (x) => 3 * x - 2, g: (x) => -x + 10, a: 0, b: 6, exact: 3, tip: "Look down the table for equal values." },
    { stage: 1, ft: "0.5x + 3", gt: "2x " + M + " 3", f: (x) => 0.5 * x + 3, g: (x) => 2 * x - 3, a: 0, b: 6, exact: 4, tip: "Which one is ahead at first? When do they meet?" },
    { stage: 1, ft: M + "2x + 7", gt: "x " + M + " 2", f: (x) => -2 * x + 7, g: (x) => x - 2, a: 0, b: 6, exact: 3, tip: "Same idea: find the meeting point in the table." },
    { stage: 2, ft: "2ˣ", gt: "x + 4", f: (x) => Math.pow(2, x), g: (x) => x + 4, a: 0, b: 5, root: 2.75621530, tip: "Exponential vs. linear: no algebra trick solves 2ˣ = x + 4. Use the table and zoom in." },
    { stage: 2, ft: "3ˣ", gt: "2x + 4", f: (x) => Math.pow(3, x), g: (x) => 2 * x + 4, a: 0, b: 4, root: 1.86047109, tip: "Find where the bigger one switches, then zoom in." },
    { stage: 2, ft: "100(0.5)ˣ", gt: "10x", f: (x) => 100 * Math.pow(0.5, x), g: (x) => 10 * x, a: 0, b: 5, root: 2.19060122, tip: "A decaying exponential meets a growing line." },
    { stage: 2, ft: "1.5ˣ", gt: "x + 1", f: (x) => Math.pow(1.5, x), g: (x) => x + 1, a: 1, b: 6, root: 3.93917646, tip: "This exponential grows slowly at first." },
    { stage: 3, concept: true, tip: "Why does the crossing point solve the equation?" },
    { stage: 3, ft: "2ˣ", gt: M + "x + 5", f: (x) => Math.pow(2, x), g: (x) => -x + 5, a: 0, b: 4, root: 1.71562073, graphFirst: true, tip: "Now with the graph too. The table confirms what the graph suggests." },
    { stage: 3, ft: "2ˣ", gt: "x + 2", f: (x) => Math.pow(2, x), g: (x) => x + 2, a: -4, b: 1, root: -1.69009307, note: "One solution is x = 2 exactly. Find the other one.", tip: "Equations like this can have two solutions." },
    { stage: 3, ft: "800(0.8)ᵗ", gt: "600 " + M + " 50t", f: (x) => 800 * Math.pow(0.8, x), g: (x) => 600 - 50 * x, a: 0, b: 5, root: 2.19414301, ctx: "Phone A is worth V = 800(0.8)ᵗ dollars after t years; phone B is worth V = 600 − 50t. When are they worth the same?",
      v: "t", tip: "Last one: a real question with the same method." },
  ];
  const round = (v, d) => Alg.round(v, d == null ? 2 : d);
  const fmt = (v) => Alg.num(round(v, 2));

  GameShell.register({
    slug: "a-rei-d-11",
    title: "Meeting Point",
    firstMove: "Scan the table for a row where the two outputs match. Select that row and check your choice.",
    subtitle: "Solve f(x) = g(x) with tables and graphs",
    stages: { 1: "Stage 1 · Meet in the table", 2: "Stage 2 · Zoom in", 3: "Stage 3 · Graphs and meaning" },
    levels: LEVELS,
    help: {
      intro: "Where the graphs of y = f(x) and y = g(x) meet, f(x) and g(x) are equal. That x is a <b>solution of f(x) = g(x)</b>.",
      steps: [
        "Stage 1: click the row where f(x) = g(x).",
        "Stages 2–3: click the row where the bigger function switches (the crossing is between that row and the next).",
        "The table zooms in to tenths. Click the row closest to the crossing.",
        "The graph shows where your answer lands. Fewer wrong clicks means more stars.",
      ],
      note: "The \"bigger\" column shows which function is ahead at each x.",
    },
    load(lv, api) {
      if (lv.concept) {
        api.stage.appendChild(api.h("div", { class: "stage-text", style: { fontSize: "24px" } }, "y = f(x) and y = g(x) cross at the point (a, b)."));
        Steps.run(api, { steps: [
          { type: "choice", prompt: "At the crossing point (a, b), which statement is true?", options: [
            { label: "f(a) = b and g(a) = b", ok: true }, { label: "f(b) = a and g(b) = a", why: "The point is (x, y) = (a, b): the input is a." }, { label: "f(a) = 0", why: "The graphs meet each other, not necessarily the x-axis." }] },
          { type: "choice", prompt: "So what can you say about f(a) and g(a)?", options: [
            { label: "f(a) = g(a), so x = a solves f(x) = g(x)", ok: true }, { label: "f(a) + g(a) = 0", why: "Both equal b, so they're equal to each other." }, { label: "Nothing: the graphs just look close", why: "At a crossing the point lies on both graphs, so both outputs are exactly b." }] },
          { type: "choice", prompt: "2ˣ = x + 4 has no algebra method from this course. How can you still solve it?", options: [
            { label: "Graph y = 2ˣ and y = x + 4, or make a table, and find where they meet", ok: true }, { label: "Subtract x from both sides to get 2 = 4", why: "2ˣ − x is not 2: the x is an exponent on one side." }, { label: "It can't be solved", why: "It has solutions; we can find them as closely as we like with tables or technology." }] },
        ], logTitle: "Your reasoning", result: () => ({ answer: "The x-coordinate of a crossing solves f(x) = g(x)", check: "On both graphs, the same input gives the same output ✓" }) });
        return;
      }
      const v = lv.v || "x";
      if (lv.ctx) api.stage.appendChild(api.h("div", { class: "preview", style: { textAlign: "center", padding: "8px", fontSize: "18px", color: "var(--ink)" } }, lv.ctx));
      api.stage.appendChild(api.h("div", { class: "stage-text", style: { fontSize: "24px" } }, "f(" + v + ") = " + lv.ft + "    g(" + v + ") = " + lv.gt));
      if (lv.note) api.stage.appendChild(api.h("div", { class: "preview", style: { textAlign: "center" } }, lv.note));
      const ys = []; for (let x = lv.a; x <= lv.b; x += 0.05) ys.push(lv.f(x), lv.g(x));
      const lo = Math.min(...ys), hi = Math.max(...ys);
      const pad = (hi - lo) * 0.1 + 1;
      const P = Plane.create({ xmin: lv.a - 0.5, xmax: lv.b + 0.5, ymin: Math.floor(lo - pad), ymax: Math.ceil(hi + pad), h: 300, xstep: 1, ystep: Math.max(1, Math.ceil((hi - lo) / 10)), xlabel: v });
      const svg = api.svg("0 0 900 300", "Graphs of f and g");
      const tableWrap = api.h("div", { style: { overflowX: "auto" } });
      api.stage.append(svg, tableWrap);
      let showGraph = !!lv.graphFirst, chosen = null, rows = [], sel = null;
      function draw() {
        let s = P.grid();
        if (showGraph) { s += P.curve(lv.f, { color: "#5a78b8" }); s += P.curve(lv.g, { color: "#c8553d" }); }
        if (chosen != null) { s += P.seg(chosen, P.ymin, chosen, P.ymax, { dash: "6 5", width: 2 }); s += P.point(chosen, lv.f(chosen), { r: 8, label: v + " ≈ " + fmt(chosen) }); }
        svg.innerHTML = s;
        svg.classList.toggle("hidden", !showGraph);
      }
      function table(a, b, stp) {
        rows = [];
        for (let x = a; x <= b + 1e-9; x += stp) rows.push(round(x, 4));
        const t = api.h("table", { class: "area", style: { borderSpacing: "4px" }, "aria-label": "Table of values" });
        t.appendChild(api.h("tr", null, api.h("th", null, v), api.h("th", null, "f(" + v + ")"), api.h("th", null, "g(" + v + ")"), api.h("th", null, "bigger")));
        rows.forEach((x, i) => {
          const fx = lv.f(x), gx = lv.g(x);
          const big = Math.abs(fx - gx) < 1e-9 ? "equal" : fx > gx ? "f" : "g";
          const btn = api.h("button", { "aria-pressed": String(sel === i), class: "choice" + (sel === i ? " sel" : ""), style: { minHeight: "44px", padding: "4px 10px", textAlign: "center" },
            on: { click: () => { sel = i; table(a, b, stp); } } }, Alg.num(x));
          t.appendChild(api.h("tr", null, api.h("td", { style: { height: "auto", padding: "2px", border: 0, background: "transparent" } }, btn),
            api.h("td", { style: { height: "auto" } }, fmt(fx)), api.h("td", { style: { height: "auto" } }, fmt(gx)),
            api.h("td", { style: { height: "auto", fontWeight: 800, color: big === "f" ? "#5a78b8" : big === "g" ? "#c8553d" : "#3f7d4c" } }, big)));
        });
        tableWrap.innerHTML = "";
        tableWrap.appendChild(t);
      }
      draw();
      const steps = [];
      if (lv.exact != null) {
        steps.push({ type: "click", button: "Check", prompt: "Click the " + v + " where f(" + v + ") = g(" + v + ").", onEnter: () => table(lv.a, lv.b, 1),
          check: () => { if (sel == null) return "Click a row first."; const x = rows[sel]; if (x === lv.exact) { chosen = x; showGraph = true; draw(); return true; } return "At " + v + " = " + x + ", f = " + fmt(lv.f(x)) + " and g = " + fmt(lv.g(x)) + ". Not equal yet."; },
          autoplay: () => { sel = rows.indexOf(lv.exact); }, done: "f(" + lv.exact + ") = g(" + lv.exact + ") = " + fmt(lv.f(lv.exact)) });
      } else {
        const lo1 = Math.floor(lv.root), hi1 = lo1 + 1;
        const nearestTenth = round(lv.root, 1);
        steps.push({ type: "click", button: "Zoom in", prompt: "Click the row just before the bigger function switches.", onEnter: () => { sel = null; table(lv.a, lv.b, 1); },
          check: () => { if (sel == null) return "Click a row first."; const x = rows[sel]; if (x === lo1) return true; const s1 = Math.sign(lv.f(x) - lv.g(x)), s2 = Math.sign(lv.f(x + 1) - lv.g(x + 1));
            return s1 === s2 ? "From " + v + " = " + x + " to " + (x + 1) + ", the same function stays bigger, so they don't cross there." : "Look again at which function is bigger."; },
          autoplay: () => { sel = rows.indexOf(lo1); }, done: "The crossing is between " + lo1 + " and " + hi1 });
        steps.push({ type: "click", button: "Check", prompt: "Zoomed in to tenths. Click the " + v + " closest to the crossing.", onEnter: () => { sel = null; table(lo1, hi1, 0.1); },
          check: () => { if (sel == null) return "Click a row first."; const x = rows[sel];
            if (x === nearestTenth) { chosen = x; showGraph = true; draw(); return true; }
            return "At " + v + " = " + Alg.num(x) + ", f and g are " + fmt(Math.abs(lv.f(x) - lv.g(x))) + " apart. Find where the bigger one switches."; },
          autoplay: () => { sel = rows.indexOf(nearestTenth); }, done: "f(" + v + ") = g(" + v + ") at " + v + " ≈ " + Alg.num(Alg.round(lv.root, 1)) });
      }
      Steps.run(api, { steps, logTitle: "Your work", result: () => ({ answer: lv.exact != null ? v + " = " + lv.exact : v + " ≈ " + Alg.num(Alg.round(lv.root, 1)),
        check: lv.exact != null ? "f(" + lv.exact + ") = " + fmt(lv.f(lv.exact)) + " = g(" + lv.exact + ") ✓" : "At your estimate, " + v + " = " + Alg.num(chosen) + ", the outputs are about " + fmt(lv.f(chosen)) + " and " + fmt(lv.g(chosen)) + ". The exact crossing lies between table rows." }) });
    },
    guide: {
      summary: "A 12-level game for solving f(x) = g(x) with tables and graphs, including linear-versus-exponential equations that algebra can't solve directly. Students find where the larger function switches, zoom the table to tenths, and connect the crossing point to the equation.",
      also: "<span class='code'>AI.F-LE.A.3</span> exponential growth eventually exceeding linear growth.",
      practices: "MP5 Use appropriate tools strategically · MP3 Construct viable arguments",
      evidence: "Ask what the matching row tells you. Listen for the input that solves the equation and the common output that locates the crossing.",
      goals: [
        "Explain why the x-coordinate of an intersection of y = f(x) and y = g(x) solves f(x) = g(x).",
        "Find exact solutions from a table when they are whole numbers.",
        "Approximate solutions of equations with linear and exponential functions to the nearest tenth by zooming a table.",
      ],
      howItWorks: "Each level gives f and g. A table lists f(x), g(x) and which is bigger. In stage 1 students click the row where they're equal. In stages 2 and 3 students click the row where the bigger function is about to switch, the table zooms to tenths, and they click the row closest to the crossing. The graph then appears with the chosen x marked.",
      stageNotes: {
        1: { sees: "Two linear functions; integer solutions.", builds: "Reading equality from a table." },
        2: { sees: "Exponential vs. linear.", builds: "Sign change of f − g; zooming in." },
        3: { sees: "A why-question, graphs, a second solution, and a context.", builds: "Justification; multiple solutions; interpretation." },
      },
      discussion: [
        "How does the \"bigger\" column tell you a crossing is coming?",
        "Why can't you solve 2ˣ = x + 4 by doing the same thing to both sides?",
        "In the phone-value level, what does t ≈ 2.2 mean?",
      ],
      misconceptions: [
        ["Choosing the row where f and g are both largest", "Feedback reports the values at the chosen row."],
        ["Thinking a crossing must happen at a whole number", "Stages 2–3 zoom into tenths."],
        ["Swapping input and output at the intersection", "The concept level addresses f(a) = b."],
      ],
      exitTicket: {
        items: ["f(x) = 4x − 3 and g(x) = 2x + 5. Where do their graphs meet?", "Between which two whole numbers is the solution of 2ˣ = 3x?", "Explain why the x-coordinate of the meeting point solves f(x) = g(x)."],
        answers: ["x = 4 (both equal 13).", "Between 3 and 4 (2³ = 8 < 9, 2⁴ = 16 > 12); there's also one between 0 and 1.", "At the meeting point both graphs have the same y for that x, so f(x) = g(x) there."],
      },
    },
    answerKey(lv) {
      if (lv.concept) return { prompt: "Meaning of an intersection", solution: "At (a, b), f(a) = b = g(a), so a solves f(x) = g(x)", answer: "x = a" };
      const v = lv.v || "x";
      return { prompt: "f(" + v + ") = " + lv.ft + ", g(" + v + ") = " + lv.gt, solution: lv.exact != null ? "Table row where f = g" : "Switch between " + Math.floor(lv.root) + " and " + (Math.floor(lv.root) + 1) + "; zoom to tenths",
        answer: lv.exact != null ? v + " = " + lv.exact : v + " ≈ " + Alg.num(Alg.round(lv.root, 1)) };
    },
  });
})();
