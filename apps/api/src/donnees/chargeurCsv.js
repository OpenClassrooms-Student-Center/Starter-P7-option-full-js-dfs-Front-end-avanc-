import { readFile } from 'node:fs/promises';

const SEPARATEUR = ',';

function decouperLigne(ligne) {
  return ligne.split(SEPARATEUR).map((valeur) => valeur.trim());
}

function versUtilisateur(enregistrement) {
  return {
    id: enregistrement.id,
    role: enregistrement.role,
    prenom: enregistrement.prenom,
    nom: enregistrement.nom,
    email: enregistrement.email,
    motDePasseClair: enregistrement.mot_de_passe_clair,
    dateCreation: enregistrement.date_creation,
  };
}

function versLogement(enregistrement) {
  return {
    id: enregistrement.id,
    titre: enregistrement.titre,
    typeLogement: enregistrement.type_logement,
    ville: enregistrement.ville,
    prixParNuit: enregistrement.prix_par_nuit,
    idHote: enregistrement.id_hote,
    dateCreation: enregistrement.date_creation,
  };
}

function versSejour(enregistrement) {
  return {
    id: enregistrement.id,
    idVoyageur: enregistrement.id_voyageur,
    idLogement: enregistrement.id_logement,
    dateArrivee: enregistrement.date_arrivee,
    nombreNuits: Number(enregistrement.nombre_nuits),
    statut: enregistrement.statut_sejour,
    prixTotal: Number(enregistrement.prix_total),
  };
}

/**
 * Transforme le CSV en collections d'utilisateurs, de logements et de séjours.
 * Le type d'enregistrement détermine les colonnes à lire pour chaque ligne.
 */
export function parserCsv(texte) {
  const lignes = texte
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((ligne) => ligne.trim() !== '');

  if (lignes.length === 0) {
    return { utilisateurs: [], logements: [], sejours: [] };
  }

  const entetes = decouperLigne(lignes[0]);
  const utilisateurs = [];
  const logements = [];
  const sejours = [];

  for (const ligne of lignes.slice(1)) {
    const valeurs = decouperLigne(ligne);
    const enregistrement = {};

    entetes.forEach((entete, index) => {
      enregistrement[entete] = valeurs[index] ?? '';
    });

    if (enregistrement.type_enregistrement === 'utilisateur') {
      utilisateurs.push(versUtilisateur(enregistrement));
    } else if (enregistrement.type_enregistrement === 'logement') {
      logements.push(versLogement(enregistrement));
    } else if (enregistrement.type_enregistrement === 'sejour') {
      sejours.push(versSejour(enregistrement));
    }
  }

  return { utilisateurs, logements, sejours };
}

export async function chargerDonnees(cheminFichier) {
  const contenu = await readFile(cheminFichier, 'utf8');
  return parserCsv(contenu);
}
