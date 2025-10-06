# API Documentation – Opération ATLAS

## Architecture

- **Backend** : Spring Boot 3, REST + WebSocket STOMP
- **Frontend** : React + SockJS/STOMP client
- **Format** : JSON pour tous les payloads

## REST Endpoints

### Base URL

```
http://localhost:8080/api
```

### 1. Créer une partie

**POST** `/rooms`

```json
Request:
{
  "pseudo": "Alice"
}

Response (200):
{
  "room": {
    "id": "abc123",
    "joinCode": "XY4Z9K",
    "stage": "BRIEF",
    "timerSec": 1500,
    "draw": ["EUROPE", "ASIA", "AMERICAS"],
    "solved": { "eu": false, "as": false, "am": false },
    "hintsUsed": { "eu": 0, "as": 0, "am": 0 },
    "fragments": {},
    "players": [
      { "id": "p1", "pseudo": "Alice", "role": "", "connected": true }
    ],
    "version": 0
  },
  "playerId": "p1"
}
```

### 2. Rejoindre une partie

**POST** `/rooms/{roomId}/join`

```json
Request:
{
  "pseudo": "Bob",
  "joinCode": "XY4Z9K"
}

Response (200):
{
  "room": { ... },
  "playerId": "p2"
}
```

### 3. Obtenir l'état d'une partie

**GET** `/rooms/{roomId}/state?since={version}`

```json
Response (200):
{
  "id": "abc123",
  "stage": "PLAY",
  "timerSec": 1450,
  "solved": { "eu": true, "as": false, "am": false },
  ...
}

Response (204): Pas de changement depuis la version demandée
```

### 4. Démarrer la partie

**POST** `/rooms/{roomId}/start`

### 5. Soumettre un puzzle

**POST** `/rooms/{roomId}/puzzle/{continent}`

```json
Request:
{
  "answer": "MONDE",
  "playerId": "p1"
}

Continents: EUROPE | ASIA | AMERICAS
```

### 6. Demander un indice

**POST** `/rooms/{roomId}/hint/{continent}`

### 7. Soumettre la méta-énigme

**POST** `/rooms/{roomId}/meta`

```json
Request:
{
  "answer": "MONDE→↑→↑",
  "playerId": "p1"
}
```

### 8. Soumettre la clé finale

**POST** `/rooms/{roomId}/final`

```json
Request:
{
  "answer": "MONDE→↑→↑",
  "playerId": "p1"
}
```

---

## WebSocket STOMP

### Connexion

**Endpoint** : `ws://localhost:8080/ws`

**Configuration SockJS** :
```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);
```

### Subscribe

**Topics** :
- `/topic/rooms/{roomId}` : snapshots & événements
- `/topic/rooms/{roomId}/chat` : messages chat

### Messages envoyés (client → serveur)

#### Soumettre un puzzle

**Destination** : `/app/rooms/{roomId}/puzzle`

```json
{
  "continent": "EUROPE",
  "answer": "MONDE",
  "playerId": "p1"
}
```

#### Demander un indice

**Destination** : `/app/rooms/{roomId}/hint`

```json
{
  "continent": "EUROPE"
}
```

#### Chat

**Destination** : `/app/rooms/{roomId}/chat`

```json
{
  "playerId": "p1",
  "message": "Bonjour !"
}
```

### Messages reçus (serveur → clients)

#### RoomSnapshot

```json
{
  "id": "abc123",
  "stage": "PLAY",
  "timerSec": 1400,
  "solved": { "eu": true, "as": false, "am": false },
  "hintsUsed": { "eu": 1, "as": 0, "am": 0 },
  "fragments": { "letterEU": "M" },
  "players": [...],
  "version": 5
}
```

#### TimerTick (1 Hz)

```json
{
  "type": "TIMER_TICK",
  "timerSec": 1399
}
```

#### PuzzleResult

```json
{
  "type": "PUZZLE_RESULT",
  "continent": "EUROPE",
  "success": true
}

{
  "type": "PUZZLE_RESULT",
  "continent": "ASIA",
  "success": false,
  "errorCode": "E_AS_FORMAT"
}
```

#### StageChange

```json
{
  "type": "STAGE_CHANGE",
  "stage": "META"
}
```

#### HintGranted

```json
{
  "type": "HINT_GRANTED",
  "continent": "EUROPE",
  "timerSec": 1340
}
```

#### FinalResult

```json
{
  "type": "FINAL_RESULT",
  "success": true
}
```

#### ChatMessage

```json
{
  "playerId": "p1",
  "pseudo": "Alice",
  "message": "Regardez les familles linguistiques !",
  "timestamp": "1691234567890"
}
```

---

## Exemples d'échanges

### Scénario : Alice crée une partie, Bob rejoint

1. **Alice** : `POST /api/rooms` → reçoit `roomId` + `joinCode` + `playerId`
2. **Alice** : Se connecte en WebSocket, subscribe à `/topic/rooms/{roomId}`
3. **Bob** : `POST /api/rooms/{roomId}/join` avec `joinCode`
4. **Serveur** : Broadcast `RoomSnapshot` (version+1) avec 2 joueurs
5. **Alice** : `POST /api/rooms/{roomId}/start`
6. **Serveur** : Broadcast `StageChange` → `PLAY`
7. **Alice** : STOMP `/app/rooms/{roomId}/puzzle` avec `answer: "MONDE"`
8. **Serveur** : Broadcast `PuzzleResult` (success=true)
9. **Serveur** : Broadcast `RoomSnapshot` avec `solved.eu=true`, `fragments.letterEU="M"`

---

## Codes HTTP

- **200 OK** : succès
- **204 No Content** : pas de changement (polling)
- **400 Bad Request** : validation échouée, erreur métier
- **404 Not Found** : room introuvable
- **500 Internal Server Error** : erreur serveur

---

## Fallback REST (si WebSocket indisponible)

Le client peut poll `/rooms/{roomId}/state?since={version}` toutes les 1 seconde.
