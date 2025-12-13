# @caoji/backend

Google Apps Script (GAS) backend service implemented in TypeScript.

## 📁 Structure

```
apps/backend/
├── src/
│   ├── index.ts          # Entry point
│   └── appsscript.json   # GAS manifest
├── build.sh              # Build script
├── deploy.sh             # Deploy script
└── package.json
```

## 🔧 Scripts

- `yarn pull`: Pull code from Google Apps Script
- `yarn push`: Build and push code to Google Apps Script (runs `build.sh` and `deploy.sh`)

## 🛠 Development

The project uses `esbuild` for bundling and `clasp` for deployment.
