<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any */
	let {
		label,
		value,
		unit = '',
		sublabel = '',
		icon
	}: {
		label: string;
		value: string;
		unit?: string;
		sublabel?: string;
		icon?: any;
	} = $props();
</script>

<div class="stat-item">
	<div class="flex items-center gap-1">
		{#if icon}
			{@render iconRender()}
		{/if}
		<span class="text-[10px] font-medium text-graphite-secondary">{label}</span>
	</div>
	<p class="flex items-baseline gap-0.5">
		<span class="text-lg font-semibold tracking-tight text-graphite">{value}</span>
		{#if unit}
			<span class="text-[10px] text-graphite-secondary">{unit}</span>
		{/if}
	</p>
	{#if sublabel}
		<p class="text-[9px] text-graphite-secondary/70">{sublabel}</p>
	{/if}
</div>

{#snippet iconRender()}
	{#if icon}
		{@const Icon = icon}
		<Icon size={11} strokeWidth={1.75} class="text-graphite-secondary/50" aria-hidden="true" />
	{/if}
{/snippet}
