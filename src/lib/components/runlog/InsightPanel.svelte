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

<div class="space-y-4">
	<!-- Records -->
	<div class="rounded-2xl border border-divider bg-surface p-5 shadow-sm">
		<h3 class="section-heading">
			<Trophy size={16} strokeWidth={1.75} class="text-graphite-secondary" aria-hidden="true" />
			Personal Records
		</h3>
		<dl class="mt-3 space-y-3">
			<div>
				<dt class="text-xs text-graphite-secondary">Longest Run</dt>
				<dd class="text-lg font-semibold tracking-tight text-graphite">
					{data.longestRun.km} <span class="text-sm font-normal text-graphite-secondary">km</span>
				</dd>
				<dd class="text-[10px] text-graphite-secondary">{formatDate(data.longestRun.date)}</dd>
			</div>
			<div class="border-t border-divider pt-3">
				<dt class="text-xs text-graphite-secondary">Fastest Avg Pace</dt>
				{#if data.fastestRun}
					<dd class="text-lg font-semibold tracking-tight text-graphite">
						{data.fastestRun.pace}
						<span class="text-sm font-normal text-graphite-secondary">/km</span>
					</dd>
					<dd class="text-[10px] text-graphite-secondary">{formatDate(data.fastestRun.date)}</dd>
				{:else}
					<dd class="text-sm text-graphite-secondary">—</dd>
				{/if}
			</div>
			<div class="border-t border-divider pt-3">
				<dt class="text-xs text-graphite-secondary">Total Calories</dt>
				<dd class="text-lg font-semibold tracking-tight text-graphite">
					{formatNumber(data.totalCalories)}
					<span class="text-sm font-normal text-graphite-secondary">kcal</span>
				</dd>
			</div>
		</dl>
	</div>

	<!-- Performance -->
	<div class="rounded-2xl border border-divider bg-surface p-5 shadow-sm">
		<h3 class="section-heading">
			<Activity size={16} strokeWidth={1.75} class="text-graphite-secondary" aria-hidden="true" />
			Performance
		</h3>
		<div class="mt-3 space-y-3">
			<div>
				<p class="text-xs text-graphite-secondary">Latest VO2max</p>
				<p class="mt-0.5 flex items-center gap-2">
					<span class="text-lg font-semibold tracking-tight text-graphite">
						{data.latestVo2max.value}
					</span>
					<span
						class="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize {vo2StatusColor[
							data.latestVo2max.status
						] ?? 'bg-gray-200 text-graphite'}"
					>
						{data.latestVo2max.status}
					</span>
				</p>
			</div>
			<div class="border-t border-divider pt-3">
				<p class="text-xs text-graphite-secondary">Avg Recovery</p>
				<p class="text-lg font-semibold tracking-tight text-graphite">
					{data.avgRecoveryHours}
					<span class="text-sm font-normal text-graphite-secondary">hours</span>
				</p>
			</div>
			<div class="border-t border-divider pt-3">
				<p class="text-xs text-graphite-secondary">Total Duration</p>
				<p class="text-lg font-semibold tracking-tight text-graphite">
					{data.totalDuration}
				</p>
			</div>
		</div>
	</div>
</div>
