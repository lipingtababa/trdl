
export interface Env {
	REGION: string;
	trdl_kv: KVNamespace;
}


export interface ApprovalRate {
	president: string;
	approvalRate: number;
}

async function processApprovalRate(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	const url = new URL(request.url);
	if (url.pathname === '/api/president' && request.method === 'POST') {
		console.log('POST');
		const data: ApprovalRate  = await request.json();
		if (data.president && data.approvalRate) {
			await env.trdl_kv.put(data.president, String(data.approvalRate));
			return new Response('OK', {status: 202, headers: {'Content-Type': 'text/plain'}});
		}
		return new Response('President and ApprovalRate are required', {status: 400, headers: {'content-type': 'text/plain'}});
	}
	else if (url.pathname.startsWith('/api/president/') && request.method === 'GET') {
		// Get the name from /api/presidents/{president name}
		console.log("##### " + url.pathname)
		let key = url.pathname.substring('/api/president/'.length);
		if (key) {
			key = decodeURIComponent(key);
			const value = await env.trdl_kv.get(key);
			if (value) {
				return new Response(value, {status:200, headers: {'content-type': 'text/plain'}});
			}
			return new Response(`${key} Not Found. url is ${url.pathname}`, {status: 404, headers: {'content-type': 'text/plain'}});
		}
		return new Response("Key is required", {status: 400, headers: {'content-type': 'text/plain'}});
	}
	return new Response('Method not supported', {status: 405, headers: {'content-type': 'text/plain'}});
}


export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

		const url = new URL(request.url);
		if (url.pathname === '/ping') {
			// return basic info
			return new Response(JSON.stringify({ region: env.REGION }), {
				headers: {
					'content-type': 'application/json',
				},
			});
		}
		else if (url.pathname.startsWith('/api/president')) {
			return await processApprovalRate(request, env, ctx);
		}
		else{
			// return the magic number 42
			return new Response('42', {headers: {'content-type': 'text/plain'}});
		}		
	},
};
