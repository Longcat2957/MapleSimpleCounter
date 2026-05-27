<script lang="ts">
	import PlusIcon from "@lucide/svelte/icons/plus";
	import { Button } from "$lib/components/ui/button";
	import { timer } from "$lib/state/timer.svelte";

	const quickAdds = [
		{ label: "10초", seconds: 10 },
		{ label: "30초", seconds: 30 },
		{ label: "1분", seconds: 60 },
		{ label: "2분", seconds: 120 },
		{ label: "5분", seconds: 300 },
		{ label: "10분", seconds: 600 }
	];
</script>

<section class="quick-add-bar divide-x divide-border">
	{#each quickAdds as item}
		<Button
			class="quick-add-button justify-center hover:bg-muted hover:text-foreground"
			variant="ghost"
			onclick={() => timer.addSeconds(item.seconds)}
			aria-label={`${item.label} 추가`}
		>
			<PlusIcon class="size-3.5" />
			{item.label}
		</Button>
	{/each}
</section>
