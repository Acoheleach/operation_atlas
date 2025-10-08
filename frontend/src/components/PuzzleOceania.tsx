import React, { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";

interface Island {
  name: string;
  code: string;
  emoji: string;
  country: string;
}

interface Route {
  name: string;
  path: string[];
  totalDistance: number;
}

interface OceaniaData {
  islands: Island[];
  distances: Record<string, number>;
  routes: Route[];
  question: string;
  correctRoute: string;
  hint: string;
}

export const PuzzleOceania: React.FC = () => {
  const { room, submitPuzzle, requestHint } = useGameStore();
  const [answer, setAnswer] = useState("");
  const [data, setData] = useState<OceaniaData | null>(null);

  const currentPuzzleIndex = useGameStore((state) => state.currentPuzzleIndex);
  const setCurrentPuzzleIndex = useGameStore(
    (state) => state.setCurrentPuzzleIndex
  );

  useEffect(() => {
    fetch("/content/oc_islands.json")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to load Oceania data:", err));
  }, []);

  if (!room || !data) return null;

  const solved = room.solved.oc || false;
  const hintsUsed = room.hintsUsed.oc || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    submitPuzzle("OCEANIA", answer);

    // Vérifie si la réponse est correcte (adapte selon ta logique)
    if (answer.toUpperCase() === data?.correctRoute.toUpperCase()) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      // Tu peux aussi envoyer la progression au backend ici si besoin
    }
  };

  const handleHint = () => {
    if (hintsUsed < 2) {
      requestHint("OCEANIA");
    }
  };

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
          🏝️
        </div>
        <div>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "#06B6D4",
            }}
          >
            Océanie – La Route des Îles
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Trouvez la route la plus courte à travers l'océan Pacifique
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
              background: "rgba(6, 182, 212, 0.05)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "1px solid rgba(6, 182, 212, 0.2)",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "#06B6D4",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🌊</span>
              Îles du Pacifique
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              {data.islands.map((island) => (
                <div
                  key={island.code}
                  style={{
                    padding: "1.25rem",
                    background: "#FFFFFF",
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0",
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(6, 182, 212, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div
                    style={{
                      fontSize: "2.5rem",
                      marginBottom: "0.75rem",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  >
                    {island.emoji}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      marginBottom: "0.5rem",
                      color: "#1e293b",
                    }}
                  >
                    {island.name}
                  </div>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "0.875rem",
                      marginBottom: "0.5rem",
                      fontWeight: "500",
                    }}
                  >
                    {island.country}
                  </div>
                  <div
                    style={{
                      color: "#06B6D4",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    Code: {island.code}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              background: "rgba(6, 182, 212, 0.05)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "1px solid rgba(6, 182, 212, 0.2)",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
                color: "#06B6D4",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>📏</span>
              Distances entre îles (km)
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {Object.entries(data.distances).map(([route, distance]) => (
                <div
                  key={route}
                  style={{
                    padding: "0.75rem 1rem",
                    background: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  {route}:{" "}
                  <span style={{ color: "#06B6D4" }}>{distance} km</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              background: "rgba(6, 182, 212, 0.05)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "2px solid #06B6D4",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "#06B6D4",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🗺️</span>
              Routes possibles
            </h4>
            {data.routes.map((route) => (
              <div
                key={route.name}
                style={{
                  padding: "1.25rem",
                  background: "#FFFFFF",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  border: "2px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(6, 182, 212, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0, 0, 0, 0.05)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        marginBottom: "0.5rem",
                        color: "#1e293b",
                      }}
                    >
                      {route.name}
                    </div>
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      {route.path.join(" → ")}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#06B6D4",
                      color: "white",
                      borderRadius: "50px",
                      fontWeight: 700,
                      fontSize: "1rem",
                      boxShadow: "0 2px 4px rgba(6, 182, 212, 0.3)",
                    }}
                  >
                    {route.totalDistance} km
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "1.5rem",
              background: "rgba(255, 193, 7, 0.1)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "2px solid #d97706",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
                color: "#d97706",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🎯</span>
              Question
            </h4>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#475569",
                fontWeight: "600",
              }}
            >
              {data.question}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
          >
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.toUpperCase())}
              placeholder="Lettre de la route (A, B, C ou D)"
              maxLength={1}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s ease",
                fontFamily: '"Poppins", sans-serif',
                textTransform: "uppercase",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#06B6D4")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              aria-label="Réponse pour le puzzle Océanie"
            />
            <button
              type="submit"
              disabled={!answer.match(/^[A-D]$/i)}
              style={{
                padding: "12px 24px",
                background: !answer.match(/^[A-D]$/i)
                  ? "#cbd5e1"
                  : "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: !answer.match(/^[A-D]$/i) ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                fontFamily: '"Poppins", sans-serif',
              }}
              onMouseEnter={(e) => {
                if (answer.match(/^[A-D]$/i)) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(6, 182, 212, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (answer.match(/^[A-D]$/i)) {
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
              {room.fragments.directionOC}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
