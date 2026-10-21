import Link from 'next/link';
import { API_URL, getLogement } from '@/lib/api';
import ConciergerieLogement from '@/components/ConciergerieLogement';

interface PageLogementProps {
  params: Promise<{ id: string }>;
}

export default async function PageLogement({ params }: PageLogementProps) {
  const { id } = await params;
  const logement = await getLogement(id);

  return (
    <article className="detail-logement">
      <Link href="/" className="lien-retour">
        ← Retour aux logements
      </Link>
      <h1>{logement.titre}</h1>
      <p className="detail-meta">
        {logement.typeLogement} · {logement.ville}
      </p>
      <p className="prix">{logement.prixParNuit} € / nuit</p>
      {logement.hote && (
        <p>
          Proposé par {logement.hote.prenom} {logement.hote.nom}
        </p>
      )}

      <section className="section-fonctionnalite">
        <h2>Partager votre avis</h2>
        <p>Prévisualisez votre commentaire avant de le publier.</p>
        <form
          action={
            API_URL +
            '/logements/' +
            encodeURIComponent(id) +
            '/avis/apercu'
          }
          method="get"
          target="avis-apercu"
        >
          <label className="champ">
            <span>Votre avis</span>
            <textarea
              name="message"
              placeholder="Racontez votre expérience…"
              required
            />
          </label>
          <button className="bouton">Prévisualiser l’avis</button>
        </form>
        <iframe
          className="apercu-avis"
          name="avis-apercu"
          title="Aperçu de votre avis"
        />
      </section>
      <ConciergerieLogement logementId={id} />
    </article>
  );
}
