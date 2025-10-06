import { create } from 'zustand';
import { GameRoom, ChatMessage, GameStage } from '../types/game';
import { WebSocketService } from '../services/websocket';
import { api } from '../services/api';

interface GameState {
  room: GameRoom | null;
  playerId: string | null;
  pseudo: string | null;
  chatMessages: ChatMessage[];
  error: string | null;
  wsService: WebSocketService | null;
  notification: string | null;

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
}

export const useGameStore = create<GameState>((set, get) => ({
  room: null,
  playerId: null,
  pseudo: null,
  chatMessages: [],
  error: null,
  wsService: null,
  notification: null,

  setRoom: (room) => set({ room }),

  setPlayerId: (id) => set({ playerId: id }),

  setPseudo: (pseudo) => set({ pseudo }),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message]
    })),

  setError: (error) => set({ error }),

  setNotification: (notification) => {
    set({ notification });
    if (notification) {
      setTimeout(() => set({ notification: null }), 5000);
    }
  },

  updateTimer: (timerSec) =>
    set((state) => ({
      room: state.room ? { ...state.room, timerSec } : null
    })),

  updateStage: (stage) =>
    set((state) => ({
      room: state.room ? { ...state.room, stage } : null
    })),

  initWebSocket: () => {
    const wsService = new WebSocketService(
      (room) => {
        set({ room });
      },
      (event) => {
        const { room } = get();
        if (event.type === 'TIMER_TICK') {
          get().updateTimer(event.timerSec);
        } else if (event.type === 'STAGE_CHANGE') {
          get().updateStage(event.stage);
          get().setNotification(`Stage changé: ${event.stage}`);
        } else if (event.type === 'PUZZLE_RESULT') {
          if (event.success) {
            get().setNotification(`Puzzle ${event.continent} résolu!`);
          } else {
            get().setError(event.errorCode || 'Erreur inconnue');
          }
        } else if (event.type === 'HINT_GRANTED') {
          get().setNotification(`Indice accordé pour ${event.continent} (-60s)`);
          get().updateTimer(event.timerSec);
        } else if (event.type === 'FINAL_RESULT') {
          if (event.success) {
            get().setNotification('Mission accomplie!');
          } else {
            get().setNotification('Échec de la mission finale');
          }
        }
      },
      (message) => {
        get().addChatMessage(message);
      },
      (error) => {
        console.error('WebSocket error:', error);
        get().setError('Erreur de connexion WebSocket');
      }
    );

    wsService.connect();
    set({ wsService });
  },

  disconnectWebSocket: () => {
    const { wsService } = get();
    if (wsService) {
      wsService.disconnect();
      set({ wsService: null });
    }
  },

  sendChat: (message) => {
    const { wsService, room, playerId } = get();
    if (wsService && room && playerId) {
      wsService.sendChatMessage(room.id, playerId, message);
    }
  },

  createRoom: async (pseudo) => {
    try {
      const response = await api.createRoom(pseudo);
      set({
        room: response.room,
        playerId: response.playerId,
        pseudo
      });

      get().initWebSocket();
      const { wsService, room } = get();
      if (wsService && room) {
        wsService.subscribeToRoom(room.id);
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  joinRoom: async (joinCode, pseudo) => {
    try {
      const response = await api.joinRoom(joinCode, pseudo);
      set({
        room: response.room,
        playerId: response.playerId,
        pseudo
      });

      get().initWebSocket();
      const { wsService, room } = get();
      if (wsService && room) {
        wsService.subscribeToRoom(room.id);
      }
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  startGame: async () => {
    const { room } = get();
    if (!room) return;

    try {
      await api.startGame(room.id);
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  submitPuzzle: async (continent, answer) => {
    const { wsService, room, playerId } = get();
    if (!room || !playerId) return;

    try {
      if (wsService && wsService.isConnected()) {
        wsService.submitPuzzle(room.id, continent, answer, playerId);
      } else {
        await api.submitPuzzle(room.id, continent, answer, playerId);
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  requestHint: async (continent) => {
    const { wsService, room } = get();
    if (!room) return;

    try {
      if (wsService && wsService.isConnected()) {
        wsService.requestHint(room.id, continent);
      } else {
        await api.requestHint(room.id, continent);
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  submitMeta: async (answer) => {
    const { wsService, room, playerId } = get();
    if (!room || !playerId) return;

    try {
      if (wsService && wsService.isConnected()) {
        wsService.submitMeta(room.id, answer);
      } else {
        await api.submitMeta(room.id, answer, playerId);
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  submitFinal: async (answer) => {
    const { wsService, room, playerId } = get();
    if (!room || !playerId) return;

    try {
      if (wsService && wsService.isConnected()) {
        wsService.submitFinal(room.id, answer);
      } else {
        await api.submitFinal(room.id, answer, playerId);
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  }
}));
