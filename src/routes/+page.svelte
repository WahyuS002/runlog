<script lang="ts">
	import { computeDashboard } from '$lib/data/dashboard';
	import RunCard from '$lib/components/runlog/RunCard.svelte';
	import WeeklyTrend from '$lib/components/runlog/WeeklyTrend.svelte';
	import InsightPanel from '$lib/components/runlog/InsightPanel.svelte';

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

<div class="mx-auto max-w-[1080px] px-6 py-8">
	<!-- Header -->
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

	<!-- Top fold: Weekly + Stats -->
	<section
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

	<!-- Recent Runs -->
	<section>
		<h2
			class="animate-fade-up section-heading mb-3"
			style="animation-delay: 80ms"
		>
			Recent Runs
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
