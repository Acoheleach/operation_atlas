import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";

const continents = [
  {
    id: "EUROPE",
    name: "Europe",
    emoji: "🗣️",
    color: "#2563eb",
    title: "Serveur Linguistique",
    description: "Déchiffrement linguistique avancé",
    difficulty: "Moyenne",
    status: "En attente",
  },
  {
    id: "ASIA",
    name: "Asie",
    emoji: "🕐",
    color: "#059669",
    title: "Réseau Temporel",
    description: "Synchronisation fuseaux horaires",
    difficulty: "Difficile",
    status: "En attente",
  },
  {
    id: "AMERICAS",
    name: "Amériques",
    emoji: "✈️",
    color: "#d97706",
    title: "Protocole Aérien",
    description: "Règles transport international",
    difficulty: "Moyenne",
    status: "En attente",
  },
];

export const MissionBrief: React.FC = () => {
  const { room, startGame } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes en secondes
  const navigate = useNavigate();

  useEffect(() => {
    if (!room) {
      navigate("/");
      return;
    }

    if (room.stage !== "BRIEF") {
      navigate("/game");
    }
  }, [room, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!room) return null;

  const canStart = room.players.length >= 2;

  const handleStart = () => {
    startGame();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "20px",
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
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 8px;
        }
        
        .status-online { background: #10b981; }
        .status-offline { background: #64748b; }
        
        .server-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%);
          border: 1px solid rgba(71, 85, 105, 0.3);
          border-radius: 8px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        
        .server-card:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
        }
        
        .primary-button {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          border: none;
          border-radius: 8px;
          padding: 16px 32px;
          color: white;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
        }
        
        .primary-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
        }
        
        .primary-button:disabled {
          background: #475569;
          cursor: not-allowed;
          transform: none;
        }
        
        .countdown-critical {
          animation: pulse 1s ease-in-out infinite;
          color: #ef4444;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Principal */}
        <div
          className="dashboard-card"
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            border: "1px solid #dc2626",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "200px",
              height: "200px",
              background:
                "radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  margin: "0 0 8px 0",
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                OPÉRATION ATLAS
              </h1>
              <div
                style={{
                  fontSize: "1rem",
                  color: "#94a3b8",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Dashboard de Mission
              </div>
            </div>

            <div
              style={{
                background: "rgba(220, 38, 38, 0.1)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
                borderRadius: "8px",
                padding: "16px 24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#94a3b8",
                  marginBottom: "4px",
                }}
              >
                TEMPS RESTANT
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  fontFamily: "monospace",
                  color: timeLeft < 300 ? "#ef4444" : "#10b981",
                }}
              >
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "20px",
          }}
        >
          {/* Colonne Principale */}
          <div>
            {/* Section Alerte Urgence */}
            <div
              className="dashboard-card"
              style={{
                background:
                  "linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "#dc2626",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                    fontSize: "18px",
                  }}
                >
                  ⚠️
                </div>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    margin: 0,
                    color: "#f8fafc",
                  }}
                >
                  ALERTE CRITIQUE
                </h2>
              </div>

              <div style={{ lineHeight: "1.6", color: "#cbd5e1" }}>
                <p style={{ marginBottom: "12px" }}>
                  <strong style={{ color: "#dc2626" }}>S.H.A.D.O.W.</strong>{" "}
                  (Sabotage of Heritage And Disruption Of Worldwide Culture)
                  menace de détruire le patrimoine culturel mondial !
                </p>
                <p style={{ marginBottom: "16px" }}>
                  Le virus numérique <strong>"ATLAS-KILLER"</strong> s'activera
                  dans <strong>{formatTime(timeLeft)}</strong> et effacera les
                  archives de musées, bibliothèques et sites culturels de 3
                  continents.
                </p>

                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.3)",
                    borderRadius: "8px",
                    padding: "16px",
                    border: "1px solid rgba(71, 85, 105, 0.5)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      margin: "0 0 12px 0",
                      color: "#f8fafc",
                    }}
                  >
                    OBJECTIF DE MISSION :
                  </h3>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "12px", color: "#3b82f6" }}>
                        🔓
                      </div>
                      <span>
                        Infiltrez les 3 serveurs continentaux de S.H.A.D.O.W.
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "12px", color: "#3b82f6" }}>
                        🧩
                      </div>
                      <span>
                        Récupérez les fragments du mot de passe maître
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "12px", color: "#3b82f6" }}>
                        🔑
                      </div>
                      <span>
                        Reconstituez la clé d'accès au serveur central
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "12px", color: "#3b82f6" }}>
                        ⚡
                      </div>
                      <span>Désactivez le virus en 30 secondes chrono !</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Serveurs */}
            <div className="dashboard-card">
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  margin: "0 0 20px 0",
                  color: "#f8fafc",
                }}
              >
                🌍 SERVEURS CIBLES
              </h2>

              <div style={{ display: "grid", gap: "16px" }}>
                {continents.map((continent, index) => (
                  <div key={continent.id} className="server-card">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            background: `linear-gradient(135deg, ${continent.color} 0%, ${continent.color}99 100%)`,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "24px",
                          }}
                        >
                          {continent.emoji}
                        </div>
                        <div>
                          <h3
                            style={{
                              fontSize: "1.125rem",
                              fontWeight: "600",
                              margin: "0 0 4px 0",
                              color: "#f8fafc",
                            }}
                          >
                            {continent.name}
                          </h3>
                          <div
                            style={{
                              fontSize: "0.875rem",
                              color: "#94a3b8",
                              marginBottom: "8px",
                            }}
                          >
                            {continent.title}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                background: "rgba(71, 85, 105, 0.3)",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                color: "#cbd5e1",
                              }}
                            >
                              Difficulté: {continent.difficulty}
                            </div>
                            <div
                              style={{
                                background: "rgba(59, 130, 246, 0.1)",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                color: "#3b82f6",
                              }}
                            >
                              {continent.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Équipe */}
            <div className="dashboard-card">
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  margin: "0 0 16px 0",
                  color: "#f8fafc",
                }}
              >
                👥 ÉQUIPE ({room.players.length}/4)
              </h2>

              <div style={{ display: "grid", gap: "12px" }}>
                {room.players.map((player) => (
                  <div
                    key={player.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px",
                      background: "rgba(30, 41, 59, 0.6)",
                      borderRadius: "8px",
                      border: "1px solid rgba(71, 85, 105, 0.3)",
                    }}
                  >
                    <div
                      className={`status-indicator ${
                        player.connected ? "status-online" : "status-offline"
                      }`}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "500", color: "#f8fafc" }}>
                        {player.pseudo}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                        {player.connected ? "En ligne" : "Hors ligne"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Mission */}
            <div className="dashboard-card">
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  margin: "0 0 16px 0",
                  color: "#f8fafc",
                }}
              >
                🎯 CODE MISSION
              </h2>

              <div
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "8px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    fontFamily: "monospace",
                    color: "#3b82f6",
                    letterSpacing: "4px",
                  }}
                >
                  {room.joinCode}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#94a3b8",
                    marginTop: "8px",
                  }}
                >
                  Partagez ce code avec votre équipe
                </div>
              </div>
            </div>

            {/* Astuce */}
            <div
              className="dashboard-card"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  margin: "0 0 12px 0",
                  color: "#f8fafc",
                }}
              >
                💡 STRATÉGIE
              </h2>

              <div style={{ color: "#cbd5e1", lineHeight: "1.5" }}>
                Coordonnez-vous via le chat ! Chaque indice demandé coûte 60
                secondes précieuses à votre mission.
              </div>
            </div>

            {/* Bouton Démarrage */}
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="primary-button"
              style={{ width: "100%", marginTop: "20px" }}
            >
              {canStart
                ? `🚀 DÉMARRER LA MISSION (${room.players.length}/4)`
                : `⏳ EN ATTENTE (${room.players.length}/2)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
