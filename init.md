# MapleSimpleTimer Init Plan

## Goal

Build a small desktop timer app for MapleStory players using Svelte, Tauri, and shadcn-svelte.

The primary use case is counting repeated intervals such as 2 minutes while playing. The app should be compact, fast to operate, visually clean, and readable when placed next to the game.

## Stack

- Desktop shell: Tauri v2
- Frontend: SvelteKit
- Svelte syntax: Svelte 5 runes
- Language: TypeScript
- Package manager: pnpm
- UI system: shadcn-svelte
- Styling: Tailwind CSS
- Icons: lucide-svelte
- Initial persistence: localStorage

SvelteKit should be configured for Tauri using static output.

All Svelte components and stateful logic should use Svelte 5 rune syntax. Do not use legacy Svelte 3/4 patterns such as `$:` reactive statements, `export let`, or classic writable stores for component-local state unless a dependency requires it.

Use Svelte MCP documentation tools during implementation when available in Codex. If the MCP server is not exposed in the current Codex session, restart Codex and verify the configured `svelte` MCP server is available before implementing non-trivial Svelte 5 rune logic.

## Product Scope

### MVP Features

- Default timer duration: 2 minutes
- Editable time display with hour, minute, and second fields
- Start, pause, and reset controls
- Quick add buttons inspired by Naver timer:
  - +10 seconds
  - +30 seconds
  - +1 minute
  - +2 minutes
  - +5 minutes
  - +10 minutes
- Countdown warning colors:
  - 30 seconds or more: normal timer color
  - Under 30 seconds: orange
  - Under 10 seconds: red
- Repeat mode toggle
- Notification toggle
- Always-on-top toggle
- Light and dark theme support
- Persist user settings between app launches

### Default Settings

- Duration: 120 seconds
- Theme: dark
- Repeat mode: off
- Notification: on
- Always on top: off

## Interaction Rules

- Editing the time while idle or paused updates both duration and remaining time.
- Editing the time while running should pause first or require an explicit reset before applying the new value.
- Quick add buttons while idle or paused add to both duration and remaining time.
- Quick add buttons while running add to the current remaining time and update the active end time.
- Reset returns the timer to the current configured duration.
- When the timer reaches zero:
  - If repeat mode is off, status becomes `finished`.
  - If repeat mode is on, the timer restarts from the current duration.
  - If notifications are enabled, trigger the configured finish notification.

## Design Direction

The app should feel like a focused utility, not a marketing page. The first screen should be the actual timer.

Use a compact desktop layout:

```text
+---------------------------+
| MapleSimpleTimer      theme |
|                           |
|        00 : 02 : 00       |
|                           |
|     [START]   [RESET]     |
|                           |
| +10s +30s +1m +2m         |
| +5m  +10m                 |
|                           |
| Repeat  Notify  Top       |
+---------------------------+
```

Design principles:

- Clean shadcn-svelte styling
- Dark mode first, light mode available
- No landing page
- No decorative gradients or heavy illustration
- Keep the app readable in a small window
- Main action button should be visually emphasized
- Quick add buttons should be lower emphasis but easy to scan

## Fonts

Bundle fonts locally. Do not rely on CDN font loading.

- UI font: Noto Sans KR
- Timer number font: Oxanium

Font files should be stored under `static/fonts/`.

Preferred bundled weights:

- Noto Sans KR: 400, 500, 600, 700
- Oxanium: 500, 600, 700

Confirm font licenses are compatible with app redistribution before release.

Timer display CSS should use:

```css
font-family: "Oxanium", monospace;
font-variant-numeric: tabular-nums;
```

The timer font should provide a subtle cyberpunk/game utility feel without sacrificing readability.

## Theme

Support both light and dark modes.

Implementation direction:

- Use shadcn-svelte CSS variable theme tokens
- Toggle `dark` class on the root element
- Persist `theme: "light" | "dark"` to localStorage
- Restore theme before or during app initialization

## State Model

Recommended state files:

```text
src/lib/state/timer.svelte.ts
src/lib/state/settings.svelte.ts
src/lib/utils/time.ts
```

Timer state:

- `durationSeconds`
- `remainingSeconds`
- `status: "idle" | "running" | "paused" | "finished"`
- `startedAt`
- `endsAt`

Settings state:

- `theme`
- `repeat`
- `notification`
- `alwaysOnTop`

Use timestamp-based countdown calculation instead of decrementing one second at a time. This avoids timer drift.

Use rune-based state modules for app state:

- `$state` for mutable timer and settings state
- `$derived` for formatted time, warning level, and button state
- `$effect` for localStorage persistence and interval lifecycle where appropriate
- Component props should use `$props()`
- Event handlers should use normal callback props and Svelte 5 conventions

## Component Plan

```text
src/lib/components/timer/TimerDisplay.svelte
src/lib/components/timer/TimerControls.svelte
src/lib/components/timer/QuickAddBar.svelte
src/lib/components/timer/SettingsBar.svelte
src/lib/components/timer/TimeInput.svelte
```

shadcn-svelte components likely needed:

- button
- input
- switch
- separator
- tooltip
- card, only if it frames the app surface cleanly

Avoid nested cards.

## Tauri Requirements

Initial window suggestion:

- Width: 360
- Height: 480
- Resizable: true, but keep layout optimized for compact size
- Title: MapleSimpleTimer

Tauri integrations:

- Always-on-top setting
- Native notification if practical in MVP

If native notification setup becomes too much for the first pass, implement visual finish state first and leave native notification as the next task.

Always-on-top implementation should use Tauri APIs from the frontend where possible. If permissions or capability files are required by Tauri v2, add the minimal capability needed for the window operation.

Notification fallback:

- Native notification when available
- In-app visual finish state always required
- Optional short sound can be added after the MVP, but should not block the first build

## Distribution Target

The app must be distributable in a form that runs on Windows 11.

Primary release target:

- Windows 11 x64
- Portable Windows executable first
- Installer is optional later

Build considerations:

- Verify Windows packaging through Tauri's Windows target before release.
- Prefer a portable executable for the first release because this is a small utility app.
- Document any Windows build prerequisites if the build is performed outside Windows.
- Final release validation must include launching the built app on Windows 11.
- If cross-compilation is unreliable, perform the final production build on a Windows 11 machine or Windows CI runner.
- Expect possible Windows SmartScreen or unknown publisher warnings unless code signing is added.

Recommended release path:

1. Develop and validate locally.
2. Add a GitHub Actions Windows build workflow.
3. Produce a portable Windows executable artifact from a Windows runner.
4. Smoke test the executable on Windows 11.

## Implementation Steps

1. Scaffold SvelteKit + Tauri v2 project.
2. Add Tailwind CSS.
3. Initialize shadcn-svelte.
4. Add required shadcn-svelte components.
5. Configure SvelteKit for static output in Tauri.
6. Add local font files and CSS font-face declarations.
7. Implement timer utilities and store.
8. Implement settings store and localStorage persistence.
9. Build main timer UI.
10. Add warning color rules for under 30 seconds and under 10 seconds.
11. Add theme toggle.
12. Add always-on-top integration.
13. Run dev server and verify UI.
14. Run build checks.
15. Build Windows 11 release artifact.
16. Verify the Windows artifact launches and the timer works.

## Open Decisions Before Coding

- Exact scaffold command may depend on the current Tauri/SvelteKit template state.
- Native notification support may require a Tauri plugin or capability configuration.
- Installer format is not required for MVP. If installation support is added later, select NSIS or MSI depending on current Tauri defaults and release needs.

## Verification Checklist

- App starts in dark mode by default.
- Default timer is 2 minutes.
- Start, pause, and reset work correctly.
- Quick add buttons update duration predictably.
- Timer text turns orange below 30 seconds.
- Timer text turns red below 10 seconds.
- Theme selection persists.
- Repeat setting persists.
- Notification setting persists.
- Always-on-top toggle works in Tauri.
- Layout remains clean around 360x480.
- Windows 11 artifact is produced.
- Windows 11 artifact launches successfully.
