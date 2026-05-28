<script lang="ts">
	import BellIcon from "@lucide/svelte/icons/bell";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import PinIcon from "@lucide/svelte/icons/pin";
	import RepeatIcon from "@lucide/svelte/icons/repeat-2";
	import SunIcon from "@lucide/svelte/icons/sun";
	import { cn } from "$lib/utils";
	import { settings } from "$lib/state/settings.svelte";

	type NotificationSupport = NotificationPermission | "unsupported";

	let notificationPermission = $state<NotificationSupport>("default");
	const isNotificationUnavailable = $derived(notificationPermission === "unsupported" || notificationPermission === "denied");

	function toggleTheme() {
		settings.toggleTheme();
	}

	function syncNotificationPermission() {
		notificationPermission = typeof Notification === "undefined" ? "unsupported" : Notification.permission;

		if (notificationPermission !== "granted") {
			settings.notification = false;
		}
	}

	async function toggleNotification() {
		syncNotificationPermission();

		if (settings.notification) {
			settings.notification = false;
			return;
		}

		if (notificationPermission === "unsupported" || notificationPermission === "denied") {
			settings.notification = false;
			return;
		}

		if (notificationPermission === "default") {
			const permission = await Notification.requestPermission();
			notificationPermission = permission;
			settings.notification = permission === "granted";
			return;
		}

		settings.notification = true;
	}

	$effect(() => {
		syncNotificationPermission();
	});
</script>

<div
	class="settings-bar divide-x divide-border"
	role="toolbar"
	aria-label="타이머 설정"
	tabindex="-1"
>
	<button
		type="button"
		class={cn("settings-button settings-toggle", settings.repeat && "is-active")}
		title="반복"
		aria-label="반복"
		aria-pressed={settings.repeat}
		onclick={() => (settings.repeat = !settings.repeat)}
	>
		<RepeatIcon />
	</button>
	<button
		type="button"
		class={cn("settings-button settings-toggle", settings.notification && "is-active", isNotificationUnavailable && "is-disabled")}
		title={notificationPermission === "denied" ? "알림 권한 차단됨" : "알림"}
		aria-label={notificationPermission === "denied" ? "알림 권한 차단됨" : "알림"}
		aria-pressed={settings.notification}
		disabled={isNotificationUnavailable}
		onclick={toggleNotification}
	>
		<BellIcon />
	</button>
	<button
		type="button"
		class={cn("settings-button settings-toggle", settings.alwaysOnTop && "is-active")}
		title="항상 위"
		aria-label="항상 위"
		aria-pressed={settings.alwaysOnTop}
		onclick={() => (settings.alwaysOnTop = !settings.alwaysOnTop)}
	>
		<PinIcon />
	</button>
	<button
		class="settings-button settings-action"
		type="button"
		title="테마"
		aria-label="테마"
		onclick={toggleTheme}
	>
		{#if settings.theme === "dark"}
			<SunIcon />
		{:else}
			<MoonIcon />
		{/if}
	</button>
</div>
