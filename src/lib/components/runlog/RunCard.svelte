<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Runlog } from '$lib/types/runlog';
	import { formatNumber, formatDateShort } from '$lib/data/dashboard';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Info from 'lucide-svelte/icons/info';
	import PaceSplitBars from './PaceSplitBars.svelte';
	import HrZoneBar from './HrZoneBar.svelte';

	const statusDescriptions: Record<string, string> = {
		productive: 'Training is effective and fitness is improving.',
		improving: 'Training load is rising and the body is adapting.',
		maintained: 'Fitness is holding steady without major change.',
		recovery: 'Training load is light to support recovery.',
		detraining: 'Recent training load is low and fitness may be slipping.',
		overreaching: 'Training load is very high and extra rest may help.',
		unproductive: 'Training load is high, but fitness is not improving yet.'
	};

	let {
		run,
		expanded = false,
		onToggle
	}: { run: Runlog; expanded?: boolean; onToggle: () => void } = $props();

	const statusColors: Record<string, string> = {
		productive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
		improving: 'bg-blue-50 text-blue-700 border-blue-200',
		maintained: 'bg-rl-subtle text-rl-text-secondary border-rl-border',
		recovery: 'bg-amber-50 text-amber-700 border-amber-200',
		detraining: 'bg-orange-50 text-orange-700 border-orange-200',
		overreaching: 'bg-red-50 text-red-700 border-red-200',
		unproductive: 'bg-rl-subtle text-rl-text-tertiary border-rl-border'
	};

	const stress = $derived(run.performance.aerobic_training_stress);
	const recovery = $derived(run.hr_recovery);
	const dt = $derived(formatDateShort(run.date));
</script>

<div
	class="rounded-xl border border-rl-border bg-rl-surface transition-colors {expanded
		? 'border-rl-text/12'
		: 'hover:bg-rl-surface-hover'}"
>
	<button
		class="flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left sm:gap-4 sm:px-4 sm:py-3"
		onclick={onToggle}
		aria-expanded={expanded}
	>
		<!-- Date -->
		<div class="w-14 shrink-0 sm:w-[72px]">
			<p class="text-[12px] leading-[16px] font-medium text-rl-text sm:text-[13px] sm:leading-[18px]">{dt.dayMon}</p>
			<p class="font-mono text-[10px] leading-[14px] text-rl-text-tertiary sm:text-[11px] sm:leading-[16px]">
				{dt.yearTime} · {run.time}
			</p>
		</div>

		<!-- Inline metrics -->
		<div class="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[12px] leading-[16px] sm:gap-x-5 sm:text-[13px] sm:leading-[18px]">
			<span class="font-medium text-rl-text">
				{run.distance_km}<span class="text-rl-text-tertiary"> km</span>
			</span>
			<span class="text-rl-text-secondary">{run.duration}</span>
			<span class="text-rl-text-secondary">
				{run.avg_pace}<span class="text-rl-text-tertiary"> /km</span>
			</span>
			<span class="hidden text-rl-text-secondary sm:inline">
				{run.avg_hr}<span class="text-rl-text-tertiary"> bpm</span>
			</span>
		</div>

		<!-- Status badge -->
		{#if stress}
			<span class="group relative shrink-0">
				<span
					class="inline-flex items-center gap-1 rounded-full border py-0.5 pr-1.5 pl-2 text-[10px] font-medium capitalize sm:pl-2.5 sm:text-[11px] {statusColors[
						stress.status
					] ?? 'bg-rl-subtle text-rl-text-tertiary border-rl-border'}"
				>
					{stress.status}
					<Info size={11} strokeWidth={1.75} class="opacity-40" />
				</span>
				<span
					class="pointer-events-none absolute right-1/2 bottom-full z-10 mb-2 w-44 translate-x-1/2 rounded-lg bg-rl-text px-3 py-2 text-center text-[12px] leading-[16px] font-normal text-white normal-case opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
				>
					{statusDescriptions[stress.status] ?? stress.status}
					<span
						class="absolute top-full right-1/2 translate-x-1/2 border-4 border-transparent border-t-rl-text"
					></span>
				</span>
			</span>
		{/if}

		<span
			class="shrink-0 text-rl-text-tertiary transition-transform duration-150 {expanded
				? 'rotate-180'
				: ''}"
			aria-hidden="true"
		>
			<ChevronDown size={14} strokeWidth={1.75} />
		</span>
	</button>

	{#if expanded}
		<div transition:slide={{ duration: 150 }} class="border-t border-rl-border px-4 pt-4 pb-5">
			<div class="grid gap-6 md:grid-cols-2">
				<div>
					<h4 class="mb-2 text-[12px] leading-[16px] font-medium tracking-wide text-rl-text-tertiary uppercase">
						Pace Splits
					</h4>
					<PaceSplitBars splits={run.pace.per_km} />
					<p class="mt-2 text-[12px] leading-[16px] text-rl-text-secondary">
						Fastest: <span class="font-mono font-medium text-rl-text">{run.pace.fastest} /km</span>
					</p>
				</div>

				<div>
					<h4 class="mb-2 text-[12px] leading-[16px] font-medium tracking-wide text-rl-text-tertiary uppercase">
						Heart Rate Zones
					</h4>
					<HrZoneBar zones={run.hr_zones_minutes} />
					<p class="mt-2 text-[12px] leading-[16px] text-rl-text-secondary">
						Max: <span class="font-mono font-medium text-rl-text">{run.max_hr} bpm</span>
					</p>
				</div>

				<div>
					<h4 class="mb-2 text-[12px] leading-[16px] font-medium tracking-wide text-rl-text-tertiary uppercase">
						Recovery
					</h4>
					<div class="grid grid-cols-2 gap-3">
						<div class="rounded-lg border border-rl-border p-3">
							<p class="text-[11px] text-rl-text-tertiary">HR Drop</p>
							<p class="mt-0.5 font-mono text-[16px] leading-[24px] font-semibold text-rl-text">
								{recovery.dropped_bpm} <span class="text-[12px] font-normal text-rl-text-tertiary">bpm</span>
							</p>
							<p class="text-[11px] text-rl-text-tertiary">
								{recovery.start_bpm} → {recovery.end_bpm}
							</p>
						</div>
						<div class="rounded-lg border border-rl-border p-3">
							<p class="text-[11px] text-rl-text-tertiary">Recovery Time</p>
							<p class="mt-0.5 font-mono text-[16px] leading-[24px] font-semibold text-rl-text">
								{run.performance.recovery_time_hours}
								<span class="text-[12px] font-normal text-rl-text-tertiary">hrs</span>
							</p>
							<p class="text-[11px] text-rl-text-tertiary">
								in {recovery.duration_minutes} min
							</p>
						</div>
					</div>
				</div>

				<div>
					<h4 class="mb-2 text-[12px] leading-[16px] font-medium tracking-wide text-rl-text-tertiary uppercase">
						Cadence & Stride
					</h4>
					<div class="grid grid-cols-2 gap-3">
						<div class="rounded-lg border border-rl-border p-3">
							<p class="text-[11px] text-rl-text-tertiary">Avg Cadence</p>
							<p class="mt-0.5 font-mono text-[16px] leading-[24px] font-semibold text-rl-text">
								{run.cadence.avg_spm} <span class="text-[12px] font-normal text-rl-text-tertiary">spm</span>
							</p>
							<p class="text-[11px] text-rl-text-tertiary">max {run.cadence.max_spm}</p>
						</div>
						<div class="rounded-lg border border-rl-border p-3">
							<p class="text-[11px] text-rl-text-tertiary">Avg Stride</p>
							<p class="mt-0.5 font-mono text-[16px] leading-[24px] font-semibold text-rl-text">
								{run.avg_stride_cm} <span class="text-[12px] font-normal text-rl-text-tertiary">cm</span>
							</p>
							<p class="text-[11px] text-rl-text-tertiary">
								{formatNumber(run.steps)} steps
							</p>
						</div>
					</div>

					<div class="mt-3 flex flex-wrap gap-2">
						<span class="inline-flex items-center gap-1.5 rounded-md border border-rl-border px-2 py-1 text-[11px]">
							<span class="text-rl-text-tertiary">VO2max</span>
							<span class="font-mono font-semibold text-rl-text">{run.performance.vo2max.value}</span>
							<span class="text-rl-text-tertiary capitalize">{run.performance.vo2max.status}</span>
						</span>
						{#if stress}
							<span class="inline-flex items-center gap-1.5 rounded-md border border-rl-border px-2 py-1 text-[11px]">
								<span class="text-rl-text-tertiary">Stress</span>
								<span class="font-mono font-semibold text-rl-text">{stress.value}</span>
							</span>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
