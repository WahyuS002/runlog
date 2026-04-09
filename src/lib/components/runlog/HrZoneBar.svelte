<script lang="ts">
	import type { Runlog } from '$lib/types/runlog';
	import { hrZonePercents } from '$lib/data/dashboard';

	let { zones }: { zones: Runlog['hr_zones_minutes'] } = $props();

	const data = $derived(hrZonePercents(zones));

	const zoneColors: Record<string, string> = {
		warm_up: 'var(--color-zone-warm-up)',
		fat_burning: 'var(--color-zone-fat-burning)',
		aerobic: 'var(--color-zone-aerobic)',
		anaerobic: 'var(--color-zone-anaerobic)',
		extreme: 'var(--color-zone-extreme)'
	};
</script>

<div class="space-y-2">
	<div class="flex h-4 w-full overflow-hidden rounded-full">
		{#each data as segment}
			{#if segment.percent > 0}
				<div
					class="transition-all duration-500"
					style="width: {segment.percent}%; background-color: {zoneColors[segment.zone]}"
					title="{segment.label}: {segment.minutes}min ({segment.percent}%)"
				></div>
			{/if}
		{/each}
	</div>
	<div class="flex flex-wrap gap-x-4 gap-y-1">
		{#each data as segment}
			{#if segment.percent > 0}
				<div class="flex items-center gap-1.5 text-xs text-graphite-secondary">
					<span
						class="inline-block h-2 w-2 rounded-full"
						style="background-color: {zoneColors[segment.zone]}"
					></span>
					{segment.label}
					<span class="font-medium text-graphite">{segment.percent}%</span>
				</div>
			{/if}
		{/each}
	</div>
</div>
