/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	REGION: string;
	trdl_kv: KVNamespace;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

		const url = new URL(request.url);
		if (url.pathname === '/ping') {
			// rerurn a json response with the region
			return new Response(JSON.stringify({ region: env.REGION }), {
				headers: {
					'content-type': 'application/json',
				},
			});
		}
		else if (url.pathname.startsWith('/api')) {
			let statusCode = 400;
			let key = url.searchParams.get('president');
			if (key) {
				statusCode = 404;
				key = decodeURIComponent(key);
				console.log(key);
				const value = await env.trdl_kv.get(key);
				console.log(await env.trdl_kv.list());
				if (value) {
					statusCode = 200;
					return new Response(value, {headers: {'content-type': 'text/plain'}});
				}
				return new Response(`${key} Not Found`, {status: statusCode, headers: {'content-type': 'text/plain'}});
			}
			return new Response("Key is required", {status: statusCode, headers: {'content-type': 'text/plain'}});
		}

		// Otherwise, return a simple response
		return new Response('42', {headers: {'content-type': 'text/plain'}});
	},
};
