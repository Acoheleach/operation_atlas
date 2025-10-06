import { GameRoom } from '../types/game';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export interface CreateRoomResponse {
  room: GameRoom;
  playerId: string;
}

export interface JoinRoomResponse {
  room: GameRoom;
  playerId: string;
}

export const api = {
  async createRoom(pseudo: string): Promise<CreateRoomResponse> {
    const response = await fetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create room');
    }

    return response.json();
  },

  async joinRoom(joinCode: string, pseudo: string): Promise<JoinRoomResponse> {
    const response = await fetch(`${API_BASE}/rooms/${joinCode}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo, joinCode })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to join room');
    }

    return response.json();
  },

  async getRoomState(roomId: string, since?: number): Promise<GameRoom | null> {
    const url = since !== undefined
      ? `${API_BASE}/rooms/${roomId}/state?since=${since}`
      : `${API_BASE}/rooms/${roomId}/state`;

    const response = await fetch(url);

    if (response.status === 204) {
      return null; // No changes
    }

    if (!response.ok) {
      throw new Error('Failed to get room state');
    }

    return response.json();
  },

  async startGame(roomId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/rooms/${roomId}/start`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Failed to start game');
    }
  },

  async submitPuzzle(roomId: string, continent: string, answer: string, playerId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/rooms/${roomId}/puzzle/${continent}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer, playerId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit puzzle');
    }
  },

  async requestHint(roomId: string, continent: string): Promise<void> {
    const response = await fetch(`${API_BASE}/rooms/${roomId}/hint/${continent}`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Failed to request hint');
    }
  },

  async submitMeta(roomId: string, answer: string, playerId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/rooms/${roomId}/meta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer, playerId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit meta');
    }
  },

  async submitFinal(roomId: string, answer: string, playerId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/rooms/${roomId}/final`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer, playerId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit final');
    }
  }
};
