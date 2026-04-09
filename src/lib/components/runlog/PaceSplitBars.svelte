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
			<span class="w-12 shrink-0 text-right text-xs text-graphite-secondary">
				{split.km === 'partial' ? 'last' : `km ${split.km}`}
			</span>
			<div class="relative h-5 flex-1">
				<div
					class="h-full rounded-r transition-all duration-500 {isFastest
						? 'bg-cyan-accent'
						: 'bg-cyan-accent/30'}"
					style="width: {widthPct}%"
				></div>
			</div>
			<span class="w-11 shrink-0 text-right text-xs font-medium text-graphite">{split.pace}</span>
		</div>
	{/each}
</div>
