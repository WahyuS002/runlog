<script lang="ts">
	import type { MonthAggregate } from '$lib/data/dashboard';
	import TrendingUp from 'lucide-svelte/icons/trending-up';

	let { aggregates }: { aggregates: MonthAggregate[] } = $props();

	const maxDistance = $derived(Math.max(...aggregates.map((a) => a.distanceKm)));
</script>

<div class="rounded-2xl border border-divider bg-surface p-5 shadow-sm">
	<h2 class="section-heading">
		<TrendingUp size={16} strokeWidth={1.75} class="text-graphite-secondary" aria-hidden="true" />
		Monthly Distance
	</h2>

	<div class="mt-4 flex items-end gap-2" style="height: 140px">
		{#each aggregates as agg, i}
			{@const heightPct = maxDistance > 0 ? (agg.distanceKm / maxDistance) * 100 : 0}
			<div
				class="flex flex-1 flex-col items-center gap-1"
				style="animation-delay: {i * 80}ms"
			>
				<span class="text-xs font-medium text-graphite">{agg.distanceKm}</span>
				<div class="relative w-full flex-1">
					<div
						class="animate-fade-up absolute inset-x-1 bottom-0 rounded-t-md bg-cyan-accent/80 transition-all"
						style="height: {heightPct}%"
					></div>
				</div>
				<div class="text-center">
					<span class="block text-[10px] leading-tight text-graphite-secondary">
						{agg.label.split(' ')[0]}
					</span>
					<span class="block text-[10px] leading-tight text-graphite-secondary/60">
						{agg.runs} run{agg.runs === 1 ? '' : 's'}
					</span>
				</div>
			</div>
		{/each}
	</div>
</div>
