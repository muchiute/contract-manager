import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth"; // ⬅️ ajuste no caminho
import contractRoutes from "./routes/contracts"; // ⬅️ ajuste no caminho
import userRoutes from "./routes/users";

const app = express();
const prisma = new PrismaClient();

// Usuarios
app.use("/users", userRoutes(prisma));

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authRoutes(prisma));
app.use("/contracts", contractRoutes(prisma));

// Rota de teste / health check
app.get("/", (req, res) => {
  res.send("API de Gestão de Contratos rodando 🚀");
});

// Inicializa servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}`);
});
