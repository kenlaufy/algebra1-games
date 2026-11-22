/* Counterexample Duel · AI.N-RN.B.3 */
(function () {
  const LEVELS = [
    { stage: 1, ctx: "Claim card: <b>√2 + 3 is irrational.</b>", steps: [["ch", "Defend or break it?", [["Defend: rational + irrational is always irrational", ""], ["Break it: 3 is rational, so the sum is rational", "If √2 + 3 were rational, subtracting 3 would make √2 rational too. But √2 is irrational."]]]], answer: "True", check: "Rational + irrational = irrational ✓", tip: "Defend true claims, break false ones." },
    { stage: 1, ctx: "Claim card: <b>1/2 + 1/3 is rational.</b>", steps: [["in", "Write the sum in lowest terms: 1/2 + 1/3 = [] / []", [5, 6]], ["ch", "So the claim is…", [["True: it's a ratio of integers", ""], ["False", "5/6 is a fraction of integers."]]]], answer: "5/6, rational", check: "3/6 + 2/6 = 5/6 ✓", tip: "Rational + rational." },
    { stage: 1, ctx: "Claim card: <b>The product of two irrational numbers is always irrational.</b>", steps: [["ch", "Pick the counterexample:", [["√2 · √2 = 2", ""], ["√2 · √3 = √6", "√6 is irrational, so this doesn't break the claim."], ["2 · 3 = 6", "Those numbers are rational."]]]], answer: "False: √2 · √2 = 2", check: "One counterexample breaks an \"always\" ✓", tip: "Break it with one example." },
    { stage: 1, ctx: "Claim card: <b>The sum of two irrational numbers is always irrational.</b>", steps: [["ch", "Pick the counterexample:", [["√2 + (−√2) = 0", ""], ["√2 + √3", "That sum is irrational."], ["π + π = 2π", "2π is irrational."]]]], answer: "False: √2 + (−√2) = 0", check: "0 is rational ✓", tip: "Look for cancelling." },
    { stage: 2, ctx: "Is <b>3√5</b> rational or irrational?", steps: [["ch", "Choose:", [["Irrational: nonzero rational × irrational", ""], ["Rational: 3 is rational", "Multiplying by a nonzero rational keeps it irrational."]]]], answer: "Irrational", check: "Nonzero rational × irrational ✓", tip: "Products." },
    { stage: 2, ctx: "Is <b>0 · √7</b> rational or irrational?", steps: [["in", "0 · √7 = []", [0]], ["ch", "So it's…", [["Rational, which is why the rule says \"nonzero\" rational", ""], ["Irrational", "0 · √7 = 0, which is rational."]]]], answer: "Rational (0)", check: "Zero is the exception ✓", tip: "Why does the rule say nonzero?" },
    { stage: 2, ctx: "Is <b>√9 + √2</b> rational or irrational?", steps: [["in", "√9 = []", [3]], ["ch", "So √9 + √2 is…", [["Irrational: 3 + an irrational number", ""], ["Rational: both are square roots", "√9 is rational, but √2 is not."]]]], answer: "Irrational", check: "Simplify first ✓", tip: "Not every square root is irrational." },
    { stage: 2, ctx: "Is <b>(2/3) · (9/4)</b> rational?", steps: [["in", "(2/3) · (9/4) = [] / []  (in lowest terms)", [3, 2]]], answer: "3/2, rational", check: "18/12 = 3/2 ✓", tip: "Rational × rational." },
    { stage: 3, ctx: "Proof card: why is a/b + c/d always rational (a, b, c, d integers; b, d ≠ 0)?", steps: [["ch", "Best reason:", [["It equals (ad + bc)/(bd): an integer over a nonzero integer", ""], ["Because fractions are always rational", "That's what we need to prove."], ["Because it checks for 1/2 + 1/3", "One example doesn't prove \"always\"."]]]], answer: "(ad + bc)/(bd)", check: "Integers are closed under + and × ✓", tip: "Defend with a proof, not an example." },
    { stage: 3, ctx: "Proof card: Suppose r is rational, x is irrational, and r + x = q is rational.", steps: [["ch", "Then x = q − r. Why is that a contradiction?", [["q − r is rational, but x is irrational", ""], ["q − r is irrational", "The difference of two rationals is rational."], ["It isn't a contradiction", "x can't be both rational and irrational."]]]], answer: "So r + x must be irrational", check: "Proof by contradiction ✓", tip: "Why rational + irrational is irrational." },
    { stage: 3, ctx: "Claim card: <b>π · (1/π) is irrational, because both factors are irrational.</b>", steps: [["in", "π · (1/π) = []", [1]], ["ch", "So the claim is…", [["Broken: the product is 1, which is rational", ""], ["Correct", "Two irrationals can multiply to a rational."]]]], answer: "False: it equals 1", check: "A second counterexample ✓", tip: "Another product to break." },
    { stage: 3, ctx: "Final duel: which number is rational?", steps: [["ch", "Choose:", [["(√3)²", ""], ["√3 + 1", "Rational + irrational is irrational."], ["2√3", "Nonzero rational × irrational is irrational."], ["π/2", "Irrational ÷ nonzero rational is still irrational."]]], ["in", "(√3)² = []", [3]]], answer: "(√3)² = 3", check: "Squares can cancel roots ✓", tip: "Last one: classify them all." },
  ];
  Timeline.stepGame({
    slug: "n-rn-b-3", title: "Counterexample Duel", firstMove: "Decide whether the claim is always true. If not, one counterexample breaks it.",
    subtitle: "Sums and products of rational and irrational numbers",
    stages: { 1: "Stage 1 · Break or defend", 2: "Stage 2 · Classify", 3: "Stage 3 · Prove it" }, levels: LEVELS,
    help: { intro: "Rational numbers are ratios of integers. Irrational numbers, like √2 and π, are not.",
      steps: ["rational + rational and rational × rational are rational.", "rational + irrational is irrational; nonzero rational × irrational is irrational.", "irrational + irrational and irrational × irrational can go either way: find counterexamples.", "Fewer wrong answers means more stars."], note: "One counterexample breaks an \"always\" claim; it takes a proof to defend one." },
    hint: "Simplify first, then apply the rules.",
    guide: {
      summary: "A 12-level card duel about rational and irrational numbers. Students defend or break claims about sums and products with counterexamples, classify numbers (watching for √9 and 0), and choose the reasons behind the closure proofs and the proof by contradiction.",
      also: "<span class='code'>AI.N-RN.A.2</span> radicals and exponents.",
      practices: "MP3 Construct viable arguments and critique the reasoning of others · MP6 Attend to precision",
      goals: ["Explain why sums and products of rational numbers are rational.", "Explain why rational + irrational and nonzero rational × irrational are irrational.", "Use counterexamples to show that irrational sums and products can be rational."],
      howItWorks: "Each card is a claim or a number. Students defend, break or classify it; some steps ask them to compute (5/6, 0, 3). Stage 3 asks for the reason in a proof.",
      stageNotes: { 1: { sees: "Claims about sums and products.", builds: "Counterexamples." }, 2: { sees: "3√5, 0 · √7, √9 + √2, fractions.", builds: "Classifying; the nonzero condition." }, 3: { sees: "Closure proof, contradiction, π · 1/π.", builds: "Arguments." } },
      discussion: ["Why does one example not prove a claim, but one counterexample disproves it?", "Why does the rule say nonzero rational?", "Explain the proof that rational + irrational is irrational."],
      misconceptions: [["All square roots are irrational", "Level 7."], ["Irrational × irrational is always irrational", "Levels 3 and 11."], ["An example proves a general claim", "Level 9."]],
      exitTicket: { items: ["Is 5 + √3 rational or irrational? Why?", "Give two irrational numbers whose product is rational.", "Why is 2/5 + 3/7 rational?"],
        answers: ["Irrational: rational + irrational.", "For example √5 · √5 = 5.", "It equals 29/35, a ratio of integers."] },
    },
  });
})();
