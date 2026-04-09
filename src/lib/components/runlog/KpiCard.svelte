<script lang="ts">
	let {
		label,
		value,
		unit = '',
		sublabel = ''
	}: { label: string; value: string; unit?: string; sublabel?: string } = $props();
</script>

<div class="rounded-2xl border border-divider bg-surface px-5 py-4 shadow-sm">
	<p class="text-xs font-medium tracking-widest text-graphite-secondary uppercase">{label}</p>
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
