
import { describe, expect, it } from 'vitest';
import handler from './index';

describe('Worker', async () => {

    const env: any = { 
                trdl_kv: { get: async () => { throw Error("Can't connect to KV") } },
                REGION: 'CLOUDFLARE'
            };
    const ctx:any = {};

	it('should return 42', async () => {
        const request = new Request('http://localhost/', {method: 'GET'});
		const resp = await handler.fetch(request, env, ctx);
		expect(resp.status).toBe(200);
		expect(await resp.text()).toBe('42');
	});

    it('should return region info', async () => {
            const request = new Request('http://localhost/ping', {method: 'GET'});
            const resp = await handler.fetch(request, env, ctx);
            expect(resp.status).toBe(200);
            expect(await resp.text()).toBe('{"region":"CLOUDFLARE"}');
    });

    it('should return 500', async () => {
        const request = new Request('http://localhost/api/president/George Washington', {method: 'GET'});

        const resp = await handler.fetch(request, env, ctx);
        expect(resp.status).toBe(500);
    });
});
