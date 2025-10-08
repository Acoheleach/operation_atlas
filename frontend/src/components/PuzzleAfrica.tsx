import React, { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";

interface Currency {
  country: string;
  currency: string;
  code: string;
  flagEmoji: string;
  exchangeRateToEUR: number;
}

interface AfricaData {
  currencies: Currency[];
  startingAmount: number;
  startingCurrency: string;
  finalCurrency: string;
  expectedFinalAmount: number;
  hint: string;
}

export const PuzzleAfrica: React.FC = () => {
  const { room, submitPuzzle, requestHint } = useGameStore();
  const [answer, setAnswer] = useState("");
  const [data, setData] = useState<AfricaData | null>(null);

  useEffect(() => {
    fetch("/content/af_currencies.json")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to load Africa data:", err));
  }, []);

  if (!room || !data) return null;

  const solved = room.solved.af || false;
  const hintsUsed = room.hintsUsed.af || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    submitPuzzle("AFRICA", answer);
  };

  const handleHint = () => {
    if (hintsUsed < 2) {
      requestHint("AFRICA");
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
          🌍
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
            Afrique – Le Circuit Monétaire
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Suivez le parcours à travers 5 pays et calculez la conversion finale
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
              <span>💰</span>
              Monnaies disponibles
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1rem",
              }}
            >
              {data.currencies.map((currency) => (
                <div
                  key={currency.code}
                  style={{
                    padding: "1.25rem",
                    background: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2.5rem",
                      marginBottom: "0.5rem",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  >
                    {currency.flagEmoji}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      marginBottom: "0.25rem",
                      color: "#1e293b",
                    }}
                  >
                    {currency.country}
                  </div>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "0.875rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {currency.currency}
                  </div>
                  <div
                    style={{
                      color: "#44bdff",
                      fontWeight: 600,
                      fontSize: "1rem",
                    }}
                  >
                    {currency.code}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#94a3b8",
                      marginTop: "0.5rem",
                      fontWeight: "500",
                    }}
                  >
                    1 {currency.code} = {currency.exchangeRateToEUR} EUR
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "1.5rem",
              background: "rgba(68, 189, 255, 0.05)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "1px solid rgba(68, 189, 255, 0.2)",
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
              Mission
            </h4>
            <p
              style={{
                marginBottom: "0.5rem",
                color: "#475569",
              }}
            >
              Vous commencez avec{" "}
              <strong style={{ color: "#dc2626" }}>
                {data.startingAmount} {data.startingCurrency}
              </strong>
            </p>
            <p
              style={{
                marginBottom: "0.5rem",
                color: "#475569",
              }}
            >
              Convertissez cette somme dans chacune des 5 monnaies,{" "}
              <strong>dans l'ordre suivant</strong> :
            </p>
            <div
              style={{
                paddingLeft: "1.5rem",
                color: "#64748b",
                fontSize: "0.875rem",
                lineHeight: "1.6",
              }}
            >
              <div>1️⃣ MAD → EUR → XOF (Sénégal)</div>
              <div>2️⃣ XOF → EUR → KES (Kenya)</div>
              <div>3️⃣ KES → EUR → ZAR (Afrique du Sud)</div>
              <div>4️⃣ ZAR → EUR → EGP (Égypte)</div>
            </div>
            <p
              style={{
                marginTop: "0.75rem",
                fontWeight: 600,
                color: "#d97706",
              }}
            >
              💡 Arrondissez à l'entier le plus proche à chaque étape
            </p>
            <p
              style={{
                marginTop: "0.5rem",
                color: "#475569",
              }}
            >
              Le code final est le montant en{" "}
              <strong style={{ color: "#059669" }}>{data.finalCurrency}</strong>{" "}
              (4 chiffres)
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
          >
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Montant final en EGP (4 chiffres)"
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
              aria-label="Réponse pour le puzzle Afrique"
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
              {room.fragments.letterAF}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
