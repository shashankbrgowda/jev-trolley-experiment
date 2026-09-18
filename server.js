import express from 'express';
import { askJev } from './jev.js';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use('/vendor', express.static('node_modules/three/build'));
app.use(express.static('ui'));

app.post('/api/decision', async (_request, response) => {
  if (!process.env.AI_GATEWAY_API_KEY) {
    return response.status(503).json({
      error: 'Add AI_GATEWAY_API_KEY to .env before asking Jev.',
    });
  }

  try {
    response.json(await askJev());
  } catch (error) {
    console.error(error);
    response.status(502).json({ error: 'Jev could not make a decision.' });
  }
});

const server = app.listen(port, (error) => {
  if (error) {
    console.error(`Could not start server: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Trolley demo: http://localhost:${port}`);
});
