import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

// Mapping des continents pour l'affichage
const continentInfo: Record<string, { emoji: string; name: string }> = {
  EUROPE: { emoji: '🇪🇺', name: 'Europe' },
  ASIA: { emoji: '🌏', name: 'Asie' },
  AMERICAS: { emoji: '✈️', name: 'Amériques' },
  AFRICA: { emoji: '🌍', name: 'Afrique' },
  OCEANIA: { emoji: '🏝️', name: 'Océanie' },
  ANTARCTICA: { emoji: '🧊', name: 'Antarctique' }
};

export const Final: React.FC = () => {
  const { room, submitFinal } = useGameStore();
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!room?.finalStartedAt) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(room.finalStartedAt).getTime()) / 1000);
      const remaining = Math.max(0, 30 - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [room?.finalStartedAt]);

  if (!room) return null;

  const drawnContinents = room.draw || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || timeLeft === 0) return;

    submitFinal(answer);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1d2e 0%, #0f1117 100%)',
      border: '4px solid #FB7185',
      borderRadius: 'var(--radius)',
      padding: '2rem',
      boxShadow: '0 0 40px rgba(251, 113, 133, 0.5)',
      animation: timeLeft < 10 ? 'shake 0.5s infinite' : 'none'
    }}>
      {/* Header Terminal */}
      <div style={{
        background: 'linear-gradient(135deg, #FB7185 0%, #DC2626 100%)',
        padding: '1rem',
        borderRadius: '10px',
        marginBottom: '1.5rem',
        border: '3px solid rgba(0, 0, 0, 0.3)',
        boxShadow: '0 8px 0 rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '0.25rem' }}>
              &gt; TERMINAL SÉCURISÉ S.H.A.D.O.W.
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '2px' }}>
              ⚠️ DÉSACTIVATION VIRUS
            </div>
          </div>
          <div style={{
            fontSize: '3rem',
            fontWeight: 900,
            color: timeLeft < 10 ? '#FFF' : '#FCD34D',
            textShadow: '0 0 20px currentColor',
            animation: timeLeft < 10 ? 'pulse 0.5s infinite' : 'none'
          }}>
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Statut nœuds infiltrés */}
      <div style={{
        background: 'rgba(134, 239, 172, 0.1)',
        border: '2px solid #86EFAC',
        borderRadius: '10px',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ fontSize: '0.875rem', color: '#86EFAC', marginBottom: '0.75rem', fontWeight: 700 }}>
          ✓ NŒUDS INFILTRÉS :
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {drawnContinents.map((continent: string) => {
            const info = continentInfo[continent];
            return (
              <div key={continent} style={{
                background: 'rgba(134, 239, 172, 0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '2px solid #86EFAC',
                color: 'white',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>{info.emoji}</span>
                <span>{info.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message d'alerte */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(251, 113, 133, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
        border: '3px solid #FB7185',
        borderRadius: '10px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        color: 'white'
      }}>
        <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 700 }}>
          🚨 ALERTE CRITIQUE
        </div>
        <p style={{ lineHeight: '1.6', margin: 0 }}>
          Le virus <strong>ATLAS-KILLER</strong> est prêt à s'activer !
          <br />
          Entrez le <strong style={{ color: '#FCD34D' }}>code de désactivation final</strong> maintenant !
        </p>
      </div>

      {/* Console input */}
      <div style={{
        background: '#000',
        border: '3px solid #38B6FF',
        borderRadius: '10px',
        padding: '1.5rem',
        fontFamily: 'monospace',
        marginBottom: '1rem'
      }}>
        <div style={{ color: '#86EFAC', marginBottom: '1rem', fontSize: '0.875rem' }}>
          &gt; root@shadow-central:~# disable_virus --code=
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ color: '#38B6FF', fontSize: '1.2rem' }}>&gt;</div>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value.toUpperCase())}
            placeholder="CODE DÉSACTIVATION..."
            disabled={timeLeft === 0}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#FFF',
              fontSize: '1.5rem',
              fontWeight: 900,
              letterSpacing: '3px',
              outline: 'none',
              fontFamily: 'monospace',
              padding: '0.5rem'
            }}
            autoFocus
            aria-label="Code de désactivation"
          />
          <button
            type="submit"
            disabled={!answer.trim() || timeLeft === 0}
            style={{
              background: timeLeft === 0 ? '#64748B' : 'linear-gradient(135deg, #86EFAC 0%, #059669 100%)',
              padding: '0.75rem 2rem',
              fontSize: '1.2rem',
              fontWeight: 900,
              border: '3px solid rgba(0, 0, 0, 0.3)',
              boxShadow: timeLeft === 0 ? 'none' : '0 6px 0 rgba(0, 0, 0, 0.3)',
              animation: (!answer.trim() || timeLeft === 0) ? 'none' : 'pulse 2s infinite'
            }}
          >
            {timeLeft === 0 ? '⏰ EXPIRÉ' : '🔓 DÉSACTIVER'}
          </button>
        </form>
      </div>

      {timeLeft === 0 && (
        <div style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
          borderRadius: '10px',
          color: 'white',
          textAlign: 'center',
          fontSize: '1.2rem',
          fontWeight: 900,
          border: '3px solid rgba(0, 0, 0, 0.3)',
          boxShadow: '0 8px 0 rgba(0, 0, 0, 0.3)'
        }}>
          💥 TEMPS ÉCOULÉ ! Le virus ATLAS-KILLER a été activé...
        </div>
      )}

      {timeLeft > 0 && (
        <div style={{
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#BAE6FD',
          fontStyle: 'italic'
        }}>
          💡 Indice : Le code final est basé sur les continents infiltrés
        </div>
      )}
    </div>
  );
};
