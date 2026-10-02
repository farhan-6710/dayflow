# DayFlow web & desktop

Vite + React workspace and client portal. Tauri 2 wraps the same UI for macOS and Windows. Same Supabase project as mobile.

Product overview: [README.md](../../README.md). Conventions: [docs/RULES.md](../../docs/RULES.md).

## Setup

```bash
cd apps/web
bun install
```

`.env` (do not commit):

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Must match the mobile `EXPO_PUBLIC_SUPABASE_*` values.

## Commands

| Command | Purpose |
|---------|---------|
| `bun run dev` | Web on http://localhost:5173 |
| `bun run tauri:dev` | Desktop window (starts Vite) |
| `bun run build` | Vite production `dist/` only |
| `bun run tauri:build` | Desktop installer for the current OS |

## Desktop release build

Build **macOS on a Mac** and **Windows on a Windows PC**. One machine cannot produce both installers.

Do not commit `src-tauri/target/`.

### Before every release (both platforms)

1. If DayFlow is already installed and you want the latest build: quit the app, then move it to Trash / Bin (macOS: `/Applications/DayFlow.app`; Windows: uninstall or delete the installed app).
2. Install once: [Bun](https://bun.sh), [Rust](https://rustup.rs), and [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for that OS.
3. Put the same `.env` values in `apps/web/.env` (see Setup above).
4. Bump version in **both** files to the same value:
   - `src-tauri/tauri.conf.json` → `version`
   - `src-tauri/Cargo.toml` → `version`
5. From `apps/web`:
   ```bash
   bun install
   ```

### macOS

1. Quit DayFlow if it is open.
2. Eject a mounted DayFlow disk (or the `.dmg` step fails):
   ```bash
   hdiutil detach "/Volumes/DayFlow" 2>/dev/null || true
   ```
3. Build:
   ```bash
   cd apps/web
   bun run tauri:build
   ```
4. Installer: `src-tauri/target/release/bundle/dmg/DayFlow_*_*.dmg`
5. Open the `.dmg`, drag DayFlow to Applications, smoke-test, then upload that `.dmg` to GitHub Releases.

**After install (unsigned):** if macOS says the app is damaged:

```bash
xattr -cr /Applications/DayFlow.app
```

Or Applications → right-click **DayFlow** → **Open**.

### Windows

1. Install once: Bun, Rust, Visual Studio Build Tools (C++ workload), and WebView2.
2. Clone/pull the same commit; same `apps/web/.env` and version bump as above.
3. Build:
   ```bash
   cd apps/web
   bun install
   bun run tauri:build
   ```
4. Installer: `src-tauri/target/release/bundle/nsis/DayFlow_*_x64-setup.exe`
5. Run the installer, smoke-test, then upload that `.exe` to GitHub Releases.

SmartScreen may warn on unsigned builds: **More info → Run anyway**.

### Publish

GitHub → Releases → draft → tag matching the version (e.g. `v0.1.6`) → upload macOS `.dmg` + Windows `.exe`.

## Tauri notes

- Config: `src-tauri/tauri.conf.json` (identifier `com.dayflow.app`, scheme `dayflow://`)
- Vite ignores `src-tauri/` in watch
- Detect desktop in React: `isDesktopApp()` from `@/shared/utils/platform`
- Google OAuth: system browser → hosted `/auth/desktop-oauth-bridge` → `dayflow://auth/callback`. Works in the **installed** app. Deploy web if the bridge changes, then rebuild.
- Supabase calls stay in `src/services/` — not in feature folders.

## Layout

```text
src/features/workspace/   Owner app (/workspace)
src/features/client/      Client portal (/client-portal)
src/services/             Supabase
src/shared/               Shared UI
src-tauri/                Rust shell, icons, capabilities
```
