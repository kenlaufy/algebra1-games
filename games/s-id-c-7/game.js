/* Translation Duel · AI.S-ID.C.7 */
(function () {
  const D = window.DataLab;
  const SL = (right, wrong1, wrong2) => [[right, ""], wrong1, wrong2];
  const LEVELS = [
    { stage: 1, ctx: "Test score = 5 × (hours studied) + 60", steps: [["ch", "What does the slope 5 mean?", SL("Each extra hour of study goes with about 5 more points", ["Students study 5 hours", "5 is a rate, not an amount of hours."], ["The score is 5", "5 is how much the score changes per hour."])],
      ["ch", "What does the intercept 60 mean?", SL("A student who studies 0 hours is predicted to score 60", ["The maximum score is 60", "It's the predicted score at 0 hours."], ["Scores go up 60 per hour", "That's not the slope."])]], answer: "+5 points per hour; 60 at 0 hours", check: "Slope = rate; intercept = value at 0 ✓", tip: "Translate the numbers into words." },
    { stage: 1, ctx: "Plant height (cm) = 1.2 × (weeks) + 3", steps: [["ch", "Slope 1.2 means…", SL("The plant grows about 1.2 cm per week", ["The plant is 1.2 cm tall", "That's a rate of growth."], ["It takes 1.2 weeks to grow", "Units: cm per week."])], ["ch", "Intercept 3 means…", SL("It was about 3 cm tall when measuring started", ["It grows 3 cm per week", "That's the slope's job."], ["It lives 3 weeks", "It's a height at week 0."])]],
      answer: "1.2 cm/week; 3 cm at start", check: "Units: cm per week and cm ✓", tip: "Units help." },
    { stage: 1, ctx: "Car value ($) = −1500 × (years) + 18000", steps: [["ch", "Slope −1500 means…", SL("The car loses about $1,500 of value each year", ["The car costs $1,500", "It's a change per year."], ["The value goes up $1,500 a year", "The negative sign means decreasing."])], ["in", "Value when new (t = 0): $[]", [18000]]],
      answer: "−$1500 per year; $18,000 new", check: "Negative slope = decreasing ✓", tip: "Negative slopes." },
    { stage: 1, ctx: "Taxi fare ($) = 2.25 × (miles) + 3.50", steps: [["ch", "Which is the flat starting fee?", SL("$3.50", ["$2.25", "That's the cost per mile."], ["$5.75", "That's the fare for 1 mile."])], ["in", "Fare for 4 miles: $[]", [12.5]]], answer: "$3.50 fee + $2.25/mile", check: "9 + 3.5 = 12.50 ✓", tip: "Fees and rates." },
    { stage: 2, ctx: "Ice cream sales = 5 × (temperature in °C) − 50", pic: { vb: "0 0 900 420", label: "Scatter plot with line", html: D.scatter([[15, 22], [18, 42], [20, 48], [22, 62], [24, 68], [26, 82], [28, 88], [30, 98]], { xr: [0, 35, 1, 5], yr: [-60, 130, 10, 20], xlabel: "temperature (°C)", ylabel: "sales", line: { m: 5, b: -50 } }).svg },
      steps: [["ch", "The intercept says sales are −50 at 0 °C. What do you make of that?", SL("It's meaningless: 0 °C is far outside the data and sales can't be negative", ["The shop loses 50 cones at 0 °C", "You can't sell negative cones."], ["The model is useless", "It's fine within the data's range."])]],
      answer: "Intercept not meaningful here", check: "Interpret only within the data ✓", tip: "Sometimes the intercept makes no sense." },
    { stage: 2, ctx: "A fitted line passes through (2, 40) and (6, 64) on a graph of tips ($) vs. hours worked.", steps: [["in", "Slope = []", [6]], ["ch", "So…", SL("Each extra hour of work goes with about $6 more in tips", ["Tips are $6", "A rate per hour."], ["It takes 6 hours to earn tips", "Read it as dollars per hour."])]], answer: "$6 per hour", check: "(64 − 40) ÷ (6 − 2) = 6 ✓", tip: "Find the slope, then say it." },
    { stage: 2, ctx: "Electricity bill ($) = 0.15 × (kWh used) + 12", steps: [["ch", "Units of the slope:", SL("dollars per kWh", ["kWh per dollar", "y units per x unit."], ["dollars", "A slope is a rate."])], ["ch", "The 12 is…", SL("a monthly charge even if you use nothing", ["the price of 1 kWh", "That's 0.15."], ["the number of kWh", "It's in dollars."])]], answer: "$0.15 per kWh; $12 base", check: "Slope units = y/x ✓", tip: "Units of slope." },
    { stage: 2, ctx: "Arm span (cm) = 1.02 × (height in cm) − 3", steps: [["ch", "Best interpretation of the slope:", SL("For each extra cm of height, arm span is about 1.02 cm longer", ["Arm span is 1.02 times bigger", "It's per extra cm of height."], ["Everyone's arm span is 1.02 m", "It's a rate, not a length."])], ["ch", "Intercept −3:", [["Not meaningful: no one is 0 cm tall", ""], ["Babies have −3 cm arms", "Lengths can't be negative."]]]],
      answer: "+1.02 cm per cm of height", check: "Interpret in context ✓", tip: "Slope near 1." },
    { stage: 3, ctx: "Duel! Your friend says: \"In Plant height = 1.2w + 3, the plant grows 1.2 cm in total.\"", steps: [["ch", "Your reply:", SL("No: 1.2 cm per week, so it keeps growing every week", ["Correct", "It's per week."], ["No: it grows 3 cm in total", "3 is the starting height."])]], answer: "Rate, not total", check: "Per unit! ✓", tip: "Spot the mistranslation." },
    { stage: 3, ctx: "Two coffee shops. Shop A: line of sales vs. temperature has slope −4. Shop B: slope −10.", steps: [["ch", "Which is true?", SL("Shop B's sales drop faster as it gets warmer", ["Shop A's sales drop faster", "−10 is steeper than −4."], ["Both sell more when it's warm", "Negative slopes mean fewer sales."])]], answer: "B drops faster", check: "Compare slopes ✓", tip: "Compare two slopes." },
    { stage: 3, ctx: "Gym members = 12 × (month) + 150", steps: [["in", "Predicted members in month 10: []", [270]], ["ch", "Which sentence uses the slope correctly?", SL("The gym gains about 12 members per month", ["The gym has 12 members", "It's a rate per month."], ["The gym gains 150 members per month", "150 is the starting number."])]], answer: "+12 per month", check: "12(10) + 150 = 270 ✓", tip: "Predict and interpret." },
    { stage: 3, ctx: "Reading speed (words/min) = 8 × (age in years) + 20, for ages 6 to 14.", steps: [["ch", "Best full interpretation:", SL("Between 6 and 14, each year of age goes with about 8 more words per minute; the intercept (age 0) isn't meaningful", ["Babies read 20 words per minute", "Age 0 is outside the data."], ["Everyone reads 8 words per minute", "8 is a change per year."])]], answer: "Slope meaningful; intercept not", check: "Stay inside the data ✓", tip: "Last one: the full translation." },
  ];
  Timeline.stepGame({
    slug: "s-id-c-7", title: "Translation Duel", firstMove: "Say what one more unit of x does to y (the slope), then what y is when x is 0 (the intercept).",
    subtitle: "Interpret the slope and intercept of a linear model in context",
    stages: { 1: "Stage 1 · Translate the numbers", 2: "Stage 2 · Units and meaning", 3: "Stage 3 · Duels and comparisons" }, levels: LEVELS,
    help: { intro: "The <b>slope</b> is the change in y for each one-unit increase in x. The <b>intercept</b> is the predicted y when x = 0, if that makes sense.",
      steps: ["Translate each number into a sentence with units.", "Check whether x = 0 is inside the data before trusting the intercept.", "Spot mistranslations.", "Fewer wrong answers means more stars."], note: "Slope units = y units per x unit." },
    hint: "Slope: change per unit. Intercept: value at x = 0.",
    guide: {
      summary: "A 12-level game for interpreting the slope and intercept of linear models in context: translating them into sentences with units, recognizing when the intercept is meaningless, comparing slopes, and correcting mistranslations.",
      also: "<span class='code'>AI.F-LE.B.5</span> interpreting parameters.",
      practices: "MP2 Reason abstractly and quantitatively · MP6 Attend to precision",
      goals: ["Interpret the slope of a linear model as a rate of change in context, with units.", "Interpret the intercept and decide whether it is meaningful.", "Compare and critique interpretations."],
      howItWorks: "Each level shows a linear model (sometimes on a scatter plot). Students choose interpretations; distractors are common mistranslations (rate vs. total, slope vs. intercept), each with feedback.",
      stageNotes: { 1: { sees: "Study, plants, cars, taxis.", builds: "Slope and intercept sentences." }, 2: { sees: "Ice cream, tips, electricity, arm span.", builds: "Units; meaningless intercepts." }, 3: { sees: "Duels and comparisons.", builds: "Critiquing interpretations." } },
      discussion: ["Why is the ice cream intercept meaningless?", "How do units help you interpret a slope?", "What's the difference between \"grows 1.2 cm\" and \"grows 1.2 cm per week\"?"],
      misconceptions: [["Slope as a total amount", "Level 9."], ["Trusting every intercept", "Levels 5, 8, 12."], ["Mixing up slope and intercept", "Levels 1 and 11."]],
      exitTicket: { items: ["Interpret the slope and intercept of Cost = 45x + 30 for x hours of tutoring.", "Weight = 3.5 × age + 2 for puppies 1–6 months. Interpret 3.5.", "When is an intercept not meaningful?"],
        answers: ["$45 per hour; a $30 fixed fee.", "About 3.5 lb gained per month.", "When x = 0 is outside the data or impossible in context."] },
    },
  });
})();
