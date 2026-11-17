# SM IMRAN PACKAGES Website (Phase 1)
Node.js + Express + EJS + Knex + SQLite. Public website, quote/contact forms, database foundation.

## Run locally

### Windows (no Visual Studio or C++ Build Tools needed)
1. Install Node.js **22 LTS or 24 LTS** (64-bit) from https://nodejs.org. Check with `node -v` (must show v22.x or v24.x). Python is not required.
2. Open PowerShell in the project folder (`SM-IMRAN-PACKAGES-WEBSITE`).
3. `npm install`  (downloads a prebuilt SQLite binary; you should see no "node-gyp" or "Visual Studio" messages).
4. `copy .env.example .env`, then open `.env` and set `SESSION_SECRET` to a long random string.
5. `npm start`, then open http://localhost:3000 (the database is created automatically).
6. Optional: `npm test` runs the smoke tests.

### macOS / Linux
`npm install`, `cp .env.example .env` (edit `SESSION_SECRET`), `npm start`.

### Troubleshooting
- Wrong Node version (e.g. v23 or v25): better-sqlite3 12.11.1 has prebuilt binaries only for Node 22 and 24, so npm would try to compile. Install Node 22 or 24 LTS.
- After changing Node version: delete the `node_modules` folder, then run `npm install` again.
- `npm warn deprecated prebuild-install` is a harmless warning from better-sqlite3's installer.

## Google Antigravity
Open the `SM-IMRAN-PACKAGES-WEBSITE` folder as a workspace, open a terminal, follow the Windows or macOS/Linux steps above.

## Database
SQLite file at `data/smimran.sqlite` (persists across restarts; needs a host with persistent disk and backups).
To move to MySQL/PostgreSQL: set `DB_CLIENT=mysql2` or `pg`, set `DB_URL`, `npm i mysql2` (or `pg`), run `npm run migrate`. All queries go through Knex.

## Structure
`server.js` app setup | `src/config` company info, content, db | `src/routes` | `src/services` business logic | `src/views` EJS | `src/db/migrations` schema | `public` assets | `storage/uploads` private uploads (not web-served)

## Editing placeholders
Company details: `.env` (phone, email, address, WhatsApp). Products/steps/text: `src/config/content.js`. See `VISUAL_CONTENT_GUIDE.md` for images.

## Status
Complete (Phase 1): 8 public pages + legal pages, sticky responsive header, quote form (validation, CSRF, rate limit, private uploads), contact form, DB schema for all planned modules, tests.
Needs real company info: contact details, WhatsApp, maps, photos, mission/vision approval, legal text, SEO review.
Not yet built (Phase 2+): admin login/dashboard, quotation revisions + PDF, sample tracking, bulk orders, production, delivery, payments, activity UI. Production deploy: use a persistent session store and HTTPS.

## Design notes (Phase 1 redesign)
- Light editorial design: DM Serif Display + Inter (self-hosted in `public/fonts`, no external requests), navy used for the custom packaging feature and brand accents.
- All non-logo visuals are **illustrative studio renders** (see `VISUAL_CONTENT_GUIDE.md`, `tools/mockup-renderer/`). Replace with real photos.
- Header: desktop nav + separate mobile menu panel (switches at 1020px). Styles in `public/css/style.css`, behaviour in `public/js/main.js`.
- WhatsApp buttons use `WHATSAPP_NUMBER` from `.env`; until set they go to the Contact page and the custom packaging section shows a placeholder notice.
- Copy: `src/config/content.js` (products, process steps, why-us), `src/views/partials/custom-cta.ejs` (custom packaging feature).
- Quote form deletes uploaded files if a submission is rejected (CSRF or validation failure).
