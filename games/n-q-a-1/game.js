/* Unit Chain · AI.N-Q.A.1 */
(function () {
  const fr = (a, b) => '<span class="frac"><span>' + a + "</span><span>" + b + "</span></span>";
  const LEVELS = [
    { stage: 1, ctx: "3 ft × " + fr("12 in", "1 ft"), steps: [["ch", "Which units cancel?", [["ft: one on top, one on the bottom", ""], ["in", "Inches appear only on top, so they stay."], ["Nothing cancels", "ft on top and ft on the bottom cancel, like a/a = 1."]]], ["in", "3 ft = [] in", [36]]],
      answer: "36 in", check: "ft cancels, leaving inches ✓", tip: "A conversion factor equals 1. Units cancel like fractions." },
    { stage: 1, ctx: "90 min × " + fr("1 h", "60 min"), steps: [["in", "90 min = [] h", [1.5]]], answer: "1.5 h", check: "90 ÷ 60 = 1.5 ✓", tip: "Put the unit you want to cancel on the bottom." },
    { stage: 1, ctx: "5 km × " + fr("1000 m", "1 km") + " × " + fr("100 cm", "1 m"), steps: [["in", "5 km = [] m = [] cm", [5000, 500000]]], answer: "500,000 cm", check: "km cancels, then m cancels ✓", tip: "A chain of two links." },
    { stage: 1, ctx: "60 " + fr("mi", "h") + " × " + fr("1 h", "60 min"), steps: [["in", "60 mi/h = [] mi/min", [1]]], answer: "1 mile per minute", check: "h cancels ✓", tip: "Rates convert the same way." },
    { stage: 2, ctx: "A cheetah runs 30 m/s. How fast is that in km/h?", steps: [["ch", "Set up the chain:", [["30 " + fr("m", "s") + " × " + fr("3600 s", "1 h") + " × " + fr("1 km", "1000 m"), ""], ["30 " + fr("m", "s") + " × " + fr("1 h", "3600 s") + " × " + fr("1 km", "1000 m"), "Then seconds don't cancel: you'd get s² on the bottom."], ["30 × 3600 × 1000", "Multiplying by 1000 makes it bigger; there are fewer km than m."]]], ["in", "30 m/s = [] km/h", [108]]],
      answer: "108 km/h", check: "30 × 3600 ÷ 1000 = 108 ✓", tip: "Two units change at once." },
    { stage: 2, ctx: "A car uses 8 L of fuel per 100 km. How much for a 350 km trip?", steps: [["in", "350 km × " + fr("8 L", "100 km") + " = [] L", [28]]], answer: "28 L", check: "km cancels, leaving liters ✓", tip: "The units tell you how to multiply." },
    { stage: 2, ctx: "Aluminum has a density of 2.7 g/cm³. What's the mass of 50 cm³?", steps: [["in", "50 cm³ × " + fr("2.7 g", "1 cm³") + " = [] g", [135]]], answer: "135 g", check: "cm³ cancels ✓", tip: "Density is a conversion factor too." },
    { stage: 2, ctx: "d = rt. A train goes 80 km/h for 45 minutes.", steps: [["in", "First make the units match: 45 min = [] h", [0.75]], ["in", "d = 80 × 0.75 = [] km", [60]]], answer: "60 km", check: "km/h × h = km ✓", tip: "Units in a formula must agree." },
    { stage: 3, ctx: "You're graphing monthly costs from $0 to $1,800 on a grid with 10 lines.", steps: [["ch", "Best scale for the cost axis:", [["$200 per grid line", ""], ["$10 per grid line", "That only reaches $100."], ["$1,000 per grid line", "Everything would squeeze into the bottom two lines."]]]], answer: "$200 per line", check: "10 × 200 = 2000 covers 1800 ✓", tip: "Choose a scale that fits and spreads out the data." },
    { stage: 3, ctx: "Room temperatures this week were between 68 °F and 75 °F.", steps: [["ch", "Where should the temperature axis start?", [["Near 65 °F, with a mark showing the axis doesn't start at 0", ""], ["At 0 °F, always", "Then all the data sits in a thin band at the top and changes are hard to see."], ["At 75 °F", "Then the data would be off the graph."]]]], answer: "Start near 65 °F, marked", check: "The origin should fit the data and be labeled clearly ✓", tip: "The origin is a choice too." },
    { stage: 3, ctx: "A graph shows pay (dollars) on the y-axis against hours worked on the x-axis.", steps: [["ch", "The slope of the line is measured in…", [["dollars per hour", ""], ["hours per dollar", "Slope is y-units per x-unit."], ["dollars", "A slope is a rate: one unit per another."]]]], answer: "dollars per hour", check: "Slope units = y units ÷ x units ✓", tip: "Units of a slope." },
    { stage: 3, ctx: "One gallon of paint covers 350 ft². A wall is 12 ft by 30 ft and needs 2 coats.", steps: [["in", "Area of one coat: [] ft²", [360]], ["in", "Total paint: 720 ft² × " + fr("1 gal", "350 ft²") + " ≈ [] gal (2 decimal places)", [2.06], { tol: 0.006 }], ["in", "Paint is sold in whole gallons. Buy [] gallons", [3]]],
      answer: "3 gallons", check: "2.06 rounds UP to 3 because you can't buy part of a gallon ✓", tip: "Last one: a multi-step problem." },
  ];
  Timeline.stepGame({
    slug: "n-q-a-1", title: "Unit Chain", firstMove: "Set up the conversion so the unit you don't want cancels, then multiply.",
    subtitle: "Use units to understand problems, convert, and choose scales",
    stages: { 1: "Stage 1 · Conversion chains", 2: "Stage 2 · Units in rates and formulas", 3: "Stage 3 · Scales and origins on graphs" }, levels: LEVELS,
    help: { intro: "Units are a guide. A conversion factor like (12 in / 1 ft) equals 1, and units cancel like fractions.",
      steps: ["Put the unit you want to get rid of in the denominator.", "Cancel matching units on top and bottom, then multiply the numbers.", "In formulas, make the units match first.", "Fewer wrong answers means more stars."], note: "Decimals are fine. Round up when you have to buy whole items." },
    hint: "Check which units cancel, then multiply the numbers.",
    guide: {
      summary: "A 12-level game about units: building conversion chains where units cancel like fractions, converting units inside rates and formulas, and choosing scales and origins for graphs, ending with a multi-step painting problem.",
      also: "<span class='code'>AI.N-Q.A.3</span> appropriate precision.",
      practices: "MP6 Attend to precision · MP4 Model with mathematics",
      goals: ["Use units to guide the solution of multi-step problems.", "Choose and interpret units consistently in formulas.", "Choose and interpret the scale and origin of a graph."],
      howItWorks: "Each level shows a conversion chain or a problem. Students identify which units cancel, choose correct chain setups (distractors leave units uncancelled), compute results, and choose graph scales and origins.",
      stageNotes: { 1: { sees: "Length, time and rate conversions.", builds: "Factors equal to 1; cancelling." }, 2: { sees: "Speed, fuel use, density, d = rt.", builds: "Rates; matching units in formulas." }, 3: { sees: "Graph scales, origins, slope units, painting.", builds: "Scales; units of rates; rounding in context." } },
      discussion: ["Why is (12 in / 1 ft) equal to 1?", "In d = rt, what goes wrong if t is in minutes and r in km per hour?", "Why round 2.06 gallons up instead of down?"],
      misconceptions: [["Upside-down conversion factors", "Level 5 distractors."], ["Mixing units in a formula", "Level 8."], ["Always starting axes at 0", "Level 10."]],
      exitTicket: { items: ["Convert 2.5 hours to minutes with a conversion factor.", "A printer prints 12 pages per minute. How long for 300 pages?", "Units of the slope for distance (km) vs. time (h)?"],
        answers: ["2.5 h × (60 min / 1 h) = 150 min", "300 pages × (1 min / 12 pages) = 25 min", "km per hour"] },
    },
  });
})();
