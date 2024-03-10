import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { JsonSchema } from 'miniflare';

describe('Worker', () => {
	let worker: UnstableDevWorker;

	beforeAll(async () => {
		worker = await unstable_dev('src/index.ts', {
			experimental: { disableExperimentalWarning: true },
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it('should return 200 response', async () => {
		const resp = await worker.fetch();
		expect(resp.status).toBe(200);
	});

	it('should return the text 42', async () => {
		const resp = await worker.fetch();
		const text = await resp.text();
		expect(text).toBe('42');
	});

	it('should return a json with region info', async () => {
		const resp = await worker.fetch("/ping");
		const text = await resp.text();
		expect(text).toBe('{"region":"CLOUDFLARE"}');
	});

	it('should return a TODO', async () => {
		const resp = await worker.fetch("/api?finished=false");
		const text = await resp.text();
		expect(text).toBe('TODO');
	});

});
