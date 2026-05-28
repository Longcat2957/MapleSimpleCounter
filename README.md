# MapleSimpleTimer

MapleSimpleTimer is a compact desktop timer for MapleStory routines. It focuses on fast time adjustment, repeat timing, and staying out of the way while you play.

Built with Svelte 5 runes, Tauri 2, Tailwind CSS, and shadcn-svelte.

## Download

Windows portable builds are published from GitHub Actions.

- Latest release: https://github.com/Longcat2957/MapleSimpleCounter/releases/latest
- Portable executable: `MapleSimpleTimer-windows-portable.exe`

The executable is portable: download it and run it directly. No installer is required.

## Features

- Digit-based `HH MM SS` input
- Left-click quick time buttons to add time
- Right-click quick time buttons to subtract time
- Start, pause, and reset controls
- Repeat mode for automatic restart
- Desktop notifications
- Always-on-top toggle
- Light and dark themes
- 30-second warning and 10-second danger timer colors
- Bundled `Noto Sans KR` UI font and `Oxanium` timer font
- Custom fixed-ratio resize handle
- Slate / light-gray visual theme

## Controls

Timer digits:

- Click a digit and type a number to replace it.
- Number input moves focus to the next digit.
- `ArrowLeft` / `ArrowRight` moves between digits.
- `Home` / `End` jumps to the first / last digit.
- `ArrowUp` / `ArrowDown` increments or decrements a digit.
- `Backspace` / `Delete` resets the focused digit to `0`.

Quick time buttons:

- Left click: add that amount.
- Right click: subtract that amount.
- The timer is clamped at `0`, so subtracting cannot make it negative.

## Development

Prerequisites:

- Node.js 22+
- pnpm
- Rust stable
- Tauri platform dependencies

Install and run:

```sh
pnpm install
pnpm tauri:dev
```

The dev script sets `WEBKIT_DISABLE_DMABUF_RENDERER=1` for Linux WebKit rendering stability.

## Validation

```sh
pnpm check
cargo check --manifest-path src-tauri/Cargo.toml
pnpm tauri:build --no-bundle --ci
```

## Release Build

Local production build:

```sh
pnpm tauri:build
```

GitHub Actions builds the Windows portable executable on `windows-latest`.

Workflow output:

- Artifact: `MapleSimpleTimer-windows-portable`
- Release asset: `MapleSimpleTimer-windows-portable.exe`

## Release Process

Update versions, commit, then push `main` and a version tag:

```sh
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

Pushing a `v*` tag creates or updates the GitHub Release and uploads the portable Windows executable.

## Notes

The portable executable is currently unsigned. Windows SmartScreen may warn on some systems until the app gains reputation or code signing is added.
