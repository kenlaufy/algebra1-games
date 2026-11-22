# Algebra 1 Games

Browser games for the Massachusetts Algebra I standards, where the math *is* the gameplay. Students don't answer quiz questions to unlock fun; they reason with algebra to win.

- **For teachers and schools.** Each game has a teacher guide with a lesson plan, misconceptions, an answer key, and an exit ticket.
- **No logins, no student data.** No accounts, cookies, analytics, ads, or third-party requests. See [privacy](privacy/index.html).
- **Runs anywhere.** Plain static web pages that work on Chromebooks, iPads, and laptops.

## What's included

| Page | Path |
| --- | --- |
| Home page: featured game, design rules, roadmap of all planned games | [`index.html`](index.html) |
| Balance Workshop, AI.A-REI.B.3 (12 levels) | [`games/a-rei-b-3/`](games/a-rei-b-3/index.html) |
| Teacher guide for Balance Workshop | [`teachers/`](teachers/index.html) |
| Privacy statement | [`privacy/`](privacy/index.html) |
| Automated checks for Balance Workshop | [`tests/balance-workshop.html`](tests/balance-workshop.html) |

## One game per standard

Every Model Algebra I standard gets its own game in `games/<standard-code>/`. The home page roadmap lists all 63 planned games across the 62 standards (A-REI.B.3 has two: equations and inequalities). The standard codes and wording were checked against the official [2017 Massachusetts Curriculum Framework for Mathematics](https://www.doe.mass.edu/frameworks/math/2017-06.pdf), Model Algebra I (pages 110–117).

Games that work the same way share code and art through six "engines":

| Engine | Used by |
| --- | --- |
| Balance Workshop | Equations, inequalities, polynomials, factoring, completing the square, elimination |
| Coordinate Battlefield | Graphing, systems, inequality regions, transformations |
| Time Machine | Sequences, linear vs. exponential growth, rates of change |
| Data Lab | Statistics, fitting, residuals, correlation |
| Function Machine | Function definition, notation, inverses |
| Card Duel | Rational/irrational claims, comparing function representations |

## Design rules for every game

1. **Predict, then verify.** Players commit to an answer before the game shows the result.
2. **Concrete to abstract.** Pictures, then tiles, then symbols only.
3. **Feedback that targets misconceptions.** A common mistake gets a visible consequence, not just "wrong".
4. **Two-player and level-creation modes** where they fit.
5. **Themes for 13–15 year olds.**

After each game, students translate what they did into written algebra.

## Visual style and accessibility

- Cartoon sketchbook look: cream paper, flat outlined illustrations, chunky buttons.
- Fonts: Fredoka for headings and buttons, Nunito for text and equations. Both are self-hosted under the SIL Open Font License ([`assets/fonts/`](assets/fonts)).
- Keyboard playable, with visible focus, a text description of the scale for screen readers, and reduced motion when the device asks for it.

## Running locally

The site is static, so any web server works. From the project folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. To run the checks, open http://localhost:8000/tests/balance-workshop.html; the page title starts with PASS or FAIL.

## Deployment

The site is published with GitHub Pages from the `main` branch root. `404.html` assumes the site lives at `/algebra1-games/`.
