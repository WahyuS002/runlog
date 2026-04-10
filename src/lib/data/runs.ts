import type { Runlog } from '$lib/types/runlog';

// Personal data lives flat in src/data/*.json (gitignored).
// Example data lives in src/data/example/*.json (committed) and is shown
// only when no personal data is present — useful for fresh forks and CI.
const realModules = import.meta.glob<Runlog>('/src/data/*.json', {
	eager: true,
	import: 'default'
});
const exampleModules = import.meta.glob<Runlog>('/src/data/example/*.json', {
	eager: true,
	import: 'default'
});

const realRuns = Object.values(realModules);
const exampleRuns = Object.values(exampleModules);

function sortByDateDesc(list: Runlog[]): Runlog[] {
	return [...list].sort((a, b) => {
		const ka = `${a.date}T${a.time}`;
		const kb = `${b.date}T${b.time}`;
		return kb.localeCompare(ka);
	});
}

/** True when the site is rendering example data because no personal data was found. */
export const isExampleData = realRuns.length === 0;

/** All runs, newest first. */
export const runs: Runlog[] = sortByDateDesc(isExampleData ? exampleRuns : realRuns);
