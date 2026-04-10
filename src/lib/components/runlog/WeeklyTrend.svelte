<script lang="ts">
	import type { WeeklyData, CadenceStrideTrend, RecoveryTrend } from '$lib/data/dashboard';

	let {
		distance,
		cadenceStride,
		recovery
	}: {
		distance: WeeklyData;
		cadenceStride: CadenceStrideTrend;
		recovery: RecoveryTrend;
	} = $props();

	type Tab = 'distance' | 'cadence' | 'recovery';
	const tabs: { key: Tab; label: string }[] = [
		{ key: 'distance', label: 'Distance' },
		{ key: 'cadence', label: 'Cadence & Stride' },
		{ key: 'recovery', label: 'Recovery' }
	];

	let active = $state<Tab>('distance');

	// Distance
	const maxKm = $derived(
		Math.max(...distance.days.map((d) => Math.max(d.currentKm, d.previousKm)), 0.1)
	);

	// Cadence/Stride — normalize independently
	const maxCadence = $derived(
		Math.max(...cadenceStride.days.map((d: { avgCadence: number }) => d.avgCadence), 1)
	);
	// Recovery
	const maxRecovery = $derived(
		Math.max(...recovery.days.map((d: { recoveryHours: number }) => d.recoveryHours), 1)
	);
</script>

<div class="flex h-full flex-col rounded-xl border border-rl-border bg-rl-surface p-5">
	<!-- Inline tabs -->
	<div
		role="tablist"
		class="-mt-1 mb-4 flex gap-4 overflow-x-auto overflow-y-hidden border-b border-rl-border pb-2"
	>
		{#each tabs as tab}
			<button
				role="tab"
				aria-selected={active === tab.key}
				aria-controls="panel-{tab.key}"
				class="relative shrink-0 cursor-pointer pb-1 text-[13px] leading-4.5 font-medium whitespace-nowrap transition-colors
					{active === tab.key ? 'text-rl-text' : 'text-rl-text-tertiary hover:text-rl-text-secondary'}"
				onclick={() => (active = tab.key)}
			>
				{tab.label}
				{#if active === tab.key}
					<span class="absolute right-0 bottom-[-9px] left-0 h-px bg-rl-text"></span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Fixed shell: eyebrow → KPI → chart → day labels -->

	{#if active === 'distance'}
		<div id="panel-distance" role="tabpanel" class="flex flex-1 flex-col">
			<!-- Eyebrow -->
			<p class="text-[12px] leading-4 text-rl-text-tertiary">Running last week</p>

			<!-- KPI row — fixed height -->
			<div class="mt-3 h-[52px]">
				<p class="flex items-baseline gap-1.5">
					<span class="font-mono text-[28px] leading-9 font-semibold tracking-tight text-rl-text">
						{distance.totalKm.toFixed(1)}
					</span>
					<span class="text-[13px] font-medium text-rl-text-tertiary">km</span>
				</p>
				<p class="mt-0.5 text-[12px] leading-4 text-rl-text-secondary">
					{#if distance.deltaPct !== null}
						<span
							class="font-medium {distance.deltaPct >= 0 ? 'text-rl-success' : 'text-rl-danger'}"
						>
							{distance.deltaPct >= 0 ? '+' : ''}{distance.deltaPct}%
						</span>
						vs previous week
					{:else}
						No previous-week baseline
					{/if}
				</p>
			</div>

			<!-- Chart area — fixed height -->
			<div class="relative mt-8 h-[100px]">
				<div class="pointer-events-none absolute inset-0 flex flex-col justify-between">
					{#each { length: 4 } as _}
						<div class="h-px w-full bg-rl-border-subtle"></div>
					{/each}
				</div>
				<div class="relative flex h-full items-end gap-3">
					{#each distance.days as day}
						{@const curPct = maxKm > 0 ? (day.currentKm / maxKm) * 100 : 0}
						{@const prevPct = maxKm > 0 ? (day.previousKm / maxKm) * 100 : 0}
						<div class="flex flex-1 items-end justify-center gap-0.75" style="height: 100%">
							{#if distance.hasPrevWeek}
								<div
									class="w-1.25 rounded-t bg-rl-border transition-all"
									style="height: {prevPct}%; min-height: {day.previousKm > 0 ? '2px' : '0px'}"
								></div>
							{/if}
							<div
								class="w-1.75 rounded-t bg-rl-accent transition-all"
								style="height: {curPct}%; min-height: {day.currentKm > 0 ? '2px' : '0px'}"
							></div>
						</div>
					{/each}
				</div>
				<div class="absolute -top-3.5 flex w-full gap-3">
					{#each distance.days as day}
						<div class="flex flex-1 justify-center">
							{#if day.currentKm > 0}
								<span class="font-mono text-[10px] font-medium text-rl-text-secondary"
									>{day.currentKm}</span
								>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Day labels -->
			<div class="mt-2 flex gap-3">
				{#each distance.days as day}
					<div class="flex-1 text-center">
						<span class="font-mono text-[11px] text-rl-text-tertiary">{day.label}</span>
					</div>
				{/each}
			</div>
		</div>
	{:else if active === 'cadence'}
		<div id="panel-cadence" role="tabpanel" class="flex flex-1 flex-col">
			<!-- Eyebrow -->
			<p class="text-[12px] leading-4 text-rl-text-tertiary">7-day avg · runs &ge; 1 km</p>

			<!-- KPI row — fixed height, two inline stats -->
			<div class="mt-3 h-[52px]">
				<div class="flex items-baseline gap-5">
					<p class="flex items-baseline gap-1">
						<span class="font-mono text-[28px] leading-9 font-semibold tracking-tight text-rl-text"
							>{cadenceStride.avgCadence}</span
						>
						<span class="text-[12px] text-rl-text-tertiary">spm</span>
					</p>
					<p class="flex items-baseline gap-1">
						<span class="font-mono text-[28px] leading-9 font-semibold tracking-tight text-rl-text"
							>{cadenceStride.avgStride}</span
						>
						<span class="text-[12px] text-rl-text-tertiary">cm stride</span>
					</p>
				</div>
			</div>

			<!-- Chart area — cadence bars only -->
			<div class="relative mt-8 h-[100px]">
				<div class="pointer-events-none absolute inset-0 flex flex-col justify-between">
					{#each { length: 4 } as _}
						<div class="h-px w-full bg-rl-border-subtle"></div>
					{/each}
				</div>
				<div class="relative flex h-full items-end gap-3">
					{#each cadenceStride.days as day}
						{@const cadPct = day.hasData ? (day.avgCadence / maxCadence) * 100 : 0}
						<div class="flex flex-1 items-end justify-center" style="height: 100%">
							<div
								class="w-1.75 rounded-t transition-all {day.hasData
									? 'bg-rl-accent'
									: 'bg-transparent'}"
								style="height: {cadPct}%; min-height: {day.hasData ? '2px' : '0px'}"
							></div>
						</div>
					{/each}
				</div>
				<div class="absolute -top-3.5 flex w-full gap-3">
					{#each cadenceStride.days as day}
						<div class="flex flex-1 justify-center">
							{#if day.hasData}
								<span class="font-mono text-[10px] font-medium text-rl-text-secondary"
									>{day.avgCadence}</span
								>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Day labels -->
			<div class="mt-2 flex gap-3">
				{#each cadenceStride.days as day}
					<div class="flex-1 text-center">
						<span class="font-mono text-[11px] text-rl-text-tertiary">{day.label}</span>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div id="panel-recovery" role="tabpanel" class="flex flex-1 flex-col">
			<!-- Eyebrow -->
			<p class="text-[12px] leading-4 text-rl-text-tertiary">7-day avg recovery</p>

			<!-- KPI row — fixed height -->
			<div class="mt-3 h-[52px]">
				<p class="flex items-baseline gap-1.5">
					<span class="font-mono text-[28px] leading-9 font-semibold tracking-tight text-rl-text"
						>{recovery.avgRecovery}</span
					>
					<span class="text-[13px] font-medium text-rl-text-tertiary">hours</span>
				</p>
				{#if recovery.latestRecovery}
					<p class="mt-0.5 text-[12px] leading-4 text-rl-text-secondary">
						Latest: <span class="font-mono font-medium text-rl-text"
							>{recovery.latestRecovery.hours}h</span
						>
					</p>
				{/if}
			</div>

			<!-- Chart area — fixed height -->
			<div class="relative mt-8 h-[100px]">
				<div class="pointer-events-none absolute inset-0 flex flex-col justify-between">
					{#each { length: 4 } as _}
						<div class="h-px w-full bg-rl-border-subtle"></div>
					{/each}
				</div>
				<div class="relative flex h-full items-end gap-3">
					{#each recovery.days as day}
						{@const pct = day.hasData ? (day.recoveryHours / maxRecovery) * 100 : 0}
						<div class="flex flex-1 items-end justify-center" style="height: 100%">
							<div
								class="w-1.75 rounded-t transition-all {day.hasData
									? 'bg-rl-accent'
									: 'bg-transparent'}"
								style="height: {pct}%; min-height: {day.hasData ? '2px' : '0px'}"
							></div>
						</div>
					{/each}
				</div>
				<div class="absolute -top-3.5 flex w-full gap-3">
					{#each recovery.days as day}
						<div class="flex flex-1 justify-center">
							{#if day.hasData}
								<span class="font-mono text-[11px] font-medium text-rl-text-secondary"
									>{day.recoveryHours}h</span
								>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Day labels -->
			<div class="mt-2 flex gap-3">
				{#each recovery.days as day}
					<div class="flex-1 text-center">
						<span class="font-mono text-[11px] text-rl-text-tertiary">{day.label}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
