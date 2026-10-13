# kasa-app — plateforme de réservation de logements entre particuliers

Application web de Kasa : les voyageurs consultent les logements proposés par des hôtes particuliers et se connectent à leur compte. Le dépôt regroupe le front-end Next.js / React et l'API Node.js qui l'alimente, organisés en espaces de travail npm (*workspaces*) : une seule installation à la racine suffit.

## Prérequis

| Outil | Version | Vérification |
| --- | --- | --- |
| Node.js | 24.21.0 | `node --version` |
| npm | 11.x (livré avec Node.js 24) | `npm --version` |
| Git | 2.40 ou supérieure | `git --version` |

Le fichier `.nvmrc` fixe la version majeure de Node.js (`24`) : avec nvm, `nvm use` sélectionne la bonne version.

Visual Studio Code est recommandé : le fichier `.vscode/launch.json` fournit les configurations de débogage de l'API, du serveur Next.js et du navigateur (Chrome), ainsi qu'un lancement combiné « Kasa : API + Web ».

## Installation

```bash
git clone https://github.com/OpenClassrooms-Student-Center/Starter-P7-option-full-js-dfs-Front-end-avanc-.git kasa-app
cd kasa-app
nvm use
npm install

cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

Les valeurs par défaut des deux fichiers d'exemple suffisent pour un lancement en local.

## Variables d'environnement

Les fichiers `.env` et `.env.local` sont ignorés par Git ; seuls les `.env.example` sont versionnés.

### Front-end — `apps/web/.env.local`

| Variable | Valeur par défaut | Rôle |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Adresse de l'API appelée par le front |
| `NEXT_PUBLIC_APP_NAME` | `Kasa` | Nom affiché dans l'en-tête |

### API — `apps/api/.env`

| Variable | Valeur par défaut | Rôle |
| --- | --- | --- |
| `PORT` | `4000` | Port d'écoute de l'API |
| `DATA_FILE` | `../../starter-kit/donnees-logements-utilisateurs-kasa.csv` | Fichier de données, chemin relatif à `apps/api` |
| `CORS_ORIGIN` | `http://localhost:3000` | Origine autorisée pour le front |
| `JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_ROUNDS`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET` | — | Réservées à une évolution de l'API ; non lues par le code actuel |

## Lancement

Depuis la racine du dépôt :

```bash
npm run dev        # API sur http://localhost:4000 et front sur http://localhost:3000
npm run dev:api    # API seule
npm run dev:web    # front seul
```

En mode production :

```bash
npm run build
npm run start
```

Pour vérifier l'installation : la page d'accueil affiche les 12 logements du fichier de données, chaque logement a sa page de détail, et la page `/connexion` accepte les comptes de démonstration du fichier de données (par exemple le voyageur `julien.morand@exemple-kasa.fr` / `azerty123`). Une fois connecté, l'en-tête affiche le prénom de l'utilisateur.

## Stack technique

| Couche | Technologie |
| --- | --- |
| Exécution | Node.js 24.21.0 |
| Front-end | Next.js 16.4.0 (App Router), React 19.3.0, TypeScript en mode strict |
| API | Express 5, `cors`, JavaScript ESM exécuté directement par Node.js (sans transpilation) |
| Qualité | ESLint 9 (`eslint-config-next` côté web, `@eslint/js` côté API) |
| Outillage | npm workspaces, `concurrently` pour lancer les deux applications |

## Structure du projet

```
kasa-app/
├── package.json               # workspaces et scripts communs
├── .nvmrc                     # version majeure de Node.js
├── .vscode/launch.json        # configurations de débogage
├── starter-kit/               # documents du projet et jeu de données de démonstration (CSV)
├── apps/api/                  # API Node.js / Express
│   └── src/
│       ├── serveur.js         # point d'entrée : middlewares, routes, écoute du port
│       ├── config.js          # lecture des variables d'environnement
│       ├── donnees/
│       │   └── chargeurCsv.js # lecture et transformation du CSV en utilisateurs et logements
│       └── routes/
│           ├── logements.js   # GET /api/logements, GET /api/logements/:id
│           └── auth.js        # POST /api/auth/login
└── apps/web/                  # front-end Next.js
    ├── app/
    │   ├── layout.tsx         # layout racine : en-tête et contenu principal
    │   ├── page.tsx           # accueil : liste des logements
    │   ├── logements/[id]/    # détail d'un logement
    │   └── connexion/         # page de connexion
    ├── components/            # Header, CarteLogement, FormulaireConnexion
    └── lib/                   # types, client HTTP de l'API, session navigateur
```

Les pages sont des composants serveur ; seuls `Header` et `FormulaireConnexion` sont des composants client. La logique sans React (appels HTTP, session, types) vit dans `apps/web/lib/`.

## Données

L'API lit ses données depuis le fichier CSV désigné par `DATA_FILE` : 10 comptes (voyageurs, hôtes, administrateur) et 12 logements. Chaque ligne porte un `type_enregistrement` (`utilisateur` ou `logement`) et les colonnes propres à ce type. Les logements sont rattachés à leur hôte par la colonne `id_hote`.

## Points d'entrée de l'API

Toutes les routes sont préfixées par `/api` et renvoient du JSON.

| Méthode et route | Description | Réponse |
| --- | --- | --- |
| `GET /api/sante` | État de l'API | `{ "statut": "ok" }` |
| `GET /api/logements` | Liste des logements, chacun complété par le prénom et le nom de son hôte | tableau de logements |
| `GET /api/logements/:id` | Détail d'un logement | un logement |
| `POST /api/auth/login` | Connexion ; corps `{ "email": "…", "motDePasse": "…" }` | `200` avec `{ id, role, prenom, nom, email }`, ou `401` avec `{ "message": "Identifiants invalides" }` |

Forme d'un logement :

```json
{
  "id": "l-001",
  "titre": "Studio lumineux près du canal",
  "typeLogement": "appartement",
  "ville": "Paris",
  "prixParNuit": "89",
  "idHote": "u-002",
  "dateCreation": "2026-01-07",
  "hote": { "prenom": "Marc", "nom": "Lévesque" }
}
```

## Scripts

| Script (racine) | Effet |
| --- | --- |
| `npm run dev` | Lance l'API et le front en parallèle |
| `npm run dev:api` | Lance l'API seule, avec rechargement automatique (`node --watch`) |
| `npm run dev:web` | Lance le front seul (`next dev`) |
| `npm run build` | Construit le front Next.js dans `apps/web/.next` |
| `npm run start` | Démarre l'API et le front construit en mode production |
| `npm run lint` | ESLint sur les deux applications |

## Licence

Code propriétaire de Kasa. Tous droits réservés. Usage réservé aux équipes de Kasa et à ses prestataires sous contrat.
