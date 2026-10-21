import { Router } from 'express';
import { config } from '../config.js';
import { chargerDonnees } from '../donnees/chargeurCsv.js';

const routeurSejours = Router();

function presenterSejour(sejour, utilisateurs, logements) {
  const voyageur = utilisateurs.find((element) => element.id === sejour.idVoyageur);
  const logement = logements.find((element) => element.id === sejour.idLogement);

  return {
    id: sejour.id,
    voyageurId: sejour.idVoyageur,
    arrivee: sejour.dateArrivee,
    nuits: sejour.nombreNuits,
    statut: sejour.statut,
    prixTotal: sejour.prixTotal,
    voyageur: voyageur
      ? { nom: voyageur.prenom + ' ' + voyageur.nom, email: voyageur.email }
      : null,
    logement: logement
      ? { id: logement.id, titre: logement.titre, ville: logement.ville }
      : null,
  };
}

routeurSejours.get('/', async (req, res) => {
  const { utilisateurs, logements, sejours } = await chargerDonnees(config.dataFile);
  const sejoursAffiches = req.query.voyageurId
    ? sejours.filter((sejour) => sejour.idVoyageur === req.query.voyageurId)
    : sejours;

  res.json(
    sejoursAffiches.map((sejour) =>
      presenterSejour(sejour, utilisateurs, logements),
    ),
  );
});

routeurSejours.get('/:id', async (req, res) => {
  const { utilisateurs, logements, sejours } = await chargerDonnees(config.dataFile);
  const sejour = sejours.find((element) => element.id === req.params.id);

  if (!sejour) {
    return res.status(404).json({ message: 'Séjour introuvable' });
  }

  res.json(presenterSejour(sejour, utilisateurs, logements));
});

export default routeurSejours;
