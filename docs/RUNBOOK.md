# Runbook – Opération ATLAS

## Mode démo

Pour faciliter les soutenances ou démos, un **mode démo** peut être activé.

### Activation

**Backend** : ajouter dans `application.properties` ou via variable d'env :

```properties
atlas.demo.mode=true
```

### Comportement en mode démo

- Clé finale fixe acceptée : `MONDE→↑→↑` (peu importe les fragments réels)
- Timer peut être raccourci (optionnel : ajuster `atlas.room.ttl.minutes`)

**⚠️ À désactiver en production !**

---

## Récupération simple (Rejoin)

### Problème : Un joueur refresh la page

**Symptôme** : Connexion perdue, état non visible

**Solution automatique** :
1. Le frontend stocke `roomId` + `playerId` en `localStorage` ou `sessionStorage`
2. Au refresh, le client détecte la présence de ces données
3. Appel automatique `GET /api/rooms/{roomId}/state`
4. Reconnexion WebSocket + subscribe

**Code suggéré (frontend)** :

```typescript
useEffect(() => {
  const savedRoomId = localStorage.getItem('roomId');
  const savedPlayerId = localStorage.getItem('playerId');

  if (savedRoomId && savedPlayerId) {
    api.getRoomState(savedRoomId).then(room => {
      setRoom(room);
      setPlayerId(savedPlayerId);
      initWebSocket();
      wsService.subscribeToRoom(savedRoomId);
    });
  }
}, []);
```

---

## Fallback STOMP → REST (poll 1 Hz)

### Problème : WebSocket indisponible ou déconnecté

**Symptôme** : Pas de mise à jour en temps réel

**Solution** :
1. Le client détecte que `wsService.isConnected() === false` pendant > 3 secondes
2. Active un poll REST toutes les 1 seconde :

```typescript
const pollInterval = setInterval(() => {
  if (!wsService.isConnected()) {
    api.getRoomState(roomId, currentVersion).then(room => {
      if (room) {
        setRoom(room);
        currentVersion = room.version;
      }
    });
  } else {
    clearInterval(pollInterval);
  }
}, 1000);
```

3. Dès que WebSocket se reconnecte, arrêter le poll

**Performance** : 1 req/sec acceptable pour une classe (30 clients = 30 req/sec)

---

## Procédure incident

### Incident 1 : Le serveur plante

**Symptôme** : Plus de réponse HTTP/WebSocket

**Diagnostic** :
1. Vérifier logs serveur : `tail -f backend/logs/application.log`
2. Vérifier Actuator : `curl http://localhost:8080/actuator/health`

**Résolution** :
1. Redémarrer le backend : `mvn spring-boot:run`
2. Les snapshots JSON permettent de récupérer l'état des rooms actives
3. Les clients doivent refresh pour se reconnecter

**Prévention** :
- Surveiller la RAM (limite à 512 MB pour petite instance)
- Limiter le nombre de rooms simultanées (cleanup auto toutes les 30 min)

---

### Incident 2 : Un puzzle ne se valide jamais

**Symptôme** : Client soumet une réponse correcte, aucun retour

**Diagnostic** :
1. Vérifier logs backend pour `PuzzleService.validate*`
2. Vérifier que les données JSON (`eu_salutations.json`, etc.) sont bien chargées
3. Tester manuellement via REST : `POST /api/rooms/{roomId}/puzzle/EUROPE` avec `{"answer": "MONDE"}`

**Résolution** :
1. Si données mal chargées : vérifier `backend/src/main/resources/content/`
2. Si logique incorrecte : corriger `PuzzleService.java`, recompiler, redémarrer

---

### Incident 3 : Les clients ne se voient pas

**Symptôme** : Alice et Bob dans la même room, mais ne voient pas la liste des joueurs

**Diagnostic** :
1. Vérifier que les 2 clients sont subscribed au même topic `/topic/rooms/{roomId}`
2. Vérifier logs WebSocket côté serveur
3. Vérifier CORS : s'assurer que `atlas.frontend.origin` correspond à l'URL frontend

**Résolution** :
1. Corriger la config CORS dans `WebSecurityConfig.java`
2. Redémarrer le backend
3. Refresh les clients

---

### Incident 4 : Timer décalé entre clients

**Symptôme** : Alice voit 600s, Bob voit 580s

**Diagnostic** :
1. Vérifier que le serveur broadcast `TimerTick` à 1 Hz
2. Vérifier latence réseau (ping backend)

**Résolution** :
1. Réduire la charge réseau (fermer autres apps)
2. Si décalage persiste : le serveur est la source de vérité, le frontend doit sync sur `TimerTick`

---

## Monitoring & Logs

### Logs analytiques (anonymes)

Le backend log les événements suivants **sans PII** :

```
INFO  - Room created: roomId=abc123 (joinCode masked)
INFO  - Player joined: roomId=abc123, playerId=p2
INFO  - Puzzle submitted: roomId=abc123, continent=EUROPE, success=true
INFO  - Hint requested: roomId=abc123, continent=ASIA
INFO  - Stage changed: roomId=abc123, stage=META
INFO  - Final submitted: roomId=abc123, success=true
```

**Format** : JSON structuré

```json
{
  "timestamp": "2024-10-06T12:34:56Z",
  "event": "PUZZLE_SUBMITTED",
  "roomId": "abc123",
  "continent": "EUROPE",
  "success": true
}
```

### Métriques à surveiller

- **Nombre de rooms actives** : `SELECT COUNT(*) FROM in-memory map`
- **Taux de résolution par puzzle** : `solved.eu`, `solved.as`, `solved.am`
- **Temps moyen par puzzle** : durée entre PLAY et résolution
- **Nombre d'indices utilisés** : moyenne par puzzle
- **Taux de succès finale** : % de rooms ayant atteint DEBRIEF avec succès

**Outil suggéré** : Parser les logs avec ELK Stack ou Grafana

---

## Health Checks

### Endpoint Actuator

```bash
curl http://localhost:8080/actuator/health
```

**Réponse attendue** :

```json
{
  "status": "UP"
}
```

### Déploiement (Render/Railway)

Configurer le health check sur `/actuator/health` avec :
- Interval : 30s
- Timeout : 5s
- Seuil échec : 3 tentatives

---

## Commandes utiles

### Démarrage rapide

```bash
# Backend
cd backend && mvn spring-boot:run

# Frontend
cd frontend && npm run dev
```

### Voir les snapshots sauvegardés

```bash
ls -lh backend/saves/
cat backend/saves/{roomId}.json | jq .
```

### Purger les snapshots

```bash
rm backend/saves/*.json
```

### Tester la connectivité WebSocket

```bash
# Via wscat (npm install -g wscat)
wscat -c ws://localhost:8080/ws
```

---

## FAQ Opérationnelle

**Q : Puis-je augmenter le nombre de joueurs max par room ?**
R : Oui, modifier `GameService.joinRoom()` pour accepter > 4 joueurs. Attention à la charge serveur.

**Q : Puis-je changer la durée du timer ?**
R : Oui, dans `GameRoom` constructor, modifier `this.timerSec = 1500;` (25 min = 1500s).

**Q : Puis-je ajouter de nouveaux puzzles ?**
R : Oui, créer de nouveaux JSON dans `content/`, ajouter la logique dans `PuzzleService`, et mettre à jour `GameRoom.draw`.

**Q : Comment désactiver les indices ?**
R : Commenter ou désactiver les routes `/hint` dans `RoomController` et `WebSocketController`.
