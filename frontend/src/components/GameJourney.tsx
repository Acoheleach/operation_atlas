import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useNavigate } from 'react-router-dom';
import { GameStage } from '../types/game';
import { PuzzleEurope } from './PuzzleEurope';
import { PuzzleAsia } from './PuzzleAsia';
import { PuzzleAmericas } from './PuzzleAmericas';
import { PuzzleAfrica } from './PuzzleAfrica';
import { PuzzleOceania } from './PuzzleOceania';
import { PuzzleAntarctica } from './PuzzleAntarctica';
import { Meta } from './Meta';
import { Final } from './Final';

type Destination = 'EUROPE' | 'ASIA' | 'AMERICAS' | 'AFRICA' | 'OCEANIA' | 'ANTARCTICA' | 'META' | 'FINAL';

const allContinentInfo: Record<string, { name: string; emoji: string; color: string; bg: string }> = {
  EUROPE: { name: 'Europe', emoji: '🇪🇺', color: '#7DD3FC', bg: 'linear-gradient(135deg, #7DD3FC 0%, #0C4A6E 100%)' },
  ASIA: { name: 'Asie', emoji: '🌏', color: '#86EFAC', bg: 'linear-gradient(135deg, #86EFAC 0%, #064E3B 100%)' },
  AMERICAS: { name: 'Amériques', emoji: '✈️', color: '#FCD34D', bg: 'linear-gradient(135deg, #FCD34D 0%, #92400E 100%)' },
  AFRICA: { name: 'Afrique', emoji: '🌍', color: '#FDBA74', bg: 'linear-gradient(135deg, #FDBA74 0%, #9A3412 100%)' },
  OCEANIA: { name: 'Océanie', emoji: '🏝️', color: '#7DD3FC', bg: 'linear-gradient(135deg, #7DD3FC 0%, #164E63 100%)' },
  ANTARCTICA: { name: 'Antarctique', emoji: '🧊', color: '#A5F3FC', bg: 'linear-gradient(135deg, #A5F3FC 0%, #155E75 100%)' },
  META: { name: 'Synthèse', emoji: '🧩', color: '#86EFAC', bg: 'linear-gradient(135deg, #86EFAC 0%, #7DD3FC 100%)' },
  FINAL: { name: 'Mission Finale', emoji: '🎯', color: '#FCD34D', bg: 'linear-gradient(135deg, #FCD34D 0%, #7DD3FC 100%)' }
};

export const GameJourney: React.FC = () => {
  const { room, chatMessages, sendChat, notification, error, setError } = useGameStore();
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [nextDestination, setNextDestination] = useState<Destination | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [showTransition, setShowTransition] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!room) {
      navigate('/');
      return;
    }

    if (room.stage === GameStage.DEBRIEF) {
      navigate('/debrief');
    }
  }, [room, navigate]);

  useEffect(() => {
    if (!room || !room.draw || room.draw.length === 0) return;

    // Déterminer la destination actuelle
    if (room.stage === GameStage.META) {
      if (currentDestination !== 'META') {
        triggerTransition('META');
      }
    } else if (room.stage === GameStage.FINAL) {
      if (currentDestination !== 'FINAL') {
        triggerTransition('FINAL');
      }
    } else if (room.stage === GameStage.PLAY) {
      // Aller à la première destination non résolue parmi les continents tirés
      const drawnContinents = room.draw as Destination[];

      for (let i = 0; i < drawnContinents.length; i++) {
        const continent = drawnContinents[i];
        const continentKey = continent.toLowerCase().substring(0, 2);

        if (!room.solved[continentKey]) {
          if (currentDestination !== continent) {
            if (currentDestination === null) {
              setCurrentDestination(continent);
            } else {
              triggerTransition(continent);
            }
          }
          return;
        }
      }
    }
  }, [room?.stage, room?.solved, room?.draw]);

  const triggerTransition = (destination: Destination) => {
    setNextDestination(destination);
    setShowTransition(true);
    setTimeout(() => {
      setCurrentDestination(destination);
      setShowTransition(false);
      setNextDestination(null);
    }, 1500);
  };

  if (!room || !currentDestination) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChat(chatInput);
    setChatInput('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (room.timerSec < 60) return 'timer danger';
    if (room.timerSec < 300) return 'timer warning';
    return 'timer';
  };

  // Build destinations array dynamically based on room.draw
  const destinations = [
    ...(room.draw || []).map(continent => ({
      id: continent,
      ...allContinentInfo[continent]
    })),
    { id: 'META', ...allContinentInfo.META },
    { id: 'FINAL', ...allContinentInfo.FINAL }
  ];

  const currentDest = allContinentInfo[currentDestination];

  // Count completed puzzles from the drawn continents
  const completedCount = (room.draw || []).filter((continent: string) => {
    const key = continent.toLowerCase().substring(0, 2);
    return room.solved[key];
  }).length;

  // Calculate current position in journey (1-5)
  let currentPosition = completedCount + 1;
  if (currentDestination === 'META') {
    currentPosition = 4;
  } else if (currentDestination === 'FINAL') {
    currentPosition = 5;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: currentDest.bg,
      transition: 'background 1s ease',
      padding: '2rem'
    }}>
      {/* Transition overlay */}
      {showTransition && nextDestination && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
              {allContinentInfo[nextDestination]?.emoji}
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              En route vers...
            </h2>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>
              {allContinentInfo[nextDestination]?.name}
            </h1>
          </div>
        </div>
      )}

      <div className="container" style={{ maxWidth: '1400px' }}>
        {/* Header avec progression */}
        <div className="card" style={{ marginBottom: '2rem', background: 'rgba(255, 255, 255, 0.95)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem' }}>{currentDest.emoji}</span>
                {currentDest.name}
              </h1>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)' }}>
                Destination {currentPosition} / 5
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
                Temps restant
              </div>
              <div className={getTimerClass()} aria-live="polite" aria-atomic="true">
                {formatTime(room.timerSec)}
              </div>
            </div>

            {/* Itinéraire */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {destinations.map((dest, idx) => {
                // Déterminer si cette destination est complétée
                let isCompleted = false;
                if (dest.id === 'META' || dest.id === 'FINAL') {
                  // META/FINAL ne sont jamais "complétés" dans l'itinéraire
                  isCompleted = false;
                } else {
                  // C'est un continent, vérifier s'il est résolu
                  const continentKey = dest.id.toLowerCase().substring(0, 2);
                  isCompleted = room.solved[continentKey] || false;
                }

                return (
                  <div
                    key={dest.id}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: currentDestination === dest.id ? dest.color :
                                 (isCompleted ? 'var(--color-success)' : 'var(--color-border)'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      border: currentDestination === dest.id ? '3px solid white' : 'none',
                      boxShadow: currentDestination === dest.id ? '0 0 20px rgba(0,0,0,0.3)' : 'none',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                    title={dest.name}
                  >
                    {isCompleted ? '✓' : dest.emoji}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          <div>
            {currentDestination === 'EUROPE' && <PuzzleEurope />}
            {currentDestination === 'ASIA' && <PuzzleAsia />}
            {currentDestination === 'AMERICAS' && <PuzzleAmericas />}
            {currentDestination === 'AFRICA' && <PuzzleAfrica />}
            {currentDestination === 'OCEANIA' && <PuzzleOceania />}
            {currentDestination === 'ANTARCTICA' && <PuzzleAntarctica />}
            {currentDestination === 'META' && <Meta />}
            {currentDestination === 'FINAL' && <Final />}
          </div>

          {/* Sidebar avec chat et équipe */}
          <div>
            <div className="card" style={{ marginBottom: '1rem', background: 'rgba(255, 255, 255, 0.95)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                👥 Équipe ({room.players.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {room.players.map((player) => (
                  <div
                    key={player.id}
                    style={{
                      padding: '0.5rem',
                      background: player.connected ? 'var(--color-success)' : 'var(--color-border)',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.875rem',
                      opacity: player.connected ? 1 : 0.5
                    }}
                  >
                    {player.pseudo}
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>💬 Chat d'équipe</h3>
              <div
                style={{
                  height: '300px',
                  overflowY: 'auto',
                  background: 'var(--color-bg)',
                  padding: '1rem',
                  borderRadius: 'var(--radius)',
                  marginBottom: '1rem'
                }}
                role="log"
                aria-live="polite"
              >
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <strong style={{ color: 'var(--color-primary)' }}>{msg.pseudo}:</strong>{' '}
                    {msg.message}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Message..."
                  maxLength={200}
                  style={{ flex: 1, fontSize: '0.875rem', padding: '0.5rem' }}
                  aria-label="Message de chat"
                />
                <button type="submit" disabled={!chatInput.trim()} style={{ padding: '0.5rem 1rem' }}>
                  →
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className="notification" role="alert">
          {notification}
        </div>
      )}

      {error && (
        <div className="notification error" role="alert">
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              float: 'right',
              cursor: 'pointer',
              padding: '0 0.5rem'
            }}
            aria-label="Fermer l'erreur"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
