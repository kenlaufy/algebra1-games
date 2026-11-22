/* Table Puzzle · AI.S-ID.B.5 */
(function () {
  // two-way table HTML; cells: rows of [label, a, b], hidden cells as "?"; totals computed unless hidden
  function table(t, hide) {
    hide = hide || [];
    const [r1, r2] = t.rows, c = t.cols;
    const tot = [r1[1] + r1[2], r2[1] + r2[2]], ct = [r1[1] + r2[1], r1[2] + r2[2]], all = tot[0] + tot[1];
    const cell = (v, key) => '<td style="height:auto;min-width:70px;font-weight:800;font-size:19px;background:' + (hide.includes(key) ? "var(--chip)" : "#fff") + '">' + (hide.includes(key) ? "?" : v) + "</td>";
    return '<table class="area" style="border-spacing:4px;margin:8px auto"><tr><th></th><th>' + c[0] + "</th><th>" + c[1] + "</th><th>Total</th></tr>" +
      "<tr><th>" + r1[0] + "</th>" + cell(r1[1], "a") + cell(r1[2], "b") + cell(tot[0], "r1") + "</tr>" +
      "<tr><th>" + r2[0] + "</th>" + cell(r2[1], "c") + cell(r2[2], "d") + cell(tot[1], "r2") + "</tr>" +
      "<tr><th>Total</th>" + cell(ct[0], "c1") + cell(ct[1], "c2") + cell(all, "all") + "</tr></table>";
  }
  const food = { rows: [["Grade 9", 30, 20], ["Grade 10", 15, 35]], cols: ["Pizza", "Tacos"] };
  const phone = { rows: [["Grade 9", 40, 10], ["Grade 10", 32, 8]], cols: ["Has phone", "No phone"] };
  const sleep = { rows: [["Plays sports", 48, 32], ["No sports", 36, 84]], cols: ["8+ hours sleep", "Under 8"] };
  const pets = { rows: [["Has a pet", 40, 30], ["No pet", 25, 25]], cols: ["In band", "Not in band"] };
  const LEVELS = [
    { stage: 1, ctx: "100 students chose their favorite lunch." + table(food, ["b", "c", "c1", "c2"]), steps: [["in", "Grade 9 tacos = [], Grade 10 pizza = []", [20, 15], { hint: "Each row adds up to its total." }], ["in", "Column totals: pizza [], tacos []", [45, 55]]],
      answer: "20, 15; totals 45 and 55", check: "45 + 55 = 100 ✓", tip: "Rows and columns must add up." },
    { stage: 1, ctx: table(food), steps: [["in", "Joint relative frequency: Grade 9 AND pizza = 30 ÷ 100 = []", [0.3]], ["in", "Marginal relative frequency: pizza = 45 ÷ 100 = []", [0.45]]], answer: "0.30 and 0.45", check: "Joint: one cell ÷ grand total; marginal: a total ÷ grand total ✓", tip: "Joint and marginal." },
    { stage: 1, ctx: table(food), steps: [["in", "Of Grade 9 students, what fraction chose pizza? 30 ÷ 50 = []", [0.6]], ["in", "Of Grade 10 students? []", [0.3]], ["ch", "Is lunch choice associated with grade?", [["Yes: 60% vs 30% is a big difference", ""], ["No", "The conditional rates are very different."]]]],
      answer: "60% vs 30%: associated", check: "Compare conditional relative frequencies ✓", tip: "Conditional: within one row." },
    { stage: 1, ctx: "Phone ownership." + table(phone), steps: [["in", "Has a phone: Grade 9 [] , Grade 10 [] (as decimals)", [0.8, 0.8]], ["ch", "Associated?", [["No: the same rate in both grades", ""], ["Yes: more Grade 9 students have phones", "There are more Grade 9 students. Compare RATES, not counts."]]]],
      answer: "No association", check: "40/50 = 32/40 = 0.8 ✓", tip: "Counts can fool you." },
    { stage: 2, ctx: table(food), steps: [["in", "Of students who chose tacos, what fraction are in Grade 10? 35 ÷ 55 ≈ [] (2 decimal places)", [0.64], { tol: 0.006 }]], answer: "≈ 0.64", check: "Conditional within a column ✓", tip: "Conditioning on a column." },
    { stage: 2, ctx: "A survey of 200 students." + table(sleep), steps: [["in", "8+ hours of sleep: sports [] , no sports [] (decimals)", [0.6, 0.3]], ["ch", "What does this suggest?", [["Students who play sports are more likely to sleep 8+ hours", ""], ["Sports cause better sleep", "An association doesn't prove cause."], ["No relationship", "60% vs 30% is a big gap."]]]],
      answer: "60% vs 30%: an association", check: "48/80 and 36/120 ✓", tip: "Interpret carefully." },
    { stage: 2, ctx: table(sleep), steps: [["ch", "\"More non-athletes sleep under 8 hours (84) than athletes sleep 8+ (48), so non-athletes sleep less.\" Is the reasoning sound?", [["No: compare rates within each group, not raw counts", ""], ["Yes", "84 and 48 come from groups of different sizes."]]], ["in", "Joint relative frequency of \"no sports AND under 8\" = []", [0.42]]],
      answer: "Use conditional rates", check: "84 ÷ 200 = 0.42 ✓", tip: "Spot the flawed argument." },
    { stage: 2, ctx: table(sleep, ["r1", "r2", "c1", "c2", "all"]), steps: [["in", "Row totals: sports [], no sports []", [80, 120]], ["in", "Column totals: [] and []; grand total []", [84, 116, 200]]], answer: "80, 120; 84, 116; 200", check: "Totals agree ✓", tip: "Rebuild the margins." },
    { stage: 3, ctx: "120 students. 70 have a pet. 40 pet owners are in band. 25 students without pets are in band.", steps: [["in", "Pet owners not in band = []", [30]], ["in", "Students without pets = [], of whom [] are not in band", [50, 25]]],
      answer: "Table: 40, 30 / 25, 25", check: "40 + 30 + 25 + 25 = 120 ✓", tip: "Build a table from clues." },
    { stage: 3, ctx: table(pets), steps: [["in", "In band: pet owners ≈ [], no pet = [] (2 decimal places)", [0.57, 0.5], { tol: 0.006 }], ["ch", "Association?", [["A weak one at most: 57% vs 50%", ""], ["A very strong one", "The rates are fairly close."], ["Pets cause band membership", "Association isn't causation, and this one is weak."]]]],
      answer: "Weak association", check: "40/70 ≈ 0.57 vs 25/50 = 0.5 ✓", tip: "How strong is it?" },
    { stage: 3, ctx: table(food), steps: [["ch", "\"30% of students are Grade 9 pizza fans\" is a…", [["joint relative frequency", ""], ["conditional relative frequency", "Conditional would be 30 out of Grade 9 only (60%)."], ["marginal relative frequency", "Marginal uses a row or column total."]]], ["ch", "\"60% of Grade 9 students prefer pizza\" is a…", [["conditional relative frequency", ""], ["joint relative frequency", "It's out of Grade 9 only, not all 100."]]]],
      answer: "Joint vs conditional", check: "Know which total you divide by ✓", tip: "Name the frequency." },
    { stage: 3, ctx: table(sleep), steps: [["ch", "Best conclusion:", [["In this survey, students who play sports were more likely to sleep 8+ hours; we can't say sports cause it", ""], ["Playing sports makes students sleep more", "A survey shows association, not cause."], ["Most athletes sleep under 8 hours", "60% of athletes sleep 8+ hours."]]]], answer: "Association, carefully stated", check: "Conclusions should match the evidence ✓", tip: "Last one: write the conclusion." },
  ];
  Timeline.stepGame({
    slug: "s-id-b-5", title: "Table Puzzle", firstMove: "Use the row and column totals to fill the missing cells, then compare rates within each group.",
    subtitle: "Summarize categorical data in two-way tables and look for associations",
    stages: { 1: "Stage 1 · Fill and read", 2: "Stage 2 · Conditional thinking", 3: "Stage 3 · Build and conclude" }, levels: LEVELS,
    help: { intro: "A two-way table counts two categories at once. <b>Joint</b> = one cell ÷ grand total. <b>Marginal</b> = a total ÷ grand total. <b>Conditional</b> = a cell ÷ its row (or column) total.",
      steps: ["Fill missing cells using the totals.", "Compute the relative frequency asked for.", "Compare conditional rates to look for an association.", "Fewer wrong answers means more stars."], note: "Use decimals like 0.6 for 60%." },
    hint: "Check which total you should divide by.",
    guide: {
      summary: "A 12-level game for two-way frequency tables: completing tables from totals and clues, computing joint, marginal and conditional relative frequencies, recognizing associations (and their absence), and stating careful conclusions.",
      also: "<span class='code'>AI.S-ID.C.9</span> correlation vs. causation.",
      practices: "MP2 Reason abstractly and quantitatively · MP3 Construct viable arguments",
      goals: ["Summarize categorical data in two-way frequency tables.", "Interpret joint, marginal and conditional relative frequencies in context.", "Recognize possible associations by comparing conditional relative frequencies."],
      howItWorks: "Each level shows a two-way table (some cells hidden) about student surveys. Students fill cells, compute relative frequencies, judge associations, and critique conclusions.",
      stageNotes: { 1: { sees: "Lunch choices and phones.", builds: "Completing tables; joint, marginal and conditional frequencies." }, 2: { sees: "Sleep and sports.", builds: "Conditional by row and column; flawed arguments." }, 3: { sees: "Pets and band; definitions; conclusions.", builds: "Building tables from clues; strength of association." } },
      discussion: ["Why compare 40/50 and 32/40 instead of 40 and 32?", "What's the difference between \"30% of students\" and \"60% of Grade 9 students\"?", "Why can't a survey show that sports cause better sleep?"],
      misconceptions: [["Comparing counts from unequal groups", "Levels 4 and 7."], ["Dividing by the wrong total", "Level 11."], ["Association means causation", "Levels 6 and 12."]],
      exitTicket: { items: ["In a table, 18 of 30 boys and 24 of 40 girls ride the bus. Is riding associated with gender?", "60 students: 25 like math; 15 of those also like art. What's the joint relative frequency of liking both?", "What would you compare to see whether owning a dog is associated with exercising daily?"],
        answers: ["No: 18/30 = 24/40 = 0.6.", "15/60 = 0.25.", "The fraction of dog owners who exercise daily vs. the fraction of non-owners who do."] },
    },
  });
})();
