#!/bin/bash

# Get the latest Deployment ID (excluding @HEAD)
DEPLOYMENT_ID=$(clasp deployments | grep -v "@HEAD" | grep -oE "^- [a-zA-Z0-9_-]+" | sed 's/- //')

if [ -z "$DEPLOYMENT_ID" ]; then
  echo "Error: No existing deployment found. Please create one first using 'clasp deploy'."
  exit 1
fi

echo "Deploying to existing deployment ID: $DEPLOYMENT_ID"
clasp deploy -i "$DEPLOYMENT_ID" "$@"
