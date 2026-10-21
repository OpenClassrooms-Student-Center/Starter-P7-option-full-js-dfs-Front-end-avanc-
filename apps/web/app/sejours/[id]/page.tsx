import Link from 'next/link';
import { getSejour } from '@/lib/api';

interface PageSejourProps {
  params: Promise<{ id: string }>;
}

export default async function PageSejour({ params }: PageSejourProps) {
  const { id } = await params;
  let sejour;

  try {
    sejour = await getSejour(id);
  } catch {
    return (
      <section>
        <h1>Séjour introuvable</h1>
        <Link href="/mes-sejours">Retour</Link>
      </section>
    );
  }

  return (
    <section className="detail-logement">
      <Link href="/mes-sejours" className="lien-retour">
        ← Retour à mes séjours
      </Link>
      <h1>{sejour.logement?.titre}</h1>
      <p className="detail-meta">
        {sejour.logement?.ville} · Référence {sejour.id}
      </p>
      <section className="section-fonctionnalite">
        <h2>Détails de la réservation</h2>
        <p>Arrivée : {sejour.arrivee}</p>
        <p>Durée : {sejour.nuits} nuits</p>
        <p>Statut : {sejour.statut}</p>
        <p className="prix">Montant total : {sejour.prixTotal} €</p>
      </section>
    </section>
  );
}
