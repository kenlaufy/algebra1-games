/* Algebra 1 Games: small algebra helpers shared by games. */
(function () {
  "use strict";
  const MINUS = "−";
  const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "-": "⁻", "/": "ᐟ" };
  const Alg = (window.Alg = { MINUS });

  Alg.gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  Alg.num = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));
  Alg.paren = (n) => (n < 0 ? "(" + Alg.num(n) + ")" : String(n));
  Alg.sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("");
  Alg.round = (v, d) => { const p = Math.pow(10, d == null ? 2 : d); return Math.round(v * p) / p; };
  Alg.fmtDec = (v, d) => Alg.num(Alg.round(v, d));

  /* term list -> string. terms: [{ coef, body }] where body is "" for constants, e.g. "x", "x²", "ab". */
  Alg.fmtTerms = function (terms) {
    const parts = [];
    terms.forEach((t) => {
      if (!t.coef) return;
      const a = Math.abs(t.coef);
      const mag = t.body ? (a === 1 ? "" : String(a)) + t.body : String(a);
      if (!parts.length) parts.push((t.coef < 0 ? MINUS : "") + mag);
      else parts.push((t.coef < 0 ? MINUS + " " : "+ ") + mag);
    });
    return parts.length ? parts.join(" ") : "0";
  };

  /* { x, c } with optional letter */
  Alg.fmtLin = (s, letter) => Alg.fmtTerms([{ coef: s.x, body: letter || "x" }, { coef: s.c, body: "" }]);
  Alg.fmtEq = (L, R, letter, rel) => Alg.fmtLin(L, letter) + " " + (rel || "=") + " " + Alg.fmtLin(R, letter);

  /* polynomial from coefficient array, highest power first: [1, 5, 6] -> x² + 5x + 6 */
  Alg.fmtPoly = function (coeffs, letter) {
    letter = letter || "x";
    const n = coeffs.length - 1;
    return Alg.fmtTerms(coeffs.map((c, i) => {
      const p = n - i;
      return { coef: c, body: p === 0 ? "" : p === 1 ? letter : letter + Alg.sup(p) };
    }));
  };
  Alg.polyMul = function (a, b) {
    const out = new Array(a.length + b.length - 1).fill(0);
    a.forEach((x, i) => b.forEach((y, j) => (out[i + j] += x * y)));
    return out;
  };
  Alg.polyAdd = function (a, b) {
    const n = Math.max(a.length, b.length);
    const pa = new Array(n - a.length).fill(0).concat(a), pb = new Array(n - b.length).fill(0).concat(b);
    return pa.map((v, i) => v + pb[i]);
  };
  Alg.polyTrim = (p) => { let i = 0; while (i < p.length - 1 && p[i] === 0) i++; return p.slice(i); };
  Alg.polyEq = (a, b) => { const x = Alg.polyTrim(a), y = Alg.polyTrim(b); return x.length === y.length && x.every((v, i) => v === y[i]); };
  Alg.polyEval = (p, x) => p.reduce((acc, c) => acc * x + c, 0);

  /* binomial (x + r) shown as "(x + 3)" or "(x − 2)"; with a leading coefficient: (2x + 1) */
  Alg.fmtBinom = (a, b, letter) => "(" + Alg.fmtTerms([{ coef: a, body: letter || "x" }, { coef: b, body: "" }]) + ")";

  /* fractions */
  Alg.frac = function (n, d) {
    if (d === 0) throw new Error("zero denominator");
    if (d < 0) { n = -n; d = -d; }
    const g = Alg.gcd(n, d);
    return { n: n / g, d: d / g };
  };
  Alg.fmtFrac = (f) => (f.d === 1 ? Alg.num(f.n) : (f.n < 0 ? MINUS : "") + Math.abs(f.n) + "/" + f.d);
  Alg.fracEq = (a, b) => a.n * b.d === b.n * a.d;

  /* parse a number typed by a student: integers, decimals, fractions like 3/4 or -5/2, unicode minus ok */
  Alg.parseNum = function (s) {
    if (s == null) return NaN;
    s = String(s).trim().replace(/−/g, "-").replace(/\s+/g, "");
    if (!s) return NaN;
    const m = /^(-?\d+)\/(\d+)$/.exec(s);
    if (m) return Number(m[2]) === 0 ? NaN : Number(m[1]) / Number(m[2]);
    return /^-?(\d+\.?\d*|\.\d+)$/.test(s) ? Number(s) : NaN;
  };
  Alg.close = (a, b, tol) => Math.abs(a - b) <= (tol == null ? 1e-9 : tol);

  /* parse a single term typed by a student, like "3x", "-x^2", "x²", "−6", "2x3" -> { coef, pow } or null */
  Alg.parseTerm = function (s, letter) {
    letter = letter || "x";
    if (s == null) return null;
    s = String(s).trim().replace(/−/g, "-").replace(/\s+/g, "").replace(/²/g, "^2").replace(/³/g, "^3").replace(/⁴/g, "^4").replace(/\*/g, "");
    if (!s) return null;
    const re = new RegExp("^([+-]?)(\\d*\\.?\\d*)(" + letter + "(?:\\^?(\\d+))?)?$");
    const m = re.exec(s);
    if (!m || (!m[2] && !m[3])) return null;
    const sign = m[1] === "-" ? -1 : 1;
    const coef = m[2] ? Number(m[2]) : 1;
    if (Number.isNaN(coef)) return null;
    const pow = m[3] ? (m[4] ? Number(m[4]) : 1) : 0;
    return { coef: sign * coef, pow };
  };
  Alg.fmtTerm = (coef, pow, letter) => Alg.fmtTerms([{ coef, body: pow === 0 ? "" : pow === 1 ? (letter || "x") : (letter || "x") + Alg.sup(pow) }]);
})();
