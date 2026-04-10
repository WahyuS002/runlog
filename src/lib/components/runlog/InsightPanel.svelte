<script lang="ts">
	import { formatNumber, formatDate, type DashboardData } from '$lib/data/dashboard';

	let { data }: { data: DashboardData } = $props();

	const vo2StatusColor: Record<string, string> = {
		superior: 'bg-cyan-accent text-white',
		excellent: 'bg-lime-accent text-white',
		good: 'bg-green-500 text-white',
		fair: 'bg-amber-400 text-graphite',
		poor: 'bg-red-500 text-white'
	};
</script>

<div class="flex h-full flex-col rounded-xl border border-divider/50 bg-surface p-4 shadow-xs">
	<dl class="grid flex-1 grid-cols-2 gap-x-6 gap-y-3">
		<div>
			<dt class="text-[10px] text-graphite-secondary">Distance</dt>
			<dd class="text-base font-semibold tracking-tight text-graphite">
				{data.totalDistanceKm.toFixed(1)}
				<span class="text-xs font-normal text-graphite-secondary">km</span>
			</dd>
			<dd class="text-[10px] text-graphite-secondary">{data.totalRuns} sessions</dd>
		</div>
		<div>
			<dt class="text-[10px] text-graphite-secondary">Longest Run</dt>
			<dd class="text-base font-semibold tracking-tight text-graphite">
				{data.longestRun.km}
				<span class="text-xs font-normal text-graphite-secondary">km</span>
			</dd>
			<dd class="text-[10px] text-graphite-secondary">{formatDate(data.longestRun.date)}</dd>
		</div>
		<div class="border-t border-divider/50 pt-3">
			<dt class="text-[10px] text-graphite-secondary">Best Pace</dt>
			{#if data.fastestRun}
				<dd class="text-base font-semibold tracking-tight text-graphite">
					{data.fastestRun.pace}
					<span class="text-xs font-normal text-graphite-secondary">/km</span>
				</dd>
				<dd class="text-[10px] text-graphite-secondary">{formatDate(data.fastestRun.date)}</dd>
			{:else}
				<dd class="text-xs text-graphite-secondary">—</dd>
			{/if}
		</div>
		<div class="border-t border-divider/50 pt-3">
			<dt class="text-[10px] text-graphite-secondary">VO2max</dt>
			<dd class="mt-0.5 flex items-center gap-1.5">
				<span class="text-base font-semibold tracking-tight text-graphite">
					{data.latestVo2max.value}
				</span>
				<span
					class="rounded-full px-1.5 py-px text-[9px] font-medium capitalize {vo2StatusColor[
						data.latestVo2max.status
					] ?? 'bg-gray-200 text-graphite'}"
				>
					{data.latestVo2max.status}
				</span>
			</dd>
		</div>
		<div class="border-t border-divider/50 pt-3">
			<dt class="text-[10px] text-graphite-secondary">Avg Recovery</dt>
			<dd class="text-base font-semibold tracking-tight text-graphite">
				{data.avgRecoveryHours}
				<span class="text-xs font-normal text-graphite-secondary">hours</span>
			</dd>
		</div>
		<div class="border-t border-divider/50 pt-3">
			<dt class="text-[10px] text-graphite-secondary">Total Calories</dt>
			<dd class="text-base font-semibold tracking-tight text-graphite">
				{formatNumber(data.totalCalories)}
				<span class="text-xs font-normal text-graphite-secondary">kcal</span>
			</dd>
		</div>
	</dl>
</div>
