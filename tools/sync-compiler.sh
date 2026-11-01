#!/bin/sh
# Copies the firmware's Sleep Themes page (the compiler) into tools/compiler/,
# so dist/ is built with the same compiler the device ships. Run it when the
# firmware's theme format or compiler changes, then rebuild:
#   tools/sync-compiler.sh ../crosspoint-reader && npm run compile
set -e
firmware="${1:?usage: tools/sync-compiler.sh <path to the firmware checkout>}"
cp "$firmware/src/network/html/SleepThemesPage.html" tools/compiler/SleepThemesPage.html
echo "tools/compiler/SleepThemesPage.html updated from $firmware"
