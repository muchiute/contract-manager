import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { ensureAuth } from "../middleware/auth";

export default function (prisma: PrismaClient) {
  const router = Router();

  // 📋 Listar todos os contratos do usuário autenticado
  router.get("/", ensureAuth, async (req: any, res) => {
    try {
      const contracts = await prisma.contract.findMany({
        where: { ownerId: req.user.userId },
        orderBy: { createdAt: "desc" },
      });
      res.json(contracts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao listar contratos." });
    }
  });

  // 🧩 Criar um novo contrato
  router.post("/", ensureAuth, async (req: any, res) => {
    try {
      const { title, clientName, value, description, assignedTo, imageUrl, status } = req.body;

      const contract = await prisma.contract.create({
        data: {
          title,
          clientName,
          value: value ? parseFloat(value) : 0,
          description,
          assignedTo,
          imageUrl,
          status: status || "NEGOTIATION",
          ownerId: req.user.userId,
        },
      });

      res.json(contract);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar contrato." });
    }
  });

  // ✏️ Atualizar um contrato (qualquer campo)
  router.put("/:id", ensureAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { title, clientName, value, description, assignedTo, imageUrl, status } = req.body;

      const updated = await prisma.contract.updateMany({
        where: { id, ownerId: req.user.userId },
        data: { title, clientName, value, description, assignedTo, imageUrl, status },
      });

      res.json({ updated: updated.count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao atualizar contrato." });
    }
  });

  // 🔄 Atualizar apenas o status (Kanban drag & drop)
  router.put("/:id/status", ensureAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await prisma.contract.updateMany({
        where: { id, ownerId: req.user.userId },
        data: { status },
      });

      res.json({ updated: updated.count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao atualizar status." });
    }
  });

  // 🗑️ Excluir contrato
  router.delete("/:id", ensureAuth, async (req: any, res) => {
    try {
      const { id } = req.params;

      const deleted = await prisma.contract.deleteMany({
        where: { id, ownerId: req.user.userId },
      });

      res.json({ deleted: deleted.count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao excluir contrato." });
    }
  });

  return router;
}
