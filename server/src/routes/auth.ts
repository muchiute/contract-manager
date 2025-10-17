import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

export default function(prisma: PrismaClient) {
  const router = Router();

  router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email }});
    if (existing) return res.status(400).json({ error: "Email already exists" });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, passwordHash: hash }});
    res.json({ id: user.id, email: user.email });
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }});
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "8h" });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name }});
  });

  return router;
}
