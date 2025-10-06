export enum GameStage {
  BRIEF = 'BRIEF',
  PLAY = 'PLAY',
  META = 'META',
  FINAL = 'FINAL',
  DEBRIEF = 'DEBRIEF',
  CLOSED = 'CLOSED'
}

export interface Player {
  id: string;
  pseudo: string;
  role: string;
  connected: boolean;
}

export interface GameRoom {
  id: string;
  joinCode: string;
  stage: GameStage;
  timerSec: number;
  draw: string[];
  solved: Record<string, boolean>;
  hintsUsed: Record<string, number>;
  fragments: Record<string, string>;
  players: Player[];
  version: number;
}

export interface ChatMessage {
  playerId: string;
  pseudo: string;
  message: string;
  timestamp: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  timestamp: number;
}

export interface PuzzleResult {
  type: 'PUZZLE_RESULT';
  continent: string;
  success: boolean;
  errorCode?: string;
}

export interface TimerTick {
  type: 'TIMER_TICK';
  timerSec: number;
}

export interface StageChange {
  type: 'STAGE_CHANGE';
  stage: GameStage;
}

export interface HintGranted {
  type: 'HINT_GRANTED';
  continent: string;
  timerSec: number;
}

export interface FinalResult {
  type: 'FINAL_RESULT';
  success: boolean;
}

export type GameEvent = PuzzleResult | TimerTick | StageChange | HintGranted | FinalResult;
