import React, { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";

interface Item {
  name: string;
  weightKg: number;
  volumeMl: number;
  isLiquid: boolean;
  powerWh?: number;
}

interface AmericasData {
  items: Item[];
  rules: {
    maxCabinKg: number;
    maxLiquidMl: number;
    maxPowerWh: number;
  };
  prohibitedItems: string[];
  hint: string;
}

export const PuzzleAmericas: React.FC = () => {
  const { room, submitPuzzle, requestHint } = useGameStore();
  const [answer, setAnswer] = useState("");
  const [data, setData] = useState<AmericasData | null>(null);

  useEffect(() => {
    fetch("/content/am_items.json")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to load Americas data:", err));
  }, []);

  if (!room || !data) return null;

  const solved = room.solved.am || false;
  const hintsUsed = room.hintsUsed.am || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    submitPuzzle("AMERICAS", answer);
  };

  const handleHint = () => {
    if (hintsUsed < 2) {
      requestHint("AMERICAS");
    }
  };

  const categorizeItem = (item: Item) => {
    // Vérifie si interdit
    if (data.prohibitedItems.includes(item.name)) {
      return "prohibited";
    }

    // Vérifie les règles cabine
    if (item.isLiquid && item.volumeMl > data.rules.maxLiquidMl) {
      return "checkin";
    }

    if (item.powerWh && item.powerWh > data.rules.maxPowerWh) {
      return "checkin";
    }

    return "cabin";
  };

  const getCategoryIcon = (category: string) => {
    if (category === "cabin") return "✈️";
    if (category === "checkin") return "🧳";
    return "❌";
  };

  const getCategoryLabel = (category: string) => {
    if (category === "cabin") return "Cabine";
    if (category === "checkin") return "Soute";
    return "Interdit";
  };

  const getCategoryColor = (category: string) => {
    if (category === "cabin") return "#10b981";
    if (category === "checkin") return "#d97706";
    return "#ef4444";
  };

  // Calculer le poids total cabine
  const cabinWeight = data.items
    .filter((item) => categorizeItem(item) === "cabin")
    .reduce((sum, item) => sum + item.weightKg, 0);

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            fontSize: "3rem",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
        >
          ✈️
        </div>
        <div>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "#44bdff",
            }}
          >
            Amériques – Le Code Bagages
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Triez les objets selon les règles de sécurité aérienne
          </p>
        </div>
        {solved && (
          <div
            style={{
              marginLeft: "auto",
              padding: "0.5rem 1rem",
              background: "#10b981",
              color: "#FFFFFF",
              borderRadius: "50px",
              fontWeight: 700,
              fontSize: "0.875rem",
              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
            }}
          >
            ✓ Résolu
          </div>
        )}
      </div>

      {!solved && (
        <>
          <div
            style={{
              padding: "1.5rem",
              background: "rgba(68, 189, 255, 0.05)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "1px solid rgba(68, 189, 255, 0.2)",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "#44bdff",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>📋</span>
              Règles de sécurité aérienne
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  background: "#FFFFFF",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "0.5rem",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                  }}
                >
                  ✈️
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "#1e293b",
                  }}
                >
                  Cabine
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#64748b",
                    lineHeight: "1.4",
                  }}
                >
                  • Max {data.rules.maxCabinKg} kg
                  <br />• Liquides ≤ {data.rules.maxLiquidMl}ml/item
                  <br />• Powerbank ≤ {data.rules.maxPowerWh}Wh
                </div>
              </div>
              <div
                style={{
                  padding: "1rem",
                  background: "#FFFFFF",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "0.5rem",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                  }}
                >
                  🧳
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "#1e293b",
                  }}
                >
                  Soute
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#64748b",
                    lineHeight: "1.4",
                  }}
                >
                  Objets dépassant
                  <br />
                  les limites cabine
                </div>
              </div>
              <div
                style={{
                  padding: "1rem",
                  background: "#FFFFFF",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "0.5rem",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                  }}
                >
                  ❌
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                    color: "#1e293b",
                  }}
                >
                  Interdit
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#64748b",
                    lineHeight: "1.4",
                  }}
                >
                  Objets proscrits
                  <br />
                  partout
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "#44bdff",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🧳</span>
              Objets à trier
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {data.items.map((item, idx) => {
                const category = categorizeItem(item);

                return (
                  <div
                    key={idx}
                    style={{
                      padding: "1.25rem",
                      background: "#FFFFFF",
                      borderRadius: "8px",
                      border: `2px solid ${getCategoryColor(category)}`,
                      position: "relative",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        right: "0.75rem",
                        fontSize: "1.5rem",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                      }}
                    >
                      {getCategoryIcon(category)}
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        marginBottom: "0.75rem",
                        color: "#1e293b",
                      }}
                    >
                      {item.name}
                    </div>

                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#64748b",
                        marginBottom: "0.5rem",
                        lineHeight: "1.4",
                      }}
                    >
                      <div>⚖️ Poids: {item.weightKg} kg</div>
                      {item.isLiquid && (
                        <div>💧 Liquide: {item.volumeMl} ml</div>
                      )}
                      {item.powerWh !== undefined && (
                        <div>🔋 Puissance: {item.powerWh} Wh</div>
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.375rem 0.75rem",
                        background: getCategoryColor(category),
                        color: "white",
                        borderRadius: "50px",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        textAlign: "center",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {getCategoryLabel(category)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              background: "rgba(68, 189, 255, 0.05)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "2px solid #44bdff",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
                color: "#44bdff",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🎯</span>
              Code à trouver
            </h4>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#475569",
                marginBottom: "0.5rem",
              }}
            >
              Le code est la{" "}
              <strong style={{ color: "#dc2626" }}>
                somme des poids (en kg)
              </strong>{" "}
              de tous les objets autorisés en{" "}
              <strong style={{ color: "#059669" }}>cabine uniquement</strong>,
              formaté en 4 chiffres (ex: 0005 pour 5kg).
            </p>
            <div
              style={{
                marginTop: "0.75rem",
                fontSize: "0.875rem",
                color: "#64748b",
                fontWeight: "500",
              }}
            >
              💡 Poids total cabine calculé :{" "}
              <span
                style={{
                  color: "#44bdff",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                {cabinWeight} kg
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
          >
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Code 4 chiffres (ex: 0005)"
              pattern="\d{4}"
              maxLength={4}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s ease",
                fontFamily: '"Poppins", sans-serif',
              }}
              onFocus={(e) => (e.target.style.borderColor = "#44bdff")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              aria-label="Réponse pour le puzzle Amériques"
            />
            <button
              type="submit"
              disabled={!answer.match(/^\d{4}$/)}
              style={{
                padding: "12px 24px",
                background: !answer.match(/^\d{4}$/)
                  ? "#cbd5e1"
                  : "linear-gradient(135deg, #44bdff 0%, #1d9bf0 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: !answer.match(/^\d{4}$/) ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                fontFamily: '"Poppins", sans-serif',
              }}
              onMouseEnter={(e) => {
                if (answer.match(/^\d{4}$/)) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(68, 189, 255, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (answer.match(/^\d{4}$/)) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              Valider
            </button>
          </form>

          <button
            onClick={handleHint}
            disabled={hintsUsed >= 2}
            style={{
              width: "100%",
              padding: "12px 24px",
              background: hintsUsed >= 2 ? "#e2e8f0" : "rgba(255, 193, 7, 0.1)",
              color: hintsUsed >= 2 ? "#94a3b8" : "#d97706",
              border: `1px solid ${
                hintsUsed >= 2 ? "#cbd5e1" : "rgba(255, 193, 7, 0.3)"
              }`,
              borderRadius: "8px",
              fontWeight: "600",
              cursor: hintsUsed >= 2 ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              fontFamily: '"Poppins", sans-serif',
            }}
            onMouseEnter={(e) => {
              if (hintsUsed < 2) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(255, 193, 7, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (hintsUsed < 2) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {hintsUsed === 0 && "💡 Demander un indice (-60s)"}
            {hintsUsed === 1 && "💡 Demander le 2e indice (-60s)"}
            {hintsUsed >= 2 && "⚠️ Indices épuisés"}
          </button>

          {hintsUsed > 0 && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "rgba(255, 193, 7, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 193, 7, 0.3)",
                color: "#d97706",
                fontWeight: 600,
              }}
            >
              💡 {data.hint}
            </div>
          )}
        </>
      )}

      {solved && (
        <div
          style={{
            padding: "1.5rem",
            background: "rgba(16, 185, 129, 0.1)",
            borderRadius: "8px",
            border: "2px solid #10b981",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              marginBottom: "0.5rem",
              color: "#10b981",
            }}
          >
            ✓
          </div>
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              color: "#059669",
            }}
          >
            Puzzle résolu !
          </div>
          <div
            style={{
              color: "#64748b",
              fontWeight: "500",
            }}
          >
            Fragment obtenu :{" "}
            <span
              style={{
                color: "#10b981",
                fontWeight: 700,
                fontSize: "1.5rem",
              }}
            >
              {room.fragments.letterJoker}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
