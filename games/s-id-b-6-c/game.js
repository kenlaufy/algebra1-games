/* Drag the Line · AI.S-ID.B.6.c */
(function () {
  const D = window.DataLab, Alg = window.Alg, M = Alg.MINUS;
  const LEVELS = [
    { stage: 1, pts: [[1, 3], [2, 5.5], [3, 6], [4, 8.5], [5, 9], [6, 11.5], [7, 12], [8, 14.5]], xr: [0, 9, 1], yr: [0, 18, 1, 2], m: [0, 3], b: [-2, 6], xl: "x", yl: "y", tip: "Move the sliders until the line runs through the middle of the points." },
    { stage: 1, pts: [[1, 18], [2, 16.5], [3, 14], [4, 13], [5, 10.5], [6, 9], [7, 7.5], [8, 5]], xr: [0, 9, 1], yr: [0, 22, 1, 2], m: [-3, 1], b: [10, 25], xl: "x", yl: "y", tip: "A negative association: the line slopes down." },
    { stage: 1, pts: [[10, 35], [20, 48], [30, 55], [40, 70], [50, 78], [60, 95], [70, 100]], xr: [0, 80, 10], yr: [0, 120, 10, 20], m: [0, 2], b: [0, 50], xl: "minutes of practice", yl: "score", tip: "Different scales. Watch the axes." },
    { stage: 1, pts: [[2, 4], [3, 7], [4, 7], [5, 11], [6, 10], [7, 14], [8, 13], [9, 17]], xr: [0, 10, 1], yr: [0, 20, 1, 2], m: [0, 3], b: [-4, 6], xl: "x", yl: "y", tip: "Scattered points still suggest a line." },
    { stage: 2, pts: [[15, 22], [18, 42], [20, 48], [22, 62], [24, 68], [26, 82], [28, 88], [30, 98], [32, 112]], xr: [10, 35, 1, 5], yr: [0, 130, 10, 20], m: [0, 10], b: [-100, 20], xl: "temperature (°C)", yl: "ice cream sales", tip: "Real data: ice cream sales." },
    { stage: 2, pts: [[1, 92], [2, 85], [3, 81], [4, 72], [5, 70], [6, 61], [7, 58], [8, 50]], xr: [0, 9, 1], yr: [40, 100, 5, 10], m: [-10, 0], b: [80, 110], xl: "weeks", yl: "battery health (%)", tip: "Battery health over time." },
    { stage: 2, pts: [[150, 40], [155, 44], [160, 50], [165, 54], [170, 60], [175, 63], [180, 70], [185, 74]], xr: [145, 190, 5], yr: [30, 80, 5, 10], m: [0, 2], b: [-200, 0], xl: "height (cm)", yl: "mass (kg)", tip: "The y-intercept is far off the screen here. Focus on the slope first." },
    { stage: 2, pts: [[1, 12], [2, 15], [3, 13], [4, 18], [5, 17], [6, 21], [7, 19], [8, 24], [9, 23]], xr: [0, 10, 1], yr: [0, 30, 2, 4], m: [0, 3], b: [0, 20], xl: "x", yl: "y", tip: "A noisier cloud." },
    { stage: 3, pts: [[1, 2], [2, 3], [3, 5], [4, 9], [5, 16], [6, 27], [7, 45]], curved: true, xr: [0, 8, 1], yr: [0, 50, 5, 10], m: [0, 10], b: [-20, 10], xl: "x", yl: "y", tip: "Before fitting: does this scatter plot suggest a line?" },
    { stage: 3, pts: [[2, 30], [3, 34], [4, 37], [5, 42], [6, 44], [7, 49], [8, 52]], xr: [0, 10, 1], yr: [20, 60, 2, 5], m: [0, 6], b: [10, 40], xl: "x", yl: "y", linear: true, tip: "Does this one suggest a line? If so, fit it." },
    { stage: 3, pts: [[1, 10], [2, 2], [3, 8], [4, 3], [5, 9], [6, 1], [7, 7]], none: true, xr: [0, 8, 1], yr: [0, 12, 1, 2], m: [-3, 3], b: [0, 12], xl: "x", yl: "y", tip: "Is there any linear association here?" },
    { stage: 3, pts: [[1, 8], [2, 11], [3, 13], [4, 17], [5, 18], [6, 22], [7, 25], [8, 27]], xr: [0, 9, 1], yr: [0, 32, 2, 4], m: [0, 5], b: [0, 12], xl: "x", yl: "y", write: true, tip: "Last one: fit it, then write your line's equation." },
  ];
  const snap = (v, s) => Math.round(v / s) * s;

  GameShell.register({
    slug: "s-id-b-6-c",
    title: "Drag the Line",
    firstMove: "Move the slope and intercept sliders until the line runs through the middle of the points, then check your fit.",
    subtitle: "Fit a linear function to a scatter plot that suggests a linear association",
    stages: { 1: "Stage 1 · Eyeball a fit", 2: "Stage 2 · Real data", 3: "Stage 3 · Should you fit a line?" },
    levels: LEVELS,
    help: {
      intro: "Fit a line by eye: it should follow the trend, with about as many points above it as below.",
      steps: ["Use the <b>slope</b> slider to match the trend's steepness, then the <b>intercept</b> slider to move the line up or down.", "Press <b>Check fit</b>. Only then do you see your total error, compared with the best-fit line.", "In stage 3, first decide whether a line makes sense at all.", "Stars: how close your error is to the best line's."],
      note: "Total error = sum of squared residuals (the squared distances shown as dashed segments).",
    },
    load(lv, api) {
      const best = D.fit(lv.pts), bestSSE = D.sse(lv.pts, best.m, best.b);
      const mStep = (lv.m[1] - lv.m[0]) / 100, bStep = (lv.b[1] - lv.b[0]) / 100;
      // start from a clearly poor line: the slider corner farthest from the best fit
      const starts = [[0.15, 0.85], [0.85, 0.15], [0.15, 0.15], [0.85, 0.85]].map(([a, c]) => [snap(lv.m[0] + a * (lv.m[1] - lv.m[0]), mStep), snap(lv.b[0] + c * (lv.b[1] - lv.b[0]), bStep)]);
      starts.sort((p, q) => D.sse(lv.pts, q[0], q[1]) - D.sse(lv.pts, p[0], p[1]));
      let m = starts[0][0], b = starts[0][1], revealed = false, mistakes = 0;
      const svg = api.svg("0 0 900 420", "Scatter plot with your line");
      const eq = api.h("div", { class: "stage-text", style: { fontSize: "24px" } });
      api.stage.append(svg, eq);
      function draw() {
        const o = { xr: lv.xr, yr: lv.yr, xlabel: lv.xl, ylabel: lv.yl, line: { m, b }, resid: revealed };
        let s = D.scatter(lv.pts, o).svg;
        if (revealed) {
          const P = Plane.create({ xmin: lv.xr[0], xmax: lv.xr[1], ymin: lv.yr[0], ymax: lv.yr[1], xstep: lv.xr[2], ystep: lv.yr[2], h: 420 });
          s += P.curve((x) => best.m * x + best.b, { color: "#3f7d4c", width: 3, dash: "10 7" });
        }
        svg.innerHTML = s;
        eq.innerHTML = "Your line: y = " + Alg.fmtTerms([{ coef: Alg.round(m, 2), body: "x" }, { coef: Alg.round(b, 2), body: "" }]);
      }
      const slider = (label, range, step, val, on) => {
        const inp = api.h("input", { type: "range", min: range[0], max: range[1], step, value: val, "aria-label": label });
        inp.addEventListener("input", () => { on(Number(inp.value)); revealed = false; draw(); });
        return { el: api.h("label", { class: "lbl", style: { display: "flex", alignItems: "center", gap: "8px" } }, label, inp), inp };
      };
      const sm = slider("Slope", lv.m, mStep, m, (v) => (m = v)), sb = slider("Intercept", lv.b, bStep, b, (v) => (b = v));
      const check = api.button("Check fit", onCheck, "primary");
      function fitControls() { api.controls.innerHTML = ""; api.controls.append(sm.el, sb.el, check); }

      function onCheck() {
        revealed = true; draw();
        const sse = D.sse(lv.pts, m, b), ratio = sse / bestSSE;
        if (ratio > 3) {
          mistakes++;
          const above = lv.pts.filter(([x, y]) => y > m * x + b).length;
          return api.msg("Not quite: your total error is " + Alg.round(sse, 1) + " (best is " + Alg.round(bestSSE, 1) + "). " + above + " of " + lv.pts.length + " points are above your line. " +
            (Math.abs(m - best.m) > (lv.m[1] - lv.m[0]) / 8 ? "Try changing the slope." : "Try moving the line up or down."), "bad");
        }
        const stars = ratio <= 1.15 ? 3 : ratio <= 1.6 ? 2 : 1;
        const finish = () => api.win({ answer: "y = " + Alg.fmtTerms([{ coef: Alg.round(m, 2), body: "x" }, { coef: Alg.round(b, 2), body: "" }]), stars: Math.max(1, stars - Math.min(1, mistakes)),
          note: "Your total error: " + Alg.round(sse, 1) + ". Best line's: " + Alg.round(bestSSE, 1) + ".",
          lines: ["Best-fit line: y = " + Alg.fmtTerms([{ coef: Alg.round(best.m, 2), body: "x" }, { coef: Alg.round(best.b, 2), body: "" }]) + " (dashed green)"],
          check: "Your line follows the trend ✓" });
        if (lv.write) {
          api.controls.innerHTML = "";
          Steps.run(api, { steps: [{ type: "input", prompt: "Write your line: y = []x + []", answers: [Alg.round(m, 2), Alg.round(b, 2)],
            accept: (v) => (Math.abs(v[0] - m) <= Math.max(0.05, mStep) && Math.abs(v[1] - b) <= Math.max(0.5, bStep) ? true : "Read the slope and intercept from your sliders: y = " + Alg.round(m, 2) + "x + " + Alg.round(b, 2)) }],
            result: () => ({ answer: "y = " + Alg.round(m, 2) + "x + " + Alg.round(b, 2), stars: Math.max(1, stars - Math.min(1, mistakes)), note: "Total error " + Alg.round(sse, 1) + " vs best " + Alg.round(bestSSE, 1) + "." }) });
          return;
        }
        finish();
      }
      draw();
      api.meta("Fit by eye, then check");
      if (lv.curved || lv.none || lv.linear) {
        const right = lv.linear ? 0 : lv.curved ? 1 : 2;
        const opts = [["Yes: the points follow a straight-line trend", lv.curved ? "Look at the shape: the points bend upward more and more." : "There's no clear trend at all."],
          ["No: the points curve, so a line isn't a good model", lv.linear ? "These points follow a straight-line trend." : "They don't curve; there's just no pattern."],
          ["No: there's no association to fit", lv.linear ? "There's a clear upward trend." : "There IS a pattern: it curves."]];
        // A plain question (not Steps, which would end the level): a "yes" unlocks the sliders.
        const grid = api.h("div", { class: "choices" });
        opts.forEach((o, k) => {
          const btn = api.h("button", { class: "choice", on: { click: () => {
            if (btn.disabled) return;
            if (k !== right) { mistakes++; btn.classList.add("wrong"); btn.disabled = true; return api.msg(o[1], "bad"); }
            btn.classList.add("right");
            if (lv.linear) { api.msg("Right: it's linear. Now fit it.", "good"); fitControls(); return; }
            api.win({ answer: right === 1 ? "Curved: don't fit a line" : "No association: don't fit a line", stars: mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1,
              check: "Only fit a line when the scatter plot suggests one ✓" });
          } } }, o[0]);
          btn._ok = k === right;
          grid.appendChild(btn);
        });
        api.controls.append(api.h("div", { style: { fontSize: "19px", fontWeight: 700, width: "100%" } }, "Does this scatter plot suggest a linear association?"), grid);
        api.autoplay = () => {
          [...grid.children].find((x) => x._ok).click();
          if (lv.linear) { m = snap(best.m, mStep); b = snap(best.b, bStep); sm.inp.value = m; sb.inp.value = b; check.click(); }
          return {};
        };
        return;
      }
      fitControls();
      api.msg("Adjust the sliders, then press Check fit.");
      api.autoplay = () => {
        m = snap(best.m, mStep); b = snap(best.b, bStep); sm.inp.value = m; sb.inp.value = b; check.click();
        if (lv.write && api.autoplay) api.autoplay();
        return {};
      };
    },
    guide: {
      summary: "A 12-level game for fitting lines to scatter plots by eye. Students set slope and intercept with sliders, commit, then see their total squared error compared with the least-squares line. Stage 3 asks first whether a line is appropriate.",
      also: "<span class='code'>AI.S-ID.B.6.a</span> using fitted functions and <span class='code'>AI.S-ID.B.6.b</span> residuals.",
      practices: "MP4 Model with mathematics · MP5 Use appropriate tools strategically",
      goals: ["Fit a linear function to a scatter plot that suggests a linear association.", "Judge a fit by the balance of points above and below the line and by total error.", "Decide whether a linear model is appropriate."],
      howItWorks: "Each level shows a scatter plot and a line controlled by slope and intercept sliders. The error stays hidden until the student presses Check fit; then residual segments, the total squared error, and the dashed best-fit line appear. Stars compare the student's error with the best possible. Stage 3 includes curved and patternless data where the correct answer is not to fit a line.",
      stageNotes: { 1: { sees: "Clean positive and negative trends.", builds: "Slope first, then intercept." }, 2: { sees: "Ice cream, battery health, height and mass, noisy data.", builds: "Fitting real data on real scales." }, 3: { sees: "Curved, linear and patternless data; writing the equation.", builds: "When a line is appropriate." } },
      discussion: ["How can you tell your line is too steep?", "Why do we square the residuals before adding them?", "Why is fitting a line to the curved data a mistake even if it passes near the points?"],
      misconceptions: [["A good line must pass through as many points as possible", "The error compares overall closeness."], ["Every scatter plot gets a line", "Stage 3."], ["The intercept must be visible on the graph", "Level 7's intercept is far below the window."]],
      exitTicket: { items: ["Sketch a line of fit for points (1, 2), (2, 4), (3, 5), (4, 8), (5, 9). Estimate its equation.", "How do you know whether a scatter plot suggests a linear association?", "What does it mean if most points are above your line?"],
        answers: ["About y = 1.8x + 0.2.", "The points follow a roughly straight band.", "The line is too low: raise the intercept (or adjust the slope)."] },
    },
    answerKey(lv) {
      const best = D.fit(lv.pts);
      if (lv.curved) return { prompt: "Curved scatter plot", solution: "Don't fit a line: the points curve", answer: "No linear association" };
      if (lv.none) return { prompt: "Patternless scatter plot", solution: "Don't fit a line: no association", answer: "No association" };
      return { prompt: lv.xl + " vs. " + lv.yl + " (" + lv.pts.length + " points)", solution: "Fit by eye; best fit shown for reference", answer: "≈ y = " + Alg.round(best.m, 2) + "x + " + Alg.round(best.b, 2) };
    },
  });
})();
