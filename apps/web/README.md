# DayFlow web & desktop

Vite + React workspace and client portal. Tauri 2 wraps the same UI as a macOS app. Same Supabase project as mobile.

Product overview: [docs/README.md](../../docs/README.md). Conventions: [docs/AGENTS.md](../../docs/AGENTS.md).

## Setup

```bash
cd /Users/farhan/my-work/my-projects/dayflow/apps/web
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
| `bun run tauri:build` | macOS `.app` + `.dmg` |

## Desktop release build

Eject a mounted DayFlow disk first or the `.dmg` step fails:

```bash
hdiutil detach "/Volumes/DayFlow" 2>/dev/null || true
cd /Users/farhan/my-work/my-projects/dayflow/apps/web && bun run tauri:build
```

Installer: `src-tauri/target/release/bundle/dmg/`  
App: `src-tauri/target/release/bundle/macos/DayFlow.app`

Do not commit `src-tauri/target/`.

### After install (unsigned macOS)

macOS may say the app is damaged. Once:

```bash
xattr -cr /Applications/DayFlow.app
```

Or Applications → right-click **DayFlow** → **Open**.

### Version bump (both files, same version)

- `src-tauri/tauri.conf.json` → `version`
- `src-tauri/Cargo.toml` → `version`

Then GitHub Release → upload the `.dmg`.

### Icons

```bash
cd /Users/farhan/my-work/my-projects/dayflow/apps/web
bunx tauri icon public/logo-light-icon.png
```

### Stale cache (`app_hide.toml` / wrong `src-tauri` path)

The crate lives at `apps/web/src-tauri`, not repo-root `src-tauri`. If a build looks in the old path:

```bash
rm -rf /Users/farhan/my-work/my-projects/dayflow/apps/web/src-tauri/target
```

Then run the release build again.

### Missing `.dmg` but `.app` exists

```bash
mkdir -p src-tauri/target/release/bundle/dmg
hdiutil create -volname "DayFlow" \
  -srcfolder "src-tauri/target/release/bundle/macos/DayFlow.app" \
  -ov -format UDZO \
  "src-tauri/target/release/bundle/dmg/DayFlow_0.1.4_aarch64.dmg"
```

## Tauri notes

- Config: `src-tauri/tauri.conf.json` (identifier `com.dayflow.app`, scheme `dayflow://`)
- Vite ignores `src-tauri/` in watch
- Detect desktop in React: `isDesktopApp()` from `@/shared/utils/platform`
- Google OAuth: system browser → hosted `/auth/desktop-oauth-bridge` → `dayflow://auth/callback`. Works in the **installed** `.app`. Deploy web if the bridge changes, then rebuild.
- Windows `.exe`: build on a Windows machine (or CI `windows-latest`). This Mac command only produces macOS artifacts.
- Supabase calls stay in `src/services/` — not in feature folders.

## Layout

```text
src/features/workspace/   Owner app (/workspace)
src/features/client/      Client portal (/client-portal)
src/services/             Supabase
src/shared/               Shared UI
src-tauri/                Rust shell, icons, capabilities
```
