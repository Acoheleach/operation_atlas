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
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #52B5E8 0%, #00A8E8 100%)",
          padding: "1.5rem",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <div style={{ maxWidth: "550px", width: "100%" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.98)",
              borderRadius: "12px",
              padding: "2.5rem 2rem",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
              border: "3px solid #00A8E8",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  color: "#00A8E8",
                  margin: "0 0 0.3rem 0",
                  letterSpacing: "0.5px",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Opération Atlas
              </h1>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#666",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  margin: 0,
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Le Cartographe Fantôme
              </p>
            </div>

            {error && (
              <div
                style={{
                  padding: "1rem 1.2rem",
                  background: "#FF6B6B",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                  color: "white",
                  fontWeight: "600",
                  position: "relative",
                  border: "2px solid #FF5252",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {error}
                <button
                  onClick={() => setError(null)}
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.8rem",
                    background: "transparent",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {mode === null && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <button
                  onClick={() => setMode("create")}
                  style={{
                    width: "100%",
                    padding: "1rem 1.5rem",
                    fontSize: "1.05rem",
                    background: "#00A8E8",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "700",
                    cursor: "pointer",
                    textTransform: "none",
                    transition: "all 0.2s ease",
                    fontFamily: "Poppins, sans-serif",
                    boxShadow: "0 4px 12px rgba(0, 168, 232, 0.3)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-2px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  Créer une mission
                </button>
                <button
                  onClick={() => setMode("join")}
                  style={{
                    width: "100%",
                    padding: "1rem 1.5rem",
                    fontSize: "1.05rem",
                    background: "white",
                    color: "#00A8E8",
                    border: "2px solid #00A8E8",
                    borderRadius: "8px",
                    fontWeight: "700",
                    cursor: "pointer",
                    textTransform: "none",
                    transition: "all 0.2s ease",
                    fontFamily: "Poppins, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#00A8E8";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "#00A8E8";
                  }}
                >
                  Rejoindre une mission
                </button>
              </div>
            )}

            {mode === "create" && (
              <form
                onSubmit={handleCreate}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.6rem",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: "#333",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Nom d'agent
                  </label>
                  <input
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    maxLength={50}
                    placeholder="Votre nom de code..."
                    style={{
                      width: "100%",
                      padding: "0.9rem 1rem",
                      fontSize: "1rem",
                      border: "2px solid #DDD",
                      borderRadius: "8px",
                      outline: "none",
                      transition: "border 0.2s ease",
                      fontFamily: "Poppins, sans-serif",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#00A8E8")
                    }
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#DDD")}
                    autoFocus
                    required
                  />
                </div>
                <div style={{ display: "flex", gap: "0.8rem" }}>
                  <button
                    type="button"
                    onClick={() => setMode(null)}
                    style={{
                      flex: 1,
                      padding: "0.85rem",
                      background: "white",
                      color: "#666",
                      border: "2px solid #DDD",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "Poppins, sans-serif",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#999")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "#DDD")
                    }
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={!pseudo.trim()}
                    style={{
                      flex: 2,
                      padding: "0.85rem",
                      background: pseudo.trim() ? "#00A8E8" : "#BBB",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "700",
                      cursor: pseudo.trim() ? "pointer" : "not-allowed",
                      transition: "all 0.2s ease",
                      fontFamily: "Poppins, sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      if (pseudo.trim())
                        e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    Créer la mission
                  </button>
                </div>
              </form>
            )}

            {mode === "join" && (
              <form
                onSubmit={handleJoin}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.6rem",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: "#333",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Nom d'agent
                  </label>
                  <input
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    maxLength={50}
                    placeholder="Votre nom de code..."
                    style={{
                      width: "100%",
                      padding: "0.9rem 1rem",
                      fontSize: "1rem",
                      border: "2px solid #DDD",
                      borderRadius: "8px",
                      outline: "none",
                      transition: "border 0.2s ease",
                      fontFamily: "Poppins, sans-serif",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#00A8E8")
                    }
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#DDD")}
                    autoFocus
                    required
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.6rem",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: "#333",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Code mission
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    placeholder="ABC123"
                    style={{
                      width: "100%",
                      padding: "0.9rem 1rem",
                      fontSize: "1rem",
                      border: "2px solid #DDD",
                      borderRadius: "8px",
                      textTransform: "uppercase",
                      outline: "none",
                      transition: "border 0.2s ease",
                      fontFamily: "Poppins, sans-serif",
                      letterSpacing: "2px",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#00A8E8")
                    }
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#DDD")}
                    required
                  />
                </div>
                <div style={{ display: "flex", gap: "0.8rem" }}>
                  <button
                    type="button"
                    onClick={() => setMode(null)}
                    style={{
                      flex: 1,
                      padding: "0.85rem",
                      background: "white",
                      color: "#666",
                      border: "2px solid #DDD",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "Poppins, sans-serif",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#999")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "#DDD")
                    }
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={!pseudo.trim() || joinCode.length !== 6}
                    style={{
                      flex: 2,
                      padding: "0.85rem",
                      background:
                        pseudo.trim() && joinCode.length === 6
                          ? "#00A8E8"
                          : "#BBB",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "700",
                      cursor:
                        pseudo.trim() && joinCode.length === 6
                          ? "pointer"
                          : "not-allowed",
                      transition: "all 0.2s ease",
                      fontFamily: "Poppins, sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      if (pseudo.trim() && joinCode.length === 6)
                        e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    Rejoindre la mission
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
