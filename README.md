# MapleSimpleTimer

MapleSimpleTimer is a small desktop timer for MapleStory routines. It is built with Svelte 5 runes, Tauri 2, Tailwind CSS, and shadcn-svelte.

## Features

- Hour, minute, and second timer input with separated digit controls
- Quick add buttons for common durations
- Start, pause, and reset controls
- Warning colors below 30 seconds and 10 seconds
- Repeat mode for automatic restart
- Desktop notifications
- Always-on-top toggle
- Light and dark themes
- Bundled Noto Sans KR and Oxanium fonts
- Custom fixed-ratio resize handle

## Development

```sh
pnpm install
pnpm tauri:dev
```

The Tauri dev script sets `WEBKIT_DISABLE_DMABUF_RENDERER=1` for Linux WebKit rendering stability.

## Checks

```sh
pnpm check
cargo check --manifest-path src-tauri/Cargo.toml
```

## Production Build

Local Tauri build:

```sh
pnpm tauri:build
```

Windows portable builds are produced by GitHub Actions. The workflow builds on `windows-latest` and uploads `MapleSimpleTimer-windows-portable.exe` as an artifact. When pushing a `v*` tag, the same executable is attached to the GitHub Release.

## Release

```sh
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

The `v1.0.0` tag triggers the Windows portable release build.
