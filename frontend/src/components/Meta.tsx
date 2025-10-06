import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

// Mapping des continents avec leurs infos et clés de fragments
const continentInfo: Record<string, { emoji: string; name: string; fragmentKey: string; color: string }> = {
  EUROPE: { emoji: '🇪🇺', name: 'Europe', fragmentKey: 'letterEU', color: '#7DD3FC' },
  ASIA: { emoji: '🌏', name: 'Asie', fragmentKey: 'directionAS', color: '#86EFAC' },
  AMERICAS: { emoji: '✈️', name: 'Amériques', fragmentKey: 'letterJoker', color: '#FCD34D' },
  AFRICA: { emoji: '🌍', name: 'Afrique', fragmentKey: 'letterAF', color: '#FDBA74' },
  OCEANIA: { emoji: '🏝️', name: 'Océanie', fragmentKey: 'directionOC', color: '#7DD3FC' },
  ANTARCTICA: { emoji: '🧊', name: 'Antarctique', fragmentKey: 'letterAN', color: '#A5F3FC' }
};

export const Meta: React.FC = () => {
  const { room, submitMeta } = useGameStore();
  const [answer, setAnswer] = useState('');

  if (!room) return null;

  // Récupérer les 3 continents tirés
  const drawnContinents = room.draw || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    submitMeta(answer);
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🧩 Serveur Central S.H.A.D.O.W.</h2>

      <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
        Vous avez infiltré les 3 nœuds continentaux et récupéré les fragments du mot de passe maître.
        <br />
        <strong style={{ color: 'var(--color-warning)' }}>Assemblez-les pour accéder au serveur central !</strong>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {drawnContinents.map((continent: string) => {
          const info = continentInfo[continent];
          if (!info) return null;

          const fragment = (room.fragments as Record<string, string>)[info.fragmentKey] || '?';

          return (
            <div
              key={continent}
              className="card"
              style={{
                background: `linear-gradient(135deg, ${info.color}22 0%, ${info.color}44 100%)`,
                border: `3px solid ${info.color}`,
                textAlign: 'center',
                padding: '1.5rem 1rem'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {info.emoji}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)', marginBottom: '0.75rem', fontWeight: 700 }}>
                {info.name}
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: info.color, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                {fragment}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'linear-gradient(135deg, #FB718544 0%, #FB718566 100%)', border: '3px solid #FB7185', borderRadius: 'var(--radius)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <strong style={{ color: '#FB7185', fontSize: '1.1rem' }}>Règle d'assemblage :</strong>
        </div>
        <p style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>
          Combinez les 3 fragments dans l'ordre d'apparition pour former le mot de passe.
          <br />
          <em style={{ fontSize: '0.9rem', opacity: 0.9 }}>Utilisez les lettres et directions exactement comme indiqué.</em>
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value.toUpperCase())}
          placeholder="Entrez le mot de passe maître..."
          style={{ flex: 1 }}
          aria-label="Mot de passe du serveur central"
          autoFocus
        />
        <button type="submit" disabled={!answer.trim()} style={{ padding: '0.75rem 2rem' }}>
          🔓 Accéder
        </button>
      </form>
    </div>
  );
};
