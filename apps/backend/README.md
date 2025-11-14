# Backend (Google Apps Script + TypeScript)

This folder contains the backend service for the project, implemented in **TypeScript** and deployed to **Google Apps Script (GAS)** using `clasp`.

The backend acts as a lightweight data provider:

- Reads data from Google Sheets
- Parses and normalizes structured content
- Returns JSON for the frontend during build time
- Supports local mock mode for development

---

## 📁 Structure

```
apps/backend/
│
├─ src/
│   ├─ api.ts              # Entry point for GAS (doGet)
│   ├─ sheetService.ts     # Interacts with Google Sheets
│   ├─ validators/         # Data validation logic
│   ├─ utils/              # Helpers (parsing, etc.)
│   └─ mock/               # Local development mock data
│
├─ sheets/                 # Local JSON templates for testing
├─ dist/                   # Compiled JS (generated)
├─ .clasp.json             # GAS binding (created later)
└─ tsconfig.json
```

---

## 🔧 Scripts

### Compile TypeScript:

```
yarn build
```

### Push to Google Apps Script:

Requires login first:

```
clasp login
```

Push code:

```
clasp push
```

Deploy as a web app:

```
clasp deploy --description "Initial deploy"
```

---

## 🌐 API Endpoint Format

The backend exposes:

```
GET /exec?type=<sheet-name>
```

Example:

```
/exec?type=courses
/exec?type=portfolio
```

Response is normalized JSON based on shared types.

---

## 🧪 Local Development (Mock Mode)

You can run a local mock server (coming soon):

```
yarn dev
```

This simulates:

```
GET http://localhost:3030/exec?type=courses
```

Useful for frontend development without touching GAS.

---

## 🧱 Data Model

Backend uses the shared types located in:

```
packages/shared/types.ts
```

---

## ✨ Notes

- Avoid manually modifying generated `id` fields in Sheets.
- Sheets must have headers in this order:  
  **id → datetime → images → title → content**
- The backend validates all data before sending it to the frontend.
