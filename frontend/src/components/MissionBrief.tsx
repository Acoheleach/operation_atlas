import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useNavigate } from 'react-router-dom';

const continents = [
  {
    id: 'EUROPE',
    name: 'Europe',
    emoji: '🇪🇺',
    color: '#7DD3FC',
    title: 'Serveur Linguistique',
    description: 'Infiltrez le nœud européen de S.H.A.D.O.W. protégé par un chiffrement linguistique basé sur les familles de langues.',
    difficulty: 'Moyenne',
    icon: '🗣️'
  },
  {
    id: 'ASIA',
    name: 'Asie',
    emoji: '🌏',
    color: '#86EFAC',
    title: "Réseau Temporel",
    description: 'Synchronisez-vous avec le serveur asiatique en déchiffrant le système de sécurité basé sur les fuseaux horaires.',
    difficulty: 'Difficile',
    icon: '🕐'
  },
  {
    id: 'AMERICAS',
    name: 'Amériques',
    emoji: '✈️',
    color: '#FCD34D',
    title: 'Protocole Aérien',
    description: 'Déjouez le système de sécurité du nœud américain inspiré des règles de transport aérien international.',
    difficulty: 'Moyenne',
    icon: '🧳'
  },
  {
    id: 'AFRICA',
    name: 'Afrique',
    emoji: '🌍',
    color: '#FDBA74',
    title: 'Flux Économique',
    description: 'Tracez le circuit financier de S.H.A.D.O.W. à travers 5 pays africains pour accéder au serveur.',
    difficulty: 'Moyenne',
    icon: '💰'
  },
  {
    id: 'OCEANIA',
    name: 'Océanie',
    emoji: '🏝️',
    color: '#7DD3FC',
    title: 'Réseau Insulaire',
    description: 'Optimisez le chemin d\'infiltration à travers les serveurs répartis sur les îles du Pacifique.',
    difficulty: 'Facile',
    icon: '🗺️'
  },
  {
    id: 'ANTARCTICA',
    name: 'Antarctique',
    emoji: '🧊',
    color: '#A5F3FC',
    title: 'Base Polaire',
    description: 'Identifiez la station de recherche secrète de S.H.A.D.O.W. camouflée parmi les bases scientifiques.',
    difficulty: 'Facile',
    icon: '❄️'
  }
];

export const MissionBrief: React.FC = () => {
  const { room, startGame } = useGameStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showContinents, setShowContinents] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!room) {
      navigate('/');
      return;
    }

    // Rediriger vers le jeu si déjà commencé
    if (room.stage !== 'BRIEF') {
      navigate('/game');
      return;
    }

    // Animation d'entrée
    const timer = setTimeout(() => setShowContinents(true), 500);
    return () => clearTimeout(timer);
  }, [room, navigate]);

  if (!room) return null;

  const canStart = room.players.length >= 2;

  const handleStart = () => {
    startGame();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % continents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + continents.length) % continents.length);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0C4A6E 0%, #164E63 50%, #0C4A6E 100%)',
      padding: '2rem',
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

      <div className="container" style={{ maxWidth: '1200px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="card" style={{
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #7DD3FC 0%, #155E75 100%)',
          border: '4px solid rgba(0, 0, 0, 0.5)',
          animation: 'scaleIn 0.5s ease-out'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem',
              animation: 'float 3s ease-in-out infinite'
            }}>
              🗺️
            </div>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 900,
              marginBottom: '0.5rem',
              color: 'white',
              textShadow: '4px 4px 0 rgba(0, 0, 0, 0.3)',
              letterSpacing: '2px'
            }}>
              OPÉRATION ATLAS
            </h1>
            <div style={{
              fontSize: '1.5rem',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '3px'
            }}>
              Le Cartographe Fantôme
            </div>

            <div style={{
              marginTop: '2rem',
              padding: '1rem 2rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '50px',
              display: 'inline-block',
              border: '3px solid rgba(255, 255, 255, 0.3)'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>
                Code Mission: {room.joinCode}
              </span>
            </div>
          </div>
        </div>

        {/* Section Agents */}
        <div className="card" style={{
          marginBottom: '2rem',
          animation: 'slideInFromBottom 0.6s ease-out'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 900,
            marginBottom: '1.5rem',
            color: '#38B6FF',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '2.5rem' }}>👥</span>
            Agents en Mission ({room.players.length}/4)
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {room.players.map((player, idx) => (
              <div
                key={player.id}
                style={{
                  padding: '1.5rem',
                  background: player.connected ?
                    'linear-gradient(135deg, #86EFAC 0%, #059669 100%)' :
                    'linear-gradient(135deg, #64748B 0%, #475569 100%)',
                  borderRadius: '15px',
                  border: '4px solid rgba(0, 0, 0, 0.3)',
                  boxShadow: '0 8px 0 rgba(0, 0, 0, 0.3)',
                  transform: player.connected ? 'translateY(0)' : 'translateY(4px)',
                  animation: `slideInFromBottom ${0.6 + idx * 0.1}s ease-out`,
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  textShadow: '2px 2px 0 rgba(0, 0, 0, 0.3)'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {player.connected ? '✅' : '💤'}
                </div>
                {player.pseudo}
              </div>
            ))}
          </div>
        </div>

        {/* Objectif de Mission */}
        <div className="card" style={{
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #86EFAC 0%, #059669 100%)',
          border: '4px solid rgba(0, 0, 0, 0.5)',
          animation: 'slideInFromBottom 0.8s ease-out'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 900,
            marginBottom: '1rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '2.5rem' }}>🎯</span>
            Objectif de Mission
          </h2>

          <div style={{ color: 'white', fontSize: '1.2rem', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1rem', fontWeight: 700 }}>
              L'organisation criminelle <strong style={{ color: '#FB7185' }}>S.H.A.D.O.W.</strong> (Sabotage of Heritage And Disruption Of Worldwide culture) menace de détruire le patrimoine culturel mondial !
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Leur virus numérique <strong>"ATLAS-KILLER"</strong> s'activera dans <strong style={{ color: '#FFC93C' }}>25 minutes</strong> et effacera les archives de musées, bibliothèques et sites culturels de 3 continents.
            </p>
            <p style={{ marginBottom: '1rem', fontWeight: 700 }}>
              Votre mission :
            </p>
            <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }}>
              <li>🔓 Infiltrer les 3 serveurs continentaux de S.H.A.D.O.W.</li>
              <li>🧩 Récupérer les fragments du mot de passe maître</li>
              <li>🔑 Reconstituer la clé d'accès au serveur central</li>
              <li>⚡ Désactiver le virus en 30 secondes chrono !</li>
            </ul>
            <div style={{
              padding: '1rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '15px',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              marginTop: '1rem'
            }}>
              💡 <strong>Astuce:</strong> Coordonnez-vous via le chat ! Les indices coûtent 60 secondes précieuses...
            </div>
          </div>
        </div>

        {/* Carrousel des Continents */}
        {showContinents && (
          <div className="card" style={{
            marginBottom: '2rem',
            background: 'var(--color-surface)',
            animation: 'scaleIn 1s ease-out',
            overflow: 'visible'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 900,
              marginBottom: '2rem',
              color: '#38B6FF',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '2.5rem' }}>🌍</span>
              Nœuds Serveurs Disponibles
            </h2>

            <div style={{ position: 'relative' }}>
              {/* Continent actuel */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${continents[currentSlide].color} 0%, ${continents[currentSlide].color}dd 100%)`,
                  borderRadius: '20px',
                  padding: '3rem',
                  border: '4px solid rgba(0, 0, 0, 0.5)',
                  boxShadow: '0 12px 0 rgba(0, 0, 0, 0.3)',
                  color: 'white',
                  minHeight: '350px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  animation: 'scaleIn 0.5s ease-out'
                }}
              >
                <div style={{
                  fontSize: '6rem',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  animation: 'wiggle 2s ease-in-out infinite'
                }}>
                  {continents[currentSlide].emoji}
                </div>

                <h3 style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  textAlign: 'center',
                  marginBottom: '1rem',
                  textShadow: '4px 4px 0 rgba(0, 0, 0, 0.3)'
                }}>
                  {continents[currentSlide].name}
                </h3>

                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '2rem' }}>{continents[currentSlide].icon}</span>
                  {continents[currentSlide].title}
                </div>

                <p style={{
                  fontSize: '1.3rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  lineHeight: '1.8'
                }}>
                  {continents[currentSlide].description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '50px',
                    border: '3px solid rgba(255, 255, 255, 0.5)',
                    fontWeight: 900,
                    fontSize: '1.1rem'
                  }}>
                    Difficulté: {continents[currentSlide].difficulty}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                <button
                  onClick={prevSlide}
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1.5rem',
                    background: '#38B6FF'
                  }}
                >
                  ◀
                </button>

                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}>
                  {continents.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      style={{
                        width: idx === currentSlide ? '40px' : '20px',
                        height: '20px',
                        borderRadius: '10px',
                        background: idx === currentSlide ? '#38B6FF' : '#64748B',
                        cursor: 'pointer',
                        border: '3px solid rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.3s ease',
                        boxShadow: idx === currentSlide ? '0 4px 0 rgba(0, 0, 0, 0.3)' : 'none'
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1.5rem',
                    background: '#38B6FF'
                  }}
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bouton Démarrage */}
        <div style={{ textAlign: 'center', animation: 'bounceIn 1.2s ease-out' }}>
          <button
            onClick={handleStart}
            disabled={!canStart}
            style={{
              padding: '2rem 4rem',
              fontSize: '2rem',
              background: canStart ?
                'linear-gradient(135deg, #86EFAC 0%, #059669 100%)' :
                'linear-gradient(135deg, #64748B 0%, #475569 100%)',
              boxShadow: canStart ? '0 12px 0 rgba(0, 0, 0, 0.4)' : '0 8px 0 rgba(0, 0, 0, 0.3)',
              animation: canStart ? 'pulse 2s ease-in-out infinite' : 'none'
            }}
          >
            {canStart ? '🚀 LANCER LA MISSION !' : '⏳ En attente d\'agents... (min. 2)'}
          </button>
        </div>
      </div>
    </div>
  );
};
