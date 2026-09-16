import { io, type Socket } from "socket.io-client";
import type {
  BoardState,
  CampaignCharacterLite,
  ChatMessage,
  CheckRequest,
  CombatState,
  InitiativeRequest,
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
  y: number,
  options?: { commit?: boolean }
): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    socket.emit(
      "token:move",
      {
        sessionId,
        tokenId,
        x,
        y,
        commit: options?.commit !== false,
      },
      (response: { ok: boolean; error?: string }) => resolve(response)
    );
  });
}

export function emitTokenRemove(
  socket: Socket,
  sessionId: number,
  tokenIds: string[]
): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    socket.emit(
      "token:remove",
      { sessionId, tokenIds },
      (response: { ok: boolean; error?: string }) =>
        resolve(response ?? { ok: false, error: "Sem resposta" })
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
    tokenId?: string | null;
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

export function emitInitiativeRequest(
  socket: Socket,
  sessionId: number,
  payload: {
    targetCharacterId?: number | null;
    userName: string;
  }
): Promise<{
  ok: boolean;
  error?: string;
  request?: InitiativeRequest;
  combat?: CombatState;
}> {
  return new Promise((resolve) => {
    socket.emit(
      "initiative:request",
      { sessionId, ...payload },
      ((response) =>
        resolve(
          response as {
            ok: boolean;
            error?: string;
            request?: InitiativeRequest;
            combat?: CombatState;
          }
        )) as Ack
    );
  });
}

export function emitInitiativeRoll(
  socket: Socket,
  sessionId: number,
  payload: {
    characterId: number;
    userName: string;
    advantage?: boolean;
  }
): Promise<{
  ok: boolean;
  error?: string;
  message?: ChatMessage;
  combat?: CombatState;
}> {
  return new Promise((resolve) => {
    socket.emit(
      "initiative:roll",
      { sessionId, ...payload },
      ((response) =>
        resolve(
          response as {
            ok: boolean;
            error?: string;
            message?: ChatMessage;
            combat?: CombatState;
          }
        )) as Ack
    );
  });
}

export function emitCombatAdd(
  socket: Socket,
  sessionId: number,
  payload: {
    name: string;
    initiative: number;
    kind?: "monster" | "other";
    tokenId?: string | null;
    userName: string;
  }
): Promise<{ ok: boolean; error?: string; combat?: CombatState }> {
  return new Promise((resolve) => {
    socket.emit(
      "combat:add",
      { sessionId, ...payload },
      ((response) =>
        resolve(response as { ok: boolean; error?: string; combat?: CombatState })) as Ack
    );
  });
}

export function emitCombatRollNpcs(
  socket: Socket,
  sessionId: number,
  payload: {
    entries: Array<{
      tokenId: string;
      name: string;
      dexterity?: number;
    }>;
    userName: string;
  }
): Promise<{ ok: boolean; error?: string; combat?: CombatState }> {
  return new Promise((resolve) => {
    socket.emit(
      "combat:roll-npcs",
      { sessionId, ...payload },
      ((response) =>
        resolve(response as { ok: boolean; error?: string; combat?: CombatState })) as Ack
    );
  });
}

export function emitCombatStart(
  socket: Socket,
  sessionId: number,
  userName: string
): Promise<{ ok: boolean; error?: string; combat?: CombatState }> {
  return new Promise((resolve) => {
    socket.emit(
      "combat:start",
      { sessionId, userName },
      ((response) =>
        resolve(response as { ok: boolean; error?: string; combat?: CombatState })) as Ack
    );
  });
}

export function emitCombatNext(
  socket: Socket,
  sessionId: number,
  userName: string
): Promise<{ ok: boolean; error?: string; combat?: CombatState }> {
  return new Promise((resolve) => {
    socket.emit(
      "combat:next",
      { sessionId, userName },
      ((response) =>
        resolve(response as { ok: boolean; error?: string; combat?: CombatState })) as Ack
    );
  });
}

export function emitCombatReorder(
  socket: Socket,
  sessionId: number,
  orderIds: string[],
  userName: string
): Promise<{ ok: boolean; error?: string; combat?: CombatState }> {
  return new Promise((resolve) => {
    socket.emit(
      "combat:reorder",
      { sessionId, orderIds, userName },
      ((response) =>
        resolve(response as { ok: boolean; error?: string; combat?: CombatState })) as Ack
    );
  });
}

export function emitCombatEnd(
  socket: Socket,
  sessionId: number,
  userName: string
): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    socket.emit(
      "combat:end",
      { sessionId, userName },
      ((response) => resolve(response as { ok: boolean; error?: string })) as Ack
    );
  });
}

export function emitRuler(
  socket: Socket,
  sessionId: number,
  from: { x: number; y: number },
  to: { x: number; y: number },
  options?: {
    sticky?: boolean;
    live?: boolean;
    byUserName?: string;
    shape?: "line" | "square" | "circle" | "cone" | "beam";
    color?: string;
  }
): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    socket.emit(
      "ruler:set",
      {
        sessionId,
        from,
        to,
        sticky: Boolean(options?.sticky),
        live: Boolean(options?.live),
        byUserName: options?.byUserName,
        shape: options?.shape ?? "line",
        color: options?.color,
      },
      (response: { ok: boolean; error?: string }) => resolve(response)
    );
  });
}

export function emitRulerClear(
  socket: Socket,
  sessionId: number,
  options?: { clearAll?: boolean }
): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    socket.emit(
      "ruler:set",
      {
        sessionId,
        clear: !options?.clearAll,
        clearAll: Boolean(options?.clearAll),
      },
      (response: { ok: boolean; error?: string }) => resolve(response)
    );
  });
}

/** Avisa a sala que a ficha/recursos de um personagem mudaram. */
export function emitCharacterUpdated(
  socket: Socket,
  sessionId: number,
  character: CampaignCharacterLite
): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    socket.emit(
      "character:updated",
      { sessionId, character },
      (response: { ok: boolean; error?: string }) =>
        resolve(response ?? { ok: true })
    );
  });
}
