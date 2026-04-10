import type { RequestHandler } from './$types';
import { homeCanonicalUrl } from '$lib/seo';

export const prerender = true;

export const GET: RequestHandler = () => {
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${homeCanonicalUrl}</loc>
	</url>
</urlset>`;

	return new Response(body, {
		headers: {
			'cache-control': 'max-age=0, s-maxage=86400',
			'content-type': 'application/xml; charset=utf-8'
		}
	});
};
