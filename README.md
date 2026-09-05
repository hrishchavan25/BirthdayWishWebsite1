# Birthday Wishes (Vishi's Version)

## Local development

```powershell
npm install
npm run dev
```

Open `http://localhost:3000` (or the alternate port shown by Vite).

## Shared database on Vercel

The editable website data is saved through `/api/data` and falls back to browser storage when the API is unavailable. To enable shared persistence on the deployed site:

1. In the Vercel project, open **Storage** and create or connect a Postgres database from the Marketplace.
2. Make sure the database connection variable `POSTGRES_URL` is available to Production, Preview, and Development environments.
3. Redeploy the project.

The API creates its `birthday_site_data` table automatically on the first request. It stores the shared name, chapters, photo memories, bracelets, guestbook wishes, and love letter as separate JSON records.
