<script lang="ts">
	import { computeDashboard, formatDate } from '$lib/data/dashboard';
	import KpiCard from '$lib/components/runlog/KpiCard.svelte';
	import RunCard from '$lib/components/runlog/RunCard.svelte';
	import MonthlyTrend from '$lib/components/runlog/MonthlyTrend.svelte';
	import InsightPanel from '$lib/components/runlog/InsightPanel.svelte';
	import Footprints from 'lucide-svelte/icons/footprints';
	import Route from 'lucide-svelte/icons/route';
	import CalendarRange from 'lucide-svelte/icons/calendar-range';
	import Gauge from 'lucide-svelte/icons/gauge';
	import HeartPulse from 'lucide-svelte/icons/heart-pulse';
	import TrendingUp from 'lucide-svelte/icons/trending-up';
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

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Header -->
	<header class="animate-fade-up mb-8">
		<div class="flex items-center gap-3">
			<span aria-hidden="true">
				<Footprints size={24} strokeWidth={1.75} class="text-cyan-accent" />
			</span>
			<h1 class="text-2xl font-bold tracking-tight text-graphite">Runlog</h1>
			{#if dashboard.isExampleData}
				<span
					class="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-700"
				>
					Example data
				</span>
			{/if}
		</div>
		<p class="mt-1 text-sm text-graphite-secondary">Personal running performance dashboard</p>
	</header>

	<!-- KPI Cards -->
	<section class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class="animate-fade-up" style="animation-delay: 50ms">
			<KpiCard
				label="Total Distance"
				value={dashboard.totalDistanceKm.toFixed(1)}
				unit="km"
				sublabel={`${dashboard.totalRuns} sessions`}
				icon={Route}
			/>
		</div>
		<div class="animate-fade-up" style="animation-delay: 120ms">
			<KpiCard
				label="Total Runs"
				value={String(dashboard.totalRuns)}
				unit="sessions"
				sublabel={dashboard.totalDuration}
				icon={CalendarRange}
			/>
		</div>
		<div class="animate-fade-up" style="animation-delay: 190ms">
			<KpiCard
				label="Best Pace"
				value={dashboard.fastestRun?.pace ?? '—'}
				unit={dashboard.fastestRun ? '/km' : ''}
				sublabel={dashboard.fastestRun ? formatDate(dashboard.fastestRun.date) : 'No qualifying runs'}
				icon={Gauge}
			/>
		</div>
		<div class="animate-fade-up" style="animation-delay: 260ms">
			<KpiCard
				label="Latest VO2max"
				value={String(dashboard.latestVo2max.value)}
				unit={dashboard.latestVo2max.unit}
				sublabel={dashboard.latestVo2max.status}
				icon={HeartPulse}
			/>
		</div>
	</section>

	<!-- Monthly Trend -->
	<section class="animate-fade-up mb-8" style="animation-delay: 330ms">
		<MonthlyTrend aggregates={dashboard.monthlyAggregates} />
	</section>

	<!-- Main content: Run list + Insights sidebar -->
	<div class="grid gap-8 lg:grid-cols-[1fr_300px]">
		<!-- Run list -->
		<section>
			<h2
				class="animate-fade-up section-heading mb-4"
				style="animation-delay: 400ms"
			>
				<List size={16} strokeWidth={1.75} class="text-graphite-secondary" aria-hidden="true" />
				Recent Runs
			</h2>
			<div class="space-y-3">
				{#each dashboard.runs as run, i}
					{@const id = runId(run)}
					<div class="animate-fade-up" style="animation-delay: {450 + i * 50}ms">
						<RunCard {run} expanded={expandedId === id} onToggle={() => toggleRun(id)} />
					</div>
				{/each}
			</div>
		</section>

		<!-- Insights sidebar -->
		<aside class="animate-fade-up" style="animation-delay: 400ms">
			<InsightPanel data={dashboard} />
		</aside>
	</div>
</div>
