import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useNavigate } from 'react-router-dom';

export const Debrief: React.FC = () => {
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

  return (
    <div className="card">
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>
        {allSolved ? '🎉 Mission accomplie !' : '📋 Débrief'}
      </h2>

      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: allSolved ? 'var(--color-success)' : 'var(--color-warning)',
        borderRadius: 'var(--radius)',
        marginBottom: '2rem',
        color: allSolved ? 'white' : '#000'
      }}>
        <div style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Score final</div>
        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{score}</div>
        <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          {timeRemaining}s restants - {totalHints} indice(s) utilisé(s)
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Statistiques</h3>
        <ul style={{ listStyle: 'none' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            🇪🇺 Europe : {room.solved.eu ? '✓ Résolu' : '✗ Non résolu'} ({room.hintsUsed.eu || 0} indice(s))
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            🌏 Asie : {room.solved.as ? '✓ Résolu' : '✗ Non résolu'} ({room.hintsUsed.as || 0} indice(s))
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            ✈️ Amériques : {room.solved.am ? '✓ Résolu' : '✗ Non résolu'} ({room.hintsUsed.am || 0} indice(s))
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius)' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Ce que vous avez appris</h3>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            Les langues européennes appartiennent à plusieurs familles linguistiques distinctes
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Certains fuseaux horaires utilisent des décalages de 30 ou 45 minutes
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Les règles de sécurité aérienne évoluent régulièrement pour notre protection
          </li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <p style={{ marginBottom: '1rem', fontStyle: 'italic' }}>
          Chaque puzzle révèle la complexité et la richesse de notre monde interconnecté.
        </p>
      </div>

      <button onClick={handleReplay} style={{ width: '100%' }}>
        🔄 Rejouer une partie
      </button>
    </div>
  );
};
