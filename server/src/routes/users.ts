import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { ensureAuth } from "../middleware/auth";

export default function (prisma: PrismaClient) {
  const router = Router();

  router.get("/", ensureAuth, async (req: any, res) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true },
      });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Erro ao listar usuários" });
    }
  });

  return router;
}
