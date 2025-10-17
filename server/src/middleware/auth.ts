import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function ensureAuth(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  const parts = auth.split(" ");
  if (parts.length !== 2) return res.status(401).json({ error: "Bad token" });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret") as any;
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
