import React from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";

export const DebriefJourney: React.FC = () => {
  const { room } = useGameStore();
  const navigate = useNavigate();

  if (!room) return null;

  const allSolved = room.solved.eu && room.solved.as && room.solved.am;
  const totalHints =
    (room.hintsUsed.eu || 0) +
    (room.hintsUsed.as || 0) +
    (room.hintsUsed.am || 0);
  const timeRemaining = room.timerSec;
  const score = Math.max(0, timeRemaining - totalHints * 60);
  const timeBonus = timeRemaining;
  const hintPenalty = totalHints * 60;

  const handleReplay = () => {
    navigate("/");
    window.location.reload();
  };

  const handleNewMission = () => {
    navigate("/");
  };

  const destinations = [
    {
      id: "eu",
      name: "Europe",
      emoji: "🇪🇺",
      solved: room.solved.eu,
      hints: room.hintsUsed.eu || 0,
      color: "#2563eb",
      description: "Serveur Linguistique",
    },
    {
      id: "as",
      name: "Asie",
      emoji: "🌏",
      solved: room.solved.as,
      hints: room.hintsUsed.as || 0,
      color: "#059669",
      description: "Réseau Temporel",
    },
    {
      id: "am",
      name: "Amériques",
      emoji: "✈️",
      solved: room.solved.am,
      hints: room.hintsUsed.am || 0,
      color: "#d97706",
      description: "Protocole Aérien",
    },
  ];

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
        
        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 12px;
        }
        
        .status-online { background: #10b981; }
        .status-offline { background: #ef4444; }
        
        .server-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(71, 85, 105, 0.3);
          border-radius: 8px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        
        .server-card:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
        }
        
        .secondary-button {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border: none;
          border-radius: 8px;
          padding: 16px 32px;
          color: white;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .secondary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
        }
        
        .stat-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(71, 85, 105, 0.3);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }
        
        .success-border { border-color: rgba(34, 197, 94, 0.3); }
        .warning-border { border-color: rgba(245, 158, 11, 0.3); }
        .info-border { border-color: rgba(59, 130, 246, 0.3); }
        
        .success-bg { background: rgba(34, 197, 94, 0.1); }
        .warning-bg { background: rgba(245, 158, 11, 0.1); }
        .info-bg { background: rgba(59, 130, 246, 0.1); }
        
        .grid-3-col {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }
        
        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        
        .flex-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .flex-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .text-success { color: #10b981; }
        .text-warning { color: #f59e0b; }
        .text-danger { color: #ef4444; }
        .text-info { color: #3b82f6; }
        .text-muted { color: #94a3b8; }
        
        @media (max-width: 768px) {
          .grid-3-col, .grid-2-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Principal */}
        <div
          className="dashboard-card"
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            border: `1px solid ${allSolved ? "#10b981" : "#ef4444"}`,
            textAlign: "center",
          }}
        >
          <div className="flex-center" style={{ marginBottom: "24px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: allSolved
                  ? "rgba(16, 185, 129, 0.2)"
                  : "rgba(239, 68, 68, 0.2)",
                border: `2px solid ${allSolved ? "#10b981" : "#ef4444"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
              }}
            >
              {allSolved ? "🏆" : "📋"}
            </div>
          </div>

          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              margin: "0 0 12px 0",
              background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {allSolved ? "MISSION ACCOMPLIE" : "DÉBRIEFING DU VOYAGE"}
          </h1>

          <p style={{ fontSize: "1.1rem", color: "#94a3b8", margin: 0 }}>
            {allSolved
              ? "Tous les serveurs ont été sécurisés avec succès"
              : "Rapport du parcours d'infiltration"}
          </p>
        </div>

        {/* Score Principal */}
        <div
          className="dashboard-card"
          style={{
            background: allSolved
              ? "rgba(16, 185, 129, 0.1)"
              : "rgba(239, 68, 68, 0.1)",
            border: `1px solid ${allSolved ? "#10b981" : "#ef4444"}`,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#94a3b8",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              Score Final du Voyage
            </div>
            <div
              style={{
                fontSize: "4rem",
                fontWeight: "800",
                color: "#f8fafc",
                margin: "16px 0",
              }}
            >
              {score}
            </div>
          </div>

          <div className="grid-3-col">
            <div className="stat-card info-border">
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#3b82f6",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Bonus Temps
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#f8fafc",
                  fontFamily: "monospace",
                }}
              >
                +{timeBonus}s
              </div>
            </div>

            <div className="stat-card warning-border">
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#f59e0b",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Pénalités Indices
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#f8fafc",
                  fontFamily: "monospace",
                }}
              >
                -{hintPenalty}s
              </div>
            </div>

            <div className="stat-card success-border">
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#10b981",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Indices Utilisés
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#f8fafc",
                  fontFamily: "monospace",
                }}
              >
                {totalHints}
              </div>
            </div>
          </div>
        </div>

        {/* Carte du Voyage */}
        <div className="dashboard-card">
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              margin: "0 0 24px 0",
              color: "#f8fafc",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ color: "#3b82f6" }}>🗺️</span>
            PARCOURS D'INFILTRATION
          </h2>

          <div className="grid-3-col">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="server-card"
                style={{
                  borderColor: dest.solved
                    ? dest.color
                    : "rgba(71, 85, 105, 0.3)",
                  background: dest.solved
                    ? `linear-gradient(135deg, ${dest.color}20, ${dest.color}10)`
                    : "rgba(30, 41, 59, 0.6)",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "12px" }}>
                  {dest.emoji}
                </div>

                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#f8fafc",
                    margin: "0 0 8px 0",
                  }}
                >
                  {dest.name}
                </h3>

                <div
                  style={{
                    fontSize: "0.875rem",
                    color: dest.solved ? dest.color : "#94a3b8",
                    marginBottom: "12px",
                  }}
                >
                  {dest.description}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: dest.solved ? "#10b981" : "#ef4444",
                    }}
                  >
                    {dest.solved ? "✓ SÉCURISÉ" : "✗ EN ÉCHEC"}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                    }}
                  >
                    {dest.hints} indice(s)
                  </span>
                </div>

                {dest.solved && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      width: "24px",
                      height: "24px",
                      background: "#10b981",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      color: "white",
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid-2-col">
          {/* Rapport d'Apprentissage */}
          <div className="dashboard-card">
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                margin: "0 0 24px 0",
                color: "#f8fafc",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span style={{ color: "#f59e0b" }}>🎓</span>
              ACQUIS CULTURELS
            </h2>

            <div
              className="server-card warning-bg"
              style={{ borderColor: "rgba(245, 158, 11, 0.3)" }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#f59e0b",
                  margin: "0 0 16px 0",
                }}
              >
                Découvertes du Voyage
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "20px",
                  color: "#f59e0b",
                  lineHeight: "1.6",
                }}
              >
                <li style={{ marginBottom: "12px" }}>
                  Les langues européennes appartiennent à plusieurs familles
                  linguistiques distinctes
                </li>
                <li style={{ marginBottom: "12px" }}>
                  Certains fuseaux horaires utilisent des décalages de 30 ou 45
                  minutes
                </li>
                <li style={{ marginBottom: "0" }}>
                  Les règles de sécurité aérienne évoluent régulièrement pour
                  notre protection
                </li>
              </ul>
            </div>
          </div>

          {/* Analyse de Performance */}
          <div className="dashboard-card">
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                margin: "0 0 24px 0",
                color: "#f8fafc",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span style={{ color: "#3b82f6" }}>📊</span>
              ANALYSE DE PERFORMANCE
            </h2>

            <div
              className="server-card info-bg"
              style={{ borderColor: "rgba(59, 130, 246, 0.3)" }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#3b82f6",
                  margin: "0 0 12px 0",
                }}
              >
                Évaluation Stratégique
              </h3>
              <p
                style={{
                  color: "#3b82f6",
                  margin: "0 0 16px 0",
                  lineHeight: "1.6",
                  fontSize: "0.9rem",
                }}
              >
                {allSolved
                  ? "Infiltration menée avec succès. Coordination et efficacité optimales démontrées à travers les trois continents."
                  : "Le parcours révèle des opportunités d'amélioration dans la coordination et la résolution stratégique des énigmes."}
              </p>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#3b82f6",
                  fontStyle: "italic",
                }}
              >
                Temps restant : {timeRemaining}s
              </div>
            </div>
          </div>
        </div>

        {/* Message de Conclusion */}
        <div className="dashboard-card">
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#cbd5e1",
                fontStyle: "italic",
                margin: "0 0 16px 0",
                lineHeight: "1.6",
              }}
            >
              "Chaque serveur infiltré révèle la complexité et la richesse de
              notre patrimoine culturel mondial interconnecté."
            </p>
            <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
              - Unité de Neutralisation S.H.A.D.O.W.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button onClick={handleReplay} className="primary-button">
            🔄 Relancer l'Infiltration
          </button>

          <button onClick={handleNewMission} className="secondary-button">
            🚀 Nouvelle Mission
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
            Opération Atlas • Rapport de Voyage S.H.A.D.O.W.
          </p>
        </div>
      </div>
    </div>
  );
};
