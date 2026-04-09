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
const DAY_MS = 86_400_000;

function dateToMs(iso: string): number {
	const [y, m, d] = iso.split('-').map(Number);
	return Date.UTC(y, m - 1, d);
}

function msToIso(ms: number): string {
	const d = new Date(ms);
	const y = d.getUTCFullYear();
	const m = String(d.getUTCMonth() + 1).padStart(2, '0');
	const dd = String(d.getUTCDate()).padStart(2, '0');
	return `${y}-${m}-${dd}`;
}

export interface WeekDay {
	date: string;
	label: string;
	distanceKm: number;
}

export interface WeeklyData {
	totalKm: number;
	prevTotalKm: number;
	deltaPct: number | null;
	days: WeekDay[];
}

function computeWeeklyData(list: Runlog[]): WeeklyData {
	const anchorMs = dateToMs(list[0].date);

	const dayMap = new Map<string, number>();
	for (const run of list) {
		dayMap.set(run.date, Math.round(((dayMap.get(run.date) ?? 0) + run.distance_km) * 100) / 100);
	}

	const days: WeekDay[] = [];
	let totalKm = 0;
	for (let i = 6; i >= 0; i--) {
		const iso = msToIso(anchorMs - i * DAY_MS);
		const km = dayMap.get(iso) ?? 0;
		totalKm += km;
		days.push({ date: iso, label: iso.split('-')[2], distanceKm: Math.round(km * 100) / 100 });
	}
	totalKm = Math.round(totalKm * 100) / 100;

	let prevTotalKm = 0;
	for (let i = 13; i >= 7; i--) {
		prevTotalKm += dayMap.get(msToIso(anchorMs - i * DAY_MS)) ?? 0;
	}
	prevTotalKm = Math.round(prevTotalKm * 100) / 100;

	const deltaPct = prevTotalKm > 0 ? Math.round(((totalKm - prevTotalKm) / prevTotalKm) * 100) : null;

	return { totalKm, prevTotalKm, deltaPct, days };
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
	weeklyData: WeeklyData;
	runs: Runlog[];
	isExampleData: boolean;
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
		weeklyData: computeWeeklyData(runs),
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
