import { browser } from "$app/environment";
import { DEFAULT_DURATION_SECONDS, clampDuration, formatTimer, getWarningLevel } from "$lib/utils/time";

export type TimerStatus = "idle" | "running" | "paused" | "finished";

const TICK_MS = 200;

class TimerState {
	durationSeconds = $state(DEFAULT_DURATION_SECONDS);
	remainingSeconds = $state(DEFAULT_DURATION_SECONDS);
	status = $state<TimerStatus>("idle");
	startedAt = $state<number | null>(null);
	endsAt = $state<number | null>(null);

	readonly formattedTime = $derived(formatTimer(this.remainingSeconds));
	readonly warningLevel = $derived(getWarningLevel(this.remainingSeconds));
	readonly isRunning = $derived(this.status === "running");
	readonly canStart = $derived(this.remainingSeconds > 0 && this.status !== "running");

	#intervalId: number | null = null;
	#onFinish: (() => void) | null = null;
	#shouldRepeat: (() => boolean) | null = null;

	configure(options: { onFinish?: () => void; shouldRepeat?: () => boolean }) {
		this.#onFinish = options.onFinish ?? null;
		this.#shouldRepeat = options.shouldRepeat ?? null;
	}

	setDuration(seconds: number) {
		const next = clampDuration(seconds);
		this.durationSeconds = next;

		if (this.status === "running") {
			this.pause();
		}

		this.remainingSeconds = next;
		this.status = next > 0 ? "idle" : "finished";
		this.startedAt = null;
		this.endsAt = null;
	}

	addSeconds(seconds: number) {
		const nextRemaining = clampDuration(this.remainingSeconds + seconds);
		this.remainingSeconds = nextRemaining;

		if (this.status === "running") {
			const now = Date.now();
			this.endsAt = now + nextRemaining * 1000;
		} else {
			this.durationSeconds = nextRemaining;
			this.status = nextRemaining > 0 ? "idle" : "finished";
		}
	}

	start() {
		if (!browser || this.remainingSeconds <= 0 || this.status === "running") return;

		const now = Date.now();
		this.startedAt = now;
		this.endsAt = now + this.remainingSeconds * 1000;
		this.status = "running";
		this.#startTicker();
	}

	pause() {
		if (this.status !== "running") return;

		this.#syncRemaining();
		this.status = this.remainingSeconds > 0 ? "paused" : "finished";
		this.startedAt = null;
		this.endsAt = null;
		this.#stopTicker();
	}

	reset() {
		this.#stopTicker();
		this.remainingSeconds = this.durationSeconds;
		this.status = this.durationSeconds > 0 ? "idle" : "finished";
		this.startedAt = null;
		this.endsAt = null;
	}

	toggle() {
		if (this.status === "running") {
			this.pause();
			return;
		}

		this.start();
	}

	#startTicker() {
		this.#stopTicker();
		this.#intervalId = window.setInterval(() => this.#syncRemaining(), TICK_MS);
		this.#syncRemaining();
	}

	#stopTicker() {
		if (this.#intervalId === null) return;
		window.clearInterval(this.#intervalId);
		this.#intervalId = null;
	}

	#syncRemaining() {
		if (this.endsAt === null) return;

		const nextRemaining = Math.max(0, Math.ceil((this.endsAt - Date.now()) / 1000));
		this.remainingSeconds = nextRemaining;

		if (nextRemaining > 0) return;

		this.#stopTicker();
		this.startedAt = null;
		this.endsAt = null;

		if (this.#shouldRepeat?.()) {
			this.remainingSeconds = this.durationSeconds;
			this.start();
		} else {
			this.status = "finished";
		}

		this.#onFinish?.();
	}
}

export const timer = new TimerState();
