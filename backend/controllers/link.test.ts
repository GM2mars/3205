import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import request from 'supertest';
import express, { type Request, type Response } from 'express';

import { linkService } from '@/services/link.sv';

import { linkController } from './link.ctrl';

vi.mock('@/services/link.sv', () => ({
  linkService: {
    getOriginalLink: vi.fn()
  }
}));

const app = express();

app.get('/:alias', async (req: Request, res: Response) => {
  await linkController.redirectLink(req, res);
});

describe('linkController.redirectLink', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    linkController.addStatistics = vi.fn().mockResolvedValue(() => Promise.resolve());
  });

  it('should return 302 and a Location header with the original URL when the link is found', async () => {
    const alias = 'test-alias';
    const originalUrl = 'https://example.com/page';

    (linkService.getOriginalLink as Mock).mockResolvedValue({
      id: 42,
      url: originalUrl,
      expiredAt: null
    });

    const response = await request(app).get(`/${alias}`);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(originalUrl);
    expect((linkController as any).addStatistics).toHaveBeenCalledTimes(1);
    expect((linkController as any).addStatistics).toHaveBeenCalledWith(42, expect.any(String));
  });

  it('should return 404 with a JSON error if the link is not found', async () => {
    const alias = 'no-such-alias';

    (linkService.getOriginalLink as Mock).mockResolvedValue(null);

    const response = await request(app).get(`/${alias}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Link not found' });
    expect((linkController as any).addStatistics).not.toHaveBeenCalled();
  });

  it('should return 404 when the service throws an exception', async () => {
    const alias = 'error-alias';

    (linkService.getOriginalLink as Mock).mockRejectedValue(new Error('DB error'));

    const response = await request(app).get(`/${alias}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Link not found' });

    expect((linkController as any).addStatistics).not.toHaveBeenCalled();
  });
});
