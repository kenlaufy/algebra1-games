# Algebra 1 Games

Game prototypes for the Massachusetts Algebra I standards. The design rule: the math *is* the gameplay, not a quiz you answer to unlock the fun part.

## One game per standard

Every standard gets its own game in `games/<standard-code>/`. The home page ([index.html](index.html)) lists all of them, grouped by domain, and links to each game once it's playable.

| Standard | Game | Status |
| --- | --- | --- |
| A-REI.B.3 | [Balance Workshop](games/a-rei-b-3/): solve linear equations by keeping a scale balanced | Playable |
| Everything else | See the home page for the planned game for each standard | Planned |

Behind the scenes, games that work the same way share code and art. These six shared "engines" keep the games consistent and cheaper to build:

| Engine | Used by |
| --- | --- |
| Balance Workshop | Equations, inequalities, polynomials, factoring, completing the square, elimination |
| Coordinate Battlefield | Graphing, systems, inequality regions, transformations |
| Time Machine | Sequences, linear vs. exponential growth, rates of change |
| Data Lab | Statistics, fitting, residuals, correlation |
| Function Machine | Function definition, notation, inverses |
| Card Duel | Rational/irrational claims, comparing function representations |

## Design rules for every level

1. **Predict, then verify.** Players commit to an answer before the game shows the result, so random trial and error doesn't pay off.
2. **Fade from concrete to abstract.** The same engine starts with pictures, then blocks, then symbols only.
3. **Feedback that targets misconceptions.** A common mistake gets a visible consequence, not just "wrong".
4. **Two-player and level-creation modes.** Students challenge each other and build levels for classmates.
5. **Themes for 13–15 year olds.** Strategy, competition and engineering, not little-kid stories.

After each game, students "translate" what they did: game action → drawing → symbols. Without that step, kids can win the game and still fail the same problem on paper.

## Running the games

Each game is a single static web page. Open the root `index.html` (or a game's own `index.html`) in a browser; nothing needs to be installed. The games load the Fredoka and Nunito fonts from Google Fonts, so they look best online; offline they fall back to the system font.

## Visual style

Cartoon "sketchbook" look: a cream paper background, flat illustrations with dark outlines, and chunky buttons. Fonts are chosen for readability: Fredoka for headings and buttons, Nunito for body text and equations (clear digits and minus signs).

## Standards source

The standards list was compiled from a third-party listing and has not been checked line by line against the [official 2017 Massachusetts Curriculum Framework for Mathematics](https://www.doe.mass.edu/frameworks/math/2017-06.pdf). Verify against that document before relying on the standard codes.
