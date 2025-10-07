import React, { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";

// Mapping des continents pour l'affichage
const continentInfo: Record<string, { emoji: string; name: string }> = {
  EUROPE: { emoji: "🇪🇺", name: "Europe" },
  ASIA: { emoji: "🌏", name: "Asie" },
  AMERICAS: { emoji: "✈️", name: "Amériques" },
  AFRICA: { emoji: "🌍", name: "Afrique" },
  OCEANIA: { emoji: "🏝️", name: "Océanie" },
  ANTARCTICA: { emoji: "🧊", name: "Antarctique" },
};

export const Final: React.FC = () => {
  const { room, submitFinal } = useGameStore();
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!room?.finalStartedAt) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - new Date(room.finalStartedAt).getTime()) / 1000
      );
      const remaining = Math.max(0, 30 - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [room?.finalStartedAt]);

  if (!room) return null;

  const drawnContinents = room.draw || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || timeLeft === 0) return;

    submitFinal(answer);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "24px",
        fontFamily: '"Poppins", sans-serif',
        color: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        .dashboard-card {
          background: rgba(30, 41, 59, 0.9);
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .critical-card {
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.5);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }
        
        .success-card {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.5);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
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
        
        .terminal-input {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.5);
          border-radius: 8px;
          padding: 16px;
          color: #f8fafc;
          font-family: 'monospace', 'Courier New';
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 2px;
          width: 100%;
          outline: none;
          transition: all 0.3s ease;
        }
        
        .terminal-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        .terminal-input:disabled {
          background: rgba(71, 85, 105, 0.5);
          border-color: rgba(71, 85, 105, 0.5);
          color: #94a3b8;
        }
        
        .countdown-critical {
          animation: pulse 1s ease-in-out infinite;
          color: #ef4444;
        }
        
        .server-tag {
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.5);
          border-radius: 8px;
          padding: 12px 16px;
          color: #10b981;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .grid-3-col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
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
          .grid-3-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={{ maxWidth: "800px", width: "100%" }}>
        {/* Header Principal */}
        <div className="critical-card">
          <div className="flex-between">
            <div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#ef4444",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                TERMINAL DE DÉSACTIVATION
              </div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  margin: "0",
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                ALERTE VIRUS ATLAS-KILLER
              </h1>
            </div>

            <div
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.5)",
                borderRadius: "8px",
                padding: "16px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#ef4444",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                TEMPS RESTANT
              </div>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  fontFamily: "monospace",
                  color: timeLeft < 10 ? "#ef4444" : "#f59e0b",
                }}
              >
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>

        {/* Serveurs Infiltrés */}
        <div className="success-card">
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              margin: "0 0 16px 0",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🛡️ SERVEURS INFILTRÉS
          </h2>

          <div className="grid-3-col">
            {drawnContinents.map((continent: string) => {
              const info = continentInfo[continent];
              return (
                <div key={continent} className="server-tag">
                  <span style={{ fontSize: "1.5rem" }}>{info.emoji}</span>
                  <span>{info.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message d'Alerte */}
        <div className="critical-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
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
                fontSize: "18px",
              }}
            >
              ⚠️
            </div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                margin: 0,
                color: "#f8fafc",
              }}
            >
              ALERTE CRITIQUE
            </h2>
          </div>

          <div style={{ color: "#cbd5e1", lineHeight: "1.6" }}>
            <p style={{ marginBottom: "12px" }}>
              Le virus{" "}
              <strong style={{ color: "#ef4444" }}>ATLAS-KILLER</strong> est sur
              le point de s'activer et menace d'effacer les archives culturelles
              mondiales.
            </p>
            <p style={{ margin: 0 }}>
              Entrez le{" "}
              <strong style={{ color: "#f59e0b" }}>
                code de désactivation final
              </strong>{" "}
              pour neutraliser la menace.
            </p>
          </div>
        </div>

        {/* Interface de Désactivation */}
        <div className="dashboard-card">
          <div
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              borderRadius: "8px",
              padding: "20px",
              border: "1px solid rgba(71, 85, 105, 0.5)",
            }}
          >
            <div
              style={{
                color: "#10b981",
                fontFamily: "monospace",
                fontSize: "14px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: "#3b82f6" }}>root@shadow-central</span>
              <span style={{ color: "#94a3b8" }}>:</span>
              <span style={{ color: "#f59e0b" }}>~</span>
              <span style={{ color: "#94a3b8" }}>$</span>
              <span> disable_virus --code=</span>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", gap: "12px", alignItems: "stretch" }}
            >
              <div
                style={{
                  color: "#3b82f6",
                  fontFamily: "monospace",
                  fontSize: "18px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 8px",
                }}
              >
                &gt;
              </div>

              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value.toUpperCase())}
                placeholder="SAISIR LE CODE..."
                disabled={timeLeft === 0}
                className="terminal-input"
                autoFocus
                aria-label="Code de désactivation du virus"
                style={{
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              />

              <button
                type="submit"
                disabled={!answer.trim() || timeLeft === 0}
                className="primary-button"
                style={{
                  whiteSpace: "nowrap",
                  minWidth: "140px",
                }}
              >
                {timeLeft === 0 ? "⏰ EXPIRÉ" : "🔓 DÉSACTIVER"}
              </button>
            </form>
          </div>
        </div>

        {/* Message d'Expiration */}
        {timeLeft === 0 && (
          <div className="critical-card">
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>💥</div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#ef4444",
                  margin: "0 0 8px 0",
                }}
              >
                TEMPS ÉCOULÉ
              </h3>
              <p style={{ color: "#cbd5e1", margin: 0 }}>
                Le virus ATLAS-KILLER a été activé et a compromis les archives
                culturelles.
              </p>
            </div>
          </div>
        )}

        {/* Indice */}
        {timeLeft > 0 && (
          <div className="dashboard-card" style={{ textAlign: "center" }}>
            <div
              style={{
                color: "#3b82f6",
                fontSize: "0.875rem",
                fontStyle: "italic",
              }}
            >
              💡 <strong>Indice stratégique :</strong> Le code final est basé
              sur l'analyse des serveurs infiltrés
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
            Terminal S.H.A.D.O.W. • Système de Désactivation d'Urgence
          </p>
        </div>
      </div>
    </div>
  );
};
