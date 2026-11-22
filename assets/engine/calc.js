/* Algebra 1 Games: in-game calculator.
   A floating, non-modal panel opened from the game's header. It has its own small math parser
   (no eval): + − × ÷, powers, square roots, parentheses, π, Ans and implied multiplication like 2π or 3(4).
   Results show as decimals and, when they are simple fractions, as fractions too.
   Teachers can turn it off with ?calc=0 in a game link, or for a whole class. */
(function () {
  "use strict";
  const CALC = (window.A1G_CALC = {});

  // ---------- parser ----------
  function tokenize(s) {
    s = s.replace(/\s+/g, "").replace(/[−–]/g, "-").replace(/[×·*]/g, "*").replace(/[÷/]/g, "/").replace(/π|pi/gi, "π").replace(/sqrt/gi, "√");
    const out = [];
    for (let i = 0; i < s.length;) {
      const c = s[i];
      const num = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
      if (num) { out.push({ t: "n", v: parseFloat(num[0]) }); i += num[0].length; continue; }
      if (/^ans/i.test(s.slice(i))) { out.push({ t: "ans" }); i += 3; continue; }
      if ("+-*/^()√π²".includes(c)) { out.push({ t: c }); i++; continue; }
      throw new Error("I don't understand “" + c + "”");
    }
    return out;
  }
  function evaluate(src, ans) {
    const tk = tokenize(src);
    if (!tk.length) throw new Error("Type a calculation");
    let i = 0;
    const peek = () => tk[i] && tk[i].t, take = (t) => { if (peek() !== t) throw new Error(t === ")" ? "Missing )" : "Check your expression"); i++; };
    const startsFactor = () => ["n", "ans", "(", "√", "π"].includes(peek());
    function expr() { let v = term(); while (peek() === "+" || peek() === "-") { const op = tk[i++].t, r = term(); v = op === "+" ? v + r : v - r; } return v; }
    function term() {
      let v = unary();
      for (;;) {
        if (peek() === "*") { i++; v *= unary(); }
        else if (peek() === "/") { i++; const r = unary(); if (r === 0) throw new Error("Can't divide by zero"); v /= r; }
        else if (startsFactor()) v *= power();          // implied multiplication: 2π, 3(4), 2√9
        else return v;
      }
    }
    function unary() { if (peek() === "-") { i++; return -unary(); } if (peek() === "+") { i++; return unary(); } return power(); }
    function power() {
      let b = postfix();
      if (peek() === "^") { i++; const e = unary(); b = Math.pow(b, e); }   // right-associative; −2^2 = −4
      return b;
    }
    function postfix() { let v = primary(); while (peek() === "²") { i++; v = v * v; } return v; }
    function primary() {
      const t = peek();
      if (t === "n") return tk[i++].v;
      if (t === "ans") { i++; if (ans == null) throw new Error("No answer yet"); return ans; }
      if (t === "π") { i++; return Math.PI; }
      if (t === "√") { i++; const v = peek() === "(" ? (i++, (() => { const x = expr(); take(")"); return x; })()) : postfix(); if (v < 0) throw new Error("No real square root of a negative"); return Math.sqrt(v); }
      if (t === "(") { i++; const v = expr(); take(")"); return v; }
      throw new Error(t ? "Check your expression" : "Finish the calculation");
    }
    const v = expr();
    if (i < tk.length) throw new Error(peek() === ")" ? "Extra )" : "Check your expression");
    if (!isFinite(v)) throw new Error("That number is too big");
    return v;
  }
  CALC.evaluate = evaluate;
  function fraction(v) {
    if (Number.isInteger(v)) return null;
    for (let d = 2; d <= 100; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return (n < 0 ? "−" : "") + Math.abs(n) + "/" + d; }
    return null;
  }
  function show(v) {
    let s = Math.abs(v) >= 1e12 || (Math.abs(v) < 1e-6 && v !== 0) ? v.toExponential(6) : String(parseFloat(v.toPrecision(10)));
    return s.replace(/^-/, "−");
  }
  CALC.format = (v) => { const f = fraction(v); return show(v) + (f ? "  (" + f + ")" : ""); };

  // ---------- panel ----------
  CALC.allowed = function () {
    if (/[?&]calc=(0|off|no)\b/.test(location.search)) return false;
    try { const c = JSON.parse(localStorage.getItem("a1g-class") || "null"); if (c && c.calc === false) return false; } catch (e) {}
    return true;
  };
  CALC.mount = function (where) {
    if (!where || !CALC.allowed() || document.getElementById("calcPanel")) return null;
    const mk = (tag, attrs, text) => { const el = document.createElement(tag); Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, v)); if (text != null) el.textContent = text; return el; };
    const btn = mk("button", { class: "btn calc-toggle", type: "button", "aria-expanded": "false", "aria-controls": "calcPanel" });
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><rect x="4" y="2.5" width="16" height="19" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="7" y="5.5" width="10" height="4" rx="1" fill="currentColor"/><g fill="currentColor"><circle cx="8.5" cy="13" r="1.3"/><circle cx="12" cy="13" r="1.3"/><circle cx="15.5" cy="13" r="1.3"/><circle cx="8.5" cy="17" r="1.3"/><circle cx="12" cy="17" r="1.3"/><circle cx="15.5" cy="17" r="1.3"/></g></svg><span>Calculator</span>';
    where.appendChild(btn);

    const panel = mk("section", { id: "calcPanel", class: "calc", role: "dialog", "aria-modal": "false", "aria-labelledby": "calcTitle", hidden: "" });
    panel.innerHTML =
      '<div class="calc-bar"><h2 id="calcTitle">Calculator</h2><button type="button" class="calc-x" aria-label="Close calculator">×</button></div>' +
      '<ol class="calc-hist" aria-label="Earlier calculations"></ol>' +
      '<label class="sr-only" for="calcIn">Calculation</label><input id="calcIn" class="calc-in" type="text" autocomplete="off" spellcheck="false" placeholder="e.g. (3 + 5) ÷ 2">' +
      '<div class="calc-out" role="status" aria-live="polite">&nbsp;</div><div class="calc-keys"></div>';
    document.body.appendChild(panel);
    const input = panel.querySelector(".calc-in"), out = panel.querySelector(".calc-out"), hist = panel.querySelector(".calc-hist"), keys = panel.querySelector(".calc-keys");
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) input.setAttribute("inputmode", "none");   // use the on-screen keys on tablets and phones
    let ans = null;

    const KEYS = [["C", "clear", "Clear"], ["(", "("], [")", ")"], ["⌫", "back", "Delete"], ["÷", "÷", "Divide"],
      ["7", "7"], ["8", "8"], ["9", "9"], ["x²", "²", "Square"], ["×", "×", "Times"],
      ["4", "4"], ["5", "5"], ["6", "6"], ["√", "√", "Square root"], ["−", "−", "Minus"],
      ["1", "1"], ["2", "2"], ["3", "3"], ["^", "^", "To the power"], ["+", "+", "Plus"],
      ["0", "0"], [".", ".", "Point"], ["π", "π", "Pi"], ["Ans", "Ans", "Last answer"], ["=", "eq", "Equals"]];
    KEYS.forEach(([label, act, aria]) => {
      const k = mk("button", { type: "button", "data-act": act, class: "calc-k" + (/^[0-9.]$/.test(label) ? " num" : "") + (act === "eq" ? " eq" : "") + (act === "clear" ? " clr" : "") }, label);
      if (aria) k.setAttribute("aria-label", aria);
      keys.appendChild(k);
    });
    function preview() {
      if (!input.value.trim()) { out.innerHTML = "&nbsp;"; out.classList.remove("err"); return; }
      try { out.textContent = "= " + CALC.format(evaluate(input.value, ans)); out.classList.remove("err"); } catch (e) { out.innerHTML = "&nbsp;"; }
    }
    function insert(text) {
      const a = input.selectionStart ?? input.value.length, b = input.selectionEnd ?? a;
      input.value = input.value.slice(0, a) + text + input.value.slice(b);
      const p = a + text.length; input.setSelectionRange(p, p); preview();
    }
    function equals() {
      if (!input.value.trim()) return;
      try {
        const v = evaluate(input.value, ans);
        const li = mk("li"); const b = mk("button", { type: "button", title: "Use this answer" });
        b.textContent = input.value.trim() + " = " + CALC.format(v); b.dataset.v = String(v);
        li.appendChild(b); hist.appendChild(li); while (hist.children.length > 4) hist.firstChild.remove();
        ans = v; out.textContent = "= " + CALC.format(v); out.classList.remove("err");
        input.value = ""; input.placeholder = "Ans = " + show(v);
      } catch (e) { out.textContent = e.message; out.classList.add("err"); }
    }
    keys.addEventListener("click", (e) => {
      const k = e.target.closest("button"); if (!k) return;
      const act = k.dataset.act;
      if (act === "clear") { input.value = ""; preview(); }
      else if (act === "back") {
        const a = input.selectionStart ?? input.value.length, b = input.selectionEnd ?? a;
        if (a !== b) insert(""); else if (a > 0) { input.value = input.value.slice(0, a - 1) + input.value.slice(a); input.setSelectionRange(a - 1, a - 1); preview(); }
      } else if (act === "eq") equals();
      else insert(act === "√" ? "√(" : act);
      if (!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches)) input.focus();
    });
    hist.addEventListener("click", (e) => { const b = e.target.closest("button[data-v]"); if (b) { insert(show(+b.dataset.v).replace("−", "-")); input.focus(); } });
    input.addEventListener("input", preview);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); equals(); } });
    panel.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.stopPropagation(); close(); } });

    // on phones the panel is a bottom sheet: leave room under the page so the game can scroll above it
    const room = () => { document.body.style.paddingBottom = !panel.hidden && window.innerWidth < 700 ? panel.offsetHeight + "px" : ""; };
    window.addEventListener("resize", room);
    function open() { panel.hidden = false; btn.setAttribute("aria-expanded", "true"); btn.classList.add("on"); room(); input.focus({ preventScroll: true }); }
    function close() { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); btn.classList.remove("on"); room(); btn.focus({ preventScroll: true }); }
    btn.addEventListener("click", () => (panel.hidden ? open() : close()));
    panel.querySelector(".calc-x").addEventListener("click", close);

    // drag by the title bar (wide screens; on phones it is a bottom sheet)
    const bar = panel.querySelector(".calc-bar");
    bar.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button") || window.innerWidth < 700) return;
      const r = panel.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
      bar.setPointerCapture(e.pointerId);
      const move = (ev) => {
        panel.style.left = Math.max(4, Math.min(window.innerWidth - r.width - 4, ev.clientX - dx)) + "px";
        panel.style.top = Math.max(4, Math.min(window.innerHeight - 60, ev.clientY - dy)) + "px";
        panel.style.right = "auto"; panel.style.bottom = "auto";
      };
      const up = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", up); };
      bar.addEventListener("pointermove", move); bar.addEventListener("pointerup", up);
    });
    CALC.open = open; CALC.close = close;
    return btn;
  };
})();
