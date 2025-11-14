# Shared Package

This folder contains shared TypeScript types and shared configurations used by both the backend and frontend.

It ensures type safety and synchronization across the entire monorepo.

---

## 📁 Structure

```
packages/shared/
│
├─ types.ts # Shared type definitions
├─ eslint-config/ # Monorepo-wide ESLint config
│ └─ index.js
└─ prettier-config/ # Prettier config
└─ index.js
```

---

## 🔧 Installation

Install the package inside apps:

```
yarn workspace frontend add @my/shared
yarn workspace backend add @my/shared
```

Or your actual package name.

---

## 📘 Shared Types

All core data models live here, e.g.:

- `Course`
- `PortfolioItem`
- `BaseItem`
- Shared API response types

These types are consumed by:

```
apps/backend/src/_
apps/frontend/src/_
```

Keeping models consistent across the entire stack.

---

## 🧰 Shared ESLint Config

Use it in each app’s `.eslintrc.js`:

```js
module.exports = {
  extends: ["@my/shared/eslint-config"],
};
```

---

## 🧼 Shared Prettier Config

Use it in each app:

```json
{
  "prettier": "@my/shared/prettier-config"
}
```

---

## ✨ Notes

- This package contains **no JavaScript runtime code**.
- Strictly limited to types and configuration.
- Ensures the monorepo stays consistent and clean.
