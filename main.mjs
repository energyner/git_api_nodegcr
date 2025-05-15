
// src/main.mjs
import express from 'express';
import httpProxy from 'http-proxy';
import cors from 'cors';
import path from 'path'; // Importa el módulo 'path'
import { fileURLToPath } from 'url'; // Importa fileURLToPath
import { dirname } from 'path'; // Importa dirname

// Configurar __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Manejo de la señal SIGINT
process.on('SIGINT', () => {
    console.log('Proxy server: Recibida señal SIGINT. Cerrando...');
    // Aquí podrías agregar lógica para cerrar conexiones o limpiar recursos del proxy
    process.exit(0);
});

const app = express();
const port = process.env.PORT || 8080;
const proxy = httpProxy.createProxyServer({});

app.use(cors());

// Servir archivos estáticos desde el directorio 'src/client'
app.use(express.static(path.join(__dirname, 'src', 'client')));

// Agregar ruta para la raíz '/'
app.get('/', (req, res) => {
    res.status(200).send('Proxy server is running and routing traffic.');
});


app.use('/api/consumo-energetico', (req, res) => {
     console.log('Redirigiendo a consumo-energetico...');
    proxy.web(req, res, { target: 'http://127.0.0.1:3006' });
});


app.use('/api/huella-carbono', (req, res) => {
    proxy.web(req, res, { target: 'http://127.0.0.1:3008' }, (err) => {
         console.log('Redirigiendo a huella-carbono...');
        console.error('Error al hacer proxy a huella-carbono:', err);
        res.status(500).send('Error al conectar al servidor interno de huella de carbono');
    });
});

app.use('/api/produccion-solar', (req, res) => {
     console.log('Redirigiendo a produccion-solar...');
    proxy.web(req, res, { target: 'http://127.0.0.1:3010' });
});

// Health check para Cloud Run (opcional, pero recomendado)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Proxy server listening on port ${port}`);
});