<script lang="ts">
	import { cn } from "$lib/utils";
	import { timer } from "$lib/state/timer.svelte";

	const toneClass = $derived(
		timer.warningLevel === "danger" || timer.warningLevel === "finished"
			? "text-red-500"
			: timer.warningLevel === "warning"
				? "text-orange-500"
				: "text-foreground"
	);
</script>

<section class="grid place-items-center py-3">
	<div
		class={cn(
			"timer-display tabular-nums text-[3.8rem] font-bold leading-none tracking-normal transition-colors",
			"lg:text-[4.35rem]",
			timer.status === "finished" && "animate-pulse",
			toneClass
		)}
		aria-live="polite"
	>
		{timer.formattedTime}
	</div>
	<p class="mt-2 h-5 text-xs font-medium text-muted-foreground">
		{#if timer.status === "running"}
			Counting
		{:else if timer.status === "paused"}
			Paused
		{:else if timer.status === "finished"}
			Finished
		{:else}
			Ready
		{/if}
	</p>
</section>
