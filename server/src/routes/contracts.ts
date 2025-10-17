import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { ensureAuth } from "../middleware/auth";

export default function(prisma: PrismaClient) {
  const router = Router();

  router.get("/", ensureAuth, async (req: any, res) => {
    const contracts = await prisma.contract.findMany({ where: { ownerId: req.user.userId }});
    res.json(contracts);
  });

  router.post("/", ensureAuth, async (req: any, res) => {
    const { title, clientName, value } = req.body;
    const contract = await prisma.contract.create({
      data: { title, clientName, value: value || 0, ownerId: req.user.userId }
    });
    res.json(contract);
  });

  router.put("/:id/status", ensureAuth, async (req: any, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const contract = await prisma.contract.updateMany({
      where: { id, ownerId: req.user.userId },
      data: { status }
    });
    res.json({ updated: contract.count });
  });

  return router;
}
