import { create } from "zustand";
import { api } from "../services/api";
import { WebSocketService } from "../services/websocket";
import { ChatMessage, GameRoom, GameStage } from "../types/game";

interface GameState {
  room: GameRoom | null;
  playerId: string | null;
  pseudo: string | null;
  chatMessages: ChatMessage[];
  error: string | null;
  wsService: WebSocketService | null;
  notification: string | null;
  currentPuzzleIndex: number;

  // Actions
  setRoom: (room: GameRoom) => void;
  setPlayerId: (id: string) => void;
  setPseudo: (pseudo: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  setError: (error: string | null) => void;
  setNotification: (message: string | null) => void;
  updateTimer: (timerSec: number) => void;
  updateStage: (stage: GameStage) => void;
  initWebSocket: () => void;
  disconnectWebSocket: () => void;
  sendChat: (message: string) => void;
  createRoom: (pseudo: string) => Promise<void>;
  joinRoom: (joinCode: string, pseudo: string) => Promise<void>;
  startGame: () => Promise<void>;
  submitPuzzle: (continent: string, answer: string) => Promise<void>;
  requestHint: (continent: string) => Promise<void>;
  submitMeta: (answer: string) => Promise<void>;
  submitFinal: (answer: string) => Promise<void>;
  setCurrentPuzzleIndex: (index: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  room: null,
  playerId: null,
  pseudo: null,
  chatMessages: [],
  error: null,
  wsService: null,
  notification: null,
  currentPuzzleIndex: 0,

  setRoom: (room) => {
    console.log("🔄 Setting room:", room);
    set({ room });
  },

  setPlayerId: (id) => set({ playerId: id }),

  setPseudo: (pseudo) => set({ pseudo }),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),

  setError: (error) => set({ error }),

  setNotification: (notification) => {
    console.log("💬 Notification:", notification);
    set({ notification });
    if (notification) {
      setTimeout(() => set({ notification: null }), 5000);
    }
  },

  updateTimer: (timerSec) =>
    set((state) => ({
      room: state.room ? { ...state.room, timerSec } : null,
    })),

  updateStage: (stage) =>
    set((state) => ({
      room: state.room ? { ...state.room, stage } : null,
    })),

  initWebSocket: () => {
    const { room } = get();
    if (!room) {
      console.error("❌ Cannot init WebSocket: no room");
      return;
    }

    console.log("🔌 Initializing WebSocket for room:", room.id);

    const wsService = new WebSocketService(
      // Mise à jour complète de la room
      (updatedRoom) => {
        console.log("🔄 Full room update received:", updatedRoom);
        set({ room: updatedRoom });
      },

      // Gestion des événements
      (event: any) => {
        console.log("🎮 Game event received:", event);
        const { room } = get();

        switch (event.type) {
          case "TIMER_TICK":
            get().updateTimer(event.timerSec);
            break;

          case "STAGE_CHANGE":
            get().updateStage(event.stage);
            get().setNotification(`Nouveau stage: ${event.stage}`);
            break;

          case "PUZZLE_RESULT":
            if (event.success) {
              get().setNotification(`✅ Puzzle ${event.continent} résolu !`);
              // Mise à jour optimiste de l'état local
              if (room) {
                const continentKey = event.continent
                  .toLowerCase()
                  .substring(0, 2);
                const updatedRoom = {
                  ...room,
                  solved: {
                    ...room.solved,
                    [continentKey]: true,
                  },
                };
                set({ room: updatedRoom });
              }
            } else {
              get().setError(`❌ ${event.errorCode || "Mauvaise réponse"}`);
            }
            break;

          case "HINT_GRANTED":
            get().setNotification(`💡 Indice accordé pour ${event.continent}`);
            get().updateTimer(event.timerSec);
            // Mise à jour optimiste des hints
            if (room) {
              const continentKey = event.continent
                .toLowerCase()
                .substring(0, 2);
              const currentHints = room.hintsUsed[continentKey] || 0;
              const updatedRoom = {
                ...room,
                hintsUsed: {
                  ...room.hintsUsed,
                  [continentKey]: currentHints + 1,
                },
              };
              set({ room: updatedRoom });
            }
            break;

          case "FINAL_RESULT":
            if (event.success) {
              get().setNotification("🎉 Mission accomplie !");
            } else {
              get().setNotification("💥 Échec de la mission finale");
            }
            break;

          default:
            console.log("Unknown event type:", event.type);
        }
      },

      // Messages chat
      (message) => {
        console.log("💬 Chat message:", message);
        get().addChatMessage(message);
      },

      // Erreurs
      (error) => {
        console.error("❌ WebSocket error:", error);
        get().setError("Connexion perdue - tentative de reconnexion...");
      }
    );

    wsService.connect();
    set({ wsService });

    // S'abonner à la room après un court délai
    setTimeout(() => {
      if (wsService.isConnected()) {
        wsService.subscribeToRoom(room.id);
        console.log("✅ Subscribed to room:", room.id);
      } else {
        console.log("⏳ WebSocket not ready, retrying...");
        setTimeout(() => {
          if (wsService.isConnected()) {
            wsService.subscribeToRoom(room.id);
          }
        }, 2000);
      }
    }, 1000);
  },

  disconnectWebSocket: () => {
    const { wsService } = get();
    if (wsService) {
      console.log("🔌 Disconnecting WebSocket");
      wsService.disconnect();
      set({ wsService: null });
    }
  },

  sendChat: (message) => {
    const { wsService, room, playerId } = get();
    if (wsService && room && playerId) {
      console.log("💬 Sending chat message:", message);
      wsService.sendChatMessage(room.id, playerId, message);
    }
  },

  createRoom: async (pseudo) => {
    try {
      console.log("🎮 Creating room with pseudo:", pseudo);
      const response = await api.createRoom(pseudo);
      console.log("✅ Room created:", response);

      set({
        room: response.room,
        playerId: response.playerId,
        pseudo,
        error: null,
      });

      // Initialiser WebSocket
      get().initWebSocket();
    } catch (error: any) {
      console.error("❌ Failed to create room:", error);
      set({ error: error.message });
      throw error;
    }
  },

  joinRoom: async (joinCode, pseudo) => {
    try {
      console.log("🎮 Joining room:", joinCode, "with pseudo:", pseudo);
      const response = await api.joinRoom(joinCode, pseudo);
      console.log("✅ Room joined:", response);

      set({
        room: response.room,
        playerId: response.playerId,
        pseudo,
        error: null,
      });

      // Initialiser WebSocket
      get().initWebSocket();
    } catch (error: any) {
      console.error("❌ Failed to join room:", error);
      set({ error: error.message });
      throw error;
    }
  },

  startGame: async () => {
    const { room } = get();
    if (!room) {
      set({ error: "No room to start" });
      return;
    }

    try {
      console.log("🎮 Starting game for room:", room.id);
      await api.startGame(room.id);
      get().setNotification("🎮 Jeu démarré !");
    } catch (error: any) {
      console.error("❌ Failed to start game:", error);
      set({ error: error.message });
    }
  },

  submitPuzzle: async (continent, answer) => {
    const { wsService, room, playerId } = get();
    if (!room || !playerId) {
      set({ error: "No room or player ID" });
      return;
    }

    try {
      console.log("🎮 Submitting puzzle:", { continent, answer, playerId });

      if (wsService && wsService.isConnected()) {
        // Utiliser WebSocket si disponible
        wsService.submitPuzzle(room.id, continent, answer, playerId);
        get().setNotification(`⏳ Soumission de ${continent}...`);
      } else {
        // Fallback à l'API REST
        await api.submitPuzzle(room.id, continent, answer, playerId);
        get().setNotification(`⏳ Soumission de ${continent}...`);
      }
    } catch (error: any) {
      console.error("❌ Failed to submit puzzle:", error);
      set({ error: error.message });
    }
  },

  requestHint: async (continent) => {
    const { wsService, room } = get();
    if (!room) {
      set({ error: "No room" });
      return;
    }

    try {
      console.log("🎮 Requesting hint for:", continent);

      if (wsService && wsService.isConnected()) {
        wsService.requestHint(room.id, continent);
      } else {
        await api.requestHint(room.id, continent);
      }

      get().setNotification(`💡 Demande d'indice pour ${continent}`);
    } catch (error: any) {
      console.error("❌ Failed to request hint:", error);
      set({ error: error.message });
    }
  },

  submitMeta: async (answer) => {
    const { wsService, room, playerId } = get();
    if (!room || !playerId) {
      set({ error: "No room or player ID" });
      return;
    }

    try {
      console.log("🎮 Submitting meta:", answer);

      if (wsService && wsService.isConnected()) {
        wsService.submitMeta(room.id, answer);
      } else {
        await api.submitMeta(room.id, answer, playerId);
      }

      get().setNotification("⏳ Soumission méta...");
    } catch (error: any) {
      console.error("❌ Failed to submit meta:", error);
      set({ error: error.message });
    }
  },

  submitFinal: async (answer) => {
    const { wsService, room, playerId } = get();
    if (!room || !playerId) {
      set({ error: "No room or player ID" });
      return;
    }

    try {
      console.log("🎮 Submitting final:", answer);

      if (wsService && wsService.isConnected()) {
        wsService.submitFinal(room.id, answer);
      } else {
        await api.submitFinal(room.id, answer, playerId);
      }

      get().setNotification("⏳ Soumission finale...");
    } catch (error: any) {
      console.error("❌ Failed to submit final:", error);
      set({ error: error.message });
    }
  },

  setCurrentPuzzleIndex: (index: number) => set({ currentPuzzleIndex: index }),
}));
