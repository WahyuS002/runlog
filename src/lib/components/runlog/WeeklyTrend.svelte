<script lang="ts">
	import type { WeeklyData } from '$lib/data/dashboard';

	let { data }: { data: WeeklyData } = $props();

	const maxKm = $derived(
		Math.max(...data.days.map((d) => Math.max(d.currentKm, d.previousKm)), 0.1)
	);
</script>

<div class="flex h-full flex-col rounded-xl border border-rl-border bg-rl-surface p-5">
	<!-- Title -->
	<p class="text-[13px] leading-[18px] text-rl-text-secondary">Running last week</p>

	<!-- Main total + delta -->
	<div class="mt-2">
		<p class="flex items-baseline gap-1.5">
			<span class="text-[32px] leading-[40px] font-semibold tracking-tight text-rl-text">
				{data.totalKm.toFixed(1)}
			</span>
			<span class="text-[13px] font-medium text-rl-text-tertiary">km</span>
		</p>
		<p class="mt-0.5 text-[13px] leading-[18px] text-rl-text-secondary">
			{#if data.deltaPct !== null}
				<span
					class="font-medium {data.deltaPct >= 0 ? 'text-rl-success' : 'text-rl-danger'}"
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
	<div class="relative mt-5 flex-1" style="min-height: 72px">
		<!-- Guide lines -->
		<div class="pointer-events-none absolute inset-0 flex flex-col justify-between">
			{#each { length: 4 } as _}
				<div class="h-px w-full bg-rl-border-subtle"></div>
			{/each}
		</div>

		<!-- Bars -->
		<div class="relative flex h-full items-end gap-3">
			{#each data.days as day, i}
				{@const curPct = maxKm > 0 ? (day.currentKm / maxKm) * 100 : 0}
				{@const prevPct = maxKm > 0 ? (day.previousKm / maxKm) * 100 : 0}
				<div class="flex flex-1 items-end justify-center gap-[3px]" style="height: 100%">
					{#if data.hasPrevWeek}
						<div
							class="w-[5px] rounded-t bg-rl-border transition-all"
							style="height: {prevPct}%; min-height: {day.previousKm > 0 ? '2px' : '0px'}"
						></div>
					{/if}
					<div
						class="animate-fade-up w-[7px] rounded-t bg-rl-accent transition-all"
						style="height: {curPct}%; animation-delay: {i * 40}ms; min-height: {day.currentKm > 0 ? '2px' : '0px'}"
					></div>
				</div>
			{/each}
		</div>

		<!-- Value labels -->
		<div class="absolute -top-4 flex w-full gap-3">
			{#each data.days as day}
				<div class="flex flex-1 justify-center">
					{#if day.currentKm > 0}
						<span class="font-mono text-[11px] font-medium text-rl-text-secondary"
							>{day.currentKm}</span
						>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Day labels -->
	<div class="mt-2 flex gap-3">
		{#each data.days as day}
			<div class="flex-1 text-center">
				<span class="font-mono text-[11px] text-rl-text-tertiary">{day.label}</span>
			</div>
		{/each}
	</div>
</div>
