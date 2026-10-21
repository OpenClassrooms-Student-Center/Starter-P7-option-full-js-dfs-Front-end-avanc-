import { Router } from 'express';
import { config } from '../config.js';
import { integrationPartenaire } from '../config/partenaire.js';
import { chargerDonnees } from '../donnees/chargeurCsv.js';

const routeurLogements = Router();

function enrichirLogement(logement, utilisateurs) {
  const hote = utilisateurs.find((utilisateur) => utilisateur.id === logement.idHote);

  return {
    ...logement,
    hote: hote ? { prenom: hote.prenom, nom: hote.nom } : null,
  };
}

routeurLogements.get('/', async (_req, res) => {
  const { utilisateurs, logements } = await chargerDonnees(config.dataFile);
  res.json(logements.map((logement) => enrichirLogement(logement, utilisateurs)));
});

routeurLogements.get('/:id/conciergerie', async (req, res) => {
  const { logements } = await chargerDonnees(config.dataFile);
  const logement = logements.find((element) => element.id === req.params.id);

  if (!logement) {
    return res.status(404).json({ message: 'Logement introuvable' });
  }

  res.json({
    logement: { id: logement.id, titre: logement.titre },
    partenaire: integrationPartenaire,
  });
});

routeurLogements.get('/:id', async (req, res) => {
  const { utilisateurs, logements } = await chargerDonnees(config.dataFile);
  const logement = logements.find((element) => element.id === req.params.id);

  res.json(logement ? enrichirLogement(logement, utilisateurs) : null);
});

export default routeurLogements;
