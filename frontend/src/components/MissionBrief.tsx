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
        background: "#44bdff",
        padding: "20px",
        fontFamily: '"Poppins", sans-serif',
        color: "#1e293b",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        .dashboard-card {
          background: #FFFFFF;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 8px;
        }
        
        .status-online { background: #10b981; }
        .status-offline { background: #94a3b8; }
        
        .server-card {
          background: #FFFFFF;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        
        .server-card:hover {
          border-color: #44bdff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(68, 189, 255, 0.15);
        }
        
        .primary-button {
          background: linear-gradient(135deg, #44bdff 0%, #1d9bf0 100%);
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
          box-shadow: 0 8px 25px rgba(68, 189, 255, 0.3);
        }
        
        .primary-button:disabled {
          background: #cbd5e1;
          color: #64748b;
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

      <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
        {/* Header Principal */}
        <div
          className="dashboard-card"
          style={{
            background: "#FFFFFF",
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
                "radial-gradient(circle, rgba(68, 189, 255, 0.1) 0%, transparent 70%)",
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
                  color: "#44bdff",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                OPÉRATION ATLAS
              </h1>
              <div
                style={{
                  fontSize: "1rem",
                  color: "#64748b",
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
                background: "rgba(68, 189, 255, 0.1)",
                border: "1px solid rgba(68, 189, 255, 0.3)",
                borderRadius: "8px",
                padding: "16px 24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#64748b",
                  marginBottom: "4px",
                  fontWeight: "600",
                }}
              >
                TEMPS RESTANT
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  fontFamily: "monospace",
                  color: timeLeft < 300 ? "#ef4444" : "#059669",
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
                background: "#FFFFFF",
                border: "1px solid rgba(239, 68, 68, 0.3)",
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
                    background: "#ef4444",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                    fontSize: "18px",
                    color: "white",
                  }}
                >
                  ⚠️
                </div>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    margin: 0,
                    color: "#ef4444",
                  }}
                >
                  ALERTE CRITIQUE
                </h2>
              </div>

              <div style={{ lineHeight: "1.6", color: "#475569" }}>
                <p style={{ marginBottom: "12px" }}>
                  <strong style={{ color: "#ef4444" }}>S.H.A.D.O.W.</strong>{" "}
                  (Sabotage of Heritage And Disruption Of Worldwide Culture)
                  menace de détruire le patrimoine culturel mondial !
                </p>
                <p style={{ marginBottom: "16px" }}>
                  Le virus numérique{" "}
                  <strong style={{ color: "#dc2626" }}>"ATLAS-KILLER"</strong>{" "}
                  s'activera dans{" "}
                  <strong style={{ color: "#d97706" }}>
                    {formatTime(timeLeft)}
                  </strong>{" "}
                  et effacera les archives de musées, bibliothèques et sites
                  culturels de 3 continents.
                </p>

                <div
                  style={{
                    background: "rgba(68, 189, 255, 0.05)",
                    borderRadius: "8px",
                    padding: "16px",
                    border: "1px solid rgba(68, 189, 255, 0.2)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      margin: "0 0 12px 0",
                      color: "#44bdff",
                    }}
                  >
                    OBJECTIF DE MISSION :
                  </h3>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "12px", color: "#44bdff" }}>
                        🔓
                      </div>
                      <span style={{ color: "#475569" }}>
                        Infiltrez les 3 serveurs continentaux de S.H.A.D.O.W.
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "12px", color: "#44bdff" }}>
                        🧩
                      </div>
                      <span style={{ color: "#475569" }}>
                        Récupérez les fragments du mot de passe maître
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "12px", color: "#44bdff" }}>
                        🔑
                      </div>
                      <span style={{ color: "#475569" }}>
                        Reconstituez la clé d'accès au serveur central
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "12px", color: "#44bdff" }}>
                        ⚡
                      </div>
                      <span style={{ color: "#475569" }}>
                        Désactivez le virus en 30 secondes chrono !
                      </span>
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
                  color: "#44bdff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>🌍</span>
                SERVEURS CIBLES
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
                            color: "white",
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
                              color: "#1e293b",
                            }}
                          >
                            {continent.name}
                          </h3>
                          <div
                            style={{
                              fontSize: "0.875rem",
                              color: "#64748b",
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
                                background: "rgba(100, 116, 139, 0.1)",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                color: "#475569",
                                fontWeight: "500",
                              }}
                            >
                              Difficulté: {continent.difficulty}
                            </div>
                            <div
                              style={{
                                background: "rgba(68, 189, 255, 0.1)",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                color: "#44bdff",
                                fontWeight: "500",
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
                  color: "#44bdff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>👥</span>
                ÉQUIPE ({room.players.length}/4)
              </h2>

              <div style={{ display: "grid", gap: "12px" }}>
                {room.players.map((player) => (
                  <div
                    key={player.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px",
                      background: player.connected
                        ? "rgba(16, 185, 129, 0.05)"
                        : "rgba(100, 116, 139, 0.05)",
                      borderRadius: "8px",
                      border: player.connected
                        ? "1px solid rgba(16, 185, 129, 0.2)"
                        : "1px solid rgba(100, 116, 139, 0.2)",
                    }}
                  >
                    <div
                      className={`status-indicator ${
                        player.connected ? "status-online" : "status-offline"
                      }`}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "500", color: "#1e293b" }}>
                        {player.pseudo}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: player.connected ? "#059669" : "#64748b",
                          fontWeight: "500",
                        }}
                      >
                        {player.connected ? "🟢 En ligne" : "⚫ Hors ligne"}
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
                  color: "#44bdff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>🎯</span>
                CODE MISSION
              </h2>

              <div
                style={{
                  background: "rgba(68, 189, 255, 0.05)",
                  border: "1px solid rgba(68, 189, 255, 0.3)",
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
                    color: "#44bdff",
                    letterSpacing: "4px",
                  }}
                >
                  {room.joinCode}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#64748b",
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
                background: "#FFF",
                border: "1px solid rgba(68, 189, 255, 0.2)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  margin: "0 0 12px 0",
                  color: "#44bdff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>💡</span>
                STRATÉGIE
              </h2>

              <div style={{ color: "#475569", lineHeight: "1.5" }}>
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
