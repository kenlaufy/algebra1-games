/* Blind Sketch · AI.F-IF.B.4 */
(function () {
  const Alg = window.Alg, M = Alg.MINUS;
  // tiny sketch thumbnails (points in 0..10 × 0..10 space)
  function thumb(pts, o) {
    o = o || {};
    const X = (x) => 12 + x * 17.6, Y = (y) => 108 - y * 9.6;
    let s = '<svg viewBox="0 0 200 120" width="180" height="108" aria-hidden="true"><rect width="200" height="120" rx="8" fill="#fffdf7"/>' +
      '<line x1="12" y1="108" x2="196" y2="108" stroke="#23262d" stroke-width="2"/><line x1="12" y1="4" x2="12" y2="108" stroke="#23262d" stroke-width="2"/>';
    (o.segs || [pts]).forEach((sg) => (s += '<polyline points="' + sg.map((p) => X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1)).join(" ") + '" fill="none" stroke="#5a78b8" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>'));
    return s + "</svg>";
  }
  const curve = (f, a, b, n) => { const out = []; for (let i = 0; i <= (n || 40); i++) { const x = a + ((b - a) * i) / (n || 40); out.push([x, f(x)]); } return out; };
  const G = { // thumbnail library
    trap: thumb([[0, 0], [2.5, 7], [7, 7], [10, 0]]), rise: thumb([[0, 0], [10, 9]]), spike: thumb([[0, 0], [5, 9], [10, 0]]),
    drain: thumb([[0, 9], [7, 0], [10, 0]]), fill: thumb([[0, 0], [7, 9], [10, 9]]), flat: thumb([[0, 6], [10, 6]]),
    expo: thumb(curve((x) => 0.3 * Math.pow(1.4, x), 0, 10)), log: thumb(curve((x) => 3 * Math.sqrt(x), 0, 10)), line: thumb([[0, 1], [10, 9]]),
    bounce: thumb(null, { segs: [curve((x) => 9 - 9 * Math.pow(x / 2.5, 2), 0, 2.5, 12), curve((x) => 5.5 * (1 - Math.pow((x - 4.6) / 2.1, 2)), 2.5, 6.7, 14), curve((x) => 3 * (1 - Math.pow((x - 8.2) / 1.5, 2)), 6.7, 9.7, 12)] }),
    hill: thumb(curve((x) => 9 - 0.36 * Math.pow(x - 5, 2), 0, 10)), zig: thumb([[0, 9], [3, 3], [5, 6], [10, 1]]),
  };
  const sketchDescriptions = {
    trap: "Rises, stays level, then falls to zero", rise: "Rises at a steady rate",
    spike: "Rises to one point, then immediately falls", drain: "Falls steadily to zero, then stays there",
    fill: "Rises steadily, then levels off", flat: "Stays at the same height", expo: "Rises faster and faster",
    log: "Rises more and more slowly", line: "Rises in a straight line",
    bounce: "Curved bounces with successively lower peaks", hill: "One smooth hill",
    zig: "Falls, rises, then falls along straight segments",
  };
  const LEVELS = [
    { stage: 1, ctx: "A ball's height h (meters) t seconds after it's thrown: h = −5(t − 2)² + 20.", f: (t) => -5 * Math.pow(t - 2, 2) + 20, r: [0, 4.5, 0, 24, 0.5, 4], v: ["t", "h"],
      qs: [["Maximum height: [] m", [20]], ["It reaches the maximum at t = [] s", [2]], ["It lands (h = 0) at t = [] s", [4]]], tip: "Read the key features straight off the graph." },
    { stage: 1, ctx: "Temperature T (°C) h hours after midnight: T = −0.5(h − 14)² + 30, from 6 a.m. to 10 p.m.", f: (h) => -0.5 * Math.pow(h - 14, 2) + 30, r: [6, 22, 0, 34, 2, 4], v: ["h", "T"],
      qs: [["The warmest temperature is []°C", [30]], ["It happens at h = [] (2 p.m.)", [14]], { c: "When is it getting warmer?", o: [["From 6 to 14 (6 a.m. to 2 p.m.)", ""], ["From 14 to 22", "After 2 p.m. the graph goes down."], ["The whole day", "The graph rises, then falls."]] }],
      tip: "Increasing means the graph goes up as you move right." },
    { stage: 1, ctx: "Savings S (dollars) after w weeks of spending: S = 500 − 40w.", f: (w) => 500 - 40 * w, r: [0, 14, 0, 560, 1, 100], v: ["w", "S"],
      qs: [["Starting savings (the S-intercept): $[]", [500]], ["The savings run out (S = 0) at w = []", [12.5]], { c: "Is the function increasing or decreasing?", o: [["Decreasing: $40 less each week", ""], ["Increasing", "S gets smaller as w grows."]] }],
      tip: "Intercepts have meanings in context." },
    { stage: 1, ctx: "A town's population P (thousands) t years from now: P = 2(1.5)ᵗ.", f: (t) => 2 * Math.pow(1.5, t), r: [0, 6, 0, 24, 1, 4], v: ["t", "P"],
      qs: [["Today's population (P-intercept): [] thousand", [2]], { c: "What happens to P as t keeps growing?", o: [["It grows faster and faster without limit", ""], ["It levels off", "Each year multiplies P by 1.5 again."], ["It goes back down", "1.5 > 1, so P keeps growing."]] }],
      tip: "End behavior: what happens far to the right?" },
    { stage: 2, desc: "A car speeds up from a stop, cruises at a steady speed, then slows to a stop. (speed vs. time)", opts: [["trap", ""], ["spike", "This car never cruises at a steady speed."], ["rise", "The car never slows down here."]],
      tip: "Sketch it in your head before you look at the choices." },
    { stage: 2, desc: "A tub drains at a steady rate until it's empty, then stays empty. (water vs. time)", opts: [["drain", ""], ["fill", "That tub is filling up."], ["expo", "Draining at a steady rate is a straight line down."]],
      tip: "Steady rate means a straight line." },
    { stage: 2, desc: "A plant grows slowly at first, then faster and faster. (height vs. time)", opts: [["expo", ""], ["log", "This one grows fast at first, then slower."], ["line", "A line grows at the same rate the whole time."]],
      tip: "Faster and faster means the graph gets steeper." },
    { stage: 2, desc: "A ball is dropped and bounces, each bounce lower than the last. (height vs. time)", opts: [["bounce", ""], ["hill", "That's one throw with no bounces."], ["zig", "Bounces are curved arcs, and they don't go below the ground."]],
      tip: "Last sketch: picture the ball." },
    { stage: 3, table: [[-2, 5], [-1, 0], [0, -3], [1, -4], [2, -3], [3, 0], [4, 5]],
      qs: [["The minimum value is []", [-4]], ["It happens at x = []", [1]], ["The zeros are x = [] and x = []", [-1, 3], true], ["The graph is symmetric about the line x = []", [1]]],
      tip: "Tables have key features too." },
    { stage: 3, table: [[-2, 5], [-1, 0], [0, -3], [1, -4], [2, -3], [3, 0], [4, 5]],
      qs: [{ c: "Where is the function negative?", o: [["Between x = −1 and x = 3", ""], ["Where x is negative", "Negative means the OUTPUT is below 0."], ["Everywhere except the zeros", "Check f(4) = 5."]] },
        { c: "Where is it increasing?", o: [["For x > 1", ""], ["For x < 1", "From −2 to 1 the values go down: 5, 0, −3, −4."], ["Everywhere", "It goes down, then up."]] }],
      tip: "Same table. Positive, negative, increasing, decreasing." },
    { stage: 3, ctx: "y = 2ˣ", f: (x) => Math.pow(2, x), r: [-5, 4, -1, 12, 1, 2], v: ["x", "y"],
      qs: [{ c: "As x goes far to the left (x → −∞), y gets closer to…", o: [["0, but never reaches it", ""], ["−∞", "2ˣ is always positive."], ["1", "2⁰ = 1, but 2⁻¹⁰ is tiny."]] }, ["The y-intercept is []", [1]]],
      tip: "End behavior in both directions." },
    { stage: 3, ctx: "A shop's profit P (hundreds of dollars) at price x dollars: P = −(x − 5)² + 9.", f: (x) => -Math.pow(x - 5, 2) + 9, r: [0, 10, -12, 12, 1, 2], v: ["x", "P"],
      qs: [["Profit is positive for [] < x < []", [2, 8]], ["The maximum profit is [] hundred dollars", [9]], { c: "What does the symmetry tell you?", o: [["Prices $1 above and below $5 give the same profit", ""], ["Profit is the same for every price", "Only pairs of prices equally far from 5 match."], ["Nothing useful", "It means P(4) = P(6), P(3) = P(7), …"]] }],
      tip: "Last one: put it all together." },
  ];

  GameShell.register({
    slug: "f-if-b-4",
    title: "Blind Sketch",
    firstMove: "Find the top of the ball’s path. Read across to the height axis and enter the height in meters.",
    subtitle: "Interpret key features of graphs and tables, and sketch from descriptions",
    stages: { 1: "Stage 1 · Read the graph", 2: "Stage 2 · Sketch from words", 3: "Stage 3 · Tables and end behavior" },
    levels: LEVELS,
    help: {
      intro: "Graphs tell stories. The key features are <b>intercepts</b>, where it's <b>increasing</b> or <b>decreasing</b>, <b>positive</b> or <b>negative</b>, its <b>maximum</b> or <b>minimum</b>, <b>symmetry</b>, and <b>end behavior</b>.",
      steps: [
        "Stage 1: read key features from a graph in context.",
        "Stage 2: imagine the sketch from a description, then pick it.",
        "Stage 3: find the same features in a table, and far to the left or right.",
        "Fewer wrong answers means more stars.",
      ],
      note: "Always say what a feature means in the situation.",
    },
    load(lv, api) {
      const steps = [];
      if (lv.desc) {
        api.stage.appendChild(api.h("div", { class: "stage-text", style: { fontSize: "22px", lineHeight: 1.4 } }, lv.desc));
        steps.push({ type: "choice", prompt: "Which sketch matches?", options: lv.opts.map((o, k) => ({ label: G[o[0]] + "<span>" + sketchDescriptions[o[0]] + "</span>", ok: k === 0, why: o[1] })).sort((a, b) => (a.label < b.label ? -1 : 1)), done: "Matched the description" });
      } else {
        if (lv.ctx) api.stage.appendChild(api.h("div", { class: "stage-text", style: { fontSize: "21px" } }, lv.ctx));
        if (lv.f) {
          const P = Plane.create({ xmin: lv.r[0], xmax: lv.r[1], ymin: lv.r[2], ymax: lv.r[3], xstep: lv.r[4], ystep: lv.r[5], xtick: lv.r[4] * (lv.r[1] - lv.r[0] > 10 ? 2 : 1), ytick: lv.r[5], xlabel: lv.v[0], ylabel: lv.v[1], h: 380 });
          const svg = api.svg("0 0 900 380", "Graph");
          svg.innerHTML = P.grid() + P.curve(lv.f, { from: Math.max(lv.r[0], lv.v[0] === "h" ? 6 : lv.r[0]) });
          api.stage.appendChild(svg);
        }
        if (lv.table) {
          const t = api.h("table", { class: "area", "aria-label": "Table of values" });
          t.appendChild(api.h("tr", null, api.h("th", null, "x"), ...lv.table.map((r) => api.h("td", { style: { height: "auto", fontWeight: 800 } }, Alg.num(r[0])))));
          t.appendChild(api.h("tr", null, api.h("th", null, "f(x)"), ...lv.table.map((r) => api.h("td", { style: { height: "auto", fontWeight: 800 } }, Alg.num(r[1])))));
          api.stage.appendChild(t);
        }
        lv.qs.forEach((q) => {
          if (Array.isArray(q)) steps.push({ type: "input", prompt: q[0], answers: q[1], unordered: !!q[2], hint: "Look at the graph or table carefully: where is it highest, lowest, or crossing zero?" });
          else steps.push({ type: "choice", prompt: q.c, options: q.o.map((o, k) => ({ label: o[0], ok: k === 0, why: o[1] })), done: q.c + " " + q.o[0][0] });
        });
      }
      Steps.run(api, { steps, logTitle: "Key features", result: () => ({ answer: lv.desc ? "Sketch matched" : "Key features found", check: "Every feature has a meaning in context ✓" }) });
    },
    guide: {
      summary: "A 12-level game about the key features of functions. Students read maximums, intercepts, intervals of increase and end behavior from graphs in context, choose sketches that match verbal descriptions, and find features in tables.",
      also: "<span class='code'>AI.F-IF.B.5</span> relating domain to context.",
      practices: "MP2 Reason abstractly and quantitatively · MP4 Model with mathematics",
      evidence: "Ask the student to describe the peak in one sentence using both coordinates and their units. Listen for a distinction between when and how high.",
      goals: [
        "Interpret intercepts, maximums and minimums, intervals of increase and decrease, positive and negative intervals, symmetry and end behavior in context.",
        "Sketch (choose) graphs that show key features from a verbal description.",
        "Identify the same features from a table of values.",
      ],
      howItWorks: "Stage 1 shows a graph with a context and asks for features with their meaning. Stage 2 gives a description and three sketches with plausible distractors. Stage 3 uses a table and an exponential for end behavior, and ends with a profit context combining several features.",
      stageNotes: {
        1: { sees: "Graphs of a thrown ball, temperature, savings and population.", builds: "Reading and interpreting key features." },
        2: { sees: "Descriptions and three sketches each.", builds: "Translating words to graph shapes: steady, faster and faster, slower and slower." },
        3: { sees: "A table, y = 2ˣ, and a profit parabola.", builds: "Features without a graph; end behavior; symmetry in context." },
      },
      discussion: [
        "What does the S-intercept mean for the savings graph? The w-intercept?",
        "How can you tell from a table where the minimum is?",
        "Why does y = 2ˣ never reach 0 as x goes to the left?",
      ],
      misconceptions: [
        ["\"Negative\" means where x is negative", "Level 10's distractor."],
        ["A steady rate looks curved", "Level 6 contrasts the drain with an exponential."],
        ["Faster growth looks like a steeper start", "Level 7 contrasts growing faster with growing slower."],
      ],
      exitTicket: {
        items: ["h = −5t² + 30t gives a ball's height. When does it land?", "Sketch: a bike rides up a hill slowly, then down quickly.", "A table has f(0) = 4, f(1) = 1, f(2) = 0, f(3) = 1, f(4) = 4. Find the minimum and the line of symmetry."],
        answers: ["t = 6 seconds (h = −5t(t − 6)).", "Distance vs. time: a gentle rise, then a steep rise (it keeps moving forward); speed vs. time: low, then high.", "Minimum 0 at x = 2; symmetric about x = 2."],
      },
    },
    answerKey(lv) {
      if (lv.desc) return { prompt: lv.desc, solution: "Choose the sketch: " + { trap: "speed up, flat, slow down", drain: "straight line down, then flat at 0", expo: "curving upward, steeper and steeper", bounce: "decreasing arcs" }[lv.opts[0][0]], answer: "the " + lv.opts[0][0] + " sketch" };
      const fill = (q) => Array.isArray(q) ? (() => { let k = 0; return q[0].replace(/\[\]/g, () => Alg.num(q[1][k++])); })() : q.c + " " + q.o[0][0];
      const nums = lv.qs.filter(Array.isArray).map((q) => q[1].map(Alg.num).join(" and "));
      return { prompt: lv.ctx || "Table of values", solution: lv.qs.map(fill).join("; "), answer: nums.length ? nums.join("; ") : lv.qs[0].o[0][0] };
    },
  });
})();
