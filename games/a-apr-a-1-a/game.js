/* Tile Multiplication · AI.A-APR.A.1.a */
(function () {
  const Alg = window.Alg, M = Alg.MINUS;
  const LEVELS = [
    { stage: 1, type: "mul", A: [1, 2], B: [1, 3], tip: "Each cell is a row term times a column term. Fill in every tile, then add like terms." },
    { stage: 1, type: "mul", A: [1, 1], B: [1, 4], tip: "x times x makes a big square tile: x²." },
    { stage: 1, type: "mul", A: [1, 5], B: [1, 2], tip: "The two x tiles in the middle are like terms." },
    { stage: 1, type: "mul", A: [2, 1], B: [1, 3], tip: "Now a 2x side. 2x times x is 2x²." },
    { stage: 2, type: "mul", A: [1, -2], B: [1, 5], tip: "Red means negative. A negative times a positive is negative." },
    { stage: 2, type: "mul", A: [1, -3], B: [1, -4], tip: "What's a negative times a negative?" },
    { stage: 2, type: "add", A: [2, 3, -1], B: [1, -5, 4], tip: "Adding polynomials: combine the x² tiles, the x tiles, and the ones." },
    { stage: 2, type: "sub", A: [4, -1, 6], B: [1, 3, -2], tip: "Subtracting a polynomial means subtracting every term. First flip every sign in the second one." },
    { stage: 3, type: "mul", A: [2, -3], B: [1, 4], tip: "Mix of signs and a 2x term." },
    { stage: 3, type: "mul", A: [3, 2], B: [2, -1], tip: "Both binomials have an x coefficient bigger than 1." },
    { stage: 3, type: "mul", A: [1, 2], B: [1, 3, 1], tip: "A binomial times a trinomial: 6 tiles to fill." },
    { stage: 3, type: "mul", A: [1, -1], B: [1, 1, 1], tip: "Last one. Watch what cancels." },
  ];
  const terms = (p) => p.map((c, i) => ({ coef: c, pow: p.length - 1 - i })).filter((t) => t.coef !== 0);
  const tstr = (t) => Alg.fmtTerm(t.coef, t.pow);
  const pstr = (p) => Alg.fmtPoly(Alg.polyTrim(p));
  const neg = (p) => p.map((c) => -c);
  const result = (lv) => (lv.type === "mul" ? Alg.polyMul(lv.A, lv.B) : lv.type === "add" ? Alg.polyAdd(lv.A, lv.B) : Alg.polyAdd(lv.A, neg(lv.B)));
  const prompt = (lv) => lv.type === "mul" ? "(" + pstr(lv.A) + ")(" + pstr(lv.B) + ")" : "(" + pstr(lv.A) + ") " + (lv.type === "add" ? "+" : M) + " (" + pstr(lv.B) + ")";
  const tileClass = (t) => (t.coef < 0 ? "t-neg" : t.pow === 3 ? "t-x3" : t.pow === 2 ? "t-x2" : t.pow === 1 ? "t-x" : "t-u");

  function coefInputs(api, deg) {
    const row = api.h("div", { class: "coef-row" });
    const inputs = [];
    for (let p = deg; p >= 0; p--) {
      const f = api.h("input", { type: "text", inputmode: "numeric", "aria-label": p === 0 ? "constant term" : "coefficient of x" + (p > 1 ? " to the " + p : "") });
      inputs.push(f);
      row.appendChild(f);
      row.appendChild(api.h("span", { html: p === 0 ? "" : (p === 1 ? "<i>x</i>" : "<i>x</i>" + Alg.sup(p)) + " + " }));
    }
    return { row, inputs };
  }

  GameShell.register({
    slug: "a-apr-a-1-a",
    title: "Tile Multiplication",
    subtitle: "Add, subtract and multiply polynomials with algebra tiles",
    stages: { 1: "Stage 1 · Tile rectangles", 2: "Stage 2 · Negatives, adding and subtracting", 3: "Stage 3 · Bigger products" },
    levels: LEVELS,
    help: {
      intro: "A product like (x + 2)(x + 3) is the area of a rectangle. Each cell is one tile.",
      steps: [
        "Fill each cell with its row term times its column term, like <b>x²</b>, <b>3x</b> or <b>6</b>. Type x² as x^2 or x2.",
        "Press <b>Check tiles</b>. Correct cells turn into colored tiles; red tiles are negative.",
        "Combine like terms: type the coefficients of the answer. Use a minus sign for negatives, and 0 if a term disappears.",
        "Fewer wrong checks means more stars.",
      ],
      note: "Every answer is also checked with x = 10, where polynomials work just like whole numbers.",
    },
    load(lv, api) {
      let mistakes = 0;
      const work = [];
      const res = result(lv);
      const deg = res.length - 1;
      const title = api.h("div", { class: "stage-text" }, prompt(lv));
      api.stage.appendChild(title);
      const area = api.h("div");
      api.stage.appendChild(area);
      api.meta("Fewer wrong checks, more stars");
      let cells = [];

      if (lv.type === "mul") {
        const At = terms(lv.A), Bt = terms(lv.B);
        const table = api.h("table", { class: "area", "aria-label": "Area model" });
        table.appendChild(api.h("tr", null, api.h("th", null, "×"), ...Bt.map((b) => api.h("th", null, tstr(b)))));
        At.forEach((a) => {
          const tr = api.h("tr", null, api.h("th", null, tstr(a)));
          Bt.forEach((b) => {
            const want = { coef: a.coef * b.coef, pow: a.pow + b.pow };
            const inp = api.h("input", { type: "text", "aria-label": tstr(a) + " times " + tstr(b), autocomplete: "off" });
            const td = api.h("td", null, inp);
            cells.push({ a, b, want, inp, td });
            tr.appendChild(td);
          });
          table.appendChild(tr);
        });
        area.appendChild(table);
        phaseCells();
      } else if (lv.type === "sub") {
        phaseNegate();
      } else {
        phaseCombine();
      }

      function phaseCells() {
        api.controls.innerHTML = "";
        const btn = api.button("Check tiles", checkCells, "primary");
        api.controls.append(api.h("span", { class: "preview" }, "Fill every cell, then check."), btn);
        api.autoplay = () => { cells.forEach((c) => (c.inp.value = tstr(c.want).replace(/²/, "^2").replace(/³/, "^3"))); btn.click(); return phaseAuto(); };
        cells[0].inp.focus();
      }
      function checkCells() {
        let firstBad = null;
        cells.forEach((c) => {
          const t = Alg.parseTerm(c.inp.value);
          const ok = t && Alg.close(t.coef, c.want.coef) && t.pow === c.want.pow;
          c.td.classList.toggle("bad", !ok);
          if (!ok && !firstBad) firstBad = c;
        });
        if (firstBad) {
          mistakes++;
          const c = firstBad;
          return api.msg("Check " + tstr(c.a) + " × " + tstr(c.b) + ": multiply the numbers (" + Alg.num(c.a.coef) + " · " + Alg.num(c.b.coef) + " = " + Alg.num(c.want.coef) +
            ") and the x's (add the exponents: " + c.a.pow + " + " + c.b.pow + " = " + c.want.pow + ").", "bad");
        }
        cells.forEach((c) => { c.td.className = tileClass(c.want) + " done"; c.inp.value = tstr(c.want); c.inp.readOnly = true; });
        work.push("Tiles: " + cells.map((c) => tstr(c.want)).join(", "));
        api.log(work, "Your work");
        api.msg("All tiles are right. Now combine like terms.", "good");
        phaseCombine();
      }
      function phaseNegate() {
        api.controls.innerHTML = "";
        area.innerHTML = "";
        const { row, inputs } = coefInputs(api, lv.B.length - 1);
        const lbl = api.h("div", { class: "preview", html: "Subtracting means adding the opposite. Write " + M + "(" + pstr(lv.B) + ") without parentheses:" });
        const btn = api.button("Check", () => {
          const vals = inputs.map((f) => Alg.parseNum(f.value));
          const want = neg(lv.B);
          if (vals.some(Number.isNaN)) return api.msg("Fill every box with a number (use 0 if a term is missing).", "warn");
          if (!vals.every((v, k) => Alg.close(v, want[k]))) {
            mistakes++;
            return api.msg("Every sign flips, including the last term: " + M + "(" + pstr(lv.B) + ") = " + "?", "bad");
          }
          work.push(M + "(" + pstr(lv.B) + ") = " + pstr(want));
          api.log(work, "Your work");
          api.msg("Right: every sign flipped. Now add.", "good");
          phaseCombine(want);
        }, "primary");
        api.controls.append(api.h("div", { style: { width: "100%" } }, lbl, row), btn);
        api.autoplay = () => { neg(lv.B).forEach((v, k) => (inputs[k].value = v)); btn.click(); return phaseAuto(); };
      }
      function phaseCombine(negB) {
        api.controls.innerHTML = "";
        if (lv.type !== "mul") {
          const second = negB || lv.B;
          area.innerHTML = "";
          const t = api.h("table", { class: "area", "aria-label": "Like terms lined up" });
          const header = [];
          for (let p = deg; p >= 0; p--) header.push(api.h("th", null, p === 0 ? "ones" : p === 1 ? "x" : "x" + Alg.sup(p)));
          t.appendChild(api.h("tr", null, api.h("th", null, ""), ...header));
          [lv.A, second].forEach((poly, r) => {
            const tr = api.h("tr", null, api.h("th", null, r === 0 ? "" : "+"));
            poly.forEach((c, i) => {
              const tt = { coef: c, pow: poly.length - 1 - i };
              tr.appendChild(api.h("td", { class: c === 0 ? "" : tileClass(tt) + " done", style: { color: c > 0 && tt.pow === 0 ? "var(--ink)" : "#fff", fontWeight: 800, fontSize: "20px" } }, c === 0 ? "" : tstr(tt)));
            });
            t.appendChild(tr);
          });
          area.appendChild(t);
        }
        const { row, inputs } = coefInputs(api, deg);
        const btn = api.button("Check answer", () => {
          const vals = inputs.map((f) => Alg.parseNum(f.value));
          if (vals.some(Number.isNaN)) return api.msg("Fill every box with a number (use 0 if a term disappears).", "warn");
          const bad = vals.findIndex((v, k) => !Alg.close(v, res[k]));
          if (bad >= 0) {
            mistakes++;
            const p = deg - bad;
            return api.msg("Look at the " + (p === 0 ? "constant terms (ones)" : p === 1 ? "x terms" : "x" + Alg.sup(p) + " terms") + " again. Add their coefficients, keeping track of the signs.", "bad");
          }
          work.push(prompt(lv) + " = " + pstr(res));
          const a10 = Alg.polyEval(lv.A, 10), b10 = Alg.polyEval(lv.B, 10), r10 = Alg.polyEval(res, 10);
          const op = lv.type === "mul" ? " × " : lv.type === "add" ? " + " : " " + M + " ";
          api.win({ answer: pstr(res), lines: work, stars: mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1,
            note: mistakes === 0 ? "No wrong checks. Perfect!" : mistakes + (mistakes === 1 ? " wrong check." : " wrong checks."),
            check: "Check with x = 10: " + Alg.num(a10) + op + Alg.num(b10) + " = " + Alg.num(r10) + ", and your answer gives " + Alg.num(r10) + " ✓" });
        }, "primary");
        api.controls.append(api.h("div", { style: { width: "100%" } }, api.h("div", { class: "preview" }, lv.type === "mul" ? "Combine like terms:" : "Add the like terms:"), row), btn);
        api.autoplay = () => { res.forEach((v, k) => (inputs[k].value = v)); btn.click(); return {}; };
        inputs[0].focus();
      }
      function phaseAuto() { return api.autoplay(); }
    },
    guide: {
      summary: "A 12-level game for adding, subtracting and multiplying polynomials with an area model. Each cell becomes an algebra tile when it's right, and every answer is checked at x = 10 to compare polynomials with whole numbers.",
      also: "<span class='code'>AI.A-APR.A.1.b</span> combining like terms and the distributive property.",
      practices: "MP7 Look for and make use of structure · MP8 Look for and express regularity in repeated reasoning",
      goals: [
        "Multiply binomials and a binomial by a trinomial using an area model.",
        "Add and subtract polynomials by combining like terms, including distributing a negative sign.",
        "Explain how polynomial arithmetic is like integer arithmetic (closure; x = 10 as place value).",
      ],
      howItWorks: "For products, students fill in every cell of an area model (row term × column term); correct cells turn into colored tiles (green x², blue x, yellow ones, red negatives). Then they combine like terms into coefficient boxes. For sums and differences, like terms are lined up in columns; subtraction first asks students to write the opposite of the second polynomial.",
      stageNotes: {
        1: { sees: "Positive binomial products, then a 2x term.", builds: "Area model; x · x = x²; like terms in the middle." },
        2: { sees: "Red negative tiles; addition and subtraction in columns.", builds: "Sign rules; subtracting every term." },
        3: { sees: "Mixed signs, larger coefficients, a trinomial.", builds: "Fluency; cancellation in (x − 1)(x² + x + 1)." },
      },
      discussion: [
        "Why is (x + 2)(x + 3) not x² + 6? Use the tiles to explain.",
        "Level 12 gives x³ − 1. Where did the x² and x terms go?",
        "With x = 10, (x + 2)(x + 3) is 12 × 13. How does the area model match multiplying 12 × 13 by hand?",
      ],
      misconceptions: [
        ["(x + a)(x + b) = x² + ab (forgetting the middle terms)", "Every cell of the area model must be filled before combining."],
        ["x · x = 2x", "The checker explains: multiply the numbers and add the exponents."],
        ["Subtracting only the first term of a polynomial", "Subtraction levels require writing the opposite of every term first."],
        ["Sign errors with negatives", "Negative tiles are red, and the feedback names the sign rule."],
      ],
      exitTicket: {
        items: ["Multiply: (x + 4)(x − 2)", "Subtract: (3x² + 2x − 5) − (x² − 4x + 1)", "Multiply: (2x + 1)(x + 5). Check your answer with x = 10."],
        answers: ["x² + 2x − 8", "2x² + 6x − 6", "2x² + 11x + 5. With x = 10: 21 × 15 = 315 and 200 + 110 + 5 = 315."],
      },
    },
    answerKey(lv) {
      const r = result(lv);
      let sol;
      if (lv.type === "mul") sol = "Tiles: " + terms(lv.A).flatMap((a) => terms(lv.B).map((b) => tstr({ coef: a.coef * b.coef, pow: a.pow + b.pow }))).join(", ") + "; combine like terms";
      else if (lv.type === "sub") sol = "Flip every sign of the second polynomial: " + pstr(neg(lv.B)) + "; then add like terms";
      else sol = "Add like terms";
      return { prompt: prompt(lv), solution: sol, answer: pstr(r) };
    },
  });
})();
