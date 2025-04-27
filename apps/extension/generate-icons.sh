#!/bin/bash

# Generate PNG icons from SVG for different sizes
# Requires Inkscape to be installed (sudo apt-get install inkscape)

SVG_PATH="public/icons/icon.svg"
OUTPUT_DIR="public/icons"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Generate icons for different sizes
generate_icon() {
  local size=$1
  echo "Generating $size x $size icon..."
  
  if command -v inkscape &> /dev/null; then
    inkscape -w "$size" -h "$size" "$SVG_PATH" -o "$OUTPUT_DIR/icon$size.png"
  else
    echo "Warning: Inkscape not found. Using alternative method..."
    convert -background none -resize "${size}x${size}" "$SVG_PATH" "$OUTPUT_DIR/icon$size.png"
  fi
}

# Generate different sizes
generate_icon 16
generate_icon 32
generate_icon 48
generate_icon 128

echo "Icons generated successfully!"