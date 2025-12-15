#!/bin/bash

# Build the TypeScript source code using esbuild, for inline types
npx esbuild src/index.ts \
  --bundle \
  --outfile=src/index.js \
  --platform=neutral \
  --target=es2020 \
  --format=esm \
  --tree-shaking=false

if [ $? -eq 0 ]; then
  echo "Build completed successfully!"
  echo ""
else
  echo "Build failed!"
  exit 1
fi
