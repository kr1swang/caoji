# 📦 Monorepo Workspace

This repository uses a **Yarn Workspaces monorepo structure** to manage both the frontend and backend codebases, along with shared utilities and configurations.

The monorepo keeps the root level **clean and minimal**, while each application or package manages its own dependencies and configurations.

---

## 📁 Directory Structure

```
my-project/
│
├─ apps/
│   ├─ frontend/   # Next.js frontend (SSG)
│   └─ backend/    # Google Apps Script backend (TypeScript)
│
├─ packages/
│   └─ shared/     # Shared TypeScript types & configurations
│
├─ .gitignore
├─ package.json
└─ README.md
```

---

## 🚀 Features

- **Yarn Workspaces** for dependency sharing and isolated app environments
- **Strict separation** between frontend, backend, and shared logic
- **Clean root directory** (no global ESLint, Prettier, or TS configs)
- **Fully typed backend & frontend** with shared TypeScript definitions
- **Ready for CI/CD** and GitHub Pages deployment (frontend SSG)

---

## 📦 Yarn Workspaces

The root `package.json` defines the monorepo structure:

```jsonc
{
  "name": "my-project",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
}
```

All installations must be done **inside each workspace**, e.g.:

```
cd apps/frontend
yarn add axios
```

---

## 🔧 Requirements

Before working in this repo, install:

### Global Dependencies

| Tool               | Version | Purpose                              |
| ------------------ | ------- | ------------------------------------ |
| **Node.js**        | 18+     | Required for frontend & tooling      |
| **Yarn (Classic)** | 1.22.x  | Monorepo workspace manager           |
| **clasp**          | latest  | Deploy backend to Google Apps Script |
| **npm / npx**      | latest  | For scaffolding tools (Next.js etc.) |

Install clasp globally:

```bash
npm install -g @google/clasp
```

---

## 🏗 Development Workflow (High-Level)

1. **Backend**
   - Built with TypeScript
   - Deployed to Google Apps Script via `clasp`
   - Provides `/exec?type=...` API endpoints

2. **Frontend**
   - Next.js App Router (SSG)
   - Downloads images at build time
   - Uses GAS as data source via REST API

3. **Shared**
   - Shared types (e.g., `Course`, `PortfolioItem`)
   - Shared ESLint & Prettier configs

---

## 📚 Additional Documentation

Each workspace includes its own documentation:

- `apps/frontend/README.md`
- `apps/backend/README.md`
- `packages/shared/README.md`

---

## ✅ Status

This root layer is ready.
Proceed to workspace setup next:

- `packages/shared`
- `apps/backend`
- `apps/frontend`

---
