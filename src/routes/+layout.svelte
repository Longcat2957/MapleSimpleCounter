<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { settings } from '$lib/state/settings.svelte';

	let { children } = $props();

	settings.load();

	$effect(() => {
		settings.persist();
		document.documentElement.classList.toggle('dark', settings.theme === 'dark');
		document.documentElement.style.colorScheme = settings.theme;
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
