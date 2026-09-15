import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config";

import authRoutes from "./routes/auth.routes";
import charactersRoutes from "./routes/characters.routes";
import usersRoutes from "./routes/users.routes";
import campaignsRoutes from "./routes/campaigns.routes";
import campaignMembersRoutes from "./routes/campaign-members.routes";
import sessionsRoutes from "./routes/sessions.routes";

import { authMiddleware } from "./middleware/auth.middleware";
import { attachGameSocket } from "./socket/game.gateway";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", (_req, res) => {
  res.json({
    message: "RPG API funcionando!",
  });
});

app.use("/auth", authRoutes);
app.use("/characters", charactersRoutes);
app.use("/users", authMiddleware, usersRoutes);
app.use("/campaigns", authMiddleware, campaignsRoutes);
app.use("/campaigns", authMiddleware, campaignMembersRoutes);
app.use(
  "/campaigns/:campaignId/sessions",
  authMiddleware,
  sessionsRoutes
);

attachGameSocket(server);

server.listen(3000, () => {
  console.log("🚀 API rodando em http://localhost:3000");
});
