# Janaza Admin Panel

Panel d'administration moderne pour la plateforme Janaza (services funéraires musulmans).

## Stack Technique

- **React 18+** avec TypeScript
- **Vite** comme bundler
- **React Router v6** pour le routing
- **TanStack Query (React Query)** pour la gestion des appels API
- **Axios** pour les requêtes HTTP
- **Zustand** pour le state management
- **shadcn/ui + Tailwind CSS** pour les composants UI
- **React Hook Form + Zod** pour la validation des formulaires

## Prérequis

- Node.js 18+
- pnpm 8+ (installé globalement: `npm install -g pnpm`)
- API Backend Janaza (NestJS) en cours d'exécution

## Installation

```bash
# Installer les dépendances
pnpm install

# Copier le fichier d'environnement
cp .env.example .env

# Modifier les variables d'environnement si nécessaire
# VITE_API_URL=http://localhost:3000/
```

## Développement

```bash
# Démarrer le serveur de développement
pnpm dev

# L'application sera disponible sur http://localhost:5173
```

## Build Production

```bash
# Build pour la production
pnpm build

# Prévisualiser le build
pnpm preview
```

## Scripts Disponibles

- `pnpm dev` - Démarrer le serveur de développement
- `pnpm build` - Build pour la production
- `pnpm preview` - Prévisualiser le build de production
- `pnpm lint` - Linter le code
- `pnpm format` - Formater le code avec Prettier
- `pnpm type-check` - Vérifier les types TypeScript

## Connexion

Seuls les utilisateurs avec le rôle **Admin** peuvent se connecter au panel d'administration.

## Fonctionnalités

### 📊 Dashboard
- Statistiques générales (utilisateurs, annonces, signalements)
- Dernières annonces créées
- Signalements non résolus

### 👥 Gestion Utilisateurs
- Liste complète avec recherche et filtres
- Création/modification/suppression d'utilisateurs
- Vue détaillée avec historique d'activité

### 📢 Gestion Annonces
- Liste des annonces actives et expirées
- Détails complets avec localisation
- Gestion des commentaires
- Marquage comme expirée
- Suppression avec raison

### 🚨 Gestion Signalements
- Liste des signalements en attente et résolus
- Résolution avec notes administrateur
- Suppression d'annonce directement depuis le signalement

### 🏷️ Gestion Raisons
- CRUD complet des raisons de suppression
- Classification par type et catégorie
- Activation/désactivation

### 🔔 Gestion Notifications
- Envoi de notifications push à un utilisateur
- Diffusion à tous les utilisateurs
- Gestion des tokens push
- Historique des appareils

## Sécurité

- Authentification JWT
- Vérification du rôle admin à plusieurs niveaux
- Protection des routes
- Gestion des erreurs 401/403
- Validation des formulaires côté client et serveur

## Architecture

```
src/
├── api/              # Configuration API et hooks React Query
├── components/       # Composants React
│   ├── ui/          # Composants UI (shadcn/ui)
│   ├── layout/      # Layout de l'app (Sidebar, Header)
│   └── [feature]/   # Composants par fonctionnalité
├── lib/             # Utilitaires et validations
├── pages/           # Pages de l'application
├── routes/          # Configuration du routing
├── stores/          # Stores Zustand
└── types/           # Types TypeScript
```

## Contribution

1. Créer une branche depuis `main`
2. Développer la fonctionnalité
3. Tester localement
4. Créer une Pull Request

## Support

Pour toute question ou problème, contacter l'équipe de développement.
