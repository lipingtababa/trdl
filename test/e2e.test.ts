import { describe, expect, it } from 'vitest';

describe('E2E', () => {
    it('should return 42', async () => {
            const resp = await fetch('http://127.0.0.1:12345/');
            const text = await resp.text();
            expect(text).toBe('42');
            expect(resp.status).toBe(200);
    });

    it('should return a json with region info', async () => {
            const resp = await fetch("http://127.0.0.1:12345/ping");
            const text = await resp.text();
            expect(text).toBe('{"region":"CLOUDFLARE"}');
    });

    it('should return 45', async () => {
        const resp = await fetch('http://127.0.0.1:12345/api?president=Donald J. Trump');
        const text = await resp.text();
        expect(text).toBe('45');
    });

    it('should return an 404 status code', async () => {
        const resp = await fetch("http://127.0.0.1:12345/api?president=McCain");
        const text = await resp.status;
        expect(text).toBe(404);
        });

    it('should return an 400 status code', async () => {
            const resp = await fetch("http://127.0.0.1:12345/api?king=Obama");
            const text = await resp.status;
            expect(text).toBe(400);
    });
});