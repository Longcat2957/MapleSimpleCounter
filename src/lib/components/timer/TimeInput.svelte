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

	type TimePart = "hours" | "minutes" | "seconds";
	type DigitPlace = "tens" | "ones";

	const digitOrder = ["hours-tens", "hours-ones", "minutes-tens", "minutes-ones", "seconds-tens", "seconds-ones"];

	function digitAt(part: TimePart, place: DigitPlace) {
		const value = displayParts[part];
		return place === "tens" ? value[0] : value[1];
	}

	function clampDigit(part: TimePart, place: DigitPlace, value: number) {
		if ((part === "minutes" || part === "seconds") && place === "tens") {
			return Math.min(5, Math.max(0, value));
		}

		return Math.min(9, Math.max(0, value));
	}

	function nextInputId(part: TimePart, place: DigitPlace) {
		const current = `${part}-${place}`;
		const index = digitOrder.indexOf(current);
		return digitOrder[index + 1];
	}

	function previousInputId(part: TimePart, place: DigitPlace) {
		const current = `${part}-${place}`;
		const index = digitOrder.indexOf(current);
		return digitOrder[index - 1];
	}

	function boundaryInputId(direction: "first" | "last") {
		return direction === "first" ? digitOrder[0] : digitOrder.at(-1);
	}

	function focusInput(id: string | undefined) {
		if (!id) return;

		window.requestAnimationFrame(() => {
			const input = document.querySelector<HTMLButtonElement>(`[data-digit-id="${id}"]`);
			input?.focus();
		});
	}

	function setDigit(part: TimePart, place: DigitPlace, rawDigit: number) {
		if (timer.isRunning) return;

		const digit = clampDigit(part, place, rawDigit);
		const current = displayParts[part];
		const nextValue = Number(place === "tens" ? `${digit}${current[1]}` : `${current[0]}${digit}`);
		const nextParts = { ...parts, [part]: nextValue };

		timer.setDuration(partsToSeconds(nextParts.hours, nextParts.minutes, nextParts.seconds));
	}

	function handleDigitKeydown(part: TimePart, place: DigitPlace, event: KeyboardEvent) {
		if (/^\d$/.test(event.key)) {
			event.preventDefault();
			setDigit(part, place, Number(event.key));
			focusInput(nextInputId(part, place));
			return;
		}

		if (event.key === "ArrowLeft") {
			event.preventDefault();
			focusInput(previousInputId(part, place));
			return;
		}

		if (event.key === "ArrowRight") {
			event.preventDefault();
			focusInput(nextInputId(part, place));
			return;
		}

		if (event.key === "Home") {
			event.preventDefault();
			focusInput(boundaryInputId("first"));
			return;
		}

		if (event.key === "End") {
			event.preventDefault();
			focusInput(boundaryInputId("last"));
			return;
		}

		if (event.key === "Backspace" || event.key === "Delete") {
			event.preventDefault();
			setDigit(part, place, 0);

			if (event.key === "Backspace" && digitAt(part, place) === "0") {
				focusInput(previousInputId(part, place));
			}
			return;
		}

		if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;

		event.preventDefault();
		const current = Number(digitAt(part, place));
		const delta = event.key === "ArrowUp" ? 1 : -1;
		setDigit(part, place, current + delta);
	}
</script>

<section class="timer-input-grid" aria-label="timer duration">
	<label class="time-segment">
		<span class="time-box">
			<span class="digit-pair">
				<button
					type="button"
					class={cn("time-digit-input", toneClass)}
					disabled={timer.isRunning}
					data-digit-id="hours-tens"
					onkeydown={(event) => handleDigitKeydown("hours", "tens", event)}
					aria-label="hours tens"
				>
					{digitAt("hours", "tens")}
				</button>
				<button
					type="button"
					class={cn("time-digit-input", toneClass)}
					disabled={timer.isRunning}
					data-digit-id="hours-ones"
					onkeydown={(event) => handleDigitKeydown("hours", "ones", event)}
					aria-label="hours ones"
				>
					{digitAt("hours", "ones")}
				</button>
			</span>
			<span class="time-label" aria-hidden="true">시</span>
		</span>
	</label>
	<label class="time-segment">
		<span class="time-box">
			<span class="digit-pair">
				<button
					type="button"
					class={cn("time-digit-input", toneClass)}
					disabled={timer.isRunning}
					data-digit-id="minutes-tens"
					onkeydown={(event) => handleDigitKeydown("minutes", "tens", event)}
					aria-label="minutes tens"
				>
					{digitAt("minutes", "tens")}
				</button>
				<button
					type="button"
					class={cn("time-digit-input", toneClass)}
					disabled={timer.isRunning}
					data-digit-id="minutes-ones"
					onkeydown={(event) => handleDigitKeydown("minutes", "ones", event)}
					aria-label="minutes ones"
				>
					{digitAt("minutes", "ones")}
				</button>
			</span>
			<span class="time-label" aria-hidden="true">분</span>
		</span>
	</label>
	<label class="time-segment">
		<span class="time-box">
			<span class="digit-pair">
				<button
					type="button"
					class={cn("time-digit-input", toneClass)}
					disabled={timer.isRunning}
					data-digit-id="seconds-tens"
					onkeydown={(event) => handleDigitKeydown("seconds", "tens", event)}
					aria-label="seconds tens"
				>
					{digitAt("seconds", "tens")}
				</button>
				<button
					type="button"
					class={cn("time-digit-input", toneClass)}
					disabled={timer.isRunning}
					data-digit-id="seconds-ones"
					onkeydown={(event) => handleDigitKeydown("seconds", "ones", event)}
					aria-label="seconds ones"
				>
					{digitAt("seconds", "ones")}
				</button>
			</span>
			<span class="time-label" aria-hidden="true">초</span>
		</span>
	</label>
</section>
