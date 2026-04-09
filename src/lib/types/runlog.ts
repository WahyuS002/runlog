export interface Runlog {
	date: string;
	time: string;
	distance_km: number;
	duration: string;
	avg_pace: string;
	avg_pace_seconds: number;
	avg_cadence: number;
	steps: number;
	calories: number;
	avg_speed_kmh: number;
	avg_stride_cm: number;
	avg_hr: number;
	max_hr: number;
	hr_zones_minutes: HrZonesMinutes;
	hr_recovery: HrRecovery;
	performance: Performance;
	pace: Pace;
	cadence: Cadence;
}

export interface HrZonesMinutes {
	extreme: number;
	anaerobic: number;
	aerobic: number;
	fat_burning: number;
	warm_up: number;
}

export interface HrRecovery {
	dropped_bpm: number;
	start_bpm: number;
	end_bpm: number;
	duration_minutes: number;
	time: string;
}

export interface Performance {
	aerobic_training_stress: {
		value: number;
		status:
			| 'maintained'
			| 'productive'
			| 'detraining'
			| 'overreaching'
			| 'unproductive'
			| 'improving'
			| 'recovery';
	} | null;
	vo2max: {
		value: number;
		unit: string;
		status: 'superior' | 'excellent' | 'good' | 'fair' | 'poor';
	};
	recovery_time_hours: number;
}

export interface Pace {
	avg: string;
	fastest: string;
	per_km: PaceSplit[];
}

export interface PaceSplit {
	km: number | 'partial';
	pace: string;
	pace_seconds: number;
}

export interface Cadence {
	avg_spm: number;
	max_spm: number;
}
