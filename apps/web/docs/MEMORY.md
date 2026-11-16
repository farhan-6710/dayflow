# Memory — DayFlow Web

Short durable facts. Shared decisions: [docs/MEMORY.md](../../../docs/MEMORY.md). Work left: [TASKS.md](./TASKS.md).

## Status

- Web rebuild and public site are shipped. Desktop builds at `0.1.x` under `src-tauri/` and [GitHub Releases](https://github.com/farhan-6710/dayflow/releases).
- Old web tree recoverable from git commit `b1335f3` if needed.

## Decisions

- Routes in `src/app/router.tsx`: workspace, client portal, public site.
- Theme from [theme.json](../../../shared/brand/theme.json); choice is local (`DF-theme`), not per-user in the DB.
- Sign-out uses `scope: "local"` (demo account is shared).
- Reminder alerts: `useReminderAlerts` in the browser while a workspace tab is open — no server job yet.
- Completion chart uses `tasks.updated_at` (no completed-at column).
- Times stay display strings (`"10:00 AM"`) for mobile parity.
- Projects: only `is_active` (no On Hold / Completed). Notes are plain text. No invented site testimonials.
- Desktop id `com.dayflow.app` kept for releases. `serde_json` must stay in `Cargo.toml`.
- Help & support links to GitHub issues (`shared/constants/support.ts`).

## Ops

- Logos: `scripts/recolor-logos.py` then `scripts/generate-tauri-icon.py` after theme colour changes.
- Shipped images are WebP; PNG masters live under `apps/web/design/` and are not deployed.

## Docs

| File | Role |
|------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Stack, folders, env, auth, deploy, Tauri, assistant |
| [DESIGN.md](./DESIGN.md) | UI patterns and tokens usage |
| [RULES.md](./RULES.md) | Web coding rules |
| [TASKS.md](./TASKS.md) | Done / remaining |
| [MEMORY.md](./MEMORY.md) | This file |

Read order: [PRD](../../../docs/PRD.md) → [DATABASE](../../../docs/DATABASE.md) → [RULES](../../../docs/RULES.md) → ARCHITECTURE → RULES → DESIGN → TASKS.
