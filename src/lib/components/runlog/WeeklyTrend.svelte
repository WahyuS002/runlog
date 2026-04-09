<script lang="ts">
	import type { WeeklyData } from '$lib/data/dashboard';
	import TrendingUp from 'lucide-svelte/icons/trending-up';

	let { data }: { data: WeeklyData } = $props();

	const maxKm = $derived(Math.max(...data.days.map((d) => d.distanceKm), 0.1));
</script>

<div class="rounded-2xl border border-divider bg-surface p-5 shadow-sm">
	<div class="flex items-start justify-between gap-4">
		<div>
			<h2 class="section-heading">
				<TrendingUp
					size={16}
					strokeWidth={1.75}
					class="text-graphite-secondary"
					aria-hidden="true"
				/>
				Running last week
			</h2>
			<p class="mt-1.5 flex items-baseline gap-1.5">
				<span class="text-3xl font-semibold tracking-tight text-graphite">
					{data.totalKm.toFixed(1)}
				</span>
				<span class="text-sm font-medium text-graphite-secondary">km</span>
			</p>
		</div>

		<!-- Delta -->
		<div class="pt-5 text-right">
			{#if data.deltaPct !== null}
				<span
					class="text-sm font-semibold {data.deltaPct >= 0
						? 'text-lime-accent'
						: 'text-red-500'}"
				>
					{data.deltaPct >= 0 ? '+' : ''}{data.deltaPct}%
				</span>
				<p class="text-[10px] text-graphite-secondary">vs previous week</p>
			{:else}
				<p class="text-xs text-graphite-secondary">No previous-week baseline</p>
			{/if}
		</div>
	</div>

	<!-- Daily bars -->
	<div class="mt-4 flex gap-2">
		{#each data.days as day, i}
			{@const heightPct = maxKm > 0 ? (day.distanceKm / maxKm) * 100 : 0}
			<div class="flex flex-1 flex-col items-center gap-1.5">
				{#if day.distanceKm > 0}
					<span class="text-[10px] font-medium text-graphite">{day.distanceKm}</span>
				{:else}
					<span class="text-[10px] text-graphite-secondary/40">—</span>
				{/if}

				<div class="relative w-full rounded-md bg-surface-dim" style="height: 80px">
					<div
						class="animate-fade-up absolute inset-x-1 bottom-0 rounded-t-md bg-cyan-accent/80"
						style="height: {heightPct}%; animation-delay: {i * 60}ms; min-height: {day.distanceKm > 0 ? '3px' : '0px'}"
					></div>
				</div>

				<span class="text-[10px] text-graphite-secondary">{day.label}</span>
			</div>
		{/each}
	</div>
</div>
