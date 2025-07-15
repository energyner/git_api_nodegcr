// git_api_nodegcr/main.mjs

// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import cors from 'cors'; // Asegúrate de importar cors aquí

// // Importar los routers de los microservicios
// // Asegúrate de que los nombres de importación coincidan con las exportaciones por defecto de tus routers
// import consumoRouter from './src/server/consumo-server.mjs';
// import footprintRouter from './src/server/footprint-server.mjs';
// import solarRouter from './src/server/solar-server.mjs';

// // Esto es necesario para usar __dirname y __filename con módulos ES
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// // Cloud Run asignará el puerto a process.env.PORT.
// // Si se ejecuta localmente, usará 8080.
// const PORT = process.env.PORT || 8080; 

// // 🔹 Middlewares Globales
// // Configuración CORS global para permitir solicitudes desde cualquier origen
// app.use(cors()); 
// // Middleware para parsear JSON en el cuerpo de las solicitudes
// app.use(express.json());
// // Middleware para parsear datos de formularios URL-encoded
// app.use(express.urlencoded({ extended: true }));

// // 🔹 Sirve archivos estáticos desde el directorio 'main' en la raíz del proyecto
// app.use('/main', express.static(path.join(__dirname, 'main')));

// // 🔹 Sirve archivos estáticos desde el directorio 'client'
// app.use('/src/client', express.static(path.join(__dirname, 'src', 'client')));


// // 🔹 Ruta para servir el archivo index.html en la URL raíz
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// // 🔹 Montar los routers de los microservicios bajo el prefijo '/api'
// // DIAGNÓSTICO: Añadimos logs para verificar el tipo de los routers importados
// console.log('--- Verificando Routers Importados ---');
// console.log('Tipo de consumoRouter:', typeof consumoRouter, consumoRouter instanceof Router);
// console.log('Tipo de footprintRouter:', typeof footprintRouter, footprintRouter instanceof Router);
// console.log('Tipo de solarRouter:', typeof solarRouter, solarRouter instanceof Router);
// console.log('------------------------------------');

// app.use('/api', consumoRouter);    // Monta el router de consumo bajo /api
// app.use('/api', footprintRouter);  // Monta el router de huella de carbono bajo /api
// app.use('/api', solarRouter);      // Monta el router solar bajo /api


// // 🔹 Manejo global de errores
// app.use((err, req, res, next) => {
//     console.error(err.stack); 
//     res.status(500).json({ error: "Error interno del servidor principal. Intenta nuevamente." });
// });

// // 🔹 Inicia el servidor
// app.listen(PORT, () => {
//   console.log(`Servidor principal escuchando en el puerto ${PORT}`);
//   console.log(`URL de la aplicación (local): http://localhost:${PORT}`);
//   console.log(`Recuerda que en Cloud Run el puerto es asignado dinámicamente.`);
// });


/**Aislando archivos para deetectar ERROR en las rutas */

// git_api_nodegcr/main.mjs

// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import cors from 'cors'; 

// // Importar los routers de los microservicios
// // Aunque los importamos, NO los montaremos inicialmente para aislar el error.
// import consumoRouter from './src/server/consumo-server.mjs';
// import footprintRouter from './src/server/footprint-server.mjs';
// import solarRouter from './src/server/solar-server.mjs';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 8080; 

// // 🔹 Middlewares Globales
// app.use(cors()); 
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // 🔹 Sirve archivos estáticos desde el directorio 'main' en la raíz del proyecto
// app.use('/main', express.static(path.join(__dirname, 'main')));

// // 🔹 Sirve archivos estáticos desde el directorio 'client'
// app.use('/src/client', express.static(path.join(__dirname, 'src', 'client')));


// // 🔹 Ruta para servir el archivo index.html en la URL raíz
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// // 🔹 Montar los routers de los microservicios bajo el prefijo '/api'
// // ✅ CAMBIO TEMPORAL PARA DEPURACIÓN: Comentamos estas líneas
// // console.log('--- Verificando Routers Importados ---');
// // console.log('Tipo de consumoRouter:', typeof consumoRouter, consumoRouter instanceof Router);
// // console.log('Tipo de footprintRouter:', typeof footprintRouter, footprintRouter instanceof Router);
// // console.log('Tipo de solarRouter:', typeof solarRouter, solarRouter instanceof Router);
// // console.log('------------------------------------');

// // app.use('/api', consumoRouter);    
// // app.use('/api', footprintRouter);  
// // app.use('/api', solarRouter);      


// // 🔹 Manejo global de errores
// app.use((err, req, res, next) => {
//     console.error(err.stack); 
//     res.status(500).json({ error: "Error interno del servidor principal. Intenta nuevamente." });
// });

// // 🔹 Inicia el servidor
// app.listen(PORT, () => {
//   console.log(`Servidor principal escuchando en el puerto ${PORT}`);
//   console.log(`URL de la aplicación (local): http://localhost:${PORT}`);
//   console.log(`Recuerda que en Cloud Run el puerto es asignado dinámicamente.`);
// });



/* ELIMINANDO LAS LINEAS SOSPECHOSAS DE CAUSAR EL ERROR path-to-regexp...*/



// git_api_nodegcr/main.mjs

// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import cors from 'cors'; 

// // Importar los routers de los microservicios
// // (Estas líneas están comentadas para la depuración actual)
//  import consumoRouter from './src/server/consumo-server.mjs';
// // import footprintRouter from './src/server/footprint-server.mjs';
// // import solarRouter from './src/server/solar-server.mjs';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 8080; 

// // 🔹 Middlewares Globales
// app.use(cors()); 
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Rutas de archivos estáticos
// // Revisa que las cadenas '/main' y '/src/client' no tengan espacios extra o caracteres invisibles.
// app.use('/main', express.static(path.join(__dirname, 'main')));
// app.use('/src/client', express.static(path.join(__dirname, 'src', 'client')));

// // Ruta raíz para servir el archivo index.html
// // Revisa que la cadena '/' no tenga espacios extra o caracteres invisibles.
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// // 🔹 Montar los routers de los microservicios bajo el prefijo '/api'
// console.log('--- Verificando Routers Importados ---');
// console.log('Tipo de consumoRouter:', typeof consumoRouter, consumoRouter instanceof Router);
// console.log('Tipo de footprintRouter:', typeof footprintRouter, footprintRouter instanceof Router); // Este mostrará 'undefined false' si está comentado
// console.log('Tipo de solarRouter:', typeof solarRouter, solarRouter instanceof Router);         // Este mostrará 'undefined false' si está comentado
// console.log('------------------------------------');
// app.use('/api', consumoRouter);    
// // app.use('/api', footprintRouter);  
// // app.use('/api', solarRouter);      


// // 🔹 Manejo global de errores
// app.use((err, req, res, next) => {
//     console.error(err.stack); 
//     res.status(500).json({ error: "Error interno del servidor principal. Intenta nuevamente." });
// });

// // 🔹 Inicia el servidor
// app.listen(PORT, () => {
//   console.log(`Servidor principal escuchando en el puerto ${PORT}`);
//   console.log(`URL de la aplicación (local): http://localhost:${PORT}`);
//   console.log(`Recuerda que en Cloud Run el puerto es asignado dinámicamente.`);
// });


/*Version de Copilot afilada con un bistury */
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

// 🔹 Middlewares Globales
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

// 🔹 Verificación de routers importados
console.log('--- Verificando Routers Importados ---');
console.log('Tipo de consumoRouter:', typeof consumoRouter);
console.log('------------------------------------');

// 🔹 Montaje seguro del router consumo con verificación de errores
try {
  app.use('/api', consumoRouter);
  console.log('consumoRouter montado correctamente en /api');
} catch (err) {
  console.error(' Error al montar consumoRouter:', err.message);
}

// 🔹 Listado de rutas registradas (post-montaje)
console.log('Rutas registradas en Express:');
app.router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(' Ruta directa:', middleware.route.path);
  } else if (middleware.name === 'router' && middleware.regexp) {
    console.log('🔧 Subrouter (RegExp):', middleware.regexp);
  }
});

// 🔹 Manejo global de errores
app.use((err, req, res, next) => {
  console.error(' Error global:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor principal. Intenta nuevamente.' });
});

// 🔹 Inicia el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
  console.log(`🌐 URL local: http://localhost:${PORT}`);
});