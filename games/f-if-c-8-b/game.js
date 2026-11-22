/* Read the Rate · AI.F-IF.C.8.b */
(function () {
  const GD = [["Growth", ""], ["Decay", "The base is bigger than 1, so each step multiplies by more than 1."]];
  const DG = [["Decay", ""], ["Growth", "The base is less than 1, so each step shrinks the amount."]];
  const LEVELS = [
    { stage: 1, ctx: "y = (1.02)ᵗ", steps: [["ch", "Growth or decay?", GD], ["in", "Rate: []% per period", [2]]], answer: "2% growth", check: "1.02 = 1 + 0.02 ✓", tip: "Compare the base with 1. The difference is the rate." },
    { stage: 1, ctx: "y = (0.97)ᵗ", steps: [["ch", "Growth or decay?", DG], ["in", "Rate: []% per period", [3]]], answer: "3% decay", check: "0.97 = 1 − 0.03 ✓", tip: "Below 1 means shrinking." },
    { stage: 1, ctx: "y = 50(1.25)ᵗ", steps: [["ch", "Growth or decay?", GD], ["in", "Rate: []% per period", [25]], ["in", "Starting value: []", [50]]], answer: "Starts at 50, grows 25%", check: "1.25 = 1 + 0.25 ✓", tip: "The coefficient is the starting value." },
    { stage: 1, ctx: "y = 800(0.6)ᵗ", steps: [["ch", "Growth or decay?", DG], ["in", "Rate: []% per period", [40]]], answer: "40% decay", check: "0.6 = 1 − 0.4 ✓", tip: "A big decay." },
    { stage: 2, ctx: "y = (1.01)<sup>12t</sup>, t in years", steps: [["in", "Rate per month: []%", [1]], ["in", "Per year: 1.01¹² ≈ [] (4 decimal places)", [1.1268], { tol: 0.0006 }], ["in", "That's about []% per year", [12.68], { tol: 0.011 }]],
      answer: "1% per month ≈ 12.68% per year", check: "1.01¹² ≈ 1.1268 ✓", tip: "A standard example: the exponent counts months." },
    { stage: 2, ctx: "y = (1.2)<sup>t/10</sup>, t in years", steps: [["in", "Rate per 10 years: []%", [20]], ["in", "Per year: 1.2^(1/10) ≈ [] (4 decimal places)", [1.0184], { tol: 0.0002 }], ["in", "About []% per year", [1.84], { tol: 0.011 }]],
      answer: "20% per decade ≈ 1.84% per year", check: "1.0184¹⁰ ≈ 1.2 ✓", tip: "Here the exponent counts decades." },
    { stage: 2, ctx: "A house bought for $250,000 is worth V = 250000(1.04)ᵗ after t years.", steps: [["ch", "Appreciation or depreciation?", [["Appreciation: it gains value", ""], ["Depreciation", "1.04 > 1."]]], ["in", "Rate: []% per year", [4]], ["in", "Value after 1 year: $[]", [260000]]],
      answer: "Appreciates 4% per year", check: "250000 × 1.04 = 260000 ✓", tip: "Appreciation means gaining value." },
    { stage: 2, ctx: "A car bought for $30,000 is worth V = 30000(0.88)ᵗ.", steps: [["ch", "Appreciation or depreciation?", [["Depreciation: it loses value", ""], ["Appreciation", "0.88 < 1."]]], ["in", "Rate: []% per year", [12]], ["in", "Value after 1 year: $[]", [26400]]],
      answer: "Depreciates 12% per year", check: "30000 × 0.88 = 26400 ✓", tip: "Cars lose value." },
    { stage: 3, ctx: "y = 2<sup>t/5</sup>", steps: [["ch", "This doubles every…", [["5 time units", ""], ["2 time units", "The 5 in t/5 sets the doubling time."], ["t/5 units", "It's a fixed time: 5."]]], ["in", "Per unit: 2^(1/5) ≈ [] (3 decimal places), about 14.9% growth", [1.149], { tol: 0.0011 }]],
      answer: "Doubles every 5; ≈ 14.9% per unit", check: "1.149⁵ ≈ 2 ✓", tip: "Doubling time inside the exponent." },
    { stage: 3, ctx: "A = 120(0.5)<sup>t/8</sup> mg of medicine after t hours.", steps: [["in", "Half-life: [] hours", [8]], ["in", "Hourly factor 0.5^(1/8) ≈ [] (3 decimal places)", [0.917], { tol: 0.0011 }], ["in", "About []% lost per hour", [8.3], { tol: 0.11 }]],
      answer: "Half-life 8 h; ≈ 8.3% per hour", check: "0.917⁸ ≈ 0.5 ✓", tip: "Half-life inside the exponent." },
    { stage: 3, ctx: "Classify each one.", steps: [["ch", "y = 4(1.5)<sup>−t</sup> is…", [["Decay: 1.5⁻ᵗ = (1/1.5)ᵗ ≈ 0.67ᵗ", ""], ["Growth: 1.5 > 1", "The negative exponent flips it: (1.5)⁻ᵗ = (2/3)ᵗ."]]],
      ["ch", "y = 0.5(3)ᵗ is…", [["Growth: the base 3 > 1", ""], ["Decay: 0.5 < 1", "0.5 is the starting value; the base is 3."]]]], answer: "Look at the base after rewriting", check: "Base > 1 grows; base < 1 decays ✓", tip: "Careful: what is the base, really?" },
    { stage: 3, ctx: "Which grows faster per year: A = (1.06)ᵗ or B = (1.03)<sup>2t</sup>?", steps: [["in", "B per year: 1.03² = [] (4 decimal places)", [1.0609], { tol: 0.00006 }], ["ch", "Faster:", [["B, slightly: 6.09% vs 6%", ""], ["A", "1.0609 > 1.06."], ["Equal", "Compounding twice adds a bit."]]]],
      answer: "B ≈ 6.09% per year", check: "1.0609 > 1.06 ✓", tip: "Last one: compare per year." },
  ];
  Timeline.stepGame({
    slug: "f-if-c-8-b", title: "Read the Rate", subtitle: "Interpret exponential expressions: growth, decay, appreciation and depreciation",
    stages: { 1: "Stage 1 · Base vs. 1", 2: "Stage 2 · Exponents that count months and decades", 3: "Stage 3 · Doubling, half-life, tricky bases" }, levels: LEVELS,
    help: { intro: "In y = a · bᵗ, the base b tells the story: b > 1 grows by (b − 1), b < 1 decays by (1 − b).",
      steps: ["Is the base above or below 1?", "Turn the base into a percent: 1.04 → 4% growth, 0.88 → 12% decay.", "If the exponent is 12t or t/10, think about what one period is.", "Fewer wrong answers means more stars."],
      note: "A calculator is fine for powers and roots." },
    hint: "Compare the base with 1, and think about what one period is.",
    guide: {
      summary: "A 12-level game for reading exponential expressions: growth or decay, percent rates, appreciation and depreciation, and rates when the exponent counts months, decades, doubling times or half-lives, using the standard's examples (1.02)ᵗ, (0.97)ᵗ, (1.01)^(12t) and (1.2)^(t/10).",
      also: "<span class='code'>AI.A-SSE.B.3.c</span> transforming exponential expressions.",
      practices: "MP2 Reason abstractly and quantitatively · MP7 Look for and make use of structure",
      goals: ["Classify an exponential function as growth or decay from its base.", "Identify the percent rate of change, including appreciation and depreciation.", "Interpret exponents such as 12t, t/10, t/5 and −t."],
      howItWorks: "Each level shows an exponential expression, often in a financial context. Students classify it, enter the percent rate, and sometimes compute a converted rate or a value after one period.",
      stageNotes: { 1: { sees: "Bases above and below 1.", builds: "b − 1 and 1 − b as rates." }, 2: { sees: "Monthly and decade exponents; a house and a car.", builds: "Rates per different periods; appreciation vs. depreciation." }, 3: { sees: "Doubling time, half-life, a negative exponent.", builds: "Structure of the exponent; comparing rates." } },
      discussion: ["Why does 0.97 mean 3% decay?", "Is 1% per month the same as 12% per year?", "How is 4(1.5)⁻ᵗ a decay function?"],
      misconceptions: [["0.88 means 88% loss", "Level 8."], ["Reading the coefficient as the base", "Level 11."], ["Negative exponent ignored", "Level 11."]],
      exitTicket: { items: ["Growth or decay, and what rate: y = 7(0.92)ᵗ?", "A painting's value is V = 5000(1.06)ᵗ. Interpret 5000 and 1.06.", "What yearly rate does (1.005)^(12t) represent?"],
        answers: ["Decay, 8% per period.", "$5000 now; appreciates 6% per year.", "1.005¹² ≈ 1.0617: about 6.17% per year."] },
    },
  });
})();
