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

	// Distance chart
	const maxKm = $derived(
		Math.max(...distance.days.map((d) => Math.max(d.currentKm, d.previousKm)), 0.1)
	);

	// Cadence/Stride charts
	const maxCadence = $derived(
		Math.max(...cadenceStride.days.map((d: { avgCadence: number }) => d.avgCadence), 1)
	);
	const maxStride = $derived(
		Math.max(...cadenceStride.days.map((d: { avgStride: number }) => d.avgStride), 1)
	);

	// Recovery chart
	const maxRecovery = $derived(
		Math.max(...recovery.days.map((d: { recoveryHours: number }) => d.recoveryHours), 1)
	);
</script>

<div class="flex h-full flex-col rounded-xl border border-rl-border bg-rl-surface p-5">
	<!-- Tab switcher -->
	<div role="tablist" class="mb-4 flex gap-1 rounded-lg bg-rl-subtle p-0.5">
		{#each tabs as tab}
			<button
				role="tab"
				aria-selected={active === tab.key}
				aria-controls="panel-{tab.key}"
				class="flex-1 cursor-pointer rounded-md px-2 py-1.5 text-[12px] leading-4 font-medium transition-colors
					{active === tab.key
					? 'bg-rl-surface text-rl-text shadow-sm'
					: 'text-rl-text-secondary hover:text-rl-text'}"
				onclick={() => (active = tab.key)}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- Distance view -->
	{#if active === 'distance'}
		<div id="panel-distance" role="tabpanel" class="flex flex-1 flex-col">
			<p class="text-[13px] leading-4.5 text-rl-text-secondary">Running last week</p>
			<div class="mt-2">
				<p class="flex items-baseline gap-1.5">
					<span class="text-[32px] leading-10 font-semibold tracking-tight text-rl-text">
						{distance.totalKm.toFixed(1)}
					</span>
					<span class="text-[13px] font-medium text-rl-text-tertiary">km</span>
				</p>
				<p class="mt-0.5 text-[13px] leading-4.5 text-rl-text-secondary">
					{#if distance.deltaPct !== null}
						<span class="font-medium {distance.deltaPct >= 0 ? 'text-rl-success' : 'text-rl-danger'}">
							{distance.deltaPct >= 0 ? '+' : ''}{distance.deltaPct}%
						</span>
						<span>vs previous week</span>
					{:else}
						No previous-week baseline
					{/if}
				</p>
			</div>

			<div class="relative mt-5 flex-1" style="min-height: 72px">
				<div class="pointer-events-none absolute inset-0 flex flex-col justify-between">
					{#each { length: 4 } as _}
						<div class="h-px w-full bg-rl-border-subtle"></div>
					{/each}
				</div>
				<div class="relative flex h-full items-end gap-3">
					{#each distance.days as day, i}
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
								class="animate-fade-up w-1.75 rounded-t bg-rl-accent transition-all"
								style="height: {curPct}%; animation-delay: {i * 40}ms; min-height: {day.currentKm > 0
									? '2px'
									: '0px'}"
							></div>
						</div>
					{/each}
				</div>
				<div class="absolute -top-4 flex w-full gap-3">
					{#each distance.days as day}
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

			<div class="mt-2 flex gap-3">
				{#each distance.days as day}
					<div class="flex-1 text-center">
						<span class="font-mono text-[11px] text-rl-text-tertiary">{day.label}</span>
					</div>
				{/each}
			</div>
		</div>

	<!-- Cadence & Stride view -->
	{:else if active === 'cadence'}
		<div id="panel-cadence" role="tabpanel" class="flex flex-1 flex-col">
			<div class="flex items-baseline gap-6">
				<div>
					<p class="text-[12px] leading-4 text-rl-text-tertiary">7-day avg cadence</p>
					<p class="mt-0.5 flex items-baseline gap-1">
						<span class="font-mono text-[24px] leading-8 font-semibold text-rl-text"
							>{cadenceStride.avgCadence}</span
						>
						<span class="text-[13px] text-rl-text-tertiary">spm</span>
					</p>
				</div>
				<div>
					<p class="text-[12px] leading-4 text-rl-text-tertiary">7-day avg stride</p>
					<p class="mt-0.5 flex items-baseline gap-1">
						<span class="font-mono text-[24px] leading-8 font-semibold text-rl-text"
							>{cadenceStride.avgStride}</span
						>
						<span class="text-[13px] text-rl-text-tertiary">cm</span>
					</p>
				</div>
			</div>
			<p class="mt-1 text-[11px] text-rl-text-tertiary">Runs &ge; 1 km only</p>

			<!-- Cadence bars -->
			<div class="mt-4 flex-1">
				<p class="mb-1.5 text-[11px] font-medium tracking-wide text-rl-text-tertiary uppercase">
					Cadence
				</p>
				<div class="relative" style="height: 48px">
					<div class="pointer-events-none absolute inset-0 flex flex-col justify-between">
						{#each { length: 3 } as _}
							<div class="h-px w-full bg-rl-border-subtle"></div>
						{/each}
					</div>
					<div class="relative flex h-full items-end gap-3">
						{#each cadenceStride.days as day}
							{@const pct = day.hasData ? (day.avgCadence / maxCadence) * 100 : 0}
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
			</div>

			<!-- Stride bars -->
			<div class="mt-4 flex-1">
				<p class="mb-1.5 text-[11px] font-medium tracking-wide text-rl-text-tertiary uppercase">
					Stride
				</p>
				<div class="relative" style="height: 48px">
					<div class="pointer-events-none absolute inset-0 flex flex-col justify-between">
						{#each { length: 3 } as _}
							<div class="h-px w-full bg-rl-border-subtle"></div>
						{/each}
					</div>
					<div class="relative flex h-full items-end gap-3">
						{#each cadenceStride.days as day}
							{@const pct = day.hasData ? (day.avgStride / maxStride) * 100 : 0}
							<div class="flex flex-1 items-end justify-center" style="height: 100%">
								<div
									class="w-1.75 rounded-t transition-all {day.hasData
										? 'bg-rl-accent/60'
										: 'bg-transparent'}"
									style="height: {pct}%; min-height: {day.hasData ? '2px' : '0px'}"
								></div>
							</div>
						{/each}
					</div>
					<div class="absolute -top-3.5 flex w-full gap-3">
						{#each cadenceStride.days as day}
							<div class="flex flex-1 justify-center">
								{#if day.hasData}
									<span class="font-mono text-[10px] font-medium text-rl-text-secondary"
										>{day.avgStride}</span
									>
								{/if}
							</div>
						{/each}
					</div>
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

	<!-- Recovery view -->
	{:else}
		<div id="panel-recovery" role="tabpanel" class="flex flex-1 flex-col">
			<p class="text-[12px] leading-4 text-rl-text-tertiary">7-day avg recovery</p>
			<div class="mt-1">
				<p class="flex items-baseline gap-1.5">
					<span class="font-mono text-[32px] leading-10 font-semibold text-rl-text"
						>{recovery.avgRecovery}</span
					>
					<span class="text-[13px] text-rl-text-tertiary">hours</span>
				</p>
				{#if recovery.latestRecovery}
					<p class="mt-0.5 text-[13px] text-rl-text-secondary">
						Latest: <span class="font-mono font-medium text-rl-text"
							>{recovery.latestRecovery.hours}h</span
						>
					</p>
				{/if}
			</div>

			<div class="relative mt-5 flex-1" style="min-height: 72px">
				<div class="pointer-events-none absolute inset-0 flex flex-col justify-between">
					{#each { length: 4 } as _}
						<div class="h-px w-full bg-rl-border-subtle"></div>
					{/each}
				</div>
				<div class="relative flex h-full items-end gap-3">
					{#each recovery.days as day, i}
						{@const pct = day.hasData ? (day.recoveryHours / maxRecovery) * 100 : 0}
						<div class="flex flex-1 items-end justify-center" style="height: 100%">
							<div
								class="animate-fade-up w-1.75 rounded-t transition-all {day.hasData
									? 'bg-rl-accent'
									: 'bg-transparent'}"
								style="height: {pct}%; animation-delay: {i * 40}ms; min-height: {day.hasData
									? '2px'
									: '0px'}"
							></div>
						</div>
					{/each}
				</div>
				<div class="absolute -top-4 flex w-full gap-3">
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
