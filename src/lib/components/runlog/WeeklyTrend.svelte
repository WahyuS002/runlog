<script lang="ts">
	import type { WeeklyData } from '$lib/data/dashboard';
	import TrendingUp from 'lucide-svelte/icons/trending-up';

	let { data }: { data: WeeklyData } = $props();

	const maxKm = $derived(
		Math.max(...data.days.map((d) => Math.max(d.currentKm, d.previousKm)), 0.1)
	);
</script>

<div class="mx-auto max-w-md">
	<div class="rounded-2xl border border-divider/60 bg-surface px-6 py-5 shadow-xs">
		<!-- Title -->
		<div class="flex items-center gap-1.5 text-graphite-secondary">
			<TrendingUp size={14} strokeWidth={1.75} aria-hidden="true" />
			<span class="text-xs font-medium">Running last week</span>
		</div>

		<!-- Main total + delta -->
		<div class="mt-2">
			<p class="flex items-baseline gap-1">
				<span class="text-4xl font-bold tracking-tight text-graphite">
					{data.totalKm.toFixed(1)}
				</span>
				<span class="text-sm font-semibold tracking-wide text-graphite-secondary uppercase">
					KM
				</span>
			</p>
			<p class="mt-0.5 text-xs text-graphite-secondary">
				{#if data.deltaPct !== null}
					<span
						class="font-semibold {data.deltaPct >= 0 ? 'text-green-600' : 'text-red-500'}"
					>
						{data.deltaPct >= 0 ? '+' : ''}{data.deltaPct}%
					</span>
					<span>vs previous week</span>
				{:else}
					No previous-week baseline
				{/if}
			</p>
		</div>

		<!-- Paired bar chart -->
		<div class="relative mt-5">
			<!-- Guide lines -->
			<div class="pointer-events-none absolute inset-0 flex flex-col justify-between" style="height: 72px">
				{#each { length: 4 } as _, j}
					<div class="h-px w-full bg-divider/40"></div>
				{/each}
			</div>

			<!-- Bars -->
			<div class="relative flex items-end gap-3" style="height: 72px">
				{#each data.days as day, i}
					{@const curPct = maxKm > 0 ? (day.currentKm / maxKm) * 100 : 0}
					{@const prevPct = maxKm > 0 ? (day.previousKm / maxKm) * 100 : 0}
					<div class="flex flex-1 items-end justify-center gap-[3px]" style="height: 100%">
						{#if data.hasPrevWeek}
							<div
								class="w-[5px] rounded-t bg-graphite/8 transition-all"
								style="height: {prevPct}%; min-height: {day.previousKm > 0 ? '2px' : '0px'}"
							></div>
						{/if}
						<div
							class="animate-fade-up w-[7px] rounded-t bg-blue-500 transition-all"
							style="height: {curPct}%; animation-delay: {i * 50}ms; min-height: {day.currentKm > 0 ? '2px' : '0px'}"
						></div>
					</div>
				{/each}
			</div>

			<!-- Value labels (above bars) -->
			<div class="absolute -top-4 flex w-full gap-3">
				{#each data.days as day}
					<div class="flex flex-1 justify-center">
						{#if day.currentKm > 0}
							<span class="text-[9px] font-medium text-graphite/70">{day.currentKm}</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Day labels -->
		<div class="mt-1.5 flex gap-3">
			{#each data.days as day}
				<div class="flex-1 text-center">
					<span class="text-[10px] text-graphite-secondary/60">{day.label}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
