import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

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
  const [answer, setAnswer] = useState('');
  const [data, setData] = useState<OceaniaData | null>(null);

  useEffect(() => {
    fetch('/content/oc_islands.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load Oceania data:', err));
  }, []);

  if (!room || !data) return null;

  const solved = room.solved.oc || false;
  const hintsUsed = room.hintsUsed.oc || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    submitPuzzle('OCEANIA', answer);
  };

  const handleHint = () => {
    if (hintsUsed < 2) {
      requestHint('OCEANIA');
    }
  };

  return (
    <div className="card" style={{ marginBottom: '2rem', animation: 'slideInFromBottom 0.5s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem' }}>🏝️</div>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Océanie – La Route des Îles
          </h2>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem' }}>
            Trouvez la route la plus courte à travers l'océan Pacifique
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
              🌊 Îles du Pacifique
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {data.islands.map((island) => (
                <div
                  key={island.code}
                  style={{
                    padding: '1.25rem',
                    background: 'var(--color-surface-light)',
                    borderRadius: 'var(--radius)',
                    border: '2px solid var(--color-border)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    {island.emoji}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                    {island.name}
                  </div>
                  <div style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    {island.country}
                  </div>
                  <div style={{
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}>
                    Code: {island.code}
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
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
              📏 Distances entre îles (km)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.875rem' }}>
              {Object.entries(data.distances).map(([route, distance]) => (
                <div
                  key={route}
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--color-border)',
                    fontWeight: 600
                  }}
                >
                  {route}: <span style={{ color: 'var(--color-primary)' }}>{distance} km</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            padding: '1rem',
            background: 'var(--color-surface-light)',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem',
            border: '2px solid var(--color-primary)'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-primary)' }}>
              🗺️ Routes possibles
            </h4>
            {data.routes.map((route) => (
              <div
                key={route.name}
                style={{
                  padding: '1rem',
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius)',
                  marginBottom: '0.75rem',
                  border: '2px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                      {route.name}
                    </div>
                    <div style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
                      {route.path.join(' → ')}
                    </div>
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--color-primary)',
                    color: 'white',
                    borderRadius: '50px',
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}>
                    {route.totalDistance} km
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '1rem',
            background: 'rgba(255, 183, 3, 0.1)',
            borderRadius: 'var(--radius)',
            marginBottom: '1.5rem',
            border: '1px solid var(--color-warning)'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              🎯 Question
            </h4>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {data.question}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.toUpperCase())}
              placeholder="Lettre de la route (A, B, C ou D)"
              maxLength={1}
              style={{ flex: 1, textTransform: 'uppercase' }}
              aria-label="Réponse pour le puzzle Océanie"
            />
            <button type="submit" disabled={!answer.match(/^[A-D]$/i)}>
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
              {room.fragments.directionOC}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
