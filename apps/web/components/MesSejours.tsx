'use client';

import Link from 'next/link';
import {
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import { getSejours } from '@/lib/api';
import { lireSession, sabonnerSession } from '@/lib/session';
import type { Sejour } from '@/lib/types';

function lireSessionServeur() {
  return null;
}

export default function MesSejours() {
  const session = useSyncExternalStore(
    sabonnerSession,
    lireSession,
    lireSessionServeur,
  );
  const [sejours, setSejours] = useState<Sejour[]>([]);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (!session) {
      return;
    }

    getSejours(session.id)
      .then(setSejours)
      .catch(() => setErreur('Impossible de charger vos séjours.'));
  }, [session]);

  if (!session) {
    return (
      <section>
        <h1>Mes séjours</h1>
        <p>Connectez-vous pour consulter vos séjours.</p>
        <Link href="/connexion">Connexion</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Mes séjours</h1>
      <p>Retrouvez vos réservations.</p>
      {erreur && <p className="erreur">{erreur}</p>}
      <ul className="grille-logements">
        {sejours.map((sejour) => (
          <li className="carte-logement" key={sejour.id}>
            <h2>{sejour.logement?.titre}</h2>
            <p>
              {sejour.logement?.ville} · Arrivée le {sejour.arrivee}
            </p>
            <p>
              {sejour.nuits} nuits · {sejour.statut}
            </p>
            <p className="prix">{sejour.prixTotal} €</p>
            <Link href={'/sejours/' + sejour.id}>Voir le séjour</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
