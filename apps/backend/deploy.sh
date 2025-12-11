#!/bin/bash

# Get the latest Deployment ID (excluding @HEAD)
DEPLOYMENT_ID=$(clasp deployments | grep -v "@HEAD" | grep -oE "^- [a-zA-Z0-9_-]+" | sed 's/- //')

# Check if a deployment ID was found
if [ -z "$DEPLOYMENT_ID" ]; then
  echo "Error: No existing deployment found. Please create one first using 'clasp deploy'."
  exit 1
fi
echo ""

# Deploy using the found Deployment ID
clasp deploy -i "$DEPLOYMENT_ID" "$@"
echo ""
