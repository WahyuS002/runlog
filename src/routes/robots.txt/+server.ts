import type { RequestHandler } from './$types';
import { absoluteUrl } from '$lib/seo';

export const prerender = true;

export const GET: RequestHandler = () => {
	const body = [`User-agent: *`, `Allow: /`, ``, `Sitemap: ${absoluteUrl('/sitemap.xml')}`].join(
		'\n'
	);

	return new Response(body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8'
		}
	});
};
