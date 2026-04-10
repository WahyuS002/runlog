<script lang="ts">
	import { computeDashboard } from '$lib/data/dashboard';
	import RunCard from '$lib/components/runlog/RunCard.svelte';
	import WeeklyTrend from '$lib/components/runlog/WeeklyTrend.svelte';
	import InsightPanel from '$lib/components/runlog/InsightPanel.svelte';
	import Footprints from 'lucide-svelte/icons/footprints';
	import List from 'lucide-svelte/icons/list';

	const dashboard = computeDashboard();
	let expandedId = $state<string | null>(null);

	function runId(run: (typeof dashboard.runs)[0]) {
		return `${run.date}T${run.time}`;
	}

	function toggleRun(id: string) {
		expandedId = expandedId === id ? null : id;
	}
</script>

<svelte:head>
	<title>Runlog</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-5 sm:px-6">
	<!-- Header -->
	<header class="animate-fade-up mb-4">
		<div class="flex items-center gap-2">
			<Footprints size={18} strokeWidth={1.75} class="text-cyan-accent" aria-hidden="true" />
			<h1 class="text-lg font-bold tracking-tight text-graphite">Runlog</h1>
			{#if dashboard.isExampleData}
				<span class="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
					Example data
				</span>
			{/if}
		</div>
	</header>

	<!-- Top fold: Hero + Right rail -->
	<section
		class="animate-fade-up mb-4 grid items-stretch gap-4 lg:grid-cols-[1.6fr_1fr]"
		style="animation-delay: 50ms"
	>
		<WeeklyTrend data={dashboard.weeklyData} />
		<InsightPanel data={dashboard} />
	</section>

	<!-- Recent Runs -->
	<section>
		<h2
			class="animate-fade-up section-heading mb-2.5"
			style="animation-delay: 120ms"
		>
			<List size={13} strokeWidth={1.75} class="text-graphite-secondary" aria-hidden="true" />
			Recent Runs
		</h2>
		<div class="space-y-1">
			{#each dashboard.runs as run, i}
				{@const id = runId(run)}
				<div class="animate-fade-up" style="animation-delay: {150 + i * 30}ms">
					<RunCard {run} expanded={expandedId === id} onToggle={() => toggleRun(id)} />
				</div>
			{/each}
		</div>
	</section>
</div>
