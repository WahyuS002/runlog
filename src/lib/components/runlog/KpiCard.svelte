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

<div class="rounded-xl border border-divider/50 bg-surface px-3.5 py-3 shadow-xs">
	<div class="flex items-center gap-1.5">
		{#if icon}
			<span class="kpi-icon-chip" aria-hidden="true">
				{@render iconRender()}
			</span>
		{/if}
		<p class="text-[10px] font-medium tracking-wider text-graphite-secondary uppercase">{label}</p>
	</div>
	<p class="mt-0.5 flex items-baseline gap-1">
		<span class="text-xl font-semibold tracking-tight text-graphite">{value}</span>
		{#if unit}
			<span class="text-xs text-graphite-secondary">{unit}</span>
		{/if}
	</p>
	{#if sublabel}
		<p class="mt-0.5 text-[10px] text-graphite-secondary">{sublabel}</p>
	{/if}
</div>

{#snippet iconRender()}
	{#if icon}
		{@const Icon = icon}
		<Icon size={14} strokeWidth={1.75} class="text-graphite-secondary" />
	{/if}
{/snippet}
