<script lang="ts">
	import PauseIcon from "@lucide/svelte/icons/pause";
	import PlayIcon from "@lucide/svelte/icons/play";
	import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
	import { Button } from "$lib/components/ui/button";
	import { timer } from "$lib/state/timer.svelte";
</script>

<section class="control-grid">
	<Button
		class="control-button"
		size="icon"
		title={timer.isRunning ? "Pause" : "Start"}
		aria-label={timer.isRunning ? "Pause" : "Start"}
		disabled={!timer.canStart && !timer.isRunning}
		onclick={() => timer.toggle()}
	>
		{#if timer.isRunning}
			<PauseIcon />
		{:else}
			<PlayIcon />
		{/if}
	</Button>
	<Button class="control-button" size="icon" variant="secondary" title="Reset" aria-label="Reset" onclick={() => timer.reset()}>
		<RotateCcwIcon />
	</Button>
</section>
