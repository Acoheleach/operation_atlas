import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { GameStage } from "../types/game";
import { Final } from "./Final";
import { Meta } from "./Meta";
import { PuzzleAfrica } from "./PuzzleAfrica";
import { PuzzleAmericas } from "./PuzzleAmericas";
import { PuzzleAntarctica } from "./PuzzleAntarctica";
import { PuzzleAsia } from "./PuzzleAsia";
import { PuzzleEurope } from "./PuzzleEurope";
import { PuzzleOceania } from "./PuzzleOceania";

type Destination =
  | "EUROPE"
  | "ASIA"
  | "AMERICAS"
  | "AFRICA"
  | "OCEANIA"
  | "ANTARCTICA"
  | "META"
  | "FINAL";

const allContinentInfo: Record<
  string,
  { name: string; emoji: string; color: string; bg: string }
> = {
  EUROPE: {
    name: "Europe",
    emoji: "🇪🇺",
    color: "#2563eb",
    bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  },
  ASIA: {
    name: "Asie",
    emoji: "🌏",
    color: "#059669",
    bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  },
  AMERICAS: {
    name: "Amériques",
    emoji: "✈️",
    color: "#d97706",
    bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  },
  AFRICA: {
    name: "Afrique",
    emoji: "🌍",
    color: "#dc2626",
    bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  },
  OCEANIA: {
    name: "Océanie",
    emoji: "🏝️",
    color: "#7c3aed",
    bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  },
  ANTARCTICA: {
    name: "Antarctique",
    emoji: "🧊",
    color: "#0891b2",
    bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  },
  META: {
    name: "Synthèse",
    emoji: "🧩",
    color: "#8b5cf6",
    bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  },
  FINAL: {
    name: "Mission Finale",
    emoji: "🎯",
    color: "#dc2626",
    bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  },
};

export const GameJourney: React.FC = () => {
  const { room, chatMessages, sendChat, notification, error, setError } =
    useGameStore();
  const [currentDestination, setCurrentDestination] =
    useState<Destination | null>(null);
  const [nextDestination, setNextDestination] = useState<Destination | null>(
    null
  );
  const [chatInput, setChatInput] = useState("");
  const [showTransition, setShowTransition] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!room) {
      navigate("/");
      return;
    }

    if (room.stage === GameStage.DEBRIEF) {
      navigate("/debrief");
    }
  }, [room, navigate]);

  useEffect(() => {
    if (!room || !room.draw || room.draw.length === 0) return;

    if (room.stage === GameStage.META) {
      if (currentDestination !== "META") {
        triggerTransition("META");
      }
    } else if (room.stage === GameStage.FINAL) {
      if (currentDestination !== "FINAL") {
        triggerTransition("FINAL");
      }
    } else if (room.stage === GameStage.PLAY) {
      const drawnContinents = room.draw as Destination[];
      for (let i = 0; i < drawnContinents.length; i++) {
        const continent = drawnContinents[i];
        const continentKey = continent.toLowerCase().substring(0, 2);
        if (!room.solved[continentKey]) {
          if (currentDestination !== continent) {
            if (currentDestination === null) {
              setCurrentDestination(continent);
            } else {
              triggerTransition(continent);
            }
          }
          return;
        }
      }
    }
  }, [room?.stage, room?.solved, room?.draw]);

  const triggerTransition = (destination: Destination) => {
    setNextDestination(destination);
    setShowTransition(true);
    setTimeout(() => {
      setCurrentDestination(destination);
      setShowTransition(false);
      setNextDestination(null);
    }, 1500);
  };

  if (!room || !currentDestination) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChat(chatInput);
    setChatInput("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const destinations = [
    ...(room.draw || []).map((continent) => ({
      id: continent,
      ...allContinentInfo[continent],
    })),
    { id: "META", ...allContinentInfo.META },
    { id: "FINAL", ...allContinentInfo.FINAL },
  ];

  const currentDest = allContinentInfo[currentDestination];
  const completedCount = (room.draw || []).filter((continent: string) => {
    const key = continent.toLowerCase().substring(0, 2);
    return room.solved[key];
  }).length;

  let currentPosition = completedCount + 1;
  if (currentDestination === "META") {
    currentPosition = 4;
  } else if (currentDestination === "FINAL") {
    currentPosition = 5;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "24px",
        fontFamily: '"Poppins", sans-serif',
        color: "#f8fafc",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        .dashboard-card {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .server-tag {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(71, 85, 105, 0.3);
          border-radius: 8px;
          padding: 12px 16px;
          color: #f8fafc;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .server-tag:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
        }
        
        .primary-button {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }
        
        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
        }
        
        .chat-input {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 8px;
          padding: 12px 16px;
          color: #f8fafc;
          font-family: 'Poppins', sans-serif;
          width: 100%;
          outline: none;
          transition: all 0.3s ease;
        }
        
        .chat-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        .progress-step {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          border: 2px solid rgba(71, 85, 105, 0.5);
          transition: all 0.3s ease;
          position: relative;
        }
        
        .progress-step.active {
          border-color: #3b82f6;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          transform: scale(1.1);
        }
        
        .progress-step.completed {
          background: #10b981;
          border-color: #10b981;
        }
        
        .timer-critical {
          animation: pulse 1s ease-in-out infinite;
          color: #ef4444;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .flex-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .flex-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .text-success { color: #10b981; }
        .text-warning { color: #f59e0b; }
        .text-danger { color: #ef4444; }
        .text-info { color: #3b82f6; }
        .text-muted { color: #94a3b8; }
        
        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 24px;
        }
        
        @media (max-width: 1024px) {
          .grid-2-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Transition Overlay */}
      {showTransition && nextDestination && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            fontFamily: '"Poppins", sans-serif',
          }}
        >
          <div style={{ textAlign: "center", color: "white" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
              {allContinentInfo[nextDestination]?.emoji}
            </div>
            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "0.5rem",
                color: "#94a3b8",
              }}
            >
              Transition de mission
            </h2>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              {allContinentInfo[nextDestination]?.name}
            </h1>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header avec Progression */}
        <div className="dashboard-card">
          <div
            className="flex-between"
            style={{ flexWrap: "wrap", gap: "24px" }}
          >
            <div>
              <h1
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "700",
                  margin: "0 0 8px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "2rem" }}>{currentDest.emoji}</span>
                {currentDest.name}
              </h1>
              <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
                Phase {currentPosition} sur 5 • Opération Atlas
              </div>
            </div>

            {/* Timer */}
            <div
              style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(71, 85, 105, 0.5)",
                borderRadius: "8px",
                padding: "16px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#94a3b8",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                TEMPS RESTANT
              </div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "700",
                  fontFamily: "monospace",
                  color:
                    room.timerSec < 60
                      ? "#ef4444"
                      : room.timerSec < 300
                      ? "#f59e0b"
                      : "#10b981",
                }}
              >
                {formatTime(room.timerSec)}
              </div>
            </div>

            {/* Barre de Progression */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {destinations.map((dest, idx) => {
                let isCompleted = false;
                let isActive = currentDestination === dest.id;

                if (dest.id === "META" || dest.id === "FINAL") {
                  isCompleted = false;
                } else {
                  const continentKey = dest.id.toLowerCase().substring(0, 2);
                  isCompleted = room.solved[continentKey] || false;
                }

                return (
                  <div
                    key={dest.id}
                    className={`progress-step ${isActive ? "active" : ""} ${
                      isCompleted ? "completed" : ""
                    }`}
                    title={dest.name}
                    style={{
                      background: isCompleted
                        ? "#10b981"
                        : isActive
                        ? dest.color
                        : "transparent",
                      color: isCompleted
                        ? "white"
                        : isActive
                        ? "white"
                        : "#94a3b8",
                    }}
                  >
                    {isCompleted ? "✓" : dest.emoji}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenu Principal */}
        <div className="grid-2-col">
          <div>
            {currentDestination === "EUROPE" && <PuzzleEurope />}
            {currentDestination === "ASIA" && <PuzzleAsia />}
            {currentDestination === "AMERICAS" && <PuzzleAmericas />}
            {currentDestination === "AFRICA" && <PuzzleAfrica />}
            {currentDestination === "OCEANIA" && <PuzzleOceania />}
            {currentDestination === "ANTARCTICA" && <PuzzleAntarctica />}
            {currentDestination === "META" && <Meta />}
            {currentDestination === "FINAL" && <Final />}
          </div>

          {/* Sidebar */}
          <div>
            {/* Équipe */}
            <div className="dashboard-card">
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  margin: "0 0 16px 0",
                  color: "#44BDFF",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                👥 ÉQUIPE ({room.players.length}/4)
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {room.players.map((player) => (
                  <div
                    key={player.id}
                    className="server-tag"
                    style={{
                      background: player.connected
                        ? "rgba(16, 185, 129, 0.1)"
                        : "rgba(71, 85, 105, 0.3)",
                      borderColor: player.connected
                        ? "rgba(16, 185, 129, 0.3)"
                        : "rgba(71, 85, 105, 0.5)",
                      opacity: player.connected ? 1 : 0.6,
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: player.connected ? "#10b981" : "#64748b",
                        marginRight: "8px",
                      }}
                    />
                    {player.pseudo}
                    {!player.connected && (
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                        }}
                      >
                        hors ligne
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="dashboard-card">
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  margin: "0 0 16px 0",
                  color: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                💬 COMMUNICATION
              </h3>

              <div
                style={{
                  height: "300px",
                  overflowY: "auto",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(71, 85, 105, 0.3)",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
                role="log"
                aria-live="polite"
              >
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{ fontSize: "0.875rem" }}>
                    <strong style={{ color: "#3b82f6" }}>{msg.pseudo}:</strong>{" "}
                    <span style={{ color: "#cbd5e1" }}>{msg.message}</span>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSendChat}
                style={{ display: "flex", gap: "8px" }}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Envoyer un message..."
                  maxLength={200}
                  className="chat-input"
                  aria-label="Message de chat"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="primary-button"
                  style={{ minWidth: "60px" }}
                >
                  →
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            background: "rgba(16, 185, 129, 0.9)",
            color: "white",
            padding: "16px 20px",
            borderRadius: "8px",
            border: "1px solid rgba(16, 185, 129, 0.5)",
            backdropFilter: "blur(10px)",
            zIndex: 1000,
            animation: "slideInRight 0.3s ease-out",
          }}
          role="alert"
        >
          {notification}
        </div>
      )}

      {error && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            background: "rgba(239, 68, 68, 0.9)",
            color: "white",
            padding: "16px 20px",
            borderRadius: "8px",
            border: "1px solid rgba(239, 68, 68, 0.5)",
            backdropFilter: "blur(10px)",
            zIndex: 1000,
            animation: "slideInRight 0.3s ease-out",
          }}
          role="alert"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
              }}
              aria-label="Fermer l'erreur"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
