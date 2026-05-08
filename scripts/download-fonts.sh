#!/bin/bash
# Download Inter font files for PDF generation
# Run from project root: bash scripts/download-fonts.sh

set -e

FONTS_DIR="public/fonts"
mkdir -p "$FONTS_DIR"

echo "Downloading Inter Regular..."
curl -L -o "$FONTS_DIR/Inter-Regular.ttf" \
  "https://github.com/rsms/inter/raw/master/fonts/truetype/Inter-Regular.ttf"

echo "Downloading Inter Bold..."
curl -L -o "$FONTS_DIR/Inter-Bold.ttf" \
  "https://github.com/rsms/inter/raw/master/fonts/truetype/Inter-Bold.ttf"

echo "Done! Fonts saved to $FONTS_DIR/"
ls -la "$FONTS_DIR"/*.ttf
