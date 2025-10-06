import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

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
  const [answer, setAnswer] = useState('');
  const [data, setData] = useState<AsiaData | null>(null);

  useEffect(() => {
    fetch('/content/as_time.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load Asia data:', err));
  }, []);

  if (!room || !data) return null;

  const solved = room.solved.as || false;
  const hintsUsed = room.hintsUsed.as || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    submitPuzzle('ASIA', answer);
  };

  const handleHint = () => {
    if (hintsUsed < 2) {
      requestHint('ASIA');
    }
  };

  const calculateLocalTime = (utcTime: string, offsetMinutes: number) => {
    const [hours, minutes] = utcTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + offsetMinutes;
    const localHours = Math.floor(totalMinutes / 60) % 24;
    const localMinutes = totalMinutes % 60;
    return `${String(localHours).padStart(2, '0')}:${String(localMinutes).padStart(2, '0')}`;
  };

  return (
    <div className="card" style={{ marginBottom: '2rem', animation: 'slideInFromBottom 0.5s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem' }}>🌏</div>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Asie – L'Énigme des Fuseaux
          </h2>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem' }}>
            Trouvez un horaire UTC où toutes les villes sont entre 08:00 et 20:00 locales
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
              🌐 Fuseaux horaires des villes
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {data.cities.map((city) => (
                <div
                  key={city.code}
                  style={{
                    padding: '1.25rem',
                    background: 'var(--color-surface-light)',
                    borderRadius: 'var(--radius)',
                    border: '2px solid var(--color-border)'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {city.code === 'TYO' && '🗼'}
                    {city.code === 'DEL' && '🕌'}
                    {city.code === 'BKK' && '🏯'}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                    {city.name}
                  </div>
                  <div style={{
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}>
                    {city.description}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>
                    Décalage: {city.offsetMinutes > 0 ? '+' : ''}{Math.floor(city.offsetMinutes / 60)}h{city.offsetMinutes % 60 > 0 ? (city.offsetMinutes % 60) : ''}
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
              🎯 Objectif
            </h4>
            <p style={{ marginBottom: '0.5rem' }}>
              Trouvez un horaire UTC (format HH:MM) tel que :
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-dim)' }}>
              <li>Tokyo est entre 08:00 et 20:00 locales</li>
              <li>Delhi est entre 08:00 et 20:00 locales</li>
              <li>Bangkok est entre 08:00 et 20:00 locales</li>
            </ul>
          </div>

          {/* Simulateur de temps */}
          {answer.match(/^\d{2}:\d{2}$/) && (
            <div style={{
              padding: '1rem',
              background: 'var(--color-surface-light)',
              borderRadius: 'var(--radius)',
              marginBottom: '1.5rem',
              border: '2px solid var(--color-primary)'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
                ⏰ Simulation pour {answer} UTC
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {data.cities.map((city) => {
                  const localTime = calculateLocalTime(answer, city.offsetMinutes);
                  const [hours] = localTime.split(':').map(Number);
                  const isValid = hours >= 8 && hours < 20;

                  return (
                    <div
                      key={city.code}
                      style={{
                        padding: '0.75rem',
                        background: isValid ? 'rgba(6, 255, 165, 0.1)' : 'rgba(255, 0, 110, 0.1)',
                        borderRadius: 'var(--radius)',
                        border: `2px solid ${isValid ? 'var(--color-success)' : 'var(--color-error)'}`,
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{city.name}</div>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: isValid ? 'var(--color-success)' : 'var(--color-error)',
                        marginTop: '0.25rem'
                      }}>
                        {localTime}
                      </div>
                      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        {isValid ? '✓ Valide' : '✗ Hors plage'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="HH:MM (ex: 06:30)"
              pattern="\d{2}:\d{2}"
              style={{ flex: 1 }}
              aria-label="Réponse pour le puzzle Asie"
            />
            <button type="submit" disabled={!answer.match(/^\d{2}:\d{2}$/)}>
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
              {room.fragments.directionAS}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
