import React, { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";

interface ResearchStation {
  name: string;
  country: string;
  emoji: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  avgTempC: number;
  established: number;
  personnel: number;
}

interface AntarcticaData {
  researchStations: ResearchStation[];
  question: string;
  categories: Record<string, string>;
  correctAnswer: string;
  hint: string;
}

export const PuzzleAntarctica: React.FC = () => {
  const { room, submitPuzzle, requestHint } = useGameStore();
  const [answer, setAnswer] = useState("");
  const [data, setData] = useState<AntarcticaData | null>(null);

  useEffect(() => {
    fetch("/content/an_stations.json")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to load Antarctica data:", err));
  }, []);

  if (!room || !data) return null;

  const solved = room.solved.an || false;
  const hintsUsed = room.hintsUsed.an || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    submitPuzzle("ANTARCTICA", answer);
  };

  const handleHint = () => {
    if (hintsUsed < 2) {
      requestHint("ANTARCTICA");
    }
  };

  const getCategoryForTemp = (temp: number) => {
    if (temp < -50) return "extreme";
    if (temp >= -50 && temp <= -20) return "harsh";
    return "moderate";
  };

  const getCategoryColor = (category: string) => {
    if (category === "extreme") return "#FF006E";
    if (category === "harsh") return "#FFB703";
    return "#4CC9F0";
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
          🧊
        </div>
        <div>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "#4CC9F0",
            }}
          >
            Antarctique – Les Gardiens du Pôle
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Analysez les stations de recherche et trouvez la plus extrême
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
              background: "rgba(76, 201, 240, 0.05)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "1px solid rgba(76, 201, 240, 0.2)",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "#4CC9F0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🌡️</span>
              Catégories de température
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {Object.entries(data.categories).map(([key, description]) => (
                <div
                  key={key}
                  style={{
                    padding: "1rem",
                    background: "#FFFFFF",
                    borderRadius: "8px",
                    border: `2px solid ${getCategoryColor(key)}`,
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
                    {key === "extreme" ? "🥶" : key === "harsh" ? "❄️" : "🌊"}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      marginBottom: "0.5rem",
                      color: "#1e293b",
                    }}
                  >
                    {key.toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#64748b",
                      lineHeight: "1.4",
                    }}
                  >
                    {description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "#4CC9F0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>❄️</span>
              Stations de recherche
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {data.researchStations.map((station) => {
                const category = getCategoryForTemp(station.avgTempC);
                const categoryColor = getCategoryColor(category);

                return (
                  <div
                    key={station.name}
                    style={{
                      padding: "1.25rem",
                      background: "#FFFFFF",
                      borderRadius: "8px",
                      border: `2px solid ${categoryColor}`,
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
                      {station.emoji}
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        marginBottom: "0.75rem",
                        color: "#1e293b",
                      }}
                    >
                      {station.name}
                    </div>
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "0.875rem",
                        marginBottom: "0.75rem",
                        fontWeight: "500",
                      }}
                    >
                      {station.country}
                    </div>

                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#64748b",
                        marginBottom: "0.5rem",
                        lineHeight: "1.4",
                      }}
                    >
                      <div>
                        🌡️ Température:{" "}
                        <span
                          style={{
                            color: categoryColor,
                            fontWeight: 700,
                            fontSize: "1rem",
                          }}
                        >
                          {station.avgTempC}°C
                        </span>
                      </div>
                      <div>
                        📍 {station.coordinates.latitude.toFixed(2)}°,{" "}
                        {station.coordinates.longitude.toFixed(2)}°
                      </div>
                      <div>📅 Établie en {station.established}</div>
                      <div>👥 Personnel: {station.personnel}</div>
                    </div>

                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.375rem 0.75rem",
                        background: categoryColor,
                        color: "white",
                        borderRadius: "50px",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        textAlign: "center",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {category === "extreme" && "🥶 EXTRÊME"}
                      {category === "harsh" && "❄️ RIGOUREUX"}
                      {category === "moderate" && "🌊 MODÉRÉ"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              background: "rgba(76, 201, 240, 0.05)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "2px solid #4CC9F0",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
                color: "#4CC9F0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🎯</span>
              Question à résoudre
            </h4>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#475569",
                marginBottom: "0.5rem",
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
              placeholder="Nom de la station"
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
              onFocus={(e) => (e.target.style.borderColor = "#4CC9F0")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              aria-label="Réponse pour le puzzle Antarctique"
            />
            <button
              type="submit"
              disabled={answer.length < 3}
              style={{
                padding: "12px 24px",
                background:
                  answer.length < 3
                    ? "#cbd5e1"
                    : "linear-gradient(135deg, #4CC9F0 0%, #38B6FF 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: answer.length < 3 ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                fontFamily: '"Poppins", sans-serif',
              }}
              onMouseEnter={(e) => {
                if (answer.length >= 3) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(76, 201, 240, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (answer.length >= 3) {
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
              {room.fragments.letterAN}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
