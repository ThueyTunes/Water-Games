#!/usr/bin/env bash
# Inlines the app into a single self-contained ../index.html — the file GitHub
# Pages serves at the site root, and the one you open locally.
# No toolchain required — run with Git Bash: ./build.sh
set -euo pipefail
cd "$(dirname "$0")"

OUT=../index.html

{
  echo '<!DOCTYPE html>'
  echo '<html lang="en">'
  echo '<head>'
  echo '<meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1">'
  echo '<title>Soaked — App Screens</title>'
  echo '<link rel="preconnect" href="https://fonts.googleapis.com">'
  echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
  echo '<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,600&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">'
  echo '<style>'
  cat src/tokens.css src/app.css
  echo '</style>'
  echo '</head>'
  echo '<body>'
  echo '<div id="shell-bar"></div>'
  echo '<div id="root"></div>'
  echo '<script>'
  cat src/data.js src/ui.js src/forms.js \
      src/screens/auth.js src/screens/main.js \
      src/screens/capture.js src/screens/teams.js \
      src/app.js
  echo '</script>'
  echo '</body>'
  echo '</html>'
} > "$OUT"

echo "wrote $(cd .. && pwd)/index.html"
