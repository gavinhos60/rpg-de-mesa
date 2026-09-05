import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import charactersRoutes from "./routes/characters.routes";
import usersRoutes from "./routes/users.routes";
import campaignsRoutes from "./routes/campaigns.routes";
import campaignMembersRoutes from "./routes/campaign-members.routes";

import { authMiddleware } from "./middleware/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "RPG API funcionando!",
  });
});

// Autenticação
app.use("/auth", authRoutes);

// Personagens
// O authMiddleware já está dentro de characters.routes.ts
app.use("/characters", charactersRoutes);

// Usuários
app.use(
  "/users",
  authMiddleware,
  usersRoutes
);

// Campanhas
app.use(
  "/campaigns",
  authMiddleware,
  campaignsRoutes
);

// Membros das campanhas
app.use(
  "/campaigns",
  authMiddleware,
  campaignMembersRoutes
);

app.listen(3000, () => {
  console.log(
    "🚀 API rodando em http://localhost:3000"
  );
});