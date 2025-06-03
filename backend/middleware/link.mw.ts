import type { Request, Response, } from "express";

export const validateUrl = (req: Request, res: Response, next) => {
  try {
    const { originalUrl } = req.body;

    new URL(originalUrl);

    next();
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
};
