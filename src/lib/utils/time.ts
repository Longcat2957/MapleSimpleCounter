export const DEFAULT_DURATION_SECONDS = 120;
export const MAX_DURATION_SECONDS = 99 * 60 * 60 + 59 * 60 + 59;

export type WarningLevel = "normal" | "warning" | "danger" | "finished";

export function clampDuration(seconds: number) {
	if (!Number.isFinite(seconds)) return DEFAULT_DURATION_SECONDS;
	return Math.min(MAX_DURATION_SECONDS, Math.max(0, Math.floor(seconds)));
}

export function partsToSeconds(hours: number, minutes: number, seconds: number) {
	return clampDuration(hours * 3600 + minutes * 60 + seconds);
}

export function secondsToParts(totalSeconds: number) {
	const safeSeconds = clampDuration(totalSeconds);
	const hours = Math.floor(safeSeconds / 3600);
	const minutes = Math.floor((safeSeconds % 3600) / 60);
	const seconds = safeSeconds % 60;

	return { hours, minutes, seconds };
}

export function formatTimer(totalSeconds: number) {
	const { hours, minutes, seconds } = secondsToParts(totalSeconds);
	const pad = (value: number) => String(value).padStart(2, "0");

	return `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
}

export function getWarningLevel(remainingSeconds: number): WarningLevel {
	if (remainingSeconds <= 0) return "finished";
	if (remainingSeconds < 10) return "danger";
	if (remainingSeconds < 30) return "warning";
	return "normal";
}
