# Alkem · Next.js + MySQL Content Studio

A dynamic rebuild of the existing Alkem-inspired premium website. Next.js App Router, React, TypeScript, MySQL, `mysql2` prepared queries and Zod validation. **No deployment has been performed.** Original HTML/CSS/JS is preserved in `legacy/`.

This is an independent, unofficial design concept. Seed copy and company figures are carried over from the original design, not independently verified company statements. Verify all claims and obtain appropriate brand/asset rights before an official launch. No fictional news, vacancies, contact details or default administrator are seeded.

## What is implemented

- Responsive public homepage; editable hero, section copy, metrics, branding, SEO and contact information.
- Database-backed pages (about, innovation, impact, sustainability), offerings, therapeutic areas, news and careers with individual URLs.
- Searchable collections, keyboard-accessible therapy tabs, mobile navigation, useful empty states and missing-page handling.
- `/admin`: authenticated dashboard, collection CRUD, draft/publish controls, ordering, image URLs, structured website settings and audit activity.
- `/admin/enquiries`: website and career enquiries; mark new/read/resolved or delete. Messages are stored in MySQL; no email or third-party notification is sent automatically.
- Password hashing with scrypt, random opaque sessions stored as SHA-256 hashes, HttpOnly cookies, server-side authorization on every mutation, same-origin API checks, SQL parameters, input validation and database-backed atomic rate limiting.
- MySQL migrations, non-destructive seed, a secure stdin-based administrator creation command, Dockerfile, local MySQL Compose service and GitHub CI.

## Local setup

Requirements: Node.js 22+ (24 recommended for parity with CI), npm, MySQL 8.4 or a compatible MySQL server. Create an empty database and a dedicated database user. Migrations require table-creation privileges; use narrower runtime privileges in production if managing migrations separately.

```sh
npm ci
cp .env.example .env.local
```

Edit `.env.local` with your own database credentials and a URL-encoded `DATABASE_URL`. Do not commit real secrets.

```dotenv
DATABASE_URL=mysql://alkem:YOUR_URL_ENCODED_PASSWORD@127.0.0.1:3306/alkem_cms
APP_URL=http://localhost:3000
DEMO_MODE=false
COOKIE_SECURE=false
DATABASE_SSL=false
TRUST_PROXY=false
```

Alternatively, start the included **local database only** with Docker Compose. Set `MYSQL_PASSWORD` and `MYSQL_ROOT_PASSWORD` in your environment or an untracked env file first, then run `docker compose --env-file .env.local up -d mysql`. The database port is bound to localhost and the data volume persists restarts. Use the same password in `DATABASE_URL`. No application is published by this command.

```sh
npm run db:migrate
npm run db:seed
npm run admin:create < /path/to/private-admin-input.json
npm run dev
```

The private admin input file must contain `{"email":"YOUR_EMAIL","password":"YOUR_OWN_STRONG_PASSWORD"}`. Passwords must be 12–200 characters. Create this file privately outside the repository, restrict its permissions, and delete it after use. The command reads stdin; passwords never need to appear in shell arguments. No shared/default login exists. For recovery, a database operator can create a replacement admin and revoke/delete the old account and sessions in MySQL.

Open `http://localhost:3000` and `/admin/login`. Seed is repeatable: it uses insert-ignore and preserves existing edited records. MySQL DDL commits implicitly; migrations are designed to be idempotent for recovery. Back up the database before future schema changes.

## Read-only design preview

Set `DEMO_MODE=true` to view the design without MySQL. Content comes from the original-design seed and the preview banner remains visible. Admin login and all persistent writes are disabled. **This is an explicit preview mode, never a silent fallback when a configured database fails.** Set it back to false before backend testing or deployment.

The preview launcher accepts `--port` and normalizes managed preview flags. An optional untracked `PREVIEW_PRODUCTION=true` in `.env.local` makes `npm run dev` serve the already-built production app for QA; run `npm run build` first. Omit this for normal hot-reloading development.

## Editing workflow

1. Sign in to Content Studio.
2. Website settings control the homepage, four metrics, brand, SEO and public contact fields. Image fields accept HTTPS URLs or local asset paths. Only sections which display an image use their image field.
3. Pages control full text at `/{slug}`. Keep the seeded slugs (`about`, `innovation`, `impact`, `sustainability`) published to retain the main navigation destinations.
4. Offerings, therapies, news and careers have their own collections. New content starts as a draft. Enable Published and Save when ready; unpublished items are excluded from public lists and detail pages.
5. Career enquiry forms reference a currently published role. No CV upload is included; applicants may share a professional-profile link in the message.
6. Monitor enquiries and delete records when no longer needed. Audit logs record actions and target identifiers, not message bodies or passwords. Configure retention and a verified privacy contact before accepting public traffic.

Content is plain text, separated into paragraphs; HTML/script input is rendered as text. External images are loaded directly by the browser, with a local fallback. This project does not proxy arbitrary image URLs through the server and does not include a media-upload service.

## Verification

```sh
npm test                 # Seven validation/password/origin tests; no DB required
npm run build            # Production compile and Next.js type checks
npm run typecheck
npm run test:integration # Real database and HTTP tests; requires migrated/seeded MySQL and a completed build
```

Integration tests use disposable records and delete them afterward. Run them against a **test database**, never production. They verify public draft filtering, atomic concurrent rate limits, session expiry, login/logout, protected routes, enquiry persistence and API validation. They are explicitly skipped when no database is configured or when demo mode is on; skipped tests do not verify the backend. CI supplies a fresh MySQL 8.4 service, migrates, seeds twice and runs all checks. Its passwords are disposable test credentials only.

Local implementation verification: production build, TypeScript and all seven no-database tests passed. Real MySQL integration and authenticated CMS testing require a MySQL instance; the implementation environment had no running server. GitHub write access was denied during handoff, so this source is supplied as a ZIP. The included CI workflow has not run remotely. Do not interpret its presence as a passing CI result.

## Android app (Google Play)

`android/` contains a Trusted Web Activity app that opens this website full-screen, so CMS changes appear in the app without an app update. The site is installable (`/manifest.webmanifest`), shows a branded offline page (`public/sw.js`, production only) and serves `/.well-known/assetlinks.json` once `ANDROID_PACKAGE_NAME` and `ANDROID_SHA256_FINGERPRINTS` are set. The brand name in Website settings drives the logo, favicon and app icons (`/app-icon/...`), and any text containing `{brand}` shows the current name. Build, signing and Play Store steps: [android/README.md](android/README.md).

## Deployment — next stage

A server-rendered Next.js + MySQL application needs a Node.js-capable host/container and a MySQL service. GitHub Pages cannot execute this backend. The Dockerfile provides a production application image; this task does not deploy it.

Before launch, configure `APP_URL` to the exact HTTPS origin, `DEMO_MODE=false`, `COOKIE_SECURE=true`, a dedicated MySQL user, TLS for remote database connections (`DATABASE_SSL=true` when using trusted certificates), backups and retention. Keep secrets in the host's environment. Set `TRUST_PROXY=true` only if your reverse proxy **overwrites** incoming `X-Forwarded-For`; otherwise rate limiting intentionally uses a shared server bucket. API forms reject Origins other than `APP_URL`.

```sh
npm ci
npm run db:migrate
npm run db:seed
npm run build
npm start
```

Production denies framing and JavaScript eval. Local development allows same-origin framing and eval/WebSockets required by Next.js tooling. There are no hardcoded production secrets, default admin, analytics, payment features, email sender, or automatic deployments.
