<script lang="ts">
	import type { PaceSplit } from '$lib/types/runlog';

	let { splits }: { splits: PaceSplit[] } = $props();

	const maxPace = $derived(Math.max(...splits.map((s) => s.pace_seconds)));
	const minPace = $derived(Math.min(...splits.map((s) => s.pace_seconds)));
</script>

<div class="space-y-1.5">
	{#each splits as split}
		{@const widthPct = (split.pace_seconds / maxPace) * 100}
		{@const isFastest = split.pace_seconds === minPace}
		<div class="flex items-center gap-2">
			<span class="w-12 shrink-0 text-right font-mono text-[12px] text-rl-text-tertiary">
				{split.km === 'partial' ? 'last' : `km ${split.km}`}
			</span>
			<div class="relative h-5 flex-1">
				<div
					class="h-full rounded-r transition-all duration-300 {isFastest
						? 'bg-rl-accent'
						: 'bg-rl-accent/20'}"
					style="width: {widthPct}%"
				></div>
			</div>
			<span class="w-11 shrink-0 text-right font-mono text-[12px] font-medium text-rl-text">
				{split.pace}
			</span>
		</div>
	{/each}
</div>
