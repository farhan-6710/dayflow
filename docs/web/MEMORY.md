# Memory — DayFlow Web

Short durable facts for web and desktop. Shared decisions: [docs/MEMORY.md](../../../docs/MEMORY.md). Work left: [TASKS.md](./TASKS.md).

## Status

- Web and public site are shipped. Desktop is at `0.1.x` (`src-tauri/tauri.conf.json`), published on [GitHub Releases](https://github.com/farhan-6710/dayflow/releases).
- The old web tree is recoverable from git commit `b1335f3` if needed.

## Decisions

- Theme choice is stored locally under `DF-theme`, not in the database.
- Reminder alerts run in the browser (`useReminderAlerts`) while a workspace tab is open. There is no server job.
- The completion chart uses `tasks.updated_at`, because there is no completed-at column.
- Projects have only `is_active` (no On Hold or Completed). Notes are plain text.
- The public site has no invented people, reviews or user counts.
- The assistant is named Flowy (see [ARCHITECTURE.md](./ARCHITECTURE.md#assistant-flowy)).
- Desktop id `com.dayflow.app` is kept for releases. `serde_json` must stay in `src-tauri/Cargo.toml`.
- Help & support links to GitHub issues (`shared/constants/support.ts`).
- Shipped images are WebP. PNG masters live under `apps/web/design/` and are not deployed.
