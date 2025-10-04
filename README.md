
# Computer Repairer Web Application

An all-in-one platform for computer repair businesses, featuring online appointment booking, customer management, product shop, blog, and admin dashboard.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/enyasystems-projects/v0-computer-repair-homepage)

## Features

- Online appointment booking
- Admin dashboard for managing appointments, customers, products, and inquiries
- Blog for sharing news and tips
- Product shop for selling computer accessories
- Contact and inquiry forms
- Responsive and modern UI

## Tech Stack

- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS / PostCSS
- Vercel (deployment)

## Getting Started

1. **Clone the repository:**
	```powershell
	git clone https://github.com/enyasystem/computersrepairer.git
	cd computersrepairer
	```
2. **Install dependencies:**
	```powershell
	pnpm install
	```
3. **Run the development server:**
	```powershell
	pnpm dev
	```
	Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

This project is automatically deployed to Vercel:

**[Live Demo](https://vercel.com/enyasystems-projects/v0-computer-repair-homepage)**

## Project Structure

- `app/` — Main application pages and routes
- `components/` — Reusable UI and feature components
- `lib/` — Utility and data logic
- `public/` — Static assets
- `styles/` — Global styles

## License

MIT License

## Environment variables

This project reads configuration from environment variables. For local development:

1. Copy `.env.example` to `.env.local`.
2. Fill in real values for secrets (do not commit `.env.local`).

Key variables included in `.env.example`:

- `DATABASE_URL` (required) — Postgres/Neon connection string used by the app.
- `DATABASE_PRIMARY_URL` (optional) — Primary/writer DB URL when using Neon replicas.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (optional) — Supabase storage/service role key.
- `ADMIN_USER` and `ADMIN_PASS` — local admin credentials used by some scripts/tests.

If you see the error "DATABASE_URL environment variable is not set", create `.env.local` and set `DATABASE_URL` to your Neon/Postgres connection string.
