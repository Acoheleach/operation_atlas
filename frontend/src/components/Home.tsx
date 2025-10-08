import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";

export const Home: React.FC = () => {
  const [pseudo, setPseudo] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [mode, setMode] = useState<"create" | "join" | null>(null);

  const { createRoom, joinRoom, error, setError } = useGameStore();
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim()) return;
    try {
      await createRoom(pseudo);
      navigate("/brief");
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim() || !joinCode.trim()) return;
    try {
      await joinRoom(joinCode.toUpperCase(), pseudo);
      navigate("/brief");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#44bdff",
        padding: "24px",
        fontFamily: '"Poppins", sans-serif',
        color: "#FFF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        .dashboard-card {
          background: #FFF;
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 12px;
          padding: 32px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .primary-button {
          background: #44BDFF;
          border: none;
          border-radius: 8px;
          padding: 16px 24px;
          color: white;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
          width: 100%;
        }
        
        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
        }
        
        .secondary-button {
          background: rgba(30, 41, 59, 0.8);
          border: none;
          border-radius: 8px;
          padding: 16px 24px;
          color: #f8fafc;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Poppins', sans-serif;
          width: 100%;
        }
        
        .secondary-button:hover {
          border-color: #44bdff;
          transform: translateY(-2px);
        }
        
        .input-field {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 8px;
          padding: 14px 16px;
          color: #f8fafc;
          font-family: 'Poppins', sans-serif;
          width: 100%;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        
        .input-field:focus {
          border-color: #44bdff;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        .mission-tag {
          background: #F29900;
          border: 1px solid #F29900;
          border-radius: 20px;
          padding: 8px 16px;
          color: #FFF;
          font-size: 0.875rem;
          font-weight: 600;
          display: inline-block;
          margin: 0 4px;
        }
        
        .floating-element {
          position: absolute;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        
        .text-center { text-align: center; }
        .text-success { color: #10b981; }
        .text-warning { color: #f59e0b; }
        .text-danger { color: #ef4444; }
        .text-info { color: #3b82f6; }
        .text-muted { color: #94a3b8; }
        
        @media (max-width: 768px) {
          .grid-2-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Éléments flottants décoratifs */}
      <div
        className="floating-element"
        style={{
          top: "10%",
          left: "5%",
          width: "120px",
          height: "120px",
          background: "#FFF",
        }}
      />
      <div
        className="floating-element"
        style={{
          top: "60%",
          right: "8%",
          width: "80px",
          height: "80px",
          animationDelay: "2s",
          background: "#FFF",
        }}
      />
      <div
        className="floating-element"
        style={{
          bottom: "20%",
          left: "15%",
          width: "60px",
          height: "60px",
          animationDelay: "4s",
          background: "#FFF",
        }}
      />

      <div
        style={{
          maxWidth: "50rem",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Carte Principale */}
        <div className="dashboard-card">
          {/* En-tête Mission */}
          <div className="text-center" style={{ marginBottom: "32px" }}>
            <div
              style={{
                fontSize: "3.5rem",
                marginBottom: "16px",
                filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
              }}
            >
              <img
                src="logo-opération-cadenas.png"
                alt=""
                style={{ width: "6rem" }}
              />
            </div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                margin: "0 0 8px 0",
                background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "#44bdff",

                letterSpacing: "2px",
              }}
            >
              Opération Atlas
            </h1>
            <p
              style={{
                fontSize: "1rem",
                color: "#94a3b8",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: "0 0 16px 0",
              }}
            >
              Le Cartographe Fantôme
            </p>

            {/* Tags de Mission */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "24px",
              }}
            >
              <span className="mission-tag">🕵️ Infiltration</span>
              <span className="mission-tag">🌍 Multicontinental</span>
              <span className="mission-tag">⚡ Temps Limité</span>
            </div>
          </div>

          {/* Message d'Alerte */}
          <div
            style={{
              background: "rgba(220, 38, 38, 0.1)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#ef4444", fontSize: "1.2rem" }}>⚠️</span>
              <span
                style={{
                  color: "#fca5a5",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                ALERTE S.H.A.D.O.W.
              </span>
            </div>
            <p
              style={{
                color: "#fca5a5",
                fontSize: "0.8rem",
                margin: 0,
                lineHeight: "1.4",
              }}
            >
              L'organisation criminelle menace le patrimoine culturel mondial.
              Votre mission commence maintenant.
            </p>
          </div>

          {/* Gestion des Erreurs */}
          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
                position: "relative",
              }}
            >
              <div
                style={{
                  color: "#fca5a5",
                  fontSize: "0.9rem",
                  marginRight: "32px",
                }}
              >
                {error}
              </div>
              <button
                onClick={() => setError(null)}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "transparent",
                  border: "none",
                  color: "#fca5a5",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* Sélection du Mode */}
          {mode === null && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                width: "25rem",
              }}
            >
              <button
                onClick={() => setMode("create")}
                className="primary-button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <span>🚀</span>
                Créer une Nouvelle Mission
              </button>
              <button
                onClick={() => setMode("join")}
                className="secondary-button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <span>🔗</span>
                Rejoindre une Mission Existante
              </button>
            </div>
          )}

          {/* Formulaire Création */}
          {mode === "create" && (
            <form
              onSubmit={handleCreate}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Nom de Code
                </label>
                <input
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  maxLength={50}
                  placeholder="Entrez votre nom d'agent..."
                  className="input-field"
                  autoFocus
                  required
                />
              </div>

              <div className="grid-2-col">
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="secondary-button"
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  disabled={!pseudo.trim()}
                  className="primary-button"
                  style={{
                    background: !pseudo.trim()
                      ? "#475569"
                      : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                    cursor: !pseudo.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  Lancer la Mission
                </button>
              </div>
            </form>
          )}

          {/* Formulaire Rejoindre */}
          {mode === "join" && (
            <form
              onSubmit={handleJoin}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Nom de Code
                </label>
                <input
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  maxLength={50}
                  placeholder="Entrez votre nom d'agent..."
                  className="input-field"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Code Mission
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  placeholder="ABC123"
                  className="input-field"
                  style={{
                    textAlign: "center",
                    letterSpacing: "3px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                  }}
                  required
                />
              </div>

              <div className="grid-2-col">
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="secondary-button"
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  disabled={!pseudo.trim() || joinCode.length !== 6}
                  className="primary-button"
                  style={{
                    background:
                      !pseudo.trim() || joinCode.length !== 6
                        ? "#475569"
                        : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                    cursor:
                      !pseudo.trim() || joinCode.length !== 6
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Rejoindre
                </button>
              </div>
            </form>
          )}

          {/* Informations supplémentaires */}
          <div
            style={{
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(71, 85, 105, 0.3)",
            }}
          >
            <div
              className="grid-2-col"
              style={{ fontSize: "0.75rem", color: "#64748b" }}
            >
              <div className="text-center">
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#94a3b8",
                    marginBottom: "4px",
                  }}
                >
                  👥 Équipe
                </div>
                <div style={{ fontWeight: "600" }}>2-4 Agents</div>
              </div>
              <div className="text-center">
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#94a3b8",
                    marginBottom: "4px",
                  }}
                >
                  ⏱️ Durée
                </div>
                <div style={{ fontWeight: "600" }}>25 Minutes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ fontSize: "0.75rem", color: "#FFF" }}>
            Système d'Infiltration S.H.A.D.O.W. • Sécurité Niveau Maximum
          </p>
        </div>
      </div>
    </div>
  );
};
