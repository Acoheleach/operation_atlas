import React, { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";

interface Salutation {
  greeting: string;
  language: string;
  country: string;
  linguisticFamily: string;
}

interface EuropeData {
  salutations: Salutation[];
  familyMapping: Record<string, string>;
  targetWord: string;
  hint: string;
}

export const PuzzleEurope: React.FC = () => {
  const { room, submitPuzzle, requestHint } = useGameStore();
  const currentPuzzleIndex = useGameStore((state) => state.currentPuzzleIndex);
  const setCurrentPuzzleIndex = useGameStore(
    (state) => state.setCurrentPuzzleIndex
  );

  const [answer, setAnswer] = useState("");
  const [data, setData] = useState<EuropeData | null>(null);
  const [localSolved, setLocalSolved] = useState(false);
  const [localHintsUsed, setLocalHintsUsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les données du puzzle
  useEffect(() => {
    fetch("/content/eu_salutations.json")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to load Europe data:", err));
  }, []);

  // Synchroniser l'état local avec les mises à jour WebSocket
  useEffect(() => {
    if (room) {
      console.log("🔄 PuzzleEurope - Room updated:", {
        solved: room.solved.eu,
        hintsUsed: room.hintsUsed.eu,
        version: room.version,
      });

      setLocalSolved(room.solved.eu || false);
      setLocalHintsUsed(room.hintsUsed.eu || 0);
    }
  }, [room?.solved.eu, room?.hintsUsed.eu, room?.version]);

  if (!room || !data) {
    return (
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
          textAlign: "center",
          fontFamily: '"Poppins", sans-serif',
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
        <p style={{ color: "#64748b" }}>Chargement du puzzle Europe...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || answer.length !== 5 || isSubmitting) return;

    console.log("🎯 Submitting Europe puzzle answer:", answer);
    setIsSubmitting(true);

    try {
      await submitPuzzle("EUROPE", answer);
      setAnswer(""); // Reset du champ après soumission

      // Vérifie si la réponse est correcte (adapte selon ta logique)
      if (answer === data?.targetWord.toUpperCase()) {
        setCurrentPuzzleIndex(currentPuzzleIndex + 1);
        // Tu peux aussi envoyer la progression au backend ici si besoin
      }
    } catch (error) {
      console.error("❌ Error submitting puzzle:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHint = () => {
    if (localHintsUsed < 2) {
      console.log("💡 Requesting hint for Europe");
      requestHint("EUROPE");
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
          🇪🇺
        </div>
        <div>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "#EF4444",
            }}
          >
            Europe – Le Mystère Linguistique
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Trouvez le mot de 5 lettres en analysant les familles linguistiques
          </p>
        </div>
        {localSolved && (
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

      {!localSolved ? (
        <>
          <div
            style={{
              padding: "1.5rem",
              background: "rgba(239, 68, 68, 0.05)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "#EF4444",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>📋</span>
              Données linguistiques
            </h3>
            <div
              style={{
                overflowX: "auto",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      borderBottom: "2px solid #EF4444",
                    }}
                  >
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#EF4444",
                        fontSize: "0.875rem",
                      }}
                    >
                      Salutation
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#EF4444",
                        fontSize: "0.875rem",
                      }}
                    >
                      Langue
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#EF4444",
                        fontSize: "0.875rem",
                      }}
                    >
                      Pays
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#EF4444",
                        fontSize: "0.875rem",
                      }}
                    >
                      Famille Linguistique
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.salutations.map((item, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(239, 68, 68, 0.03)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td
                        style={{
                          padding: "1rem",
                          fontWeight: 600,
                          color: "#1e293b",
                          fontSize: "0.9rem",
                        }}
                      >
                        {item.greeting}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          color: "#64748b",
                          fontSize: "0.875rem",
                        }}
                      >
                        {item.language}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          color: "#64748b",
                          fontSize: "0.875rem",
                        }}
                      >
                        {item.country}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span
                          style={{
                            padding: "0.375rem 0.75rem",
                            background: "rgba(239, 68, 68, 0.1)",
                            borderRadius: "50px",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "#EF4444",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                          }}
                        >
                          {item.linguisticFamily}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              background: "rgba(239, 68, 68, 0.05)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "2px solid #EF4444",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
                color: "#EF4444",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>🔑</span>
              Correspondance Famille → Lettre
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              {Object.entries(data.familyMapping).map(([family, letter]) => (
                <div
                  key={family}
                  style={{
                    padding: "1rem",
                    background: "#FFFFFF",
                    borderRadius: "8px",
                    border: `2px solid #EF4444`,
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(239, 68, 68, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#64748b",
                      marginBottom: "0.5rem",
                      fontWeight: "500",
                    }}
                  >
                    {family}
                  </div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#EF4444",
                    }}
                  >
                    {letter}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
          >
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.toUpperCase())}
              placeholder="Mot (5 lettres)"
              maxLength={5}
              disabled={isSubmitting}
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
                background: isSubmitting ? "#f8fafc" : "#FFFFFF",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#EF4444")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              aria-label="Réponse pour le puzzle Europe"
            />
            <button
              type="submit"
              disabled={answer.length !== 5 || isSubmitting}
              style={{
                padding: "12px 24px",
                background:
                  answer.length !== 5 || isSubmitting
                    ? "#cbd5e1"
                    : "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor:
                  answer.length !== 5 || isSubmitting
                    ? "not-allowed"
                    : "pointer",
                transition: "all 0.3s ease",
                fontFamily: '"Poppins", sans-serif',
              }}
              onMouseEnter={(e) => {
                if (answer.length === 5 && !isSubmitting) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(239, 68, 68, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (answer.length === 5 && !isSubmitting) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {isSubmitting ? "⏳..." : "Valider"}
            </button>
          </form>

          <button
            onClick={handleHint}
            disabled={localHintsUsed >= 2 || isSubmitting}
            style={{
              width: "100%",
              padding: "12px 24px",
              background:
                localHintsUsed >= 2 ? "#e2e8f0" : "rgba(255, 193, 7, 0.1)",
              color: localHintsUsed >= 2 ? "#94a3b8" : "#d97706",
              border: `1px solid ${
                localHintsUsed >= 2 ? "#cbd5e1" : "rgba(255, 193, 7, 0.3)"
              }`,
              borderRadius: "8px",
              fontWeight: "600",
              cursor:
                localHintsUsed >= 2 || isSubmitting ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              fontFamily: '"Poppins", sans-serif',
            }}
            onMouseEnter={(e) => {
              if (localHintsUsed < 2 && !isSubmitting) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(255, 193, 7, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (localHintsUsed < 2 && !isSubmitting) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {localHintsUsed === 0 && "💡 Demander un indice (-60s)"}
            {localHintsUsed === 1 && "💡 Demander le 2e indice (-60s)"}
            {localHintsUsed >= 2 && "⚠️ Indices épuisés"}
          </button>

          {localHintsUsed > 0 && (
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
      ) : (
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
              {room.fragments.letterEU || "L"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
