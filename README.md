# Opération ATLAS – Le Cartographe Fantôme

Escape game coopératif en temps réel, 100% web. 2–4 joueurs, 20–25 min, 3 puzzles géographiques + méta-énigme + finale.

## Prérequis

- **Backend** : Java 17+, Maven 3.8+
- **Frontend** : Node.js 18+, npm 9+
- **Réseau** : ports 8080 (back) et 5173 (front) libres

## Lancer en local (< 15 min)

```bash
# 1. Cloner le dépôt
git clone <votre-repo>
cd operation-atlas

# 2. Backend (terminal 1)
cd backend
mvn clean install
mvn spring-boot:run

# 3. Frontend (terminal 2)
cd frontend
npm install
npm run dev

# 4. Ouvrir 2+ onglets
# → http://localhost:5173
```

## Variables d'environnement

### Backend (`backend/src/main/resources/application.properties`)

```properties
server.port=8080
atlas.frontend.origin=http://localhost:5173
atlas.save.dir=./saves
atlas.room.ttl.minutes=30
atlas.demo.mode=false
```

### Frontend (`frontend/.env`)

```
VITE_WS_URL=http://localhost:8080/ws
VITE_API_BASE=http://localhost:8080/api
```

## URLs & points de terminaison

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8080/api
- **WebSocket** : ws://localhost:8080/ws
- **Health** : http://localhost:8080/actuator/health

## Gameplay

1. **Accueil** : entrer un pseudo, créer ou rejoindre une room (code 6 caractères)
2. **Briefing** : attendre les joueurs, consulter la progression, chat
3. **Puzzles** (3) :
   - **Europe** : salutations → familles linguistiques → mot 5 lettres
   - **Asie** : fuseaux horaires TYO/DEL/BKK → horaire UTC valide (HH:MM)
   - **Amériques** : règles bagages → tri objets → code 4 chiffres
4. **Méta** : 3 fragments → clé finale (mot + 4 directions)
5. **Finale** : soumettre la clé en < 30 s
6. **Débrief** : score, faits appris, rejouabilité

## Documentation

- **[API.md](docs/API.md)** : contrats REST + WebSocket (STOMP)
- **[ERRORS.md](docs/ERRORS.md)** : codes d'erreurs & messages UX
- **[TESTS.md](docs/TESTS.md)** : scénarios E2E, checklists accessibilité
- **[RUNBOOK.md](docs/RUNBOOK.md)** : mode démo, rejoin, fallback, incidents
- **[DEPLOY.md](docs/DEPLOY.md)** : déploiement Render/Railway (back) + Netlify/Vercel (front)

## Architecture

- **Backend** : Spring Boot 3, WebSocket STOMP (broker mémoire), REST, snapshots JSON (pas de DB)
- **Frontend** : React + Vite + TypeScript, Zustand, SockJS/STOMP client
- **Sécurité** : CORS strict, rate-limit, validation payloads, logs anonymes

## Contribution & Support

- Issues : <repo-issues-url>
- Licence : MIT (adapter selon besoin)
