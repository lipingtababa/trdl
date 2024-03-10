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
			// TODO implement the dynamic api
			return new Response('TODO', {headers: {'content-type': 'text/plain'}});
		}

		// Otherwise, return a simple response
		return new Response('42', {headers: {'content-type': 'text/plain'}});
	},
};
