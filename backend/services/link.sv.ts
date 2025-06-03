import { prisma } from '@/libs/prisma';
import type { Link } from '@prisma/client';

type TLinkData = {
  originalUrl: string;
  alias?: string;
  expiresAt?: Date;
};

class LinkService {
  async getShortenedLink(params: TLinkData): Promise<string> {
    const { originalUrl, alias, expiresAt } = params;

    // Find same url
    const links = await prisma.link.findMany({
      where: {
        url: originalUrl,
        isActive: true
      },
      select: {
        id: true,
        expiredAt: true,
        alias: true,
      }
    });

    //Check validity of existing links
    if (links.length > 0) {
      for (let i = 0; i < links.length; i++) {
        const link = links[i];

        if (link.expiredAt && Number(link.expiredAt) < Date.now()) {
          await prisma.link.update({
            where: { id: link.id },
            data: { isActive: false }
          });
        } else {
          return link.alias;
        }
      }
    }

    //Add new link
    const link = await prisma.link.create({
      data: {
        url: originalUrl,
        alias: alias?.replaceAll(' ', "_") || undefined,
        expiredAt: expiresAt
          ? String(new Date(expiresAt).getTime())
          : undefined,
      },
    });

    return link.alias;
  }

  async getOriginalLink(alias: string): Promise<Partial<Link>> {
    //Get active link by alias
    const link = await prisma.link.findFirst({
      where: { alias, isActive: true },
      select: {
        id: true,
        url: true,
        expiredAt: true
      }
    });

    if (!link) return null;

    //If link is expired, set it to inactive
    if (link.expiredAt && Number(link.expiredAt) < Date.now()) {
      await prisma.link.update({
        where: { id: link.id },
        data: { isActive: false }
      });

      return null;
    }

    return link;
  }

  async addStatistics(id: string, ip: string): Promise<void> {
    await prisma.statistic.create({
      data: {
        ip,
        link: { connect: { id } }
      }
    });
  }

  async getAllLinks(): Promise<Partial<Link>[]> {
    return await prisma.link.findMany({
      where: { isActive: true },
      select: {
        id: true,
        alias: true,
      }
    });
  }

  async getLinkInfo(alias: string): Promise<Partial<Link>> {
    const info = await prisma.link.findFirst({
      where: { alias, isActive: true },
      select: {
        id: true,
        url: true,
        createdAt: true,
        _count: {
          select: { statistic: true },
        }
      }
    });

    return info;
  }

  async getStatInfo(alias: string): Promise<Partial<Link>> {
    const stat = await prisma.link.findFirst({
      where: { alias, isActive: true },
      select: {
        id: true,
        statistic: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
        _count: {
          select: { statistic: true },
        }
      }
    });

    return stat;
  }

  async deactivateLink(alias: string): Promise<void> {
    await prisma.link.update({
      where: { alias },
      data: { isActive: false },
    });

    // In you need to delete the link instead of deactivating it
    // await prisma.link.delete({
    //   where: { alias },
    // });
  }

  async checkAlias(alias: string): Promise<boolean> {
    const link = await prisma.link.findUnique({
      where: { alias }
    });

    return Boolean(link);
  }
}

export const linkService = new LinkService();
