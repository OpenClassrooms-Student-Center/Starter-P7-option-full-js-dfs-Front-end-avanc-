'use client';

import { useState } from 'react';
import { getContactConciergerie } from '@/lib/api';
import type { ContactConciergerie } from '@/lib/types';

export default function ConciergerieLogement({
  logementId,
}: {
  logementId: string;
}) {
  const [contact, setContact] = useState<ContactConciergerie | null>(null);

  async function afficherContact() {
    setContact(await getContactConciergerie(logementId));
  }

  return (
    <section className="section-fonctionnalite">
      <h2>Services pour votre séjour</h2>
      <p>
        Notre conciergerie partenaire peut vous accompagner avant votre arrivée.
      </p>
      <button
        className="bouton"
        type="button"
        onClick={afficherContact}
      >
        Contacter la conciergerie
      </button>
      {contact && (
        <p>
          {contact.partenaire.nom} ·{' '}
          <a href={'mailto:' + contact.partenaire.email}>
            {contact.partenaire.email}
          </a>
        </p>
      )}
    </section>
  );
}
