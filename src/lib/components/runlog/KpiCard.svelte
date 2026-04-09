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

<div class="rounded-2xl border border-divider bg-surface px-5 py-4 shadow-sm">
	<div class="flex items-center gap-2">
		{#if icon}
			<span class="kpi-icon-chip" aria-hidden="true">
				{@render iconRender()}
			</span>
		{/if}
		<p class="text-xs font-medium tracking-widest text-graphite-secondary uppercase">{label}</p>
	</div>
	<p class="mt-1 flex items-baseline gap-1.5">
		<span class="text-3xl font-semibold tracking-tight text-graphite">{value}</span>
		{#if unit}
			<span class="text-sm font-medium text-graphite-secondary">{unit}</span>
		{/if}
	</p>
	{#if sublabel}
		<p class="mt-1 text-xs text-graphite-secondary">{sublabel}</p>
	{/if}
</div>

{#snippet iconRender()}
	{#if icon}
		{@const Icon = icon}
		<Icon size={18} strokeWidth={1.75} class="text-graphite-secondary" />
	{/if}
{/snippet}
