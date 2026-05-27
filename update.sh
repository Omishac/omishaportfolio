#!/bin/bash
# update.sh — Apply downloaded portfolio files to the correct project paths.
# Run from your project root: bash update.sh
#
# By default, looks in ~/Downloads. Pass a folder as an argument to override:
#   bash update.sh ~/Desktop
#
# FILE NAMING — when saving files Claude sends you, use these names:
#
#   home-page.tsx          → app/page.tsx
#   SharedNav.tsx          → components/SharedNav.tsx
#   playground-page.tsx    → app/playground/page.tsx
#   rfnd-page.tsx          → app/rfnd/page.tsx
#   anthropologie-page.tsx → app/anthropologie-mcommerce/page.tsx
#   ios-page.tsx           → app/ios-review-accessibility/page.tsx
#   board-page.tsx         → app/board-and-brew/page.tsx

DOWNLOADS="${1:-$HOME/Downloads}"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "Portfolio updater — reading from: $DOWNLOADS"
echo "────────────────────────────────────────────"

copy_file() {
    local name="$1"
    local dest="$2"
    local src="$DOWNLOADS/$name"

    if [ -f "$src" ]; then
        mkdir -p "$(dirname "$dest")"
        cp "$src" "$dest"
        echo -e "${GREEN}✓${NC} $name  →  $dest"
    else
        echo -e "${YELLOW}–${NC} $name not found (skipping)"
    fi
}

copy_file "home-page.tsx"          "app/page.tsx"
copy_file "SharedNav.tsx"          "components/SharedNav.tsx"
copy_file "playground-page.tsx"    "app/playground/page.tsx"
copy_file "rfnd-page.tsx"          "app/rfnd/page.tsx"
copy_file "anthropologie-page.tsx" "app/anthropologie-mcommerce/page.tsx"
copy_file "ios-page.tsx"           "app/ios-review-accessibility/page.tsx"
copy_file "board-page.tsx"         "app/board-and-brew/page.tsx"

echo "────────────────────────────────────────────"
echo ""
echo "Done. Run  npm run dev  to preview."
echo ""
