import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useNavigate } from 'react-router-dom';

export const DebriefJourney: React.FC = () => {
  const { room } = useGameStore();
  const navigate = useNavigate();

  if (!room) return null;

  const allSolved = room.solved.eu && room.solved.as && room.solved.am;
  const totalHints = (room.hintsUsed.eu || 0) + (room.hintsUsed.as || 0) + (room.hintsUsed.am || 0);
  const timeRemaining = room.timerSec;
  const score = Math.max(0, timeRemaining - (totalHints * 60));

  const handleReplay = () => {
    navigate('/');
    window.location.reload();
  };

  const destinations = [
    { id: 'eu', name: 'Europe', emoji: '🇪🇺', solved: room.solved.eu, hints: room.hintsUsed.eu || 0, color: '#667eea' },
    { id: 'as', name: 'Asie', emoji: '🌏', solved: room.solved.as, hints: room.hintsUsed.as || 0, color: '#f5576c' },
    { id: 'am', name: 'Amériques', emoji: '✈️', solved: room.solved.am, hints: room.hintsUsed.am || 0, color: '#00f2fe' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '900px', width: '100%' }}>
        <div className="card" style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.95)' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
            {allSolved ? '🎉' : '📋'}
          </div>

          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            {allSolved ? 'Mission Accomplie !' : 'Fin du Voyage'}
          </h1>

          <div style={{
            padding: '2rem',
            background: allSolved ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                       'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: 'var(--radius)',
            marginBottom: '2rem',
            color: 'white'
          }}>
            <div style={{ fontSize: '1rem', marginBottom: '0.5rem', opacity: 0.9 }}>Score final</div>
            <div style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{score}</div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>
              {timeRemaining}s restants • {totalHints} indice(s) utilisé(s)
            </div>
          </div>

          {/* Voyage récapitulatif */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>🗺️ Votre Voyage</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {destinations.map((dest) => (
                <div
                  key={dest.id}
                  style={{
                    padding: '1.5rem',
                    background: dest.solved ?
                      `linear-gradient(135deg, ${dest.color}, ${dest.color}dd)` :
                      'linear-gradient(135deg, #94a3b8, #64748b)',
                    borderRadius: 'var(--radius)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{dest.emoji}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {dest.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                    {dest.solved ? '✓ Résolu' : '✗ Non résolu'}
                  </div>
                  <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.8 }}>
                    {dest.hints} indice(s)
                  </div>
                  {dest.solved && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      fontSize: '2rem'
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Apprentissages */}
          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            borderRadius: 'var(--radius)',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', textAlign: 'center' }}>
              🎓 Ce que vous avez appris
            </h3>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>Les langues européennes appartiennent à plusieurs familles linguistiques distinctes</li>
              <li>Certains fuseaux horaires utilisent des décalages de 30 ou 45 minutes (Inde, Iran...)</li>
              <li>Les règles de sécurité aérienne évoluent régulièrement pour notre protection</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2rem', fontStyle: 'italic', color: 'var(--color-text-dim)' }}>
            Chaque puzzle révèle la complexité et la richesse de notre monde interconnecté.
          </div>

          <button onClick={handleReplay} style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.25rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none'
          }}>
            🔄 Nouveau Voyage
          </button>
        </div>
      </div>
    </div>
  );
};
