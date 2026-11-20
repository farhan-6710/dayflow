#!/usr/bin/env bash
# Renders the share card with headless Chrome, then builds the favicon set (icons.py).
# Outputs: public/share-card.jpg, public/favicon-{light,dark}.png, public/apple-touch-icon.png
# Needs: Google Chrome (macOS path below or $CHROME), python3 with Pillow, `bun install` (fonts come from node_modules).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DIR="$ROOT/scripts/share-card"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --allow-file-access-from-files --virtual-time-budget=8000 --window-size=1200,630 \
  --screenshot="$TMP/card.png" "file://$DIR/card.html" >/dev/null 2>&1

python3 - "$TMP/card.png" "$ROOT/public/share-card.jpg" <<'PY'
import sys
from PIL import Image
Image.open(sys.argv[1]).convert("RGB").save(sys.argv[2], "JPEG", quality=84, optimize=True, progressive=True)
PY
echo "Wrote public/share-card.jpg"

python3 "$DIR/icons.py"
