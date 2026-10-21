import { Router } from 'express';
import { config } from '../config.js';
import { chargerDonnees } from '../donnees/chargeurCsv.js';

const routeurAvis = Router();

function echapperHtml(valeur) {
  return String(valeur).replace(/[&<>"']/g, (caractere) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[caractere]);
}

routeurAvis.get('/logements/:id/avis/apercu', async (req, res) => {
  const { logements } = await chargerDonnees(config.dataFile);
  const logement = logements.find((element) => element.id === req.params.id);

  if (!logement) {
    return res.status(404).send('Logement introuvable');
  }

  const message = req.query.message ?? 'Votre avis apparaîtra ici.';
  const titreEchappe = echapperHtml(logement.titre);

  // Le message est inséré directement dans le HTML de prévisualisation.
  res.type('html').send(
    '<!doctype html><html lang="fr"><meta charset="utf-8">' +
    '<title>Aperçu de votre avis</title><body><h1>Avis pour ' +
    titreEchappe +
    '</h1><p>' +
    message +
    '</p></body></html>',
  );
});

export default routeurAvis;
