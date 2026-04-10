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
	currentKm: number;
	previousKm: number;
}

export interface WeeklyData {
	totalKm: number;
	prevTotalKm: number;
	deltaPct: number | null;
	hasPrevWeek: boolean;
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
	let prevTotalKm = 0;
	for (let i = 6; i >= 0; i--) {
		const curIso = msToIso(anchorMs - i * DAY_MS);
		const prevIso = msToIso(anchorMs - (i + 7) * DAY_MS);
		const curKm = dayMap.get(curIso) ?? 0;
		const prevKm = dayMap.get(prevIso) ?? 0;
		totalKm += curKm;
		prevTotalKm += prevKm;
		days.push({
			date: curIso,
			label: curIso.split('-')[2],
			currentKm: Math.round(curKm * 100) / 100,
			previousKm: Math.round(prevKm * 100) / 100
		});
	}
	totalKm = Math.round(totalKm * 100) / 100;
	prevTotalKm = Math.round(prevTotalKm * 100) / 100;

	const deltaPct =
		prevTotalKm > 0 ? Math.round(((totalKm - prevTotalKm) / prevTotalKm) * 100) : null;

	return { totalKm, prevTotalKm, deltaPct, hasPrevWeek: prevTotalKm > 0, days };
}

export interface DailyCadenceStridePoint {
	date: string;
	label: string;
	avgCadence: number;
	avgStride: number;
	hasData: boolean;
}

export interface CadenceStrideTrend {
	days: DailyCadenceStridePoint[];
	avgCadence: number;
	avgStride: number;
}

export interface DailyRecoveryPoint {
	date: string;
	label: string;
	recoveryHours: number;
	hasData: boolean;
}

export interface RecoveryTrend {
	days: DailyRecoveryPoint[];
	avgRecovery: number;
	latestRecovery: { hours: number; date: string } | null;
}

function computeCadenceStrideTrend(list: Runlog[], anchorMs: number): CadenceStrideTrend {
	const dayRuns = new Map<string, Runlog[]>();
	for (const run of list) {
		const arr = dayRuns.get(run.date) ?? [];
		arr.push(run);
		dayRuns.set(run.date, arr);
	}

	const days: DailyCadenceStridePoint[] = [];
	let totalCadence = 0;
	let totalStride = 0;
	let totalDist = 0;

	for (let i = 6; i >= 0; i--) {
		const iso = msToIso(anchorMs - i * DAY_MS);
		const eligible = (dayRuns.get(iso) ?? []).filter((r) => r.distance_km >= MIN_DISTANCE_FOR_PACE);

		if (eligible.length === 0) {
			days.push({ date: iso, label: iso.split('-')[2], avgCadence: 0, avgStride: 0, hasData: false });
			continue;
		}

		const dist = eligible.reduce((s, r) => s + r.distance_km, 0);
		const wCadence = eligible.reduce((s, r) => s + r.cadence.avg_spm * r.distance_km, 0) / dist;
		const wStride = eligible.reduce((s, r) => s + r.avg_stride_cm * r.distance_km, 0) / dist;

		totalCadence += wCadence * dist;
		totalStride += wStride * dist;
		totalDist += dist;

		days.push({
			date: iso,
			label: iso.split('-')[2],
			avgCadence: Math.round(wCadence),
			avgStride: Math.round(wStride * 10) / 10,
			hasData: true
		});
	}

	return {
		days,
		avgCadence: totalDist > 0 ? Math.round(totalCadence / totalDist) : 0,
		avgStride: totalDist > 0 ? Math.round((totalStride / totalDist) * 10) / 10 : 0
	};
}

function computeRecoveryTrend(list: Runlog[], anchorMs: number): RecoveryTrend {
	// group runs by date, pick last run of each day for recovery
	const dayLastRun = new Map<string, Runlog>();
	// list is sorted newest-first, so iterate in reverse to let earlier entries win, then later overwrite
	for (let i = list.length - 1; i >= 0; i--) {
		dayLastRun.set(list[i].date, list[i]);
	}

	const days: DailyRecoveryPoint[] = [];
	let totalRecovery = 0;
	let count = 0;
	let latestRecovery: { hours: number; date: string } | null = null;

	for (let i = 6; i >= 0; i--) {
		const iso = msToIso(anchorMs - i * DAY_MS);
		const run = dayLastRun.get(iso);
		const hours = run?.performance.recovery_time_hours ?? 0;
		const hasData = !!run && hours > 0;

		if (hasData) {
			totalRecovery += hours;
			count++;
			if (!latestRecovery) latestRecovery = { hours, date: iso };
		}

		days.push({ date: iso, label: iso.split('-')[2], recoveryHours: hasData ? hours : 0, hasData });
	}

	// latestRecovery should be most recent date with data (iterate from end)
	for (let i = days.length - 1; i >= 0; i--) {
		if (days[i].hasData) {
			latestRecovery = { hours: days[i].recoveryHours, date: days[i].date };
			break;
		}
	}

	return {
		days,
		avgRecovery: Math.round(totalRecovery / 7),
		latestRecovery
	};
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
	cadenceStrideTrend: CadenceStrideTrend;
	recoveryTrend: RecoveryTrend;
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
		cadenceStrideTrend: computeCadenceStrideTrend(runs, dateToMs(runs[0].date)),
		recoveryTrend: computeRecoveryTrend(runs, dateToMs(runs[0].date)),
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
