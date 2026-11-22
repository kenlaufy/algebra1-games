#!/bin/sh
# Usage: scripts/new-game-page.sh <slug>
# Writes games/<slug>/index.html, the standard page that loads the shared engine and the game's game.js.
set -e
slug="$1"
[ -n "$slug" ] || { echo "usage: $0 <slug>"; exit 1; }
mkdir -p "games/$slug"
cat > "games/$slug/index.html" <<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Algebra 1 Games</title>
<link rel="icon" href="../../assets/logo.svg" type="image/svg+xml">
<link rel="stylesheet" href="../../assets/site.css">
<link rel="stylesheet" href="../../assets/engine/game.css">
</head>
<body>
<script src="../../assets/engine/catalog.js"></script>
<script src="../../assets/engine/look.js"></script>
<script src="../../assets/engine/algebra.js"></script>
<script src="../../assets/engine/cartoon.js"></script>
<script src="../../assets/engine/plane.js"></script>
<script src="../../assets/engine/timeline.js"></script>
<script src="../../assets/engine/datalab.js"></script>
<script src="../../assets/engine/game-shell.js"></script>
<script src="../../assets/engine/steps.js"></script>
<script src="game.js"></script>
</body>
</html>
HTML
echo "wrote games/$slug/index.html"
