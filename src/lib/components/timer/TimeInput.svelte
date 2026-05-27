<script lang="ts">
	import { cn } from "$lib/utils";
	import { timer } from "$lib/state/timer.svelte";
	import { partsToSeconds, secondsToParts } from "$lib/utils/time";

	const parts = $derived(secondsToParts(timer.remainingSeconds));
	const displayParts = $derived({
		hours: String(parts.hours).padStart(2, "0"),
		minutes: String(parts.minutes).padStart(2, "0"),
		seconds: String(parts.seconds).padStart(2, "0")
	});
	const toneClass = $derived(`is-${timer.warningLevel}`);

	function updatePart(part: "hours" | "minutes" | "seconds", event: Event) {
		if (timer.isRunning) return;

		const input = event.currentTarget as HTMLInputElement;
		const rawValue = Number(input.value);
		const value = Number.isFinite(rawValue) ? Math.max(0, Math.floor(rawValue)) : 0;
		const nextParts = { ...parts, [part]: value };

		timer.setDuration(partsToSeconds(nextParts.hours, nextParts.minutes, nextParts.seconds));
	}
</script>

<section class="timer-input-grid" aria-label="timer duration">
	<label class="time-segment">
		<span class="time-box">
			<span class={cn("time-value", toneClass)} aria-hidden="true">{displayParts.hours}</span>
			<span class="time-label" aria-hidden="true">시</span>
		</span>
		<input
			class="time-input"
			type="text"
			inputmode="numeric"
			pattern="[0-9]*"
			maxlength="2"
			value={String(parts.hours).padStart(2, "0")}
			disabled={timer.isRunning}
			onfocus={(event) => (event.currentTarget as HTMLInputElement).select()}
			oninput={(event) => updatePart("hours", event)}
			aria-label="hours"
		/>
	</label>
	<label class="time-segment">
		<span class="time-box">
			<span class={cn("time-value", toneClass)} aria-hidden="true">{displayParts.minutes}</span>
			<span class="time-label" aria-hidden="true">분</span>
		</span>
		<input
			class="time-input"
			type="text"
			inputmode="numeric"
			pattern="[0-9]*"
			maxlength="2"
			value={String(parts.minutes).padStart(2, "0")}
			disabled={timer.isRunning}
			onfocus={(event) => (event.currentTarget as HTMLInputElement).select()}
			oninput={(event) => updatePart("minutes", event)}
			aria-label="minutes"
		/>
	</label>
	<label class="time-segment">
		<span class="time-box">
			<span class={cn("time-value", toneClass)} aria-hidden="true">{displayParts.seconds}</span>
			<span class="time-label" aria-hidden="true">초</span>
		</span>
		<input
			class="time-input"
			type="text"
			inputmode="numeric"
			pattern="[0-9]*"
			maxlength="2"
			value={String(parts.seconds).padStart(2, "0")}
			disabled={timer.isRunning}
			onfocus={(event) => (event.currentTarget as HTMLInputElement).select()}
			oninput={(event) => updatePart("seconds", event)}
			aria-label="seconds"
		/>
	</label>
</section>
