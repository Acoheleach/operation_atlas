import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ChatMessage, GameEvent, GameRoom } from "../types/game";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:8081/ws";

export class WebSocketService {
  private client: Client;
  private roomSubscription: StompSubscription | null = null;
  private chatSubscription: StompSubscription | null = null;
  private connected = false;

  constructor(
    private onRoomUpdate: (room: GameRoom) => void,
    private onGameEvent: (event: GameEvent) => void,
    private onChatMessage: (message: ChatMessage) => void,
    private onError: (error: Error) => void
  ) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as any,
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        this.connected = true;
        console.log("WebSocket connected");
      },
      onDisconnect: () => {
        this.connected = false;
        console.log("WebSocket disconnected");
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        this.onError(new Error("WebSocket connection error"));
      },
    });
  }

  connect(): void {
    this.client.activate();
  }

  disconnect(): void {
    if (this.roomSubscription) {
      this.roomSubscription.unsubscribe();
    }
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    this.client.deactivate();
  }

  subscribeToRoom(roomId: string): void {
    if (!this.connected) {
      setTimeout(() => this.subscribeToRoom(roomId), 500);
      return;
    }

    this.roomSubscription = this.client.subscribe(
      `/topic/rooms/${roomId}`,
      (message) => {
        const data = JSON.parse(message.body);

        if (data.type) {
          // C'est un événement
          this.onGameEvent(data as GameEvent);
        } else {
          // C'est un snapshot de room
          this.onRoomUpdate(data as GameRoom);
        }
      }
    );

    this.chatSubscription = this.client.subscribe(
      `/topic/rooms/${roomId}/chat`,
      (message) => {
        const chatMsg = JSON.parse(message.body) as ChatMessage;
        this.onChatMessage(chatMsg);
      }
    );
  }

  sendChatMessage(roomId: string, playerId: string, message: string): void {
    if (!this.connected) {
      console.warn("Cannot send chat: not connected");
      return;
    }

    this.client.publish({
      destination: `/app/rooms/${roomId}/chat`,
      body: JSON.stringify({ playerId, message }),
    });
  }

  submitPuzzle(
    roomId: string,
    continent: string,
    answer: string,
    playerId: string
  ): void {
    if (!this.connected) {
      console.warn("Cannot submit puzzle: not connected");
      return;
    }

    this.client.publish({
      destination: `/app/rooms/${roomId}/puzzle`,
      body: JSON.stringify({ continent, answer, playerId }),
    });
  }

  requestHint(roomId: string, continent: string): void {
    if (!this.connected) {
      console.warn("Cannot request hint: not connected");
      return;
    }

    this.client.publish({
      destination: `/app/rooms/${roomId}/hint`,
      body: JSON.stringify({ continent }),
    });
  }

  submitMeta(roomId: string, answer: string): void {
    if (!this.connected) {
      console.warn("Cannot submit meta: not connected");
      return;
    }

    this.client.publish({
      destination: `/app/rooms/${roomId}/meta`,
      body: JSON.stringify({ answer }),
    });
  }

  submitFinal(roomId: string, answer: string): void {
    if (!this.connected) {
      console.warn("Cannot submit final: not connected");
      return;
    }

    this.client.publish({
      destination: `/app/rooms/${roomId}/final`,
      body: JSON.stringify({ answer }),
    });
  }

  isConnected(): boolean {
    return this.connected;
  }
}
