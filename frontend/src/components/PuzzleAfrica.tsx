import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

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
  const [answer, setAnswer] = useState('');
  const [data, setData] = useState<AfricaData | null>(null);

  useEffect(() => {
    fetch('/content/af_currencies.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load Africa data:', err));
  }, []);

  if (!room || !data) return null;

  const solved = room.solved.af || false;
  const hintsUsed = room.hintsUsed.af || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    submitPuzzle('AFRICA', answer);
  };

  const handleHint = () => {
    if (hintsUsed < 2) {
      requestHint('AFRICA');
    }
  };

  return (
    <div className="card" style={{ marginBottom: '2rem', animation: 'slideInFromBottom 0.5s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem' }}>🌍</div>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Afrique – Le Circuit Monétaire
          </h2>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem' }}>
            Suivez le parcours à travers 5 pays et calculez la conversion finale
          </p>
        </div>
        {solved && (
          <div style={{
            marginLeft: 'auto',
            padding: '0.5rem 1rem',
            background: 'var(--color-success)',
            color: 'var(--color-bg)',
            borderRadius: '50px',
            fontWeight: 700,
            fontSize: '0.875rem'
          }}>
            ✓ Résolu
          </div>
        )}
      </div>

      {!solved && (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-primary)' }}>
              💰 Monnaies disponibles
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {data.currencies.map((currency) => (
                <div
                  key={currency.code}
                  style={{
                    padding: '1.25rem',
                    background: 'var(--color-surface-light)',
                    borderRadius: 'var(--radius)',
                    border: '2px solid var(--color-border)'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    {currency.flagEmoji}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                    {currency.country}
                  </div>
                  <div style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    {currency.currency}
                  </div>
                  <div style={{
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}>
                    {currency.code}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>
                    1 {currency.code} = {currency.exchangeRateToEUR} EUR
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            padding: '1rem',
            background: 'rgba(56, 182, 255, 0.1)',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem',
            border: '1px solid var(--color-border)'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              🎯 Mission
            </h4>
            <p style={{ marginBottom: '0.5rem' }}>
              Vous commencez avec <strong>{data.startingAmount} {data.startingCurrency}</strong>
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              Convertissez cette somme dans chacune des 5 monnaies, <strong>dans l'ordre suivant</strong> :
            </p>
            <div style={{ paddingLeft: '1.5rem', color: 'var(--color-text-dim)', fontSize: '0.875rem' }}>
              <div>1️⃣ MAD → EUR → XOF (Sénégal)</div>
              <div>2️⃣ XOF → EUR → KES (Kenya)</div>
              <div>3️⃣ KES → EUR → ZAR (Afrique du Sud)</div>
              <div>4️⃣ ZAR → EUR → EGP (Égypte)</div>
            </div>
            <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>
              💡 Arrondissez à l'entier le plus proche à chaque étape
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Le code final est le montant en <strong>{data.finalCurrency}</strong> (4 chiffres)
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Montant final en EGP (4 chiffres)"
              pattern="\d{4}"
              maxLength={4}
              style={{ flex: 1 }}
              aria-label="Réponse pour le puzzle Afrique"
            />
            <button type="submit" disabled={!answer.match(/^\d{4}$/)}>
              Valider
            </button>
          </form>

          <button
            onClick={handleHint}
            disabled={hintsUsed >= 2}
            className="secondary"
            style={{ width: '100%' }}
          >
            {hintsUsed === 0 && '💡 Demander un indice (-60s)'}
            {hintsUsed === 1 && '💡 Demander le 2e indice (-60s)'}
            {hintsUsed >= 2 && '⚠️ Indices épuisés'}
          </button>

          {hintsUsed > 0 && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(255, 183, 3, 0.15)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--color-warning)',
              color: 'var(--color-warning)',
              fontWeight: 600
            }}>
              💡 {data.hint}
            </div>
          )}
        </>
      )}

      {solved && (
        <div style={{
          padding: '1.5rem',
          background: 'rgba(6, 255, 165, 0.15)',
          borderRadius: 'var(--radius)',
          border: '2px solid var(--color-success)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Puzzle résolu !
          </div>
          <div style={{ color: 'var(--color-text-dim)' }}>
            Fragment obtenu : <span style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: '1.5rem' }}>
              {room.fragments.letterAF}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
