#!/bin/bash

echo "🔄 Fetching latest deployment from Apps Script..."

# Navigate to backend directory
BACKEND_DIR="../backend"

# Get the latest deployment ID (excluding @HEAD)
DEPLOYMENT_ID=$(cd "$BACKEND_DIR" && clasp deployments | grep -v "@HEAD" | grep -oE "^- [a-zA-Z0-9_-]+" | sed 's/- //')

# Check if deployment ID was found
if [ -z "$DEPLOYMENT_ID" ]; then
  echo "❌ Error: Could not find deployment ID from clasp deployments."
  echo "Please ensure you have deployed your Apps Script project."
  exit 1
fi

# Construct the Web App URL
WEB_APP_URL="https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec"

# Write to .env file
ENV_FILE=".env"
echo "NEXT_PUBLIC_API_ENDPOINT=$WEB_APP_URL" > "$ENV_FILE"

echo "✅ Generated $ENV_FILE with:"
echo "   NEXT_PUBLIC_API_ENDPOINT=$WEB_APP_URL"
