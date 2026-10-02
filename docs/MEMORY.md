# Memory — DayFlow

Durable context for future sessions. Prefer short facts over narrative.

## Positioning

- Positioning key: `freelancer-workspace` (see `brandManifest.json`).
- Canonical description: *A workspace built for freelancers to manage clients, projects, tasks, meetings, notes, reminders, and more — all in one place.*
- Tagline: *Organize your day. Elevate your flow.*
- Docs banner: `apps/web/public/brand-promotion-banner-img-dark.png`
- Auth UI banners: `brand-promotion-banner-light.png` / `brand-promotion-banner-dark.png` (manifest `promotionBanners`)

## Architecture decisions

- One Supabase project for web, desktop, and mobile — no per-platform DB.
- Clients never own `projects`; portal access is RPC + RLS helpers only.
- `project_for`: `null` = personal; UUID = client-facing.
- Activities use `raised_by`: `'workspace'` | `'client'`.
- Workspace terminology: `owner_user_id` (not `admin_id`); routes under `/workspace` (`/admin-portal` redirects).
- Projects use `is_active` (active/inactive). Do not reintroduce archive semantics.
- Shared activities UI: `features/workspace/client-activities/` with `forClientPortal` props.

## Ops

- Live demo/hosting historically on Hostinger; product overview and install links live in the **repo root** `README.md`.
- Migrations are append-only under `scripts/migrations/` (through 033+).
- Desktop release: eject mounted DayFlow DMG before `tauri:build`.
- Do not commit `.env`, credentials, or `src-tauri/target/`.

## Docs layout

| File | Role |
|------|------|
| `docs/PRD.md` | Product goals and requirements |
| `docs/ARCHITECTURE.md` | Systems, data, APIs |
| `docs/DESIGN.md` | UI/UX direction |
| `docs/RULES.md` | Dev/agent conventions |
| `docs/TASKS.md` | Roadmap / status |
| `docs/MEMORY.md` | This file |
| `README.md` (root) | Try / install / stack overview |
