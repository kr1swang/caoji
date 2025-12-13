# 📦 Monorepo Workspace

This repository uses a **Yarn Workspaces monorepo structure** to manage both the frontend and backend codebases, along with shared utilities and configurations.

## 📁 Directory Structure

```
.
├── apps/
│   ├── frontend/   # Next.js frontend (SSG)
│   └── backend/    # Google Apps Script backend (TypeScript)
│
├── packages/
│   ├── config/     # Shared ESLint, Prettier, and TS configurations
│   └── shared/     # Shared TypeScript types & utilities
│
├── package.json
└── README.md
```

## 🚀 Features

- **Yarn Workspaces** for dependency sharing
- **Strict separation** between frontend, backend, and shared logic
- **Shared Configuration** via `@caoji/config`
- **Shared Types** via `@caoji/shared`

## 📦 Workspaces

- **@caoji/frontend**: Next.js application
- **@caoji/backend**: Google Apps Script project
- **@caoji/shared**: Shared code library
- **@caoji/config**: Shared build/lint configurations
