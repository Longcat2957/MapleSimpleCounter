<script lang="ts">
	import TimeInput from "$lib/components/timer/TimeInput.svelte";
	import TimerControls from "$lib/components/timer/TimerControls.svelte";
	import QuickAddBar from "$lib/components/timer/QuickAddBar.svelte";
	import SettingsBar from "$lib/components/timer/SettingsBar.svelte";
	import { settings } from "$lib/state/settings.svelte";
	import { timer } from "$lib/state/timer.svelte";
	import { applyAlwaysOnTop, configureWindowResize, startCornerResize } from "$lib/tauri/window";

	let finishNotice = $state("");
	let unlistenResize = $state<(() => void) | undefined>();

	function notifyFinished({ willRepeat }: { willRepeat: boolean }) {
		if (!willRepeat) {
			finishNotice = "타이머 종료";
			window.setTimeout(() => {
				finishNotice = "";
			}, 2200);
		}

		if (!settings.notification || typeof Notification === "undefined") return;

		if (Notification.permission !== "granted") {
			settings.notification = false;
			return;
		}

		if (Notification.permission === "granted") {
			new Notification("MapleSimpleTimer", {
				body: willRepeat ? "타이머가 종료되어 다시 시작되었습니다." : "타이머가 종료되었습니다.",
				tag: `maple-simple-timer-${Date.now()}`
			});
		}
	}

	timer.configure({
		onFinish: notifyFinished,
		shouldRepeat: () => settings.repeat
	});

	$effect(() => {
		applyAlwaysOnTop(settings.alwaysOnTop);
	});

	$effect(() => {
		configureWindowResize().then((unlisten) => {
			unlistenResize = unlisten;
		});

		return () => {
			unlistenResize?.();
		};
	});
</script>

<svelte:head>
	<title>MapleSimpleTimer</title>
</svelte:head>

<main class="app-shell bg-background text-foreground">
	<div class="app-grid">
		<section class="timer-row">
			{#if finishNotice}
				<div class="finish-notice">
					{finishNotice}
				</div>
			{/if}

			<div>
				<TimeInput />
			</div>
			<TimerControls />
		</section>

		<section class="bottom-row">
			<div class="min-w-0">
				<QuickAddBar />
			</div>
			<div class="border-l border-border">
				<SettingsBar />
			</div>
		</section>
	</div>
	<button
		type="button"
		class="corner-resize-handle"
		aria-label="창 크기 조절"
		title="창 크기 조절"
		onpointerdown={startCornerResize}
	></button>
</main>
