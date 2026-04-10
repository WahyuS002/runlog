<script lang="ts">
	import { computeDashboard } from '$lib/data/dashboard';
	import RunCard from '$lib/components/runlog/RunCard.svelte';
	import WeeklyTrend from '$lib/components/runlog/WeeklyTrend.svelte';
	import InsightPanel from '$lib/components/runlog/InsightPanel.svelte';
	import {
		homeCanonicalUrl,
		homeSeo,
		homeSocialImageUrl,
		homeStructuredData,
		siteSeo
	} from '$lib/seo';

	const dashboard = computeDashboard();
	const structuredDataMarkup = homeStructuredData
		.map((entry) => {
			const json = JSON.stringify(entry).replace(/</g, '\\u003c');
			return `<script type="application/ld+json">${json}<${'/script>'}`;
		})
		.join('');
	let expandedId = $state<string | null>(null);

	function runId(run: (typeof dashboard.runs)[0]) {
		return `${run.date}T${run.time}`;
	}

	function toggleRun(id: string) {
		expandedId = expandedId === id ? null : id;
	}
</script>

<svelte:head>
	<title>{homeSeo.title}</title>
	<meta name="description" content={homeSeo.description} />
	<meta
		name="robots"
		content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
	/>
	<link rel="canonical" href={homeCanonicalUrl} />

	<meta property="og:locale" content={siteSeo.locale} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={siteSeo.siteName} />
	<meta property="og:title" content={homeSeo.title} />
	<meta property="og:description" content={homeSeo.description} />
	<meta property="og:url" content={homeCanonicalUrl} />
	<meta property="og:image" content={homeSocialImageUrl} />
	<meta property="og:image:alt" content={siteSeo.socialImageAlt} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={homeSeo.title} />
	<meta name="twitter:description" content={homeSeo.description} />
	<meta name="twitter:image" content={homeSocialImageUrl} />
	<meta name="twitter:image:alt" content={siteSeo.socialImageAlt} />

	{@html structuredDataMarkup}
</svelte:head>

<div class="mx-auto max-w-[1080px] px-6 py-8">
	<header class="animate-fade-up mb-6">
		<h1 class="text-[32px] leading-[40px] font-semibold tracking-tight text-rl-text">Runlog</h1>
		<p class="mt-1 text-[14px] leading-[20px] text-rl-text-secondary">
			Training overview and session history
			{#if dashboard.isExampleData}
				<span
					class="ml-2 inline-block rounded-full border border-rl-border bg-rl-subtle px-2 py-0.5 align-middle text-[12px] text-rl-text-tertiary"
				>
					Example data
				</span>
			{/if}
		</p>
	</header>

	<section
		aria-labelledby="weekly-training-heading"
		class="animate-fade-up mb-6 grid items-stretch gap-6 lg:grid-cols-[1.5fr_1fr]"
		style="animation-delay: 40ms"
	>
		<WeeklyTrend
			distance={dashboard.weeklyData}
			cadenceStride={dashboard.cadenceStrideTrend}
			recovery={dashboard.recoveryTrend}
		/>
		<InsightPanel data={dashboard} />
	</section>

	<section aria-labelledby="recent-runs-heading">
		<h2
			id="recent-runs-heading"
			class="animate-fade-up section-heading mb-3"
			style="animation-delay: 80ms"
		>
			Recent Running Sessions
		</h2>
		<div class="space-y-2">
			{#each dashboard.runs as run, i}
				{@const id = runId(run)}
				<div class="animate-fade-up" style="animation-delay: {100 + i * 25}ms">
					<RunCard {run} expanded={expandedId === id} onToggle={() => toggleRun(id)} />
				</div>
			{/each}
		</div>
	</section>
</div>
