import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const [pseudo, setPseudo] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [mode, setMode] = useState<'create' | 'join' | null>(null);

  const { createRoom, joinRoom, error, setError } = useGameStore();
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim()) return;

    try {
      await createRoom(pseudo);
      navigate('/brief');
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim() || !joinCode.trim()) return;

    try {
      await joinRoom(joinCode.toUpperCase(), pseudo);
      navigate('/brief');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1d2e 0%, #252938 50%, #1a1d2e 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Étoiles animées */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent)',
        backgroundSize: '200px 200px',
        opacity: 0.3,
        animation: 'float 20s ease-in-out infinite'
      }} />

      <div className="container" style={{ maxWidth: '600px', position: 'relative', zIndex: 1 }}>
        <div className="card" style={{
          background: 'var(--color-surface)',
          animation: 'scaleIn 0.6s ease-out'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              fontSize: '6rem',
              marginBottom: '1rem',
              animation: 'float 3s ease-in-out infinite'
            }}>
              🗺️
            </div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              marginBottom: '0.5rem',
              color: '#38B6FF',
              textShadow: '4px 4px 0 rgba(0, 0, 0, 0.3)',
              letterSpacing: '2px'
            }}>
              OPÉRATION ATLAS
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: 'var(--color-text-dim)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              Le Cartographe Fantôme
            </p>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              background: 'var(--color-error)',
              borderRadius: 'var(--radius)',
              marginBottom: '1.5rem',
              color: 'white',
              fontWeight: 900,
              border: '4px solid rgba(0, 0, 0, 0.3)',
              boxShadow: '0 4px 0 rgba(0, 0, 0, 0.3)',
              animation: 'shake 0.5s ease'
            }}>
              {error}
              <button
                onClick={() => setError(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  float: 'right',
                  cursor: 'pointer',
                  padding: '0 0.5rem',
                  fontSize: '1.5rem',
                  fontWeight: 900
                }}
                aria-label="Fermer l'erreur"
              >
                ×
              </button>
            </div>
          )}

          {mode === null && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              animation: 'slideInFromBottom 0.5s ease-out'
            }}>
              <button
                onClick={() => setMode('create')}
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  fontSize: '1.3rem',
                  background: 'linear-gradient(135deg, #7DD3FC 0%, #155E75 100%)'
                }}
              >
                🚀 Créer une Mission
              </button>
              <button
                onClick={() => setMode('join')}
                className="secondary"
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  fontSize: '1.3rem'
                }}
              >
                🔗 Rejoindre une Mission
              </button>
            </div>
          )}

          {mode === 'create' && (
            <form
              onSubmit={handleCreate}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                animation: 'slideInFromBottom 0.4s ease-out'
              }}
            >
              <div>
                <label
                  htmlFor="pseudo"
                  style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    color: '#38B6FF',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  👤 Nom d'Agent
                </label>
                <input
                  id="pseudo"
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  maxLength={50}
                  placeholder="Entrez votre nom d'agent..."
                  style={{ width: '100%' }}
                  autoFocus
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="secondary"
                  style={{ flex: '1' }}
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  disabled={!pseudo.trim()}
                  style={{
                    flex: '2',
                    background: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)'
                  }}
                >
                  Créer 🚀
                </button>
              </div>
            </form>
          )}

          {mode === 'join' && (
            <form
              onSubmit={handleJoin}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                animation: 'slideInFromBottom 0.4s ease-out'
              }}
            >
              <div>
                <label
                  htmlFor="joinPseudo"
                  style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    color: '#38B6FF',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  👤 Nom d'Agent
                </label>
                <input
                  id="joinPseudo"
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  maxLength={50}
                  placeholder="Entrez votre nom d'agent..."
                  style={{ width: '100%' }}
                  autoFocus
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="joinCode"
                  style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    color: '#38B6FF',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  🔑 Code Mission
                </label>
                <input
                  id="joinCode"
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  placeholder="Ex: ABC123"
                  style={{ width: '100%', textTransform: 'uppercase' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="secondary"
                  style={{ flex: '1' }}
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  disabled={!pseudo.trim() || joinCode.length !== 6}
                  style={{
                    flex: '2',
                    background: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)'
                  }}
                >
                  Rejoindre 🎯
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
