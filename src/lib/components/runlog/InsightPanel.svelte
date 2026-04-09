<script lang="ts">
	import { formatNumber, formatDate, type DashboardData } from '$lib/data/dashboard';
	import Trophy from 'lucide-svelte/icons/trophy';
	import Activity from 'lucide-svelte/icons/activity';

	let { data }: { data: DashboardData } = $props();

	const vo2StatusColor: Record<string, string> = {
		superior: 'bg-cyan-accent text-white',
		excellent: 'bg-lime-accent text-white',
		good: 'bg-green-500 text-white',
		fair: 'bg-amber-400 text-graphite',
		poor: 'bg-red-500 text-white'
	};
</script>

<div class="space-y-3">
	<!-- Records -->
	<div class="rounded-xl border border-divider/50 bg-surface p-4 shadow-xs">
		<h3 class="section-heading">
			<Trophy size={14} strokeWidth={1.75} class="text-graphite-secondary" aria-hidden="true" />
			Personal Records
		</h3>
		<dl class="mt-2.5 space-y-2.5">
			<div>
				<dt class="text-[10px] text-graphite-secondary">Longest Run</dt>
				<dd class="text-base font-semibold tracking-tight text-graphite">
					{data.longestRun.km}
					<span class="text-xs font-normal text-graphite-secondary">km</span>
				</dd>
				<dd class="text-[10px] text-graphite-secondary">{formatDate(data.longestRun.date)}</dd>
			</div>
			<div class="border-t border-divider/50 pt-2.5">
				<dt class="text-[10px] text-graphite-secondary">Fastest Avg Pace</dt>
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
			<div class="border-t border-divider/50 pt-2.5">
				<dt class="text-[10px] text-graphite-secondary">Total Calories</dt>
				<dd class="text-base font-semibold tracking-tight text-graphite">
					{formatNumber(data.totalCalories)}
					<span class="text-xs font-normal text-graphite-secondary">kcal</span>
				</dd>
			</div>
		</dl>
	</div>

	<!-- Performance -->
	<div class="rounded-xl border border-divider/50 bg-surface p-4 shadow-xs">
		<h3 class="section-heading">
			<Activity size={14} strokeWidth={1.75} class="text-graphite-secondary" aria-hidden="true" />
			Performance
		</h3>
		<div class="mt-2.5 space-y-2.5">
			<div>
				<p class="text-[10px] text-graphite-secondary">Latest VO2max</p>
				<p class="mt-0.5 flex items-center gap-1.5">
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
				</p>
			</div>
			<div class="border-t border-divider/50 pt-2.5">
				<p class="text-[10px] text-graphite-secondary">Avg Recovery</p>
				<p class="text-base font-semibold tracking-tight text-graphite">
					{data.avgRecoveryHours}
					<span class="text-xs font-normal text-graphite-secondary">hours</span>
				</p>
			</div>
			<div class="border-t border-divider/50 pt-2.5">
				<p class="text-[10px] text-graphite-secondary">Total Duration</p>
				<p class="text-base font-semibold tracking-tight text-graphite">
					{data.totalDuration}
				</p>
			</div>
		</div>
	</div>
</div>
