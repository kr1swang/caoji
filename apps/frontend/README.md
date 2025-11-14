# Frontend (Next.js SSG)

This folder contains the frontend implemented using **Next.js App Router**, fully static (SSG) at build time.

The frontend fetches data **once during build**, downloads required images, and outputs a static site suitable for deployment on **GitHub Pages**.

---

## 📁 Structure

```
apps/frontend/
│
├─ src/
│   ├─ app/
│   │   ├─ courses/[slug]/page.tsx
│   │   ├─ portfolio/[slug]/page.tsx
│   │   └─ layout.tsx
│   ├─ lib/
│   │   ├─ api.ts             # Axios instance
│   │   └─ fetchData.ts       # Shared fetch/helpers
│   └─ utils/
│
├─ scripts/
│   └─ download-images.ts     # Downloads Drive images to /public/images
│
├─ public/
│   └─ images/                # Generated at build time
│
└─ package.json
```

---

## 🔧 Scripts

### Development

```
yarn dev
```

### Build (with image downloader)

```
yard build
```

Build workflow:

1. Fetch data from GAS
2. Download images to `public/images/`
3. Generate static pages via Next.js SSG

---

## 🌍 Environment Variables

Create:

```
apps/frontend/.env
```

Add:

```
NEXT_PUBLIC_API_ENDPOINT=https://script.google.com/macros/s/<DEPLOY_ID>/exec
```

---

## 🖼 Image Downloading

Images are **generated at build time**, not committed to the repo.

Script:

```
yarn download:images
```

It:

- Downloads images from Google Drive “view URLs”
- Converts them to static files under `public/images`
- Skips images that already exist

---

## 🚀 Deployment (GitHub Pages)

The frontend is compatible with static deployment using:

```
next export
```

Follow repository CI to handle automatic deployments.

---

## 🧱 Data Model

Uses shared types from:

```
packages/shared/types.ts
```

---

## ✨ Notes

- Frontend does not call GAS at runtime.
- All data fetching and image downloading happens **during build**.
- Slugs use snake-case titles + unique IDs to avoid conflicts.
