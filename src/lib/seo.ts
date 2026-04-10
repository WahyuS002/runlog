export const siteSeo = {
	authorName: 'Wahyu Syahputra',
	siteName: 'Runlog by Wahyu Syahputra',
	defaultTitle: 'Wahyu Syahputra Running Log & Training Dashboard',
	titleTemplate: '%s | Runlog by Wahyu Syahputra',
	defaultDescription:
		'Personal running log and training dashboard by Wahyu Syahputra, featuring weekly mileage, recent sessions, pace, heart rate, cadence, and recovery insights.',
	locale: 'en_US',
	canonicalBase: 'https://runlog.wahyusyahputra.com',
	siteUrl: 'https://runlog.wahyusyahputra.com',
	socialImagePath: '/og/runlog-home.png',
	socialImageAlt: 'Preview card for Runlog by Wahyu Syahputra',
	faviconPath: '/favicon.ico',
	themeColor: '#0072f5'
} as const;

export const homeSeo = {
	path: '/',
	title: siteSeo.defaultTitle,
	description: siteSeo.defaultDescription
} as const;

export function buildPageTitle(title: string): string {
	return siteSeo.titleTemplate.replace('%s', title);
}

export function absoluteUrl(path = '/'): string {
	return new URL(path, siteSeo.siteUrl).toString();
}

export const homeCanonicalUrl = absoluteUrl(homeSeo.path);
export const homeSocialImageUrl = absoluteUrl(siteSeo.socialImagePath);

export const homeStructuredData = [
	{
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: siteSeo.authorName,
		url: homeCanonicalUrl,
		mainEntityOfPage: homeCanonicalUrl,
		description: homeSeo.description
	},
	{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: siteSeo.siteName,
		alternateName: 'Runlog',
		url: homeCanonicalUrl,
		description: homeSeo.description,
		inLanguage: 'en'
	}
] as const;
