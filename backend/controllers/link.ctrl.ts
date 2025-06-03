import type { Request, Response } from 'express';

import { linkService } from "@/services/link.sv";

class LinkController {
  async getAllLinks(req: Request, res: Response) {
    try {
      const links = await linkService.getAllLinks();
      res.status(200).json(links);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  async getShortenedLink(req: Request, res: Response) {
    try {
      const data = req.body;
      const shortenedLink = await linkService.getShortenedLink(data);
      const shortenedUrl = `${process.env.BACKEND_HOST}/${shortenedLink}`;

      res.status(200).json({ shortenedUrl });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  async redirectLink(req: Request, res: Response) {
    try {
      const { alias } = req.params;
      const link = await linkService.getOriginalLink(alias);

      if (!link) return res.status(404).json({ error: 'Link not found' });

      await this.addStatistics(link.id, req.ip);

      res.redirect(link.url);
    } catch (error) {
      res.status(404).json({ error: 'Link not found' });
    }
  }

  async addStatistics(id: string, ip: string) {
    try {
      await linkService.addStatistics(id, ip);
    } catch (error) {
      console.error('Error adding statistics:', error);
    }
  }

  async getLinkInfo(req: Request, res: Response) {
    try {
      const { alias } = req.params;
      const info = await linkService.getLinkInfo(alias);

      res.status(200).json(info);
    } catch (error) {
      res.status(404).json({ error: 'Link not found' });
    }
  }

  async getStatInfo(req: Request, res: Response) {
    try {
      const { alias } = req.params;
      const info = await linkService.getStatInfo(alias);

      res.status(200).json(info);
    } catch (error) {
      res.status(404).json({ error: 'Link not found' });
    }
  }

  async deleteLink(req: Request, res: Response) {
    try {
      const { alias } = req.params;
      await linkService.deactivateLink(alias);

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      res.status(404).json({ error: 'Link not found' });
    }
  }

  async checkAlias(req: Request, res: Response) {
    try {
      const { alias } = req.params;
      const hasAlias = await linkService.checkAlias(alias);

      res.status(200).json({ isUnique: !hasAlias });
    } catch (error) {
      res.status(404).json({ error: 'Link not found' });
    }
  }
};

export const linkController = new LinkController();