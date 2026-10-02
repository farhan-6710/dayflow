# Design — DayFlow

## Direction

Dark-first product UI with a calm workspace feel. Brand accents: cyan/light-blue primary, orange checkmark in the logo.

**Tagline:** Organize your day. Elevate your flow.  
**Description:** A workspace built for freelancers to manage clients, projects, tasks, meetings, notes, reminders, and more — all in one place.

**Source of truth:** `apps/web/src/shared/brand/brandManifest.json`  
**Assets:** `apps/web/public/` (logos, favicons, promotion banners)

Promo banners (auth + docs) must mirror manifest tagline, description, and portal feature groups. Change copy in the manifest first, then update banner images.

## Layout patterns

| Pattern | Use |
|---------|-----|
| `PageHeader` + `PageContent` | Standard page chrome |
| `DirectoryTable` + `DirectoryTableRow` | List/directory screens |
| Listing search + `OptionDropdown` | Filters; control height aligned (`h-9`) |
| Detail headers | Primary actions in the header (edit, delete, related links) |

## Components & feedback

- Project chip: `color_hex` background + white Lucide icon
- Toasts via `showToast` after mutations
- Destructive actions via `ConfirmationModal`
- Loading / empty / error states on list and detail screens — no blank hangs
- Presentational blocks stay lean; logic in hooks

## Portal UX

| Portal | Focus |
|--------|-------|
| Workspace | Owner runs clients, projects, tasks, meetings, notes, reminders |
| Client portal | Shared projects + raise activities; no owner-only chrome |

Reuse presentational blocks across portals with props (`forClientPortal`, etc.). Do not leak workspace-owner hooks into the client portal.

## Interaction notes

- Tasks calendar: browse by day; add/edit from a date
- Client activities: Add New when the user can edit; date/time, priority, status
- Notes: category filter/search; optional reference links
- Projects: active/inactive (not “archive”)

## Motion

Prefer small, purposeful motion (Framer Motion where already used). Avoid decorative noise on dense data screens.
