import React, { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";

interface City {
  name: string;
  code: string;
  offsetMinutes: number;
  description: string;
}

interface AsiaData {
  cities: City[];
  validSlotsUTC: string[];
  hint: string;
}

export const PuzzleAsia: React.FC = () => {
  const { room, submitPuzzle, requestHint } = useGameStore();
  const [answer, setAnswer] = useState("");
  const [data, setData] = useState<AsiaData | null>(null);
  const currentPuzzleIndex = useGameStore((state) => state.currentPuzzleIndex);
  const setCurrentPuzzleIndex = useGameStore(
    (state) => state.setCurrentPuzzleIndex
  );

  useEffect(() => {
    fetch("/content/as_time.json")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to load Asia data:", err));
  }, []);

  if (!room || !data) return null;

  const solved = room.solved.as || false;
  const hintsUsed = room.hintsUsed.as || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    submitPuzzle("ASIA", answer);

    // Vérifie si la réponse est correcte (adapte selon ta logique)
    if (data?.validSlotsUTC.includes(answer)) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      // Tu peux aussi envoyer la progression au backend ici si besoin
    }
  };

  const handleHint = () => {
    if (hintsUsed < 2) {
      requestHint("ASIA");
    }
  };

  const calculateLocalTime = (utcTime: string, offsetMinutes: number) => {
    const [hours, minutes] = utcTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + offsetMinutes;
    const localHours = Math.floor(totalMinutes / 60) % 24;
    const localMinutes = totalMinutes % 60;
    return `${String(localHours).padStart(2, "0")}:${String(
      localMinutes
    ).padStart(2, "0")}`;
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
          🌏
        </div>
        <div>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "#8B5CF6",
            }}
          >
            Asie – L'Énigme des Fuseaux
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Trouvez un horaire UTC où toutes les villes sont entre 08:00 et
            20:00 locales
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
              background: "rgba(139, 92, 246, 0.05)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "#8B5CF6",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🌐</span>
              Fuseaux horaires des villes
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              {data.cities.map((city) => (
                <div
                  key={city.code}
                  style={{
                    padding: "1.25rem",
                    background: "#FFFFFF",
                    borderRadius: "8px",
                    border: "2px solid #e2e8f0",
                    position: "relative",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.5rem",
                      marginBottom: "0.75rem",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  >
                    {city.code === "TYO" && "🗼"}
                    {city.code === "DEL" && "🕌"}
                    {city.code === "BKK" && "🏯"}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      marginBottom: "0.5rem",
                      color: "#1e293b",
                    }}
                  >
                    {city.name}
                  </div>
                  <div
                    style={{
                      color: "#8B5CF6",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {city.description}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    Décalage: {city.offsetMinutes > 0 ? "+" : ""}
                    {Math.floor(city.offsetMinutes / 60)}h
                    {city.offsetMinutes % 60 > 0 ? city.offsetMinutes % 60 : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              background: "rgba(139, 92, 246, 0.05)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "2px solid #8B5CF6",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
                color: "#8B5CF6",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🎯</span>
              Objectif
            </h4>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#475569",
                marginBottom: "0.75rem",
                fontWeight: "500",
              }}
            >
              Trouvez un horaire UTC (format HH:MM) tel que :
            </p>
            <ul
              style={{
                paddingLeft: "1.5rem",
                color: "#64748b",
                fontSize: "0.875rem",
                lineHeight: "1.6",
              }}
            >
              <li>Tokyo est entre 08:00 et 20:00 locales</li>
              <li>Delhi est entre 08:00 et 20:00 locales</li>
              <li>Bangkok est entre 08:00 et 20:00 locales</li>
            </ul>
          </div>

          {/* Simulateur de temps */}
          {answer.match(/^\d{2}:\d{2}$/) && (
            <div
              style={{
                padding: "1.5rem",
                background: "rgba(139, 92, 246, 0.05)",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                border: "2px solid #8B5CF6",
              }}
            >
              <h4
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                  color: "#8B5CF6",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>⏰</span>
                Simulation pour {answer} UTC
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "1rem",
                }}
              >
                {data.cities.map((city) => {
                  const localTime = calculateLocalTime(
                    answer,
                    city.offsetMinutes
                  );
                  const [hours] = localTime.split(":").map(Number);
                  const isValid = hours >= 8 && hours < 20;

                  return (
                    <div
                      key={city.code}
                      style={{
                        padding: "1rem",
                        background: isValid
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(239, 68, 68, 0.1)",
                        borderRadius: "8px",
                        border: `2px solid ${isValid ? "#10b981" : "#ef4444"}`,
                        textAlign: "center",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: "#1e293b",
                        }}
                      >
                        {city.name}
                      </div>
                      <div
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: isValid ? "#10b981" : "#ef4444",
                          marginTop: "0.5rem",
                        }}
                      >
                        {localTime}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          marginTop: "0.5rem",
                          fontWeight: "600",
                          color: isValid ? "#059669" : "#dc2626",
                        }}
                      >
                        {isValid ? "✓ Valide" : "✗ Hors plage"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
          >
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="HH:MM (ex: 06:30)"
              pattern="\d{2}:\d{2}"
              maxLength={5}
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
              onFocus={(e) => (e.target.style.borderColor = "#8B5CF6")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              aria-label="Réponse pour le puzzle Asie"
            />
            <button
              type="submit"
              disabled={!answer.match(/^\d{2}:\d{2}$/)}
              style={{
                padding: "12px 24px",
                background: !answer.match(/^\d{2}:\d{2}$/)
                  ? "#cbd5e1"
                  : "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: !answer.match(/^\d{2}:\d{2}$/)
                  ? "not-allowed"
                  : "pointer",
                transition: "all 0.3s ease",
                fontFamily: '"Poppins", sans-serif',
              }}
              onMouseEnter={(e) => {
                if (answer.match(/^\d{2}:\d{2}$/)) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(139, 92, 246, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (answer.match(/^\d{2}:\d{2}$/)) {
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
              {room.fragments.directionAS}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
