import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

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
  const [answer, setAnswer] = useState('');
  const [data, setData] = useState<AntarcticaData | null>(null);

  useEffect(() => {
    fetch('/content/an_stations.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load Antarctica data:', err));
  }, []);

  if (!room || !data) return null;

  const solved = room.solved.an || false;
  const hintsUsed = room.hintsUsed.an || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    submitPuzzle('ANTARCTICA', answer);
  };

  const handleHint = () => {
    if (hintsUsed < 2) {
      requestHint('ANTARCTICA');
    }
  };

  const getCategoryForTemp = (temp: number) => {
    if (temp < -50) return 'extreme';
    if (temp >= -50 && temp <= -20) return 'harsh';
    return 'moderate';
  };

  const getCategoryColor = (category: string) => {
    if (category === 'extreme') return '#FF006E';
    if (category === 'harsh') return '#FFB703';
    return '#4CC9F0';
  };

  return (
    <div className="card" style={{ marginBottom: '2rem', animation: 'slideInFromBottom 0.5s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem' }}>🧊</div>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Antarctique – Les Gardiens du Pôle
          </h2>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem' }}>
            Analysez les stations de recherche et trouvez la plus extrême
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
              ❄️ Stations de recherche
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {data.researchStations.map((station) => {
                const category = getCategoryForTemp(station.avgTempC);
                const categoryColor = getCategoryColor(category);

                return (
                  <div
                    key={station.name}
                    style={{
                      padding: '1.25rem',
                      background: 'var(--color-surface-light)',
                      borderRadius: 'var(--radius)',
                      border: `2px solid ${categoryColor}`,
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      fontSize: '2rem'
                    }}>
                      {station.emoji}
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                      {station.name}
                    </div>
                    <div style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                      {station.country}
                    </div>

                    <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <div style={{ marginBottom: '0.25rem' }}>
                        🌡️ Température: <span style={{
                          color: categoryColor,
                          fontWeight: 700,
                          fontSize: '1.1rem'
                        }}>
                          {station.avgTempC}°C
                        </span>
                      </div>
                      <div style={{ color: 'var(--color-text-dim)' }}>
                        📍 {station.coordinates.latitude.toFixed(2)}°, {station.coordinates.longitude.toFixed(2)}°
                      </div>
                      <div style={{ color: 'var(--color-text-dim)' }}>
                        📅 Établie en {station.established}
                      </div>
                      <div style={{ color: 'var(--color-text-dim)' }}>
                        👥 Personnel: {station.personnel}
                      </div>
                    </div>

                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.375rem 0.75rem',
                      background: categoryColor,
                      color: 'white',
                      borderRadius: '50px',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textAlign: 'center'
                    }}>
                      {category === 'extreme' && '🥶 EXTRÊME'}
                      {category === 'harsh' && '❄️ RIGOUREUX'}
                      {category === 'moderate' && '🌊 MODÉRÉ'}
                    </div>
                  </div>
                );
              })}
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
              🌡️ Catégories de température
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(data.categories).map(([key, description]) => (
                <div
                  key={key}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius)',
                    border: `2px solid ${getCategoryColor(key)}`,
                    fontSize: '0.875rem'
                  }}
                >
                  <span style={{ color: getCategoryColor(key), fontWeight: 700 }}>
                    {key.toUpperCase()}:
                  </span> {description}
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
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
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
              placeholder="Nom de la station"
              style={{ flex: 1, textTransform: 'uppercase' }}
              aria-label="Réponse pour le puzzle Antarctique"
            />
            <button type="submit" disabled={answer.length < 3}>
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
              {room.fragments.letterAN}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
