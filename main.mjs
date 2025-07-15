// git_api_nodegcr/main.mjs

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'; // Asegúrate de importar cors aquí

// Importar los routers de los microservicios
// Asegúrate de que los nombres de importación coincidan con las exportaciones por defecto de tus routers
import consumoRouter from './src/server/consumo-server.mjs';
import footprintRouter from './src/server/footprint-server.mjs';
import solarRouter from './src/server/solar-server.mjs';

// Esto es necesario para usar __dirname y __filename con módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Cloud Run asignará el puerto a process.env.PORT.
// Si se ejecuta localmente, usará 8080.
const PORT = process.env.PORT || 8080; 

// 🔹 Middlewares Globales
// Configuración CORS global para permitir solicitudes desde cualquier origen
app.use(cors()); 
// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());
// Middleware para parsear datos de formularios URL-encoded
app.use(express.urlencoded({ extended: true }));

// 🔹 Sirve archivos estáticos desde el directorio 'main' en la raíz del proyecto
// Esto permitirá que index.html cargue sus CSS, JS e imágenes desde ./main/
app.use('/main', express.static(path.join(__dirname, 'main')));

// 🔹 Sirve archivos estáticos desde el directorio 'client'
// Por ejemplo, `src/client/consumo/consumo.html` será accesible en `/src/client/consumo/consumo.html`
app.use('/src/client', express.static(path.join(__dirname, 'src', 'client')));


// 🔹 Ruta para servir el archivo index.html en la URL raíz
// Cuando alguien acceda a http://tu-app.run.app/ (o http://localhost:8080/)
// se le enviará el contenido de git_api_nodegcr/index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 🔹 Montar los routers de los microservicios bajo el prefijo '/api'
// Esto significa que las rutas definidas DENTRO de cada router
// (ej. '/consumo-energetico') se añadirán a '/api'.
// La URL final será '/api/consumo-energetico'.

app.use('/api', consumoRouter);    // Monta el router de consumo bajo /api
app.use('/api', footprintRouter);  // Monta el router de huella de carbono bajo /api
app.use('/api', solarRouter);      // Monta el router solar bajo /api


// 🔹 Manejo global de errores
// Este middleware de manejo de errores captura cualquier error que ocurra
// en las rutas o middlewares anteriores.
app.use((err, req, res, next) => {
    console.error(err.stack); // Imprime el stack trace del error para depuración
    res.status(500).json({ error: "Error interno del servidor principal. Intenta nuevamente." });
});

// 🔹 Inicia el servidor
// La aplicación Express comienza a escuchar en el puerto asignado
app.listen(PORT, () => {
  console.log(`Servidor principal escuchando en el puerto ${PORT}`);
  console.log(`URL de la aplicación (local): http://localhost:${PORT}`);
  console.log(`Recuerda que en Cloud Run el puerto es asignado dinámicamente.`);
});
