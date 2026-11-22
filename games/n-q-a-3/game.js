/* Precision Check · AI.N-Q.A.3 */
(function () {
  const LEVELS = [
    { stage: 1, ctx: "A ruler is marked in millimeters. A pencil measures between 15.2 and 15.3 cm, closer to 15.2.", steps: [["ch", "How should you report the length?", [["15.2 cm", ""], ["15.2384 cm", "The ruler can't measure ten-thousandths of a cm. That's false precision."], ["15 cm", "That throws away the millimeter the ruler can measure."]]]],
      answer: "15.2 cm", check: "Report what the tool can measure ✓", tip: "Report as precisely as your tool allows, and no more." },
    { stage: 1, ctx: "A rectangle measures 4.3 m by 2.1 m (each to the nearest 0.1 m). Calculator: 9.03 m².", steps: [["ch", "Reasonable report:", [["About 9.0 m²", ""], ["9.03000 m²", "Extra zeros claim precision the measurements don't have."], ["9.0300000001 m²", "Calculators show more digits than the measurements justify."]]]],
      answer: "About 9.0 m²", check: "Two digits measured, so about two meaningful digits ✓", tip: "Calculated answers can't be more precise than the measurements." },
    { stage: 1, ctx: "A kitchen scale weighs to the nearest gram. 4 apples weigh 742 g.", steps: [["in", "Average apple, to the nearest gram: [] g", [186]]], answer: "186 g", check: "742 ÷ 4 = 185.5 → 186 ✓", tip: "Match the scale's precision." },
    { stage: 1, ctx: "A car drove 237 km in 3 hours (both rounded).", steps: [["ch", "Average speed report:", [["About 79 km/h", ""], ["79.000000 km/h", "The extra zeros aren't measured."], ["80 km/h exactly", "It's an average from rounded numbers, so not exact."]]]], answer: "About 79 km/h", check: "237 ÷ 3 = 79 ✓", tip: "Don't add precision you don't have." },
    { stage: 2, ctx: "3 friends split a $50 bill evenly.", steps: [["in", "Each pays $[] (nearest cent)", [16.67]]], answer: "About $16.67 per person", check: "50 ÷ 3 = 16.666…, rounding gives $16.67. To pay exactly $50, two friends pay $16.67 and one pays $16.66 ✓", tip: "Money is precise to the cent." },
    { stage: 2, ctx: "A stopwatch (to 0.01 s) times a 100 m sprint at 12.34 s.", steps: [["in", "Speed = 100 ÷ 12.34 ≈ [] m/s (2 decimal places)", [8.1], { tol: 0.006 }]], answer: "About 8.10 m/s", check: "8.1037… rounds to 8.10 ✓", tip: "Reasonable rounding for a race." },
    { stage: 2, ctx: "A news site says the world population is 8,045,311,447.", steps: [["ch", "What's the issue?", [["Population is estimated; \"about 8.0 billion\" is more honest", ""], ["Nothing: big numbers are always exact", "No one can count billions of people to the last person."], ["It should be rounded to 8,045,311,000", "Still claims far more accuracy than an estimate has."]]]], answer: "About 8.0 billion", check: "Estimates should be reported as estimates ✓", tip: "Exactness can be fake." },
    { stage: 2, ctx: "A tape measure gives a room as 4.27 m by 3.15 m. Calculator: 13.4505 m².", steps: [["ch", "Best report for buying flooring:", [["About 13.5 m²", ""], ["13.4505 m²", "Four decimals of square meters aren't measurable with a tape."], ["13 m²", "Rounding down risks buying too little."]]]], answer: "About 13.5 m²", check: "Sensible precision, rounded up for a purchase ✓", tip: "Precision AND the purpose matter." },
    { stage: 3, ctx: "A square's side is 6.2 cm, measured to ±0.05 cm.", steps: [["in", "The side is really between [] and [] cm", [6.15, 6.25]], ["in", "So the perimeter is at most [] cm", [25]]], answer: "Perimeter 24.8 ± 0.2 cm", check: "4 × 6.25 = 25.0 ✓", tip: "Measurements have error." },
    { stage: 3, ctx: "Choose the tool and precision.", steps: [["ch", "A nurse measuring a 2.5 mL dose should use…", [["A syringe marked to 0.1 mL", ""], ["A 1-liter jug", "Far too rough: 2.5 mL would be invisible."], ["Their eyes", "Medicine needs precise measurement."]]], ["ch", "Filling a swimming pool, report volume to the nearest…", [["thousand liters or so", ""], ["milliliter", "Pointless precision for a pool."]]]], answer: "Precision matches the purpose", check: "Different jobs need different precision ✓", tip: "Precision depends on the situation." },
    { stage: 3, ctx: "A tile is 2.4 cm by 3.6 cm.", steps: [["in", "Area: [] cm²", [8.64]], ["ch", "A student rounded first: 2 × 4 = 8 cm². What went wrong?", [["Rounding too early made the answer less accurate", ""], ["Nothing", "8 is quite far from 8.64."], ["They should round to the nearest 10", "That makes it even worse."]]]], answer: "8.64 cm² (about 8.6)", check: "Round at the end, not the start ✓", tip: "When should you round?" },
    { stage: 3, ctx: "A 1 L bottle of juice is shared equally among 7 people.", steps: [["in", "Each gets about [] mL (nearest mL)", [143]]], answer: "About 143 mL", check: "1000 ÷ 7 = 142.857… ✓", tip: "Last one: a sensible report." },
  ];
  Timeline.stepGame({
    slug: "n-q-a-3", title: "Precision Check", firstMove: "Decide how precisely the tool can measure, then report the answer to that precision.",
    subtitle: "Choose a level of accuracy that fits the limits of measurement",
    stages: { 1: "Stage 1 · What can the tool measure?", 2: "Stage 2 · Calculated answers", 3: "Stage 3 · Error, tools and rounding" }, levels: LEVELS,
    help: { intro: "A reported number should be as precise as the measurement, and no more. Too many digits is <b>false precision</b>; too few throws information away.",
      steps: ["Look at how precise the measurements are.", "Choose or compute a report with matching precision.", "Round at the end, and think about the purpose (buying, safety, estimating).", "Fewer wrong answers means more stars."], note: "Round as each question asks." },
    hint: "Match the precision of the measurement and round at the end.",
    guide: {
      summary: "A 12-level game about precision: reporting measurements and calculated results with accuracy that fits the measuring tool, recognizing false precision, handling measurement error, and rounding at the right time for the purpose.",
      also: "<span class='code'>AI.N-Q.A.1</span> using units.",
      practices: "MP6 Attend to precision",
      goals: ["Choose a level of accuracy appropriate to limitations on measurement when reporting quantities.", "Recognize false precision in calculator outputs and estimates.", "Reason about measurement error and when to round."],
      howItWorks: "Each level gives a measurement situation. Students choose reports (distractors show false precision or over-rounding) or compute rounded results, and reason about error and tools.",
      stageNotes: { 1: { sees: "Rulers, rectangles, scales, speeds.", builds: "Precision of tools." }, 2: { sees: "Money, sprints, populations, flooring.", builds: "Rounding calculated values for a purpose." }, 3: { sees: "Error bounds, tool choice, early rounding.", builds: "Accuracy reasoning." } },
      discussion: ["Why is 15.2384 cm a misleading report from a millimeter ruler?", "Why might you round flooring area up?", "What goes wrong when you round before multiplying?"],
      misconceptions: [["More digits = more accurate", "Levels 1, 2, 4."], ["Rounding early", "Level 11."], ["Exact-looking estimates", "Level 7."]],
      exitTicket: { items: ["A ruler measures to the nearest 0.1 cm. A side is 7.3 cm. Report the area of the square.", "Split $100 among 3 people.", "Why is \"about 330 million people\" better than \"331,893,745 people\" for a country?"],
        answers: ["About 53 cm² (53.29 is more digits than justified).", "$33.33 each (with 1 cent left over).", "Population counts are estimates that change daily."] },
    },
  });
})();
