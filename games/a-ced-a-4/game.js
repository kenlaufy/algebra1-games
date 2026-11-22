/* Letter Balance · AI.A-CED.A.4 */
(function () {
  const A = window.Cartoon, Alg = window.Alg, M = Alg.MINUS;

  // ---------- tiny symbolic engine: sides are (sum of monomials) / monomial ----------
  // monomial: { n, d, v: [letters in display order] }
  const key = (m) => m.v.slice().sort().join("");
  function mono(n, d, v) { const g = Alg.gcd(n, d); let N = n / g, D = d / g; if (D < 0) { N = -N; D = -D; } return { n: N, d: D, v: v || [] }; }
  function parseMono(s) {
    s = s.replace(/−/g, "-");
    let sign = 1;
    if (s[0] === "-") { sign = -1; s = s.slice(1); }
    let n = 1, d = 1;
    const m = /^(\d+\.\d+|\d+|½)/.exec(s);
    if (m) {
      if (m[1] === "½") { n = 1; d = 2; }
      else if (m[1].includes(".")) { const dec = m[1].split(".")[1].length; d = Math.pow(10, dec); n = Math.round(Number(m[1]) * d); }
      else n = Number(m[1]);
      s = s.slice(m[1].length);
    }
    return mono(sign * n, d, s.split("").filter(Boolean));
  }
  const mul = (a, b) => mono(a.n * b.n, a.d * b.d, a.v.concat(b.v));
  function divides(b, a) { // can a be divided by b (variables)?
    const left = a.v.slice();
    for (const x of b.v) { const k = left.indexOf(x); if (k < 0) return false; left.splice(k, 1); }
    return true;
  }
  function div(a, b) {
    const left = a.v.slice();
    b.v.forEach((x) => left.splice(left.indexOf(x), 1));
    return mono(a.n * b.d, a.d * b.n, left);
  }
  const ONE = mono(1, 1, []);
  const isOne = (m) => m.n === 1 && m.d === 1 && !m.v.length;
  function addTerm(terms, t) {
    const out = terms.map((x) => Object.assign({}, x));
    const k = out.findIndex((x) => key(x) === key(t));
    if (k < 0) out.push(t);
    else {
      const s = mono(out[k].n * t.d + t.n * out[k].d, out[k].d * t.d, out[k].v);
      if (s.n === 0) out.splice(k, 1); else out[k] = s;
    }
    return out;
  }
  function sideAdd(side, t) { return { terms: addTerm(side.terms, isOne(side.den) ? t : mul(t, side.den)), den: side.den }; }
  function sideMul(side, f) {
    if (divides(f, side.den)) {
      const q = div(side.den, f);
      if (Number.isInteger(q.n / q.d) || q.v.length) {
        // fold any leftover numeric part of the denominator into the coefficients if it divides
        return { terms: side.terms, den: q };
      }
    }
    return { terms: side.terms.map((t) => mul(t, f)), den: side.den };
  }
  function sideDiv(side, f) {
    const can = side.terms.every((t) => divides(f, t));
    if (can) {
      const q = side.terms.map((t) => div(t, f));
      const intOk = f.v.length || q.every((t) => t.d === 1);
      if (intOk) return { terms: q, den: side.den };
    }
    return { terms: side.terms, den: mul(side.den, f) };
  }
  function normalize(side) { // denominator of exactly a number 1
    if (!side.den.v.length && side.den.n === side.den.d) return { terms: side.terms, den: ONE };
    return side;
  }

  // ---------- formatting ----------
  function coefStr(n, d) {
    if (d === 1) return String(n);
    if (n === 1 && d === 2) return "½";
    let t = d; while (t % 2 === 0) t /= 2; while (t % 5 === 0) t /= 5;
    if (t === 1) return String(Alg.round(n / d, 6));
    return n + "/" + d;
  }
  function monoStr(m) {
    const a = Math.abs(m.n);
    const c = coefStr(a, m.d);
    return (m.v.length && a === m.d ? "" : c) + m.v.join("");
  }
  function numStr(terms) {
    if (!terms.length) return "0";
    return terms.map((t, i) => (i === 0 ? (t.n < 0 ? M : "") : t.n < 0 ? " " + M + " " : " + ") + monoStr(t)).join("");
  }
  function sideText(side) {
    const top = numStr(side.terms);
    if (isOne(side.den)) return top;
    const denS = monoStr(side.den);
    const wrapT = side.terms.length > 1 ? "(" + top + ")" : top;
    const wrapD = denS.length > 1 ? "(" + denS + ")" : denS;
    return wrapT + "/" + wrapD;
  }
  function sideHTML(side) {
    const top = numStr(side.terms).replace(/([A-Za-zπ])/g, "<i>$1</i>");
    if (isOne(side.den)) return top;
    return Alg.fractionHTML(top, monoStr(side.den).replace(/([A-Za-zπ])/g, "<i>$1</i>"));
  }
  const parseSide = (arr) => ({ terms: arr.map(parseMono), den: ONE });
  const hasVar = (side, T) => side.terms.some((t) => t.v.includes(T)) || side.den.v.includes(T);
  const isAlone = (side, T) => isOne(side.den) && side.terms.length === 1 && side.terms[0].n === 1 && side.terms[0].d === 1 &&
    side.terms[0].v.length === 1 && side.terms[0].v[0] === T;

  const LEVELS = [
    { stage: 1, name: "Ohm's law V = IR with V = 12, R = 4", L: ["12"], R: ["4I"], T: "I", chips: ["4", "12", "I"], sol: [["/", "4"]], par: 1,
      tip: "Numbers first. Which move gets I alone?" },
    { stage: 1, name: "Line y = mx + b through (3, 11) with m = 2", L: ["11"], R: ["6", "b"], T: "b", chips: ["6", "11", "b", "2"], sol: [["-", "6"]], par: 1,
      tip: "Undo the adding." },
    { stage: 1, name: "Perimeter P = 2l + 2w with P = 30, w = 5", L: ["30"], R: ["2l", "10"], T: "l", chips: ["2", "10", "30", "l", "2l"], sol: [["-", "10"], ["/", "2"]], par: 2,
      tip: "Two moves. Which comes first?" },
    { stage: 1, name: "Temperature F = 1.8C + 32 with F = 68", L: ["68"], R: ["1.8C", "32"], T: "C", chips: ["1.8", "32", "68", "C"], sol: [["-", "32"], ["/", "1.8"]], par: 2,
      tip: "What Celsius temperature is 68°F?" },
    { stage: 2, name: "Ohm's law", L: ["V"], R: ["IR"], T: "I", chips: ["I", "R", "V", "IR"], sol: [["/", "R"]], par: 1,
      tip: "Same move as level 1, but with a letter. Get I alone." },
    { stage: 2, name: "Slope-intercept form", L: ["y"], R: ["mx", "b"], T: "b", chips: ["m", "x", "mx", "b", "y"], sol: [["-", "mx"]], par: 1,
      tip: "Solve for b. Treat mx as one piece." },
    { stage: 2, name: "Circumference C = 2πr", L: ["C"], R: ["2πr"], T: "r", chips: ["2", "π", "2π", "r", "C"], sol: [["/", "2π"]], par: 1,
      tip: "Solve for the radius r. Can you do it in one move?" },
    { stage: 2, name: "Perimeter of a rectangle", L: ["P"], R: ["2l", "2w"], T: "w", chips: ["2", "l", "2l", "w", "2w", "P"], sol: [["-", "2l"], ["/", "2"]], par: 2,
      tip: "Solve for the width w." },
    { stage: 3, name: "Slope-intercept form", L: ["y"], R: ["mx", "b"], T: "x", chips: ["m", "x", "mx", "b", "y"], sol: [["-", "b"], ["/", "m"]], par: 2,
      tip: "Solve for x this time." },
    { stage: 3, name: "Fahrenheit to Celsius", L: ["F"], R: ["1.8C", "32"], T: "C", chips: ["1.8", "32", "C", "F"], sol: [["-", "32"], ["/", "1.8"]], par: 2,
      tip: "Level 4 again, but keep F as a letter: you'll get a formula that works for any temperature." },
    { stage: 3, name: "Area of a triangle", L: ["A"], R: ["½bh"], T: "h", chips: ["2", "½", "b", "h", "A"], sol: [["*", "2"], ["/", "b"]], par: 2,
      tip: "Solve for the height h. What undoes multiplying by ½?" },
    { stage: 3, name: "Simple interest balance A = P + Prt", L: ["A"], R: ["P", "Prt"], T: "r", chips: ["P", "r", "t", "Pt", "Prt", "A"], sol: [["-", "P"], ["/", "Pt"]], par: 2,
      tip: "Solve for the interest rate r." },
  ];
  const OPS = { "+": "+", "-": M, "*": "×", "/": "÷" };
  const moveText = (m) => OPS[m[0]] + " " + m[1];

  function apply(L, R, m) {
    const f = parseMono(m[1]);
    const go = (s) => normalize(m[0] === "+" ? sideAdd(s, f) : m[0] === "-" ? sideAdd(s, mono(-f.n, f.d, f.v)) : m[0] === "*" ? sideMul(s, f) : sideDiv(s, f));
    return [go(L), go(R)];
  }

  GameShell.register({
    slug: "a-ced-a-4",
    title: "Letter Balance",
    firstMove: "Get the target letter alone. Pick an operation and a term, then apply the move to both sides.",
    subtitle: "Rearrange formulas to get any letter alone",
    stages: { 1: "Stage 1 · Formulas with numbers", 2: "Stage 2 · One-move formulas", 3: "Stage 3 · Two-move formulas" },
    levels: LEVELS,
    help: {
      intro: "A formula is a balanced scale, just like an equation. Get the <b>target letter alone</b> on one side.",
      steps: [
        "Pick an operation (+, −, ×, ÷) and a piece of the formula.",
        "Press <b>Apply to both sides</b>. The move happens to both sides, so the formula stays true.",
        "When the target letter is alone, you've solved for it.",
        "Solve in as few moves as you can to earn 3 stars.",
      ],
      note: "Stage 1 uses numbers so you can see the moves; stages 2 and 3 use the same moves with letters.",
    },
    load(lv, api) {
      const s = { L: parseSide(lv.L), R: parseSide(lv.R), steps: 0, hist: [], log: [] };
      const start = sideText(s.L) + " = " + sideText(s.R);
      s.log.push({ move: "Start", text: start });
      const svg = api.svg("0 0 900 330", "Balance scale holding a formula");
      const eq = api.h("div", { class: "stage-text", style: { lineHeight: "1.2" } });
      const goal = api.h("div", { class: "preview", style: { textAlign: "center", paddingBottom: "8px" } });
      api.stage.append(svg, eq, goal);

      let op = "/", chip = null;
      const opSeg = api.seg([{ value: "+", label: "+", aria: "Add" }, { value: "-", label: M, aria: "Subtract" }, { value: "*", label: "×", aria: "Multiply" }, { value: "/", label: "÷", aria: "Divide" }],
        op, (v) => { op = v; refresh(); }, "Operation");
      const chipSeg = api.seg(lv.chips.map((c) => ({ value: c, label: c, cls: /[a-zπ]/i.test(c) ? "var" : "" })), chip, (v) => { chip = v; refresh(); }, "Piece");
      const preview = api.h("span", { class: "preview" });
      const applyBtn = api.button("Apply to both sides", onApply, "primary");
      const undoBtn = api.button("Undo", onUndo);
      api.controls.append(opSeg.el, chipSeg.el, preview, applyBtn, undoBtn);

      function refresh() {
        preview.innerHTML = chip ? "Move: <b>" + moveText([op, chip]) + "</b> on both sides" : "Pick a piece of the formula.";
        applyBtn.disabled = !chip;
        undoBtn.disabled = !s.hist.length;
        api.meta("Par: " + lv.par + (lv.par === 1 ? " move" : " moves") + " · Moves so far: " + s.steps);
        draw();
      }
      function onApply() {
        if (!chip) return;
        if (op === "*" || op === "/") {
          const f = parseMono(chip);
          if (f.v.includes(lv.T)) return api.msg("This factor contains " + lv.T + ", which could be zero. Use a constant or another nonzero factor to preserve the solutions.", "warn");
          if (f.n === 0) return api.msg("You can't divide by 0.", "bad");
        }
        const [L, R] = apply(s.L, s.R, [op, chip]);
        s.hist.push({ L: s.L, R: s.R });
        s.L = L; s.R = R; s.steps++;
        const text = sideText(L) + " = " + sideText(R);
        s.log.push({ move: moveText([op, chip]) + " on both sides", text });
        api.log(s.log, "Your moves, written in math");
        if (isAlone(L, lv.T) && !hasVar(R, lv.T) || isAlone(R, lv.T) && !hasVar(L, lv.T)) {
          const other = isAlone(L, lv.T) ? R : L;
          draw(true);
          return api.win({ answer: lv.T + " = " + sideText(other), lines: s.log, steps: s.steps, par: lv.par, check: checkLine(other) });
        }
        if (s.steps >= lv.par + 3) api.msg("That's a lot of moves. Undo or Restart and plan a shorter path.", "warn");
        else api.msg("Both sides changed by the same operation. What is still attached to " + lv.T + "?");
        refresh();
      }
      function onUndo() {
        const p = s.hist.pop();
        if (!p) return;
        s.L = p.L; s.R = p.R; s.steps--; s.log.pop();
        api.log(s.log.length > 1 ? s.log : null);
        api.msg("Undid your last move.");
        refresh();
      }
      function checkLine(other) {
        if (lv.stage === 1) return "Check: put " + lv.T + " = " + sideText(other) + " back into the formula: both sides match ✓";
        return "Same moves as with numbers, with every divisor nonzero ✓";
      }
      function draw(won) {
        let sc = A.backdrop(900, 330, { ground: 292 });
        const cardL = sideText(s.L), cardR = sideText(s.R);
        const wl = Math.max(120, cardL.length * 15 + 30), wr = Math.max(120, cardR.length * 15 + 30);
        sc += A.scale({ cx: 450, cy: 70, arm: 290, rope: 140, groundY: 292, hit: false, mood: won ? "joy" : "ok", mascotX: 580,
          left: [{ w: wl, h: 50, svg: (x, y) => A.card(x, y, wl, 50) + A.text(x + wl / 2, y + 34, cardL, { size: 24, var: false }) }],
          right: [{ w: wr, h: 50, svg: (x, y) => A.card(x, y, wr, 50) + A.text(x + wr / 2, y + 34, cardR, { size: 24, var: false }) }] });
        svg.innerHTML = sc;
        svg.setAttribute("aria-label", "Balanced scale: " + cardL + " equals " + cardR);
        eq.innerHTML = sideHTML(s.L) + '<span class="rel">=</span>' + sideHTML(s.R);
        goal.innerHTML = (lv.name ? lv.name + " · " : "") + "Goal: get <b><i>" + lv.T + "</i></b> alone";
      }
      api.msg("Choose a move that undoes an operation on the target letter. Assume any letter you divide by is nonzero.");
      refresh();

      api.autoplay = () => {
        lv.sol.forEach(([o, c]) => {
          opSeg.buttons.find((b) => b._v === o).click();
          chipSeg.buttons.find((b) => b._v === c).click();
          applyBtn.click();
        });
        return { steps: s.steps, par: lv.par };
      };
    },
    guide: {
      evidence: "Before applying a move, ask which operation on the target letter it will undo. Have the student check the rearranged formula with a set of values.",
      summary: "A 12-level game for rearranging formulas. Students treat a formula like a balanced scale and apply the same operation to both sides until the target letter is alone, first with numbers substituted, then with letters.",
      also: "<span class='code'>AI.A-REI.B.3</span> solving equations with coefficients represented by letters.",
      practices: "MP2 Reason abstractly and quantitatively · MP7 Look for and make use of structure · MP8 Look for and express regularity in repeated reasoning",
      goals: [
        "Rearrange a formula to isolate any variable using the properties of equality.",
        "Recognize that the moves used with numbers are the same moves used with letters.",
        "Treat products like mx, 2π or Pt as single pieces when undoing operations.",
      ],
      howItWorks: "Students pick an operation and a piece of the formula, and the move is applied to both sides. The formula is shown on a balanced scale and in standard notation with fractions. Stage 1 substitutes numbers into familiar formulas; stages 2 and 3 repeat the same structures with letters.",
      stageNotes: {
        1: { sees: "Formulas with numbers substituted (Ohm's law, perimeter, temperature).", builds: "The moves as ordinary equation solving." },
        2: { sees: "One-move formulas with letters.", builds: "Dividing by a letter or a product like 2π." },
        3: { sees: "Two-move formulas.", builds: "Order of moves; undoing ½; keeping a numerator together, e.g. (F − 32)/1.8." },
      },
      discussion: [
        "Compare level 4 and level 10. How is solving 68 = 1.8C + 32 like solving F = 1.8C + 32?",
        "In level 8, why is the answer (P − 2l)/2 and not P − 2l/2? Are they the same?",
        "In level 11, why does multiplying by 2 come first?",
      ],
      misconceptions: [
        ["Dividing only one term of a sum, e.g. P − 2l ÷ 2", "The game divides the whole side and shows the result as a fraction over 2."],
        ["Subtracting before the variable term is isolated in the wrong order", "Extra moves cost stars; the move log shows the longer path."],
        ["Thinking letters can't be moved like numbers", "Stage 1 and stage 3 use the same formulas, first with numbers and then with letters."],
      ],
      exitTicket: {
        items: ["Solve d = rt for t.", "Solve P = 2l + 2w for l.", "Solve y = mx + b for m."],
        answers: ["t = d/r (divide both sides by r).", "l = (P − 2w)/2 (subtract 2w, then divide by 2).", "m = (y − b)/x (subtract b, then divide by x)."],
      },
    },
    answerKey(lv) {
      let L = parseSide(lv.L), R = parseSide(lv.R);
      lv.sol.forEach((m) => { [L, R] = apply(L, R, m); });
      const other = isAlone(L, lv.T) ? R : L;
      return { prompt: sideText(parseSide(lv.L)) + " = " + sideText(parseSide(lv.R)) + "; solve for " + lv.T,
        solution: lv.sol.map(moveText).join(", ") + " on both sides", answer: lv.T + " = " + sideText(other) };
    },
  });
})();
