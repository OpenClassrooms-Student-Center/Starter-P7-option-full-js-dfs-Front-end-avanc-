import { Router } from 'express';
import { config } from '../config.js';
import { chargerDonnees } from '../donnees/chargeurCsv.js';

const routeurAdministration = Router();

routeurAdministration.get('/', async (_req, res) => {
  const { utilisateurs, logements, sejours } = await chargerDonnees(config.dataFile);
  const sejoursConfirmes = sejours.filter((sejour) => sejour.statut === 'confirmee');
  const volumeReserve = sejoursConfirmes.reduce(
    (total, sejour) => total + sejour.prixTotal,
    0,
  );

  res.json({
    indicateurs: {
      logementsPublies: logements.length,
      comptesVoyageurs: utilisateurs.filter(
        (utilisateur) => utilisateur.role === 'utilisateur',
      ).length,
      sejoursConfirmes: sejoursConfirmes.length,
      volumeReserve,
    },
    sejours: sejours.map((sejour) => {
      const voyageur = utilisateurs.find(
        (utilisateur) => utilisateur.id === sejour.idVoyageur,
      );
      const logement = logements.find(
        (element) => element.id === sejour.idLogement,
      );

      return {
        id: sejour.id,
        voyageur: voyageur
          ? { nom: voyageur.prenom + ' ' + voyageur.nom, email: voyageur.email }
          : null,
        logement: logement ? { titre: logement.titre } : null,
        arrivee: sejour.dateArrivee,
        statut: sejour.statut === 'confirmee' ? 'Confirmé' : sejour.statut,
        montant: sejour.prixTotal,
      };
    }),
    logements: logements.map((logement) => ({
      id: logement.id,
      titre: logement.titre,
      ville: logement.ville,
      prixParNuit: logement.prixParNuit,
      statut: 'Publié',
    })),
  });
});

export default routeurAdministration;
