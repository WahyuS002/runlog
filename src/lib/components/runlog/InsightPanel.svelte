<script lang="ts">
	import { formatNumber, formatDate, type DashboardData } from '$lib/data/dashboard';

	let { data }: { data: DashboardData } = $props();

	const vo2StatusColor: Record<string, string> = {
		superior: 'bg-rl-accent text-white',
		excellent: 'bg-rl-success text-white',
		good: 'bg-emerald-600 text-white',
		fair: 'bg-rl-warning text-rl-text',
		poor: 'bg-rl-danger text-white'
	};
</script>

<div class="flex h-full flex-col rounded-xl border border-rl-border bg-rl-surface p-5">
	<dl class="grid flex-1 grid-cols-2 gap-x-8 gap-y-4">
		<div>
			<dt class="text-[12px] leading-[16px] text-rl-text-tertiary">Distance</dt>
			<dd class="mt-0.5 font-mono text-[24px] leading-[32px] font-semibold tracking-tight text-rl-text">
				{data.totalDistanceKm.toFixed(1)}
				<span class="text-[13px] font-normal text-rl-text-tertiary">km</span>
			</dd>
			<dd class="text-[12px] leading-[16px] text-rl-text-tertiary">{data.totalRuns} sessions</dd>
		</div>
		<div>
			<dt class="text-[12px] leading-[16px] text-rl-text-tertiary">Longest Run</dt>
			<dd class="mt-0.5 font-mono text-[24px] leading-[32px] font-semibold tracking-tight text-rl-text">
				{data.longestRun.km}
				<span class="text-[13px] font-normal text-rl-text-tertiary">km</span>
			</dd>
			<dd class="text-[12px] leading-[16px] text-rl-text-tertiary">{formatDate(data.longestRun.date)}</dd>
		</div>

		<div class="border-t border-rl-border pt-4">
			<dt class="text-[12px] leading-[16px] text-rl-text-tertiary">Best Pace</dt>
			{#if data.fastestRun}
				<dd class="mt-0.5 font-mono text-[24px] leading-[32px] font-semibold tracking-tight text-rl-text">
					{data.fastestRun.pace}
					<span class="text-[13px] font-normal text-rl-text-tertiary">/km</span>
				</dd>
				<dd class="text-[12px] leading-[16px] text-rl-text-tertiary">{formatDate(data.fastestRun.date)}</dd>
			{:else}
				<dd class="mt-0.5 text-[14px] text-rl-text-tertiary">—</dd>
			{/if}
		</div>
		<div class="border-t border-rl-border pt-4">
			<dt class="text-[12px] leading-[16px] text-rl-text-tertiary">VO2max</dt>
			<dd class="mt-0.5 flex items-center gap-2">
				<span class="font-mono text-[24px] leading-[32px] font-semibold tracking-tight text-rl-text">
					{data.latestVo2max.value}
				</span>
				<span
					class="rounded-full px-2 py-0.5 text-[11px] font-medium capitalize {vo2StatusColor[
						data.latestVo2max.status
					] ?? 'bg-rl-subtle text-rl-text-secondary'}"
				>
					{data.latestVo2max.status}
				</span>
			</dd>
		</div>

		<div class="border-t border-rl-border pt-4">
			<dt class="text-[12px] leading-[16px] text-rl-text-tertiary">Avg Recovery</dt>
			<dd class="mt-0.5 font-mono text-[24px] leading-[32px] font-semibold tracking-tight text-rl-text">
				{data.avgRecoveryHours}
				<span class="text-[13px] font-normal text-rl-text-tertiary">hours</span>
			</dd>
		</div>
		<div class="border-t border-rl-border pt-4">
			<dt class="text-[12px] leading-[16px] text-rl-text-tertiary">Total Calories</dt>
			<dd class="mt-0.5 font-mono text-[24px] leading-[32px] font-semibold tracking-tight text-rl-text">
				{formatNumber(data.totalCalories)}
				<span class="text-[13px] font-normal text-rl-text-tertiary">kcal</span>
			</dd>
		</div>
	</dl>
</div>
