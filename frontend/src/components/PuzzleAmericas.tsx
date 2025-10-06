import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

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
  const [answer, setAnswer] = useState('');
  const [data, setData] = useState<AmericasData | null>(null);

  useEffect(() => {
    fetch('/content/am_items.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load Americas data:', err));
  }, []);

  if (!room || !data) return null;

  const solved = room.solved.am || false;
  const hintsUsed = room.hintsUsed.am || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    submitPuzzle('AMERICAS', answer);
  };

  const handleHint = () => {
    if (hintsUsed < 2) {
      requestHint('AMERICAS');
    }
  };

  const categorizeItem = (item: Item) => {
    // Vérifie si interdit
    if (data.prohibitedItems.includes(item.name)) {
      return 'prohibited';
    }

    // Vérifie les règles cabine
    if (item.isLiquid && item.volumeMl > data.rules.maxLiquidMl) {
      return 'checkin';
    }

    if (item.powerWh && item.powerWh > data.rules.maxPowerWh) {
      return 'checkin';
    }

    return 'cabin';
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'cabin') return '✈️';
    if (category === 'checkin') return '🧳';
    return '❌';
  };

  const getCategoryLabel = (category: string) => {
    if (category === 'cabin') return 'Cabine';
    if (category === 'checkin') return 'Soute';
    return 'Interdit';
  };

  const getCategoryColor = (category: string) => {
    if (category === 'cabin') return 'var(--color-success)';
    if (category === 'checkin') return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  // Calculer le poids total cabine
  const cabinWeight = data.items
    .filter(item => categorizeItem(item) === 'cabin')
    .reduce((sum, item) => sum + item.weightKg, 0);

  return (
    <div className="card" style={{ marginBottom: '2rem', animation: 'slideInFromBottom 0.5s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem' }}>✈️</div>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Amériques – Le Code Bagages
          </h2>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem' }}>
            Triez les objets selon les règles de sécurité aérienne
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
          <div style={{
            padding: '1rem',
            background: 'rgba(56, 182, 255, 0.1)',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem',
            border: '1px solid var(--color-border)'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-primary)' }}>
              📋 Règles de sécurité aérienne
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>✈️</div>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Cabine</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)' }}>
                  • Max {data.rules.maxCabinKg} kg<br />
                  • Liquides ≤ {data.rules.maxLiquidMl}ml/item<br />
                  • Powerbank ≤ {data.rules.maxPowerWh}Wh
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🧳</div>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Soute</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)' }}>
                  Objets dépassant<br />
                  les limites cabine
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>❌</div>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Interdit</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)' }}>
                  Objets proscrits<br />
                  partout
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-primary)' }}>
              🧳 Objets à trier
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {data.items.map((item, idx) => {
                const category = categorizeItem(item);

                return (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      background: 'var(--color-surface-light)',
                      borderRadius: 'var(--radius)',
                      border: `2px solid ${getCategoryColor(category)}`,
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      fontSize: '1.5rem'
                    }}>
                      {getCategoryIcon(category)}
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                      {item.name}
                    </div>

                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
                      <div>⚖️ Poids: {item.weightKg} kg</div>
                      {item.isLiquid && <div>💧 Liquide: {item.volumeMl} ml</div>}
                      {item.powerWh !== undefined && <div>🔋 Puissance: {item.powerWh} Wh</div>}
                    </div>

                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.375rem 0.75rem',
                      background: getCategoryColor(category),
                      color: category === 'cabin' ? 'var(--color-bg)' : 'white',
                      borderRadius: '50px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      textAlign: 'center'
                    }}>
                      {getCategoryLabel(category)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            padding: '1rem',
            background: 'var(--color-surface-light)',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem',
            border: '2px solid var(--color-primary)'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
              🎯 Code à trouver
            </h4>
            <p style={{ fontSize: '0.875rem' }}>
              Le code est la <strong>somme des poids (en kg)</strong> de tous les objets autorisés en <strong>cabine uniquement</strong>, formaté en 4 chiffres (ex: 0005 pour 5kg).
            </p>
            <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-dim)' }}>
              💡 Poids total cabine calculé : <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                {cabinWeight} kg
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Code 4 chiffres (ex: 0005)"
              pattern="\d{4}"
              maxLength={4}
              style={{ flex: 1 }}
              aria-label="Réponse pour le puzzle Amériques"
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
              {room.fragments.letterJoker}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
