import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

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
  const [answer, setAnswer] = useState('');
  const [data, setData] = useState<EuropeData | null>(null);

  useEffect(() => {
    fetch('/content/eu_salutations.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load Europe data:', err));
  }, []);

  if (!room || !data) return null;

  const solved = room.solved.eu || false;
  const hintsUsed = room.hintsUsed.eu || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    submitPuzzle('EUROPE', answer);
  };

  const handleHint = () => {
    if (hintsUsed < 2) {
      requestHint('EUROPE');
    }
  };

  return (
    <div className="card" style={{ marginBottom: '2rem', animation: 'slideInFromBottom 0.5s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem' }}>🇪🇺</div>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Europe – Le Mystère Linguistique
          </h2>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem' }}>
            Trouvez le mot de 5 lettres en analysant les familles linguistiques
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
              📋 Données linguistiques
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Salutation</th>
                    <th>Langue</th>
                    <th>Pays</th>
                    <th>Famille Linguistique</th>
                  </tr>
                </thead>
                <tbody>
                  {data.salutations.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{item.greeting}</td>
                      <td>{item.language}</td>
                      <td>{item.country}</td>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: 'rgba(56, 182, 255, 0.15)',
                          borderRadius: '50px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: 'var(--color-primary)'
                        }}>
                          {item.linguisticFamily}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              🔑 Correspondance Famille → Lettre
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {Object.entries(data.familyMapping).map(([family, letter]) => (
                <div
                  key={family}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius)',
                    border: '2px solid var(--color-primary)',
                    fontWeight: 600
                  }}
                >
                  {family} = <span style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}>{letter}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.toUpperCase())}
              placeholder="Mot (5 lettres)"
              maxLength={5}
              style={{ flex: 1, textTransform: 'uppercase' }}
              aria-label="Réponse pour le puzzle Europe"
            />
            <button type="submit" disabled={answer.length !== 5}>
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
              {room.fragments.letterEU}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
