# Tests & Scénarios – Opération ATLAS

## Scénarios d'acceptation E2E

### 1. Création et join de partie

**Objectif** : Vérifier le flux complet de création/join

**Steps** :
1. Client A : ouvrir `/`, entrer pseudo "Alice", cliquer "Créer une partie"
2. Vérifier : URL change vers `/lobby`, code 6 caractères affiché
3. Client B : ouvrir `/`, entrer pseudo "Bob", cliquer "Rejoindre", saisir le code
4. Vérifier : Client B redirigé vers `/lobby`, liste des joueurs affiche "Alice" et "Bob"
5. Vérifier : Les deux clients voient le même snapshot (version identique)

**Résultat attendu** : ✓ Partie créée, 2 joueurs synchronisés

---

### 2. Timer synchronisé

**Objectif** : Vérifier que le timer tick à 1 Hz et est identique pour tous

**Steps** :
1. 2 clients dans la même room en stage PLAY
2. Observer le timer pendant 5 secondes
3. Comparer les valeurs affichées sur les 2 clients

**Résultat attendu** : ✓ Valeurs identiques (±1s toléré pour latence réseau)

---

### 3. Puzzle EUROPE – succès

**Objectif** : Résoudre le puzzle Europe avec la bonne réponse

**Steps** :
1. Stage PLAY, puzzle Europe visible
2. Entrer "MONDE" (5 lettres), cliquer "Valider"
3. Vérifier : message succès, sceau déverrouillé (🔓), fragment "M" visible
4. Vérifier : `solved.eu = true` dans le snapshot

**Résultat attendu** : ✓ Puzzle résolu, fragment obtenu

---

### 4. Puzzle EUROPE – erreur puis indice

**Objectif** : Tester une mauvaise réponse, puis demander un indice

**Steps** :
1. Entrer "HELLO", valider
2. Vérifier : message d'erreur `E_EU_WRONG_LETTER` affiché
3. Cliquer "Demander un indice (-60s)"
4. Vérifier : timer réduit de 60s, indice affiché
5. Résoudre avec "MONDE"

**Résultat attendu** : ✓ Erreur gérée, indice accordé, puzzle résolu

---

### 5. Puzzle ASIE – horaire valide

**Objectif** : Valider un horaire UTC correct

**Steps** :
1. Entrer "06:30" (valide), valider
2. Vérifier : succès, fragment direction obtenu (ex: "→→")

**Résultat attendu** : ✓ Puzzle résolu avec horaire whitelisté

---

### 6. Puzzle ASIE – horaire invalide

**Objectif** : Tester un horaire hors whitelist

**Steps** :
1. Entrer "12:00" (invalide), valider
2. Vérifier : erreur `E_AS_NO_COMMON_SLOT`

**Résultat attendu** : ✓ Erreur affichée correctement

---

### 7. Puzzle AMÉRIQUES – code correct

**Objectif** : Calculer et valider le code 4 chiffres

**Steps** :
1. Analyser les objets (laptop 2kg, powerbank 1kg, camera 1kg, book 1kg, perfume 0kg, sunscreen 0kg)
2. Total cabine autorisé : 5 kg → code "0005"
3. Entrer "0005", valider
4. Vérifier : succès, fragment joker obtenu

**Résultat attendu** : ✓ Code validé, puzzle résolu

---

### 8. Méta-énigme

**Objectif** : Combiner les fragments et passer à la finale

**Steps** :
1. Les 3 puzzles résolus → stage passe à META
2. Fragments visibles : letterEU="M", directionAS="→↑", letterJoker="X"
3. Construire clé : "MONDE→↑→↑" (selon meta_config.json)
4. Entrer la clé, valider
5. Vérifier : stage passe à FINAL

**Résultat attendu** : ✓ Méta résolue, passage en phase finale

---

### 9. Finale – soumission dans les 30s

**Objectif** : Soumettre la clé finale avant timeout

**Steps** :
1. Stage FINAL → compte à rebours 30s démarre
2. Entrer la clé finale dans les 10 premières secondes, valider
3. Vérifier : message "Mission accomplie!", stage passe à DEBRIEF

**Résultat attendu** : ✓ Finale réussie

---

### 10. Finale – timeout

**Objectif** : Vérifier l'échec si temps écoulé

**Steps** :
1. Stage FINAL, attendre 31 secondes sans soumettre
2. Vérifier : message "Temps écoulé", stage passe à DEBRIEF

**Résultat attendu** : ✓ Timeout géré

---

### 11. Rejoin après refresh

**Objectif** : Vérifier la persistance de l'état

**Steps** :
1. Client A en pleine partie (stage PLAY, 1 puzzle résolu)
2. Client A : refresh (F5)
3. Vérifier : état restauré (même room, même stage, même progression)

**Résultat attendu** : ✓ État restauré via snapshots

---

### 12. Rate-limit chat

**Objectif** : Vérifier le rate-limit sur les messages chat

**Steps** :
1. Envoyer 10 messages en < 5 secondes
2. Vérifier : message d'erreur `ERR_RATE_LIMIT` après le 8e message

**Résultat attendu** : ✓ Rate-limit appliqué sans crash

---

## Checklist Accessibilité

### Parcours clavier

- [ ] Navigation complète sans souris (Tab, Enter, Esc)
- [ ] Focus visible sur tous les éléments interactifs
- [ ] Pas de piège clavier (focus bloqué)

### Lecteurs d'écran

- [ ] Tous les inputs ont des `<label>` ou `aria-label`
- [ ] Timer annoncé avec `aria-live="polite"`
- [ ] Erreurs annoncées avec `role="alert"`
- [ ] Notifications de succès annoncées

### Contrastes

- [ ] Ratio min 4.5:1 pour texte normal
- [ ] Ratio min 3:1 pour texte large
- [ ] Palette testée avec outil (ex: WebAIM Contrast Checker)

### Alternatives textuelles

- [ ] Emojis doublés par du texte (ex: "🔓 Résolu")
- [ ] Icônes de continents avec aria-label si nécessaires

---

## Tests de charge "classe"

**Scénario** : 10 rooms × 3 clients = 30 connexions simultanées

**Métriques** :
- CPU serveur < 50%
- RAM serveur < 512 MB
- RT perçu (validation puzzle) < 200 ms
- Aucun timeout WebSocket

**Outil suggéré** : JMeter ou Artillery pour simuler les connexions

---

## Cas limites

| Cas                              | Comportement attendu                          |
|----------------------------------|-----------------------------------------------|
| Pseudo vide                      | Validation front : bouton désactivé           |
| Pseudo > 50 caractères           | Validation back : erreur `ERR_PAYLOAD_INVALID`|
| Join code invalide               | Erreur `ERR_ROOM_NOT_FOUND`                   |
| 5e joueur tente de join          | Erreur `ERR_ROOM_FULL`                        |
| Soumission puzzle déjà résolu    | Erreur `ERR_ALREADY_SOLVED`                   |
| 3e indice demandé                | Erreur `ERR_MAX_HINTS`                        |
| Déconnexion WebSocket > 3s       | Fallback REST activé (poll 1 Hz)             |
| Room inactive > 30 min           | Room supprimée (cleanup)                      |

---

## Scripts de test textuels

### Script 1 : Partie complète (Happy Path)

```
1. Alice crée → code ABC123
2. Bob join avec ABC123
3. Alice démarre → stage PLAY
4. Bob résout Europe → "MONDE"
5. Alice résout Asie → "06:30"
6. Bob résout Amériques → "0005"
7. Stage passe à META
8. Alice combine → "MONDE→↑→↑"
9. Stage passe à FINAL
10. Bob soumet clé finale en 15s
11. Stage passe à DEBRIEF
12. Score affiché
```

### Script 2 : Échec et rejoin

```
1. Alice crée, Bob join
2. Démarrage → stage PLAY
3. Timer descend à 600s
4. Bob refresh navigateur
5. Bob rejoint automatiquement (via roomId stocké)
6. État restauré : 600s restantes, même progression
7. Timeout atteint (0s)
8. Stage passe à DEBRIEF automatiquement
```

---

## Définition de succès

Une partie est considérée "complète" si :
- ✓ Tous les stages sont traversés (BRIEF → PLAY → META → FINAL → DEBRIEF)
- ✓ Au moins 1 puzzle résolu
- ✓ Aucun crash client ou serveur
- ✓ Logs sans PII visibles
