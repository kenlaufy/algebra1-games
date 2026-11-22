/* Resource Planner · AI.A-CED.A.3 */
(function () {
  const Alg = window.Alg, M = Alg.MINUS;
  const REL = { "<=": "≤", ">=": "≥" };
  const C = (a, b, c, rel, what) => ({ a, b, c, rel, what });
  const ok = (con, p) => (con.rel === "<=" ? con.a * p[0] + con.b * p[1] <= con.c + 1e-9 : con.a * p[0] + con.b * p[1] >= con.c - 1e-9);
  const whole = (p) => Number.isInteger(p[0]) && Number.isInteger(p[1]) && p[0] >= 0 && p[1] >= 0;
  const conText = (con, v) => Alg.fmtTerms([{ coef: con.a, body: v[0] }, { coef: con.b, body: v[1] }]) + " " + REL[con.rel] + " " + con.c;
  // step kinds: ["write", i] write constraint i · ["click", prompt, test(p) -> true|msg, answer point] · ["judge", plan, options...] · ["in", prompt, answers]
  const LEVELS = [
    { stage: 1, v: ["a", "k"], units: ["adult tickets", "kid tickets"], r: [12, 12], ctx: "Adult movie tickets cost $5 and kid tickets cost $3. You have $30 to spend.",
      cons: [C(5, 3, 30, "<=", "budget")], steps: [["write", 0], ["click", "Click a plan with 3 adult tickets and as many kid tickets as possible.", (p) => p[0] === 3 && p[1] === 5 ? true : "With a = 3 you've spent $15, so $15 is left for kid tickets at $3 each.", [3, 5]]],
      tip: "Turn the budget into an inequality, then find plans that fit." },
    { stage: 1, v: ["c", "b"], units: ["cookies", "brownies"], r: [20, 14], ctx: "Cookies sell for $2 and brownies for $3. The bake sale needs to raise at least $36.",
      cons: [C(2, 3, 36, ">=", "goal")], steps: [["write", 0], ["judge", [10, 5], "No: 10 cookies and 5 brownies only raise $35", "Yes: it raises enough"],
        ["click", "Click the plan with 6 brownies that sells the fewest cookies.", (p) => p[1] === 6 && p[0] === 9 ? true : "6 brownies raise $18. How many $2 cookies make up the other $18?", [9, 6]]],
      tip: "\"At least\" means ≥." },
    { stage: 1, v: ["p", "v"], units: ["photos", "videos"], r: null, ctx: "Photos use 3 MB and videos use 50 MB. The phone has at most 600 MB free.",
      cons: [C(3, 50, 600, "<=", "storage")], steps: [["write", 0], ["judge", [100, 6], "Yes: 300 + 300 = 600 MB, which is allowed", "No: it's too much"],
        ["judge", [40, 2.5], "No: you can't save half a video", "Yes: 120 + 125 = 245 MB fits"]],
      tip: "A plan can fit the inequality and still not make sense." },
    { stage: 1, v: ["t", "p"], units: ["tomato plants", "pepper plants"], r: [12, 22], ctx: "Each tomato plant needs 4 ft² and each pepper plant needs 2 ft². The garden is 40 ft².",
      cons: [C(4, 2, 40, "<=", "space")], steps: [["write", 0], ["click", "Click the plan with 6 tomato plants and the most peppers.", (p) => p[0] === 6 && p[1] === 8 ? true : "6 tomatoes use 24 ft². How many 2 ft² peppers fit in the rest?", [6, 8]]],
      tip: "Space is a constraint just like money." },
    { stage: 2, v: ["z", "s"], units: ["pizzas", "salads"], r: [10, 14], ctx: "Pizzas cost $12 and salads $6. The budget is at most $72, and you need at least 8 items.",
      cons: [C(12, 6, 72, "<=", "budget"), C(1, 1, 8, ">=", "items")], steps: [["write", 0], ["write", 1],
        ["click", "Click any plan that meets both constraints.", (p) => (whole(p) && ok(C(12, 6, 72, "<="), p) && ok(C(1, 1, 8, ">="), p)) ? true : "That plan breaks a constraint. Look for whole numbers in the region where both shadings overlap.", [4, 4]]],
      tip: "Two constraints. The workable plans are where both regions overlap." },
    { stage: 2, v: ["v", "c"], units: ["vans", "cars"], r: [10, 12], ctx: "Vans seat 8 and cars seat 4. A field trip needs at least 40 seats, and there are at most 7 drivers.",
      cons: [C(8, 4, 40, ">=", "seats"), C(1, 1, 7, "<=", "drivers")], steps: [["write", 0], ["write", 1],
        ["click", "Click any plan that works.", (p) => (whole(p) && ok(C(8, 4, 40, ">="), p) && ok(C(1, 1, 7, "<="), p)) ? true : "Check both: enough seats, and no more vehicles than drivers.", [5, 0]]],
      tip: "Each vehicle needs a driver." },
    { stage: 2, v: ["z", "s"], units: ["pizzas", "salads"], r: [10, 14], ctx: "Same party: 12z + 6s ≤ 72 (budget) and z + s ≥ 8 (items).",
      cons: [C(12, 6, 72, "<=", "budget"), C(1, 1, 8, ">=", "items")], given: true,
      steps: [["judge", [5, 2], "Not viable: only 7 items", "Viable", "Not viable: over budget"], ["judge", [3, 6], "Viable: $72 and 9 items", "Not viable: over budget", "Not viable: too few items"],
        ["judge", [2, 9], "Not viable: $78 is over budget", "Viable", "Not viable: too few items"]],
      tip: "Judge each plan, and say which constraint it breaks." },
    { stage: 2, v: ["v", "c"], units: ["vans", "cars"], r: [10, 12], ctx: "Same trip: 8v + 4c ≥ 40 (seats) and v + c ≤ 7 (drivers).",
      cons: [C(8, 4, 40, ">=", "seats"), C(1, 1, 7, "<=", "drivers")], given: true,
      steps: [["judge", [3, 3], "Not viable: only 36 seats", "Viable", "Not viable: not enough drivers"], ["judge", [4, 4], "Not viable: 8 vehicles but 7 drivers", "Viable: 48 seats", "Not viable: too few seats"],
        ["judge", [4.5, 1], "Not viable: you can't take half a van", "Viable: 40 seats and 5.5 drivers"]],
      tip: "A point inside the region can still be non-viable." },
    { stage: 3, v: ["z", "s"], units: ["pizzas", "salads"], r: [10, 14], ctx: "Party again: 12z + 6s ≤ 72 and z + s ≥ 8. You want as many items as possible.",
      cons: [C(12, 6, 72, "<=", "budget"), C(1, 1, 8, ">=", "items")], given: true, lattice: true,
      steps: [["click", "Click the viable plan with the most items.", (p) => p[0] === 0 && p[1] === 12 ? true : "Salads are cheaper. What if every dollar goes to salads?", [0, 12]], ["in", "That plan has [] items", [12]]],
      tip: "Now find the best plan, not just any plan." },
    { stage: 3, v: ["v", "c"], units: ["vans", "cars"], r: [10, 12], ctx: "Field trip again: 8v + 4c ≥ 40 and v + c ≤ 7. Use as few vehicles as possible.",
      cons: [C(8, 4, 40, ">=", "seats"), C(1, 1, 7, "<=", "drivers")], given: true, lattice: true,
      steps: [["click", "Click the viable plan with the fewest vehicles.", (p) => p[0] === 5 && p[1] === 0 ? true : "Vans carry more people. How many vans give 40 seats?", [5, 0]], ["in", "That plan uses [] vehicles", [5]]],
      tip: "Fewest vehicles means the smallest v + c." },
    { stage: 3, v: ["m", "l"], units: ["muffin trays", "bread loaves"], r: [12, 10], ctx: "A bakery has 10 oven slots (m + l ≤ 10) and 18 cups of flour (m + 3l ≤ 18). Profit is $2 per muffin tray and $5 per loaf.",
      cons: [C(1, 1, 10, "<=", "oven"), C(1, 3, 18, "<=", "flour")], given: true, lattice: true,
      steps: [["click", "Click the viable plan with the most profit (2m + 5l).", (p) => p[0] === 6 && p[1] === 4 ? true : "Check the corners of the region: (10, 0), (6, 4) and (0, 6). Which gives the most profit?", [6, 4]], ["in", "The best profit is $[]", [32]]],
      tip: "The best plan is usually at a corner of the region." },
    { stage: 3, v: ["s", "a"], units: ["student tickets", "adult tickets"], r: null, ctx: "A show has at most 100 seats (s + a ≤ 100) and needs at least $780 (6s + 10a ≥ 780). Student tickets are $6, adult tickets $10.",
      cons: [C(1, 1, 100, "<=", "seats"), C(6, 10, 780, ">=", "revenue")], given: true,
      steps: [["judge", [50, 50], "Viable: $800 with 100 seats", "Not viable: not enough money", "Not viable: too many seats"],
        ["in", "With no student tickets, the fewest adult tickets that reach $780 is []", [78]]],
      tip: "Last one: the numbers are too big to click, so reason it out." },
  ];

  GameShell.register({
    slug: "a-ced-a-3",
    title: "Resource Planner",
    firstMove: "Build the ticket budget. Enter the cost of one adult ticket, the cost of one kid ticket, and the spending limit.",
    subtitle: "Represent constraints with inequalities and find plans that work",
    stages: { 1: "Stage 1 · One constraint", 2: "Stage 2 · Two constraints", 3: "Stage 3 · The best plan" },
    levels: LEVELS,
    help: {
      intro: "Budgets, space and time are <b>constraints</b>. Write each one as an inequality, then find plans that satisfy all of them.",
      steps: [
        "Write each constraint by filling in the coefficients and the limit.",
        "The region of plans that fit is shaded. Where shadings overlap, every constraint is met.",
        "Click a plan on the grid, or judge a plan as viable or not viable.",
        "Real plans need whole numbers: half a van doesn't make sense.",
      ],
      note: "≤ means \"at most\". ≥ means \"at least\".",
    },
    load(lv, api) {
      const P = lv.r ? Plane.create({ xmin: 0, xmax: lv.r[0], ymin: 0, ymax: lv.r[1], xstep: 1, ystep: 1, xtick: lv.r[0] > 12 ? 2 : 1, ytick: lv.r[1] > 12 ? 2 : 1,
        xlabel: lv.v[0] + " (" + lv.units[0] + ")", ylabel: lv.v[1] + " (" + lv.units[1] + ")" }) : null;
      api.stage.appendChild(api.h("div", { class: "preview", style: { textAlign: "center", padding: "8px", fontSize: "18px", color: "var(--ink)" } }, lv.ctx));
      const svg = P ? api.svg("0 0 900 460", "Graph of the constraints") : null;
      if (svg) api.stage.appendChild(svg);
      const known = lv.cons.map(() => !!lv.given);
      let pick = null;
      const colors = ["#5a78b8", "#e7b84a"];
      function draw() {
        if (!svg) return;
        let s = P.grid();
        lv.cons.forEach((con, i) => {
          if (!known[i]) return;
          // shade the allowed side
          s += P.halfplane(con.a, con.b, con.c, con.rel, { fill: colors[i], opacity: 0.2 });
          s += P.boundary(con.a, con.b, con.c, { color: colors[i] === "#e7b84a" ? "#a77d18" : "#3b5591" });
        });
        if (lv.lattice) for (let x = 0; x <= P.xmax; x++) for (let y = 0; y <= P.ymax; y++) {
          if (lv.cons.every((c) => ok(c, [x, y]))) s += '<circle cx="' + P.X(x) + '" cy="' + P.Y(y) + '" r="3.5" fill="#23262d" pointer-events="none"/>';
        }
        if (pick) s += P.point(pick[0], pick[1], { r: 11, label: "(" + pick[0] + ", " + pick[1] + ")" });
        s += P.hitArea();
        svg.innerHTML = s;
      }
      if (svg) svg.addEventListener("click", (e) => { if (!e.target.closest("[data-plane]")) return; const q = P.fromEvent(e, svg, 1, 1); pick = [q.x, q.y]; draw(); });
      draw();
      const steps = lv.steps.map((st) => {
        if (st[0] === "write") {
          const con = lv.cons[st[1]];
          return { type: "input", prompt: "Write the " + con.what + " constraint: []" + lv.v[0] + " + []" + lv.v[1] + " " + REL[con.rel] + " []", answers: [con.a, con.b, con.c],
            accept: (v) => {
              const k = con.a ? v[0] / con.a : v[1] / con.b;
              if (k > 0 && Alg.close(v[0], con.a * k) && Alg.close(v[1], con.b * k) && Alg.close(v[2], con.c * k)) return true;
              return "Match each quantity with its cost or size: each " + lv.units[0].replace(/s$/, "") + " counts " + con.a + ", each " + lv.units[1].replace(/s$/, "") + " counts " + con.b + ". Check the limit too.";
            }, done: conText(con, lv.v) + " (" + con.what + ")", onDone: () => { known[st[1]] = true; draw(); } };
        }
        if (st[0] === "click") return { type: "click", prompt: st[1], button: "Check plan", check: () => (pick ? st[2](pick) : "Click a point on the grid first."),
          autoplay: () => { pick = st[3]; draw(); }, done: "Plan (" + st[3][0] + ", " + st[3][1] + "): " + lv.cons.map((c) => Alg.num(c.a * st[3][0] + c.b * st[3][1]) + " " + REL[c.rel] + " " + c.c).join(", ") };
        if (st[0] === "judge") {
          const plan = st[1];
          return { type: "choice", prompt: "Plan: " + lv.v[0] + " = " + plan[0] + ", " + lv.v[1] + " = " + plan[1] + ". Is it viable?",
            options: st.slice(2).map((lab, k) => ({ label: lab, ok: k === 0, why: "Check it: " + lv.cons.map((c) => Alg.num(c.a * plan[0] + c.b * plan[1]) + " " + REL[c.rel] + " " + c.c + " is " + (ok(c, plan) ? "true" : "false")).join("; ") + (whole(plan) ? "." : ", and it isn't a whole-number plan.") })),
            onEnter: () => { pick = plan; draw(); } };
        }
        return { type: "input", prompt: st[1], answers: st[2] };
      });
      Steps.run(api, { steps, logTitle: "Your plan", result: () => ({ answer: lv.cons.map((c) => conText(c, lv.v)).join("<br>"), check: "Viable plans are whole-number points that satisfy every constraint ✓" }) });
    },
    guide: {
      summary: "A 12-level game about constraints. Students write budget, space and capacity constraints as linear inequalities, see the feasible region shaded, choose viable plans, judge plans as viable or non-viable (including non-whole-number plans), and find the best plan.",
      also: "<span class='code'>AI.A-REI.D.12</span> graphing systems of linear inequalities.",
      practices: "MP4 Model with mathematics · MP2 Reason abstractly and quantitatively",
      evidence: "Ask for two ticket plans that meet the budget. Listen for a total cost, a comparison with the limit, and whole numbers of tickets.",
      goals: [
        "Represent constraints in a context with linear inequalities and systems of inequalities.",
        "Interpret points as viable or non-viable options, including the need for whole-number solutions.",
        "Use the feasible region to find a best option.",
      ],
      howItWorks: "Each level gives a context. Students fill in coefficients and a limit for each constraint; the allowed region is shaded on the grid and the overlap shows plans that meet every constraint. Students click plans on the grid or judge plans from options that name the broken constraint. Stage 3 marks the viable whole-number plans with dots and asks for the best one.",
      stageNotes: {
        1: { sees: "Single constraints: a budget, a fundraising goal, storage, garden space.", builds: "Writing ≤ and ≥ inequalities; reading points." },
        2: { sees: "Two constraints, then judging plans.", builds: "Systems; explaining which constraint a plan breaks; non-whole-number plans." },
        3: { sees: "Viable plans marked as dots; a context too large to click.", builds: "Optimizing over the region; corner points." },
      },
      discussion: [
        "Why is 4.5 vans a non-viable plan even though it satisfies the inequalities?",
        "In the bakery level, why is the best plan at a corner of the region?",
        "How do you decide between ≤ and ≥ from the words in a problem?",
      ],
      misconceptions: [
        ["Writing ≤ for \"at least\"", "The written constraint is checked; feedback names the words."],
        ["Thinking any point in the shaded region is a real plan", "Judge steps include half-vans and half-videos."],
        ["Checking only one constraint", "Judge feedback evaluates every constraint for the plan."],
      ],
      exitTicket: {
        items: ["Notebooks cost $4 and pens $1. You have at most $20. Write an inequality.", "Is buying 3 notebooks and 9 pens viable?", "What's the most notebooks you could buy if you also buy 4 pens?"],
        answers: ["4n + p ≤ 20", "No: 12 + 9 = 21 > 20.", "4 notebooks (16 + 4 = 20)."],
      },
    },
    answerKey(lv) {
      const parts = lv.steps.map((st) => st[0] === "write" ? conText(lv.cons[st[1]], lv.v) : st[0] === "click" ? "click (" + st[3].join(", ") + ")" : st[0] === "judge" ? "(" + st[1].join(", ") + "): " + st[2] : st[1].replace("[]", st[2][0]));
      return { prompt: lv.ctx, solution: parts.join("; "), answer: lv.cons.map((c) => conText(c, lv.v)).join(" and ") };
    },
  });
})();
