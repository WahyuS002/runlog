<script lang="ts">
	import { computeDashboard, formatDate } from '$lib/data/dashboard';
	import KpiCard from '$lib/components/runlog/KpiCard.svelte';
	import RunCard from '$lib/components/runlog/RunCard.svelte';
	import WeeklyTrend from '$lib/components/runlog/WeeklyTrend.svelte';
	import InsightPanel from '$lib/components/runlog/InsightPanel.svelte';
	import Footprints from 'lucide-svelte/icons/footprints';
	import Route from 'lucide-svelte/icons/route';
	import CalendarRange from 'lucide-svelte/icons/calendar-range';
	import Gauge from 'lucide-svelte/icons/gauge';
	import HeartPulse from 'lucide-svelte/icons/heart-pulse';
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
		class="animate-fade-up mb-4 grid items-start gap-4 lg:grid-cols-[1.7fr_0.9fr]"
		style="animation-delay: 50ms"
	>
		<WeeklyTrend data={dashboard.weeklyData} />
		<InsightPanel data={dashboard} />
	</section>

	<!-- Stat strip -->
	<section
		class="animate-fade-up stat-strip mb-5"
		style="animation-delay: 120ms"
	>
		<KpiCard
			label="Distance"
			value={dashboard.totalDistanceKm.toFixed(1)}
			unit="km"
			sublabel={`${dashboard.totalRuns} sessions`}
			icon={Route}
		/>
		<KpiCard
			label="Runs"
			value={String(dashboard.totalRuns)}
			unit="sessions"
			sublabel={dashboard.totalDuration}
			icon={CalendarRange}
		/>
		<KpiCard
			label="Best Pace"
			value={dashboard.fastestRun?.pace ?? '—'}
			unit={dashboard.fastestRun ? '/km' : ''}
			sublabel={dashboard.fastestRun ? formatDate(dashboard.fastestRun.date) : 'No qualifying runs'}
			icon={Gauge}
		/>
		<KpiCard
			label="VO2max"
			value={String(dashboard.latestVo2max.value)}
			unit={dashboard.latestVo2max.unit}
			sublabel={dashboard.latestVo2max.status}
			icon={HeartPulse}
		/>
	</section>

	<!-- Recent Runs -->
	<section>
		<h2
			class="animate-fade-up section-heading mb-2.5"
			style="animation-delay: 180ms"
		>
			<List size={13} strokeWidth={1.75} class="text-graphite-secondary" aria-hidden="true" />
			Recent Runs
		</h2>
		<div class="space-y-1">
			{#each dashboard.runs as run, i}
				{@const id = runId(run)}
				<div class="animate-fade-up" style="animation-delay: {210 + i * 30}ms">
					<RunCard {run} expanded={expandedId === id} onToggle={() => toggleRun(id)} />
				</div>
			{/each}
		</div>
	</section>
</div>
