<script lang="ts">
	import BellIcon from "@lucide/svelte/icons/bell";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import PinIcon from "@lucide/svelte/icons/pin";
	import RepeatIcon from "@lucide/svelte/icons/repeat-2";
	import SunIcon from "@lucide/svelte/icons/sun";
	import { cn } from "$lib/utils";
	import { settings } from "$lib/state/settings.svelte";

	function toggleTheme() {
		settings.toggleTheme();
	}
</script>

<section class="settings-bar divide-x divide-border">
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
		class={cn("settings-button settings-toggle", settings.notification && "is-active")}
		title="알림"
		aria-label="알림"
		aria-pressed={settings.notification}
		onclick={() => (settings.notification = !settings.notification)}
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
	<button class="settings-button settings-action" type="button" title="테마" aria-label="테마" onclick={toggleTheme}>
		{#if settings.theme === "dark"}
			<SunIcon />
		{:else}
			<MoonIcon />
		{/if}
	</button>
</section>
