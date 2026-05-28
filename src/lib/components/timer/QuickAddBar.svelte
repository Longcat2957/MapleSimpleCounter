<script lang="ts">
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

	function subtractSeconds(seconds: number, event: MouseEvent) {
		event.preventDefault();
		timer.addSeconds(-seconds);
	}
</script>

<section class="quick-add-bar divide-x divide-border">
	{#each quickAdds as item}
		<Button
			class="quick-add-button justify-center hover:bg-muted hover:text-foreground"
			variant="ghost"
			title={`좌클릭 +${item.label}, 우클릭 -${item.label}`}
			onclick={() => timer.addSeconds(item.seconds)}
			oncontextmenu={(event) => subtractSeconds(item.seconds, event)}
			aria-label={`${item.label} 추가, 우클릭으로 감소`}
		>
			<span class="quick-adjust-symbol" aria-hidden="true">±</span>
			{item.label}
		</Button>
	{/each}
</section>
