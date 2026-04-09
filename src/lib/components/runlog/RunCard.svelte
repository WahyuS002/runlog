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

<div class="rounded-2xl border border-divider bg-surface shadow-sm transition-shadow hover:shadow-md">
	<!-- Compact header -->
	<button
		class="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left"
		onclick={onToggle}
		aria-expanded={expanded}
	>
		<!-- Date -->
		<div class="w-20 shrink-0">
			<p class="text-sm font-semibold text-graphite">{dt.dayMon}</p>
			<p class="text-[11px] text-graphite-secondary">{dt.yearTime} · {run.time}</p>
		</div>

		<!-- Core stats -->
		<div class="flex min-w-0 flex-1 flex-wrap items-center gap-x-5 gap-y-1">
			<div>
				<p class="text-xs text-graphite-secondary">Distance</p>
				<p class="text-sm font-semibold text-graphite">{run.distance_km} km</p>
			</div>
			<div>
				<p class="text-xs text-graphite-secondary">Duration</p>
				<p class="text-sm font-semibold text-graphite">{run.duration}</p>
			</div>
			<div>
				<p class="text-xs text-graphite-secondary">Avg Pace</p>
				<p class="text-sm font-semibold text-graphite">{run.avg_pace} /km</p>
			</div>
			<div>
				<p class="text-xs text-graphite-secondary">Avg HR</p>
				<p class="text-sm font-semibold text-graphite">{run.avg_hr} bpm</p>
			</div>
		</div>

		<!-- Status badge -->
		{#if stress}
			<span
				class="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize {statusColors[
					stress.status
				] ?? 'bg-gray-100 text-gray-500'}"
			>
				{stress.status}
			</span>
		{/if}

		<!-- Chevron -->
		<span
			class="shrink-0 text-graphite-secondary transition-transform duration-200 {expanded
				? 'rotate-180'
				: ''}"
			aria-hidden="true"
		>
			<ChevronDown size={16} strokeWidth={1.75} />
		</span>
	</button>

	<!-- Expanded analytics panel -->
	{#if expanded}
		<div transition:slide={{ duration: 250 }} class="border-t border-divider px-5 pb-5 pt-4">
			<div class="grid gap-6 md:grid-cols-2">
				<!-- Pace splits -->
				<div>
					<h4 class="mb-2 text-xs font-medium tracking-widest text-graphite-secondary uppercase">
						Pace Splits
					</h4>
					<PaceSplitBars splits={run.pace.per_km} />
					<p class="mt-2 text-xs text-graphite-secondary">
						Fastest split: <span class="font-medium text-graphite">{run.pace.fastest} /km</span>
					</p>
				</div>

				<!-- HR Zones -->
				<div>
					<h4 class="mb-2 text-xs font-medium tracking-widest text-graphite-secondary uppercase">
						Heart Rate Zones
					</h4>
					<HrZoneBar zones={run.hr_zones_minutes} />
					<p class="mt-2 text-xs text-graphite-secondary">
						Max HR: <span class="font-medium text-graphite">{run.max_hr} bpm</span>
					</p>
				</div>

				<!-- Recovery -->
				<div>
					<h4 class="mb-2 text-xs font-medium tracking-widest text-graphite-secondary uppercase">
						Recovery
					</h4>
					<div class="grid grid-cols-2 gap-3">
						<div class="rounded-xl bg-bone p-3">
							<p class="text-[10px] text-graphite-secondary">HR Drop</p>
							<p class="text-lg font-semibold text-graphite">
								{recovery.dropped_bpm} <span class="text-xs font-normal">bpm</span>
							</p>
							<p class="text-[10px] text-graphite-secondary">
								{recovery.start_bpm} → {recovery.end_bpm}
							</p>
						</div>
						<div class="rounded-xl bg-bone p-3">
							<p class="text-[10px] text-graphite-secondary">Recovery Time</p>
							<p class="text-lg font-semibold text-graphite">
								{run.performance.recovery_time_hours}
								<span class="text-xs font-normal">hrs</span>
							</p>
							<p class="text-[10px] text-graphite-secondary">
								in {recovery.duration_minutes} min
							</p>
						</div>
					</div>
				</div>

				<!-- Cadence & Stride + Badges -->
				<div>
					<h4 class="mb-2 text-xs font-medium tracking-widest text-graphite-secondary uppercase">
						Cadence & Stride
					</h4>
					<div class="grid grid-cols-2 gap-3">
						<div class="rounded-xl bg-bone p-3">
							<p class="text-[10px] text-graphite-secondary">Avg Cadence</p>
							<p class="text-lg font-semibold text-graphite">
								{run.cadence.avg_spm} <span class="text-xs font-normal">spm</span>
							</p>
							<p class="text-[10px] text-graphite-secondary">max {run.cadence.max_spm}</p>
						</div>
						<div class="rounded-xl bg-bone p-3">
							<p class="text-[10px] text-graphite-secondary">Avg Stride</p>
							<p class="text-lg font-semibold text-graphite">
								{run.avg_stride_cm} <span class="text-xs font-normal">cm</span>
							</p>
							<p class="text-[10px] text-graphite-secondary">
								{formatNumber(run.steps)} steps
							</p>
						</div>
					</div>

					<!-- VO2max + Training Stress badges -->
					<div class="mt-3 flex flex-wrap gap-2">
						<span class="inline-flex items-center gap-1 rounded-lg bg-bone px-2.5 py-1 text-xs">
							<span class="text-graphite-secondary">VO2max</span>
							<span class="font-semibold text-graphite">{run.performance.vo2max.value}</span>
							<span class="text-[10px] text-graphite-secondary capitalize">
								{run.performance.vo2max.status}
							</span>
						</span>
						{#if stress}
							<span
								class="inline-flex items-center gap-1 rounded-lg bg-bone px-2.5 py-1 text-xs"
							>
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
