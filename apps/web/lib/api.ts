import type {
  ContactConciergerie,
  Logement,
  ReponseConnexion,
  Sejour,
  TableauAdministration,
} from './types';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function lireJson<T>(chemin: string): Promise<T> {
  const reponse = await fetch(API_URL + chemin, { cache: 'no-store' });

  if (!reponse.ok) {
    throw new Error('Requête impossible');
  }

  return reponse.json();
}

export async function getLogements(): Promise<Logement[]> {
  return lireJson('/api/logements');
}

export async function getLogement(id: string): Promise<Logement> {
  return lireJson('/api/logements/' + encodeURIComponent(id));
}

export async function connexion(
  email: string,
  motDePasse: string,
): Promise<ReponseConnexion> {
  const reponse = await fetch(API_URL + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, motDePasse }),
  });

  if (reponse.status === 401) {
    throw new Error('Identifiants invalides');
  }

  if (!reponse.ok) {
    throw new Error('Connexion impossible');
  }

  return reponse.json();
}

export async function getSejours(voyageurId: string): Promise<Sejour[]> {
  return lireJson(
    '/api/sejours?voyageurId=' + encodeURIComponent(voyageurId),
  );
}

export async function getSejour(id: string): Promise<Sejour> {
  return lireJson('/api/sejours/' + encodeURIComponent(id));
}

export async function getTableauAdministration(): Promise<TableauAdministration> {
  return lireJson('/api/administration');
}

export async function getContactConciergerie(
  logementId: string,
): Promise<ContactConciergerie> {
  return lireJson(
    '/api/logements/' + encodeURIComponent(logementId) + '/conciergerie',
  );
}
