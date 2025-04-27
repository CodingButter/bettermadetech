#!/bin/bash

# Clean and build the extension
echo "Building extension..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Build failed!"
  exit 1
fi

echo "Build completed successfully!"
echo "The extension is ready in the dist directory."
echo "You can load it in Chrome from chrome://extensions with Developer mode enabled."

# Create a zip file for distribution
if [ "$1" == "--zip" ]; then
  echo "Creating distribution zip..."
  ZIP_NAME="better-made-tech-extension-$(date +%Y%m%d).zip"
  cd dist && zip -r "../$ZIP_NAME" * && cd ..
  echo "Created $ZIP_NAME"
fi

echo "Done!"