import type { Runlog } from '$lib/types/runlog';
import { runs, isExampleData } from './runs';

function durationToSeconds(d: string): number {
	const [h, m, s] = d.split(':').map(Number);
	return h * 3600 + m * 60 + s;
}

function formatDuration(totalSec: number): string {
	const h = Math.floor(totalSec / 3600);
	const m = Math.floor((totalSec % 3600) / 60);
	const s = Math.floor(totalSec % 60);
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatPace(sec: number): string {
	const m = Math.floor(sec / 60);
	const s = Math.floor(sec % 60);
	return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatNumber(n: number): string {
	const s = String(n);
	return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const MONTH_NAMES = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
];

export function formatDate(iso: string): string {
	const [y, m, d] = iso.split('-');
	return `${parseInt(d)} ${MONTH_NAMES[parseInt(m) - 1]} ${y}`;
}

export function formatDateShort(iso: string): { dayMon: string; yearTime: string } {
	const [y, m, d] = iso.split('-');
	return { dayMon: `${d} ${MONTH_NAMES[parseInt(m) - 1]}`, yearTime: y };
}

const MIN_DISTANCE_FOR_PACE = 1;

export interface MonthAggregate {
	month: string;
	label: string;
	runs: number;
	distanceKm: number;
	totalDurationSeconds: number;
}

export interface DashboardData {
	totalRuns: number;
	totalDistanceKm: number;
	totalDurationSeconds: number;
	totalDuration: string;
	longestRun: { km: number; date: string };
	fastestRun: { pace: string; paceSeconds: number; date: string } | null;
	latestVo2max: { value: number; unit: string; status: string };
	avgRecoveryHours: number;
	totalCalories: number;
	monthlyAggregates: MonthAggregate[];
	runs: Runlog[];
	isExampleData: boolean;
}

function computeMonthlyAggregates(list: Runlog[]): MonthAggregate[] {
	const map = new Map<string, MonthAggregate>();

	for (const run of list) {
		const month = run.date.slice(0, 7);
		const [y, m] = month.split('-');

		if (!map.has(month)) {
			map.set(month, {
				month,
				label: `${MONTH_NAMES[parseInt(m) - 1]} ${y}`,
				runs: 0,
				distanceKm: 0,
				totalDurationSeconds: 0
			});
		}

		const agg = map.get(month)!;
		agg.runs++;
		agg.distanceKm = Math.round((agg.distanceKm + run.distance_km) * 100) / 100;
		agg.totalDurationSeconds += durationToSeconds(run.duration);
	}

	return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
}

export function computeDashboard(): DashboardData {
	const totalRuns = runs.length;
	const totalDistanceKm =
		Math.round(runs.reduce((sum, r) => sum + r.distance_km, 0) * 100) / 100;
	const totalDurationSeconds = runs.reduce((sum, r) => sum + durationToSeconds(r.duration), 0);
	const totalCalories = runs.reduce((sum, r) => sum + r.calories, 0);

	const paceEligible = runs.filter((r) => r.distance_km >= MIN_DISTANCE_FOR_PACE);

	const longestRunEntry = runs.reduce((best, r) => (r.distance_km > best.distance_km ? r : best));
	const fastestRunEntry =
		paceEligible.length > 0
			? paceEligible.reduce((best, r) =>
					r.avg_pace_seconds < best.avg_pace_seconds ? r : best
				)
			: null;

	const latestRun = runs[0];
	const latestVo2max = latestRun.performance.vo2max;

	const recoveryRuns = runs.filter((r) => r.performance.recovery_time_hours > 0);
	const avgRecoveryHours =
		recoveryRuns.length > 0
			? Math.round(
					recoveryRuns.reduce((sum, r) => sum + r.performance.recovery_time_hours, 0) /
						recoveryRuns.length
				)
			: 0;

	return {
		totalRuns,
		totalDistanceKm,
		totalDurationSeconds,
		totalDuration: formatDuration(totalDurationSeconds),
		longestRun: { km: longestRunEntry.distance_km, date: longestRunEntry.date },
		fastestRun: fastestRunEntry
			? {
					pace: formatPace(fastestRunEntry.avg_pace_seconds),
					paceSeconds: fastestRunEntry.avg_pace_seconds,
					date: fastestRunEntry.date
				}
			: null,
		latestVo2max: {
			value: latestVo2max.value,
			unit: latestVo2max.unit,
			status: latestVo2max.status
		},
		avgRecoveryHours,
		totalCalories,
		monthlyAggregates: computeMonthlyAggregates(runs),
		runs,
		isExampleData
	};
}

export function hrZonePercents(zones: Runlog['hr_zones_minutes']): {
	zone: string;
	label: string;
	percent: number;
	minutes: number;
}[] {
	const entries: { zone: string; label: string; minutes: number }[] = [
		{ zone: 'warm_up', label: 'Warm-up', minutes: zones.warm_up },
		{ zone: 'fat_burning', label: 'Fat Burn', minutes: zones.fat_burning },
		{ zone: 'aerobic', label: 'Aerobic', minutes: zones.aerobic },
		{ zone: 'anaerobic', label: 'Anaerobic', minutes: zones.anaerobic },
		{ zone: 'extreme', label: 'Extreme', minutes: zones.extreme }
	];
	const total = entries.reduce((s, e) => s + e.minutes, 0);
	if (total === 0) return entries.map((e) => ({ ...e, percent: 0 }));
	return entries.map((e) => ({
		...e,
		percent: Math.round((e.minutes / total) * 1000) / 10
	}));
}
