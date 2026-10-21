'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { effacerSession, lireSession, sabonnerSession } from '@/lib/session';

const NOM_APPLICATION = process.env.NEXT_PUBLIC_APP_NAME ?? 'Kasa';

// Côté serveur, il n'y a pas de session : le rendu initial affiche toujours le lien Connexion.
function lireSessionServeur() {
  return null;
}

export default function Header() {
  const session = useSyncExternalStore(sabonnerSession, lireSession, lireSessionServeur);

  return (
    <header className="entete">
      <Link href="/" className="entete-logo">
        {NOM_APPLICATION}
      </Link>
      <nav aria-label="Navigation principale">
        {session ? (
          <>
            <span>Bonjour {session.prenom}</span>
            <Link href="/mes-sejours">Mes séjours</Link>
            <button type="button" className="bouton bouton-secondaire" onClick={effacerSession}>
              Déconnexion
            </button>
          </>
        ) : (
          <Link href="/connexion">Connexion</Link>
        )}
      </nav>
    </header>
  );
}
