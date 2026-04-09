<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Runlog } from '$lib/types/runlog';
	import { formatNumber, formatDateShort } from '$lib/data/dashboard';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import PaceSplitBars from './PaceSplitBars.svelte';
	import HrZoneBar from './HrZoneBar.svelte';

	let {
		run,
		expanded = false,
		onToggle
	}: { run: Runlog; expanded?: boolean; onToggle: () => void } = $props();

	const statusColors: Record<string, string> = {
		productive: 'bg-lime-soft text-lime-800',
		improving: 'bg-cyan-soft text-cyan-800',
		maintained: 'bg-gray-100 text-gray-600',
		recovery: 'bg-amber-50 text-amber-700',
		detraining: 'bg-orange-50 text-orange-700',
		overreaching: 'bg-red-50 text-red-700',
		unproductive: 'bg-gray-100 text-gray-500'
	};

	const stress = $derived(run.performance.aerobic_training_stress);
	const recovery = $derived(run.hr_recovery);
	const dt = $derived(formatDateShort(run.date));
</script>

<div
	class="rounded-lg border border-divider/40 bg-surface transition-shadow hover:shadow-xs {expanded
		? 'shadow-xs'
		: ''}"
>
	<button
		class="flex w-full cursor-pointer items-center gap-3 px-3.5 py-2 text-left"
		onclick={onToggle}
		aria-expanded={expanded}
	>
		<!-- Date -->
		<div class="w-16 shrink-0">
			<p class="text-xs font-semibold text-graphite">{dt.dayMon}</p>
			<p class="text-[10px] text-graphite-secondary">{dt.yearTime} · {run.time}</p>
		</div>

		<!-- Inline metrics -->
		<div
			class="flex min-w-0 flex-1 items-center gap-x-4 gap-y-0.5 overflow-hidden text-xs"
		>
			<span class="font-semibold text-graphite">{run.distance_km}<span class="font-normal text-graphite-secondary"> km</span></span>
			<span class="text-graphite-secondary">{run.duration}</span>
			<span class="text-graphite-secondary">{run.avg_pace}<span class="text-graphite-secondary/60"> /km</span></span>
			<span class="hidden text-graphite-secondary sm:inline">{run.avg_hr}<span class="text-graphite-secondary/60"> bpm</span></span>
		</div>

		<!-- Status badge -->
		{#if stress}
			<span
				class="shrink-0 rounded-full px-2 py-px text-[9px] font-medium capitalize {statusColors[
					stress.status
				] ?? 'bg-gray-100 text-gray-500'}"
			>
				{stress.status}
			</span>
		{/if}

		<span
			class="shrink-0 text-graphite-secondary/50 transition-transform duration-200 {expanded
				? 'rotate-180'
				: ''}"
			aria-hidden="true"
		>
			<ChevronDown size={14} strokeWidth={1.75} />
		</span>
	</button>

	{#if expanded}
		<div transition:slide={{ duration: 200 }} class="border-t border-divider/40 px-3.5 pb-4 pt-3">
			<div class="grid gap-5 md:grid-cols-2">
				<div>
					<h4 class="mb-1.5 text-[10px] font-medium tracking-wider text-graphite-secondary uppercase">
						Pace Splits
					</h4>
					<PaceSplitBars splits={run.pace.per_km} />
					<p class="mt-1.5 text-[10px] text-graphite-secondary">
						Fastest: <span class="font-medium text-graphite">{run.pace.fastest} /km</span>
					</p>
				</div>

				<div>
					<h4 class="mb-1.5 text-[10px] font-medium tracking-wider text-graphite-secondary uppercase">
						Heart Rate Zones
					</h4>
					<HrZoneBar zones={run.hr_zones_minutes} />
					<p class="mt-1.5 text-[10px] text-graphite-secondary">
						Max: <span class="font-medium text-graphite">{run.max_hr} bpm</span>
					</p>
				</div>

				<div>
					<h4 class="mb-1.5 text-[10px] font-medium tracking-wider text-graphite-secondary uppercase">
						Recovery
					</h4>
					<div class="grid grid-cols-2 gap-2">
						<div class="rounded-lg bg-bone p-2.5">
							<p class="text-[9px] text-graphite-secondary">HR Drop</p>
							<p class="text-base font-semibold text-graphite">
								{recovery.dropped_bpm} <span class="text-[10px] font-normal">bpm</span>
							</p>
							<p class="text-[9px] text-graphite-secondary">
								{recovery.start_bpm} → {recovery.end_bpm}
							</p>
						</div>
						<div class="rounded-lg bg-bone p-2.5">
							<p class="text-[9px] text-graphite-secondary">Recovery Time</p>
							<p class="text-base font-semibold text-graphite">
								{run.performance.recovery_time_hours}
								<span class="text-[10px] font-normal">hrs</span>
							</p>
							<p class="text-[9px] text-graphite-secondary">
								in {recovery.duration_minutes} min
							</p>
						</div>
					</div>
				</div>

				<div>
					<h4 class="mb-1.5 text-[10px] font-medium tracking-wider text-graphite-secondary uppercase">
						Cadence & Stride
					</h4>
					<div class="grid grid-cols-2 gap-2">
						<div class="rounded-lg bg-bone p-2.5">
							<p class="text-[9px] text-graphite-secondary">Avg Cadence</p>
							<p class="text-base font-semibold text-graphite">
								{run.cadence.avg_spm} <span class="text-[10px] font-normal">spm</span>
							</p>
							<p class="text-[9px] text-graphite-secondary">max {run.cadence.max_spm}</p>
						</div>
						<div class="rounded-lg bg-bone p-2.5">
							<p class="text-[9px] text-graphite-secondary">Avg Stride</p>
							<p class="text-base font-semibold text-graphite">
								{run.avg_stride_cm} <span class="text-[10px] font-normal">cm</span>
							</p>
							<p class="text-[9px] text-graphite-secondary">
								{formatNumber(run.steps)} steps
							</p>
						</div>
					</div>

					<div class="mt-2 flex flex-wrap gap-1.5">
						<span class="inline-flex items-center gap-1 rounded-md bg-bone px-2 py-0.5 text-[10px]">
							<span class="text-graphite-secondary">VO2max</span>
							<span class="font-semibold text-graphite">{run.performance.vo2max.value}</span>
							<span class="text-[9px] text-graphite-secondary capitalize">
								{run.performance.vo2max.status}
							</span>
						</span>
						{#if stress}
							<span class="inline-flex items-center gap-1 rounded-md bg-bone px-2 py-0.5 text-[10px]">
								<span class="text-graphite-secondary">Stress</span>
								<span class="font-semibold text-graphite">{stress.value}</span>
							</span>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
