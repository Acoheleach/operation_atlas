# Codes d'erreurs – Opération ATLAS

## Erreurs globales

| Code                   | Message UX                                    | Cause                              |
|------------------------|-----------------------------------------------|------------------------------------|
| `ERR_ROOM_NOT_FOUND`   | Partie introuvable                            | Room inexistante ou expirée        |
| `ERR_ROOM_FULL`        | Partie complète (max 4 joueurs)               | 4 joueurs déjà présents            |
| `ERR_STAGE`            | Action non autorisée à cette étape            | Stage incorrect pour l'action      |
| `ERR_RATE_LIMIT`       | Trop de requêtes, ralentissez                 | Dépassement du rate limit          |
| `ERR_PAYLOAD_INVALID`  | Données invalides                             | Validation payload échouée         |
| `ERR_ALREADY_SOLVED`   | Puzzle déjà résolu                            | Tentative de re-soumettre          |
| `ERR_MAX_HINTS`        | Nombre maximum d'indices atteint              | Déjà 2 indices utilisés            |
| `ERR_INTERNAL`         | Erreur serveur, réessayez                     | Erreur interne                     |

---

## Erreurs puzzle EUROPE

| Code                   | Message UX                                    | Détail                             |
|------------------------|-----------------------------------------------|------------------------------------|
| `E_EU_WRONG_LENGTH`    | Le mot doit faire 5 lettres                   | Réponse != 5 caractères            |
| `E_EU_WRONG_LETTER`    | Ce n'est pas le bon mot                       | Mot incorrect                      |
| `E_EU_WRONG_ORDER`     | Vérifiez l'ordre alphabétique des pays        | Erreur de tri (leurre)             |

**Indices disponibles** :
- Indice 1 : "Classez les pays par ordre alphabétique"
- Indice 2 : "Associez chaque famille linguistique à sa lettre"

---

## Erreurs puzzle ASIE

| Code                   | Message UX                                    | Détail                             |
|------------------------|-----------------------------------------------|------------------------------------|
| `E_AS_FORMAT`          | Format attendu : HH:MM (ex: 06:30)            | Format incorrect                   |
| `E_AS_NO_COMMON_SLOT`  | Aucune ville n'est dans sa plage 08:00-20:00  | Horaire hors whiteliste            |

**Indices disponibles** :
- Indice 1 : "Delhi n'est pas à l'heure pleine – pensez aux demi-heures"
- Indice 2 : "Testez des créneaux entre 06:00 et 11:00 UTC"

---

## Erreurs puzzle AMÉRIQUES

| Code                   | Message UX                                    | Détail                             |
|------------------------|-----------------------------------------------|------------------------------------|
| `E_AM_FORMAT`          | Le code doit être 4 chiffres                  | Format incorrect                   |
| `E_AM_RULE_VIOLATION`  | Un objet ne respecte pas les règles cabine    | Objet mal classé                   |
| `E_AM_SUM_MISMATCH`    | La somme ne correspond pas aux règles         | Code incorrect                     |

**Indices disponibles** :
- Indice 1 : "Additionnez seulement les poids des objets autorisés en cabine"
- Indice 2 : "Les liquides > 100ml vont en soute, les objets proscrits ne sont comptés nulle part"

---

## Erreurs méta-énigme & finale

| Code                   | Message UX                                    | Détail                             |
|------------------------|-----------------------------------------------|------------------------------------|
| `ERR_META_WRONG`       | Clé méta incorrecte                           | Mauvaise combinaison fragments     |
| `ERR_FINAL_WRONG`      | Clé finale incorrecte                         | Mauvaise réponse finale            |
| `ERR_FINAL_TIMEOUT`    | Temps écoulé pour la soumission finale        | > 30s depuis passage en FINAL      |

---

## Mapping UX

Les codes sont retournés dans les `PuzzleResult` ou `ErrorResponse` JSON. Le frontend doit afficher les messages UX correspondants de manière **concise et claire**, en évitant de dévoiler les solutions.

### Exemple de gestion frontend

```typescript
const errorMessages: Record<string, string> = {
  'E_EU_WRONG_LETTER': 'Ce n'est pas le bon mot',
  'E_AS_NO_COMMON_SLOT': 'Aucune ville dans sa plage horaire à ce moment',
  'E_AM_SUM_MISMATCH': 'Le code ne correspond pas aux règles',
  'ERR_RATE_LIMIT': 'Ralentissez, trop de tentatives'
};

function displayError(code: string) {
  const message = errorMessages[code] || 'Erreur inconnue';
  showNotification(message, 'error');
}
```

---

## Accessibilité

- Les erreurs doivent être annoncées par les lecteurs d'écran via `role="alert"` ou `aria-live="assertive"`
- Les messages doivent être **clairs et actionnables** (pas de jargon technique)
- Utiliser des couleurs + icônes pour les utilisateurs voyants, mais toujours doubler avec du texte
