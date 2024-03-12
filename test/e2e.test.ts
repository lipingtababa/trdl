import { describe, expect, it } from 'vitest';

describe('STATIC', () => {
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
});


describe('DYNAMIC', () => {

    const donaldApprovalRate = 45;
    const donaldJson = JSON.stringify({president: "Donald J. Trump", approvalRate: donaldApprovalRate});
    const illDonaldJson = JSON.stringify({king: "Donald J. Trump", approvalRate: donaldApprovalRate});


    it('should accept correct input', async () => {
                    const resp = await fetch('http://127.0.0.1:12345/api/president',
                                            {
                                                method: "POST",
                                                headers: {'Content-Type': 'application/json'},
                                                body: donaldJson
                                            });
                    const statusCode = resp.status;
                    expect(statusCode).toBe(202);
                    expect(await resp.text()).toBe('OK');
                    expect(resp.headers.get('Content-Type')).toBe('text/plain');
    });

    it('should refuse invalid input', async () => {
                    const resp = await fetch('http://127.0.0.1:12345/api/president',
                                            {
                                                method: "POST",
                                                headers: {'Content-Type': 'application/json'},
                                                body: illDonaldJson
                                            });
                    const statusCode = resp.status;
                    expect(statusCode).toBe(400);
                    expect(await resp.text()).toBe('President and ApprovalRate are required');
                    expect(resp.headers.get('Content-Type')).toBe('text/plain');
        });

    it('should decline unsupported POST requests', async () => {
                    const resp = await fetch('http://127.0.0.1:12345/api/president/Donald J. Trump',
                                            {
                                                method: "POST",
                                                headers: {'Content-Type': 'application/json'},
                                                body: JSON.stringify({approvalRate: 45})
                                            });
                    const statusCode = resp.status;
                    expect(statusCode).toBe(405);
    });

    it('should return 45', async () => {
                const resp = await fetch('http://127.0.0.1:12345/api/president/Donald J. Trump');
                const text = await resp.text();
                expect(text).toBe(donaldApprovalRate.toString());
            });

    it('should return an 404 if not found', async () => {
        const resp = await fetch("http://127.0.0.1:12345/api/president/McCain");
        expect(resp.status).toBe(404);
    });

    it('should decline GET request with a name as a parameter', async () => {
            const resp = await fetch("http://127.0.0.1:12345/api/president?president=Obama");
            expect(resp.status).toBe(405);
    });

    it('should decline GET request without a name', async () => {
                const resp = await fetch("http://127.0.0.1:12345/api/president/");
                expect(resp.status).toBe(400);
    });
});
