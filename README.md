![DayFlow Banner](./apps/web/design/brand/brand-promotion-banner-img-dark.png)

# DayFlow

**Organize your day. Elevate your flow.**

A workspace built for freelancers to manage clients, projects, tasks, meetings, notes, reminders, and more — all in one place.

**Platforms:** Web · Desktop (macOS & Windows) · Mobile (Flutter app in development, UI preview only)

---

## Try DayFlow (web)

1. Open **[https://dayflow-web-version.vercel.app/](https://dayflow-web-version.vercel.app/)**
2. Sign in at **[Workspace login](https://dayflow-web-version.vercel.app/workspace/auth)** with the demo account on the login screen (or create your own)
3. Optional: clients use **[Client portal login](https://dayflow-web-version.vercel.app/client-portal/auth)** with an email linked to a client record

Same credentials work on desktop and Android — one Supabase project for all surfaces.

---

## Install desktop

1. Open **[GitHub Releases](https://github.com/farhan-6710/dayflow/releases)** and go to the latest release.
2. Under **Assets**, download the file for your computer:
   - **macOS:** the link ending in `.dmg`
   - **Windows:** the link ending in `.exe`
3. **macOS:** open the `.dmg`, drag **DayFlow** into **Applications**, then eject the disk image (`hdiutil eject /Volumes/DayFlow`).
4. **Windows:** run the `.exe` installer.

### If your system blocks the app

**macOS** — if you see *“DayFlow” is damaged and can’t be opened. You should move it to the Bin*:

```bash
xattr -cr /Applications/DayFlow.app
```

Then open DayFlow again from Applications (or right-click → Open).

**Windows** — if Windows blocks the installation:

```text
More info → Run anyway
```

Google sign-in on desktop opens the system browser and returns via `dayflow://`.

---

## Uninstall DayFlow

**macOS:**

```bash
rm -rf /Applications/DayFlow.app
```

**Windows:**

```text
Settings → Apps → Installed apps → DayFlow → Uninstall
```

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [docs/PRD.md](./docs/PRD.md) | Product requirements |
| [docs/DATABASE.md](./docs/DATABASE.md) | Tables, RPCs, DB contract |
| [docs/RULES.md](./docs/RULES.md) | Rules for every app |
| [docs/MEMORY.md](./docs/MEMORY.md) | Shared durable decisions |
| [apps/web/docs/](./apps/web/docs/) | Web architecture, design, rules, tasks |
| [apps/mobile/docs/](./apps/mobile/docs/) | Flutter plan, rules, tasks |

Brand: [`shared/brand/brandManifest.json`](./shared/brand/brandManifest.json) · Theme: [`shared/brand/theme.json`](./shared/brand/theme.json)
