# Déploiement – Opération ATLAS

## Vue d'ensemble

- **Backend** : Render ou Railway (Java 17, Spring Boot)
- **Frontend** : Netlify ou Vercel (React + Vite)
- **Base de données** : Aucune (état en mémoire + snapshots JSON)

---

## Déploiement Backend (Render)

### 1. Prérequis

- Compte Render : https://render.com
- Code backend poussé sur GitHub/GitLab

### 2. Configuration

1. **Créer un nouveau Web Service** sur Render
2. **Repository** : lier votre repo GitHub
3. **Build Command** :
   ```bash
   cd backend && mvn clean install
   ```
4. **Start Command** :
   ```bash
   cd backend && java -jar target/operation-atlas-backend-1.0.0.jar
   ```
5. **Environment Variables** :
   ```
   SERVER_PORT=8080
   FRONTEND_ORIGIN=https://votre-frontend.netlify.app
   SAVE_DIR=/opt/render/project/src/saves
   ROOM_TTL_MIN=30
   DEMO_MODE=false
   ```

### 3. Health Check

- **Path** : `/actuator/health`
- **Port** : 8080 (ou `$PORT` si Render assigne dynamiquement)
- **Interval** : 30s

### 4. Déploiement

- Push sur `main` → déploiement automatique
- Logs disponibles dans le dashboard Render

### 5. URL backend

```
https://operation-atlas-backend.onrender.com
```

Tester :
```bash
curl https://operation-atlas-backend.onrender.com/actuator/health
```

---

## Déploiement Backend (Railway)

### 1. Prérequis

- Compte Railway : https://railway.app
- Code backend sur GitHub

### 2. Configuration

1. **New Project** → lier le repo
2. **Détecter automatiquement** : Railway détecte Maven/Spring Boot
3. **Variables d'environnement** :
   ```
   PORT=${{ RAILWAY_PORT }}
   FRONTEND_ORIGIN=https://votre-frontend.vercel.app
   SAVE_DIR=/app/saves
   ROOM_TTL_MIN=30
   ```
4. **Start Command** (si nécessaire) :
   ```bash
   java -jar target/operation-atlas-backend-1.0.0.jar
   ```

### 3. Health Check

Railway configure automatiquement le health check sur `/actuator/health`.

### 4. URL backend

```
https://operation-atlas-production.up.railway.app
```

---

## Déploiement Frontend (Netlify)

### 1. Prérequis

- Compte Netlify : https://netlify.com
- Code frontend sur GitHub

### 2. Configuration

1. **New Site from Git** → lier le repo
2. **Build Settings** :
   - **Base directory** : `frontend`
   - **Build command** : `npm run build`
   - **Publish directory** : `frontend/dist`

3. **Environment Variables** :
   ```
   VITE_WS_URL=https://operation-atlas-backend.onrender.com/ws
   VITE_API_BASE=https://operation-atlas-backend.onrender.com/api
   ```

### 3. Déploiement

- Push sur `main` → build & deploy automatique
- Preview deployments pour les branches

### 4. URL frontend

```
https://operation-atlas.netlify.app
```

### 5. Redirection SPA (obligatoire)

Créer `frontend/public/_redirects` :

```
/*    /index.html   200
```

Cela assure que React Router fonctionne correctement.

---

## Déploiement Frontend (Vercel)

### 1. Prérequis

- Compte Vercel : https://vercel.com
- Code frontend sur GitHub

### 2. Configuration

1. **New Project** → importer le repo
2. **Framework Preset** : Vite
3. **Root Directory** : `frontend`
4. **Build Command** : `npm run build` (détecté automatiquement)
5. **Output Directory** : `dist` (détecté automatiquement)

6. **Environment Variables** :
   ```
   VITE_WS_URL=https://operation-atlas-backend.onrender.com/ws
   VITE_API_BASE=https://operation-atlas-backend.onrender.com/api
   ```

### 3. Déploiement

- Push sur `main` → déploiement instantané
- Preview deployments pour les PRs

### 4. URL frontend

```
https://operation-atlas.vercel.app
```

---

## CORS & TLS

### CORS Backend

Le backend doit autoriser uniquement l'origine frontend. Modifier `application.properties` :

```properties
atlas.frontend.origin=https://operation-atlas.netlify.app
```

Ou via variable d'env :

```
FRONTEND_ORIGIN=https://operation-atlas.netlify.app
```

### TLS (HTTPS)

- **Render & Railway** : TLS automatique avec certificat Let's Encrypt
- **Netlify & Vercel** : TLS automatique

⚠️ **Important** : Le frontend HTTPS ne peut pas se connecter à un backend HTTP. Assurez-vous que le backend est en HTTPS.

---

## Variables d'environnement (récapitulatif)

### Backend

| Variable          | Valeur par défaut               | Description                          |
|-------------------|---------------------------------|--------------------------------------|
| `SERVER_PORT`     | 8080                            | Port du serveur (dynamique sur Render/Railway) |
| `FRONTEND_ORIGIN` | http://localhost:5173           | URL du frontend (CORS)               |
| `SAVE_DIR`        | ./saves                         | Répertoire des snapshots JSON        |
| `ROOM_TTL_MIN`    | 30                              | Durée de vie d'une room inactive     |
| `DEMO_MODE`       | false                           | Activer le mode démo                 |

### Frontend

| Variable          | Valeur par défaut               | Description                          |
|-------------------|---------------------------------|--------------------------------------|
| `VITE_WS_URL`     | http://localhost:8080/ws        | URL WebSocket du backend             |
| `VITE_API_BASE`   | http://localhost:8080/api       | URL API REST du backend              |

---

## Checklist pré-déploiement

- [ ] Backend build & run en local sans erreur
- [ ] Frontend build & run en local sans erreur
- [ ] Tests E2E passés (voir TESTS.md)
- [ ] Variables d'env configurées (CORS correcte)
- [ ] Health check actif `/actuator/health`
- [ ] Logs sans PII vérifiés
- [ ] Rate-limit testé
- [ ] Mode démo désactivé en production

---

## Monitoring & Logs post-déploiement

### Render

- Dashboard → Logs (temps réel)
- Metrics : CPU, RAM, requêtes/sec
- Alertes : configurer si CPU > 80% ou erreurs 5xx

### Railway

- Dashboard → Logs & Metrics
- Intégration native avec Datadog/Sentry (optionnel)

### Netlify/Vercel

- Functions logs (si utilisé)
- Analytics : pages vues, temps de chargement
- Intégration avec Google Analytics (optionnel)

---

## Rollback

### Backend (Render/Railway)

1. Dashboard → Deployments
2. Sélectionner un déploiement précédent
3. "Redeploy" → rollback instantané

### Frontend (Netlify/Vercel)

1. Dashboard → Deploys
2. Sélectionner un déploiement stable
3. "Publish deploy" → rollback instantané

---

## Mise à l'échelle

### Vertical Scaling (instance plus puissante)

- **Render** : passer de "Free" à "Starter" (512 MB → 2 GB RAM)
- **Railway** : augmenter les ressources via le dashboard

### Horizontal Scaling (plusieurs instances)

⚠️ **Non recommandé pour ce projet** : l'état est en mémoire, pas de DB partagée.

**Alternative** : utiliser Redis pour l'état partagé (nécessite refactoring).

---

## Coûts estimés

| Service    | Plan              | Coût/mois       | Commentaire                          |
|------------|-------------------|-----------------|--------------------------------------|
| Render     | Free              | 0 €             | Sleep après inactivité               |
| Render     | Starter           | ~7 €            | Toujours actif, 512 MB RAM           |
| Railway    | Hobby             | ~5 € (usage)    | Pay-as-you-go                        |
| Netlify    | Free              | 0 €             | 100 GB bande passante                |
| Vercel     | Hobby             | 0 €             | 100 GB bande passante                |

**Total** : 0–12 € / mois pour un projet éducatif

---

## Support & Troubleshooting

### Problème : Backend ne démarre pas

**Cause** : Port déjà utilisé ou variable d'env manquante

**Solution** :
1. Vérifier logs Render/Railway
2. S'assurer que `SERVER_PORT` est bien configuré (ou `$PORT`)
3. Tester en local avec les mêmes variables d'env

### Problème : CORS error dans le navigateur

**Symptôme** : `Access-Control-Allow-Origin` error

**Solution** :
1. Vérifier que `FRONTEND_ORIGIN` correspond exactement à l'URL frontend
2. Redémarrer le backend après changement
3. Vérifier que le backend est en HTTPS si le frontend l'est

### Problème : WebSocket ne se connecte pas

**Symptôme** : `WebSocket connection failed`

**Solution** :
1. Vérifier que `VITE_WS_URL` pointe vers le bon backend
2. S'assurer que le backend supporte WebSocket (Render/Railway ok)
3. Tester avec `wscat -c https://backend.com/ws`

---

## Ressources

- Render Docs : https://render.com/docs
- Railway Docs : https://docs.railway.app
- Netlify Docs : https://docs.netlify.com
- Vercel Docs : https://vercel.com/docs
- Spring Boot on Render : https://render.com/docs/deploy-spring-boot
