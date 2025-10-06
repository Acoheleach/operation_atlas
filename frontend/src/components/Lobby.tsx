import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useNavigate } from 'react-router-dom';
import { GameStage } from '../types/game';

export const Lobby: React.FC = () => {
  const { room, startGame, sendChat, chatMessages } = useGameStore();
  const [chatInput, setChatInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (room && room.stage !== GameStage.BRIEF) {
      navigate('/game');
    }
  }, [room, navigate]);

  if (!room) {
    return (
      <div className="container">
        <div className="card">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sendChat(chatInput);
    setChatInput('');
  };

  const canStart = room.players.length >= 2;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Briefing – Opération ATLAS</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Code de la partie</h2>
            <div style={{
              background: 'var(--color-primary)',
              padding: '1rem',
              borderRadius: 'var(--radius)',
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              letterSpacing: '0.2em'
            }}>
              {room.joinCode}
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-dim)' }}>
              Partagez ce code avec vos coéquipiers
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Joueurs ({room.players.length}/4)</h2>
            <ul style={{ listStyle: 'none' }}>
              {room.players.map((player) => (
                <li
                  key={player.id}
                  style={{
                    padding: '0.5rem',
                    background: player.connected ? 'var(--color-success)' : 'var(--color-border)',
                    borderRadius: 'var(--radius)',
                    marginBottom: '0.5rem',
                    opacity: player.connected ? 1 : 0.5
                  }}
                >
                  {player.pseudo}
                  {!player.connected && ' (déconnecté)'}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Objectif</h2>
          <p>
            Résolvez 3 puzzles géographiques (Europe, Asie, Amériques), combinez les fragments, et déverrouillez la clé finale en moins de 25 minutes.
          </p>
        </div>

        <button
          onClick={startGame}
          disabled={!canStart}
          style={{ width: '100%' }}
        >
          {canStart ? 'Lancer la mission' : 'En attente de joueurs (min. 2)'}
        </button>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Chat</h2>
        <div
          style={{
            height: '200px',
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
            <div key={i} style={{ marginBottom: '0.5rem' }}>
              <strong>{msg.pseudo}:</strong> {msg.message}
            </div>
          ))}
        </div>

        <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Écrivez un message..."
            maxLength={200}
            style={{ flex: 1 }}
            aria-label="Message de chat"
          />
          <button type="submit" disabled={!chatInput.trim()}>
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};
