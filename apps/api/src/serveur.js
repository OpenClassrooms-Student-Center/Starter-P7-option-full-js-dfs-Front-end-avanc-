import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import routeurLogements from './routes/logements.js';
import routeurAuth from './routes/auth.js';
import routeurAvis from './routes/avis.js';
import routeurSejours from './routes/sejours.js';
import routeurAdministration from './routes/administration.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get('/api/sante', (_req, res) => {
  res.json({ statut: 'ok' });
});

app.use('/api/logements', routeurLogements);
app.use('/api/auth', routeurAuth);
app.use('/api/sejours', routeurSejours);
app.use('/api/administration', routeurAdministration);
app.use('/', routeurAvis);

app.listen(config.port, () => {
  console.log('API Kasa à l’écoute sur http://localhost:' + config.port);
});
