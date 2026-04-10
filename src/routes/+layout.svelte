<script lang="ts">
	import './layout.css';
	import { siteSeo } from '$lib/seo';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={siteSeo.faviconPath} sizes="any" type="image/svg+xml" />
	<meta name="author" content={siteSeo.authorName} />
	<meta name="theme-color" content={siteSeo.themeColor} />
</svelte:head>

{@render children()}
