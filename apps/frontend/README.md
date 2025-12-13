# @caoji/frontend

Next.js App Router frontend application (Static Site Generation).

## 📁 Structure

```
apps/frontend/
├── src/
│   ├── app/
│   │   ├── blogs/        # Blog pages
│   │   ├── courses/      # Course pages
│   │   ├── portfolio/    # Portfolio pages
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       ├── api.ts
│       ├── download-images.ts
│       └── utils.ts
├── public/
└── package.json
```

## 🔧 Scripts

- `yarn dev`: Start development server
- `yarn build`: Build the static site (cleans `.next` and `out` directories)
- `yarn start`: Build and serve the static site
- `yarn lint`: Run ESLint

## 🎨 Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Utils**: clsx, tailwind-merge
