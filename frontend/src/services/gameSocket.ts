import { io, type Socket } from "socket.io-client";
import type {
  BoardState,
  CampaignCharacterLite,
  ChatMessage,
  CheckRequest,
  SessionRuntimeState,
} from "../types/game";
import { api } from "./api";

function socketBaseUrl(): string {
  const base = api.defaults.baseURL || "http://localhost:3000";
  return base.replace(/\/$/, "");
}

export type JoinSessionResult = {
  ok: boolean;
  error?: string;
  role?: "MASTER" | "PLAYER";
  campaignId?: number;
  campaignName?: string;
  roomCode?: string;
  characters?: CampaignCharacterLite[];
  members?: Array<{
    userId: number;
    role: "MASTER" | "PLAYER";
    name: string;
    email: string;
  }>;
  state?: SessionRuntimeState;
};

type Ack<T = unknown> = (response: T) => void;

export function createGameSocket(): Socket {
  const token = localStorage.getItem("token");
  return io(socketBaseUrl(), {
    autoConnect: false,
    auth: { token },
    transports: ["websocket", "polling"],
  });
}

export function joinSession(
  socket: Socket,
  sessionId: number
): Promise<JoinSessionResult> {
  return new Promise((resolve) => {
    socket.emit("session:join", { sessionId }, (response: JoinSessionResult) => {
      resolve(response ?? { ok: false, error: "Sem resposta do servidor" });
    });
  });
}

export function emitBoardUpdate(
  socket: Socket,
  sessionId: number,
  board: BoardState
): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    socket.emit(
      "board:update",
      { sessionId, board },
      (response: { ok: boolean; error?: string }) => resolve(response)
    );
  });
}

export function emitTokenMove(
  socket: Socket,
  sessionId: number,
  tokenId: string,
  x: number,
  y: number
): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    socket.emit(
      "token:move",
      { sessionId, tokenId, x, y },
      (response: { ok: boolean; error?: string }) => resolve(response)
    );
  });
}

export function emitChatMessage(
  socket: Socket,
  sessionId: number,
  text: string,
  userName: string
): Promise<{ ok: boolean; error?: string; message?: ChatMessage }> {
  return new Promise((resolve) => {
    socket.emit(
      "chat:message",
      { sessionId, text, userName },
      ((response) => resolve(response as { ok: boolean; error?: string; message?: ChatMessage })) as Ack
    );
  });
}

export function emitSheetRoll(
  socket: Socket,
  sessionId: number,
  payload: {
    characterId: number;
    type: "skill" | "ability";
    key: string;
    userName: string;
    advantage?: boolean;
  }
): Promise<{ ok: boolean; error?: string; message?: ChatMessage }> {
  return new Promise((resolve) => {
    socket.emit(
      "chat:roll",
      { sessionId, ...payload },
      ((response) => resolve(response as { ok: boolean; error?: string; message?: ChatMessage })) as Ack
    );
  });
}

export function emitMonsterAction(
  socket: Socket,
  sessionId: number,
  payload: {
    monsterName: string;
    actionName: string;
    description?: string;
    attackBonus?: number | null;
    damage?: string | null;
    abilityModifier?: number | null;
    abilityLabel?: string | null;
    userName: string;
  }
): Promise<{ ok: boolean; error?: string; message?: ChatMessage }> {
  return new Promise((resolve) => {
    socket.emit(
      "chat:monster-action",
      { sessionId, ...payload },
      ((response) =>
        resolve(response as { ok: boolean; error?: string; message?: ChatMessage })) as Ack
    );
  });
}

export function emitCharacterAction(
  socket: Socket,
  sessionId: number,
  payload: {
    characterId: number;
    characterName?: string;
    actionName: string;
    description?: string;
    attackBonus?: number | null;
    damage?: string | null;
    saveDc?: number | null;
    saveLabel?: string | null;
    userName: string;
    advantage?: boolean;
  }
): Promise<{ ok: boolean; error?: string; message?: ChatMessage }> {
  return new Promise((resolve) => {
    socket.emit(
      "chat:character-action",
      { sessionId, ...payload },
      ((response) =>
        resolve(response as { ok: boolean; error?: string; message?: ChatMessage })) as Ack
    );
  });
}

export function emitCheckRequest(
  socket: Socket,
  sessionId: number,
  payload: {
    type: "skill" | "ability";
    key: string;
    targetCharacterId?: number | null;
    userName: string;
  }
): Promise<{ ok: boolean; error?: string; request?: CheckRequest }> {
  return new Promise((resolve) => {
    socket.emit(
      "check:request",
      { sessionId, ...payload },
      ((response) =>
        resolve(response as { ok: boolean; error?: string; request?: CheckRequest })) as Ack
    );
  });
}

export function emitRuler(
  socket: Socket,
  sessionId: number,
  from: { x: number; y: number },
  to: { x: number; y: number }
): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    socket.emit(
      "ruler:set",
      { sessionId, from, to },
      (response: { ok: boolean; error?: string }) => resolve(response)
    );
  });
}
