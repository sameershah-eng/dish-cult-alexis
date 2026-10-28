import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import placesHandler from './api/places.ts';
import placeDetailHandler from './api/place.ts';
import photoHandler from './api/photo.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Mount Google Places Serverless Endpoints
  app.get('/api/places', (req, res) => placesHandler(req, res));
  app.get('/api/place', (req, res) => placeDetailHandler(req, res));
  app.get('/api/photo', (req, res) => photoHandler(req, res));

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dish Cult server listening on port ${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
});
