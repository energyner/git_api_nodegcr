// git_api_nodegcr/main.mjs

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import consumoRouter from './src/server/consumo-server.mjs';
import footprintRouter from './src/server/footprint-server.mjs';
import solarRouter from './src/server/solar-server.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares Globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas estáticas
app.use('/main', express.static(path.join(__dirname, 'main')));
app.use('/src/client', express.static(path.join(__dirname, 'src', 'client')));

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Verificación de routers importados
console.log('--- Verificando Routers Importados ---');
console.log('Tipo de consumoRouter:', typeof consumoRouter);
console.log('Tipo de footprintRouter:', typeof footprintRouter);
console.log('Tipo de solarRouter:', typeof solarRouter);
console.log('------------------------------------');

// Montaje seguro de todos los microservicios
try {
  app.use('/api/consumo', consumoRouter);
  console.log('consumoRouter montado en /api/consumo');
} catch (err) {
  console.error('Error al montar consumoRouter:', err.message);
}

try {
  app.use('/api/huella', footprintRouter);
  console.log('footprintRouter montado en /api/huella');
} catch (err) {
  console.error('Error al montar footprintRouter:', err.message);
}

try {
  app.use('/api/solar', solarRouter);
  console.log('solarRouter montado en /api/solar');
} catch (err) {
  console.error('Error al montar solarRouter:', err.message);
}

// Listado de rutas activas
console.log('Rutas registradas en Express:');
app._router?.stack?.forEach((middleware) => {
  if (middleware.route) {
    console.log('Ruta directa:', middleware.route.path);
  } else if (middleware.name === 'router' && middleware.regexp) {
    console.log('Subrouter (RegExp):', middleware.regexp);
  }
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor principal. Intenta nuevamente.' });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`URL local: http://localhost:${PORT}`);
});