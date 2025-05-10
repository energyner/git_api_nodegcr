// src/main.mjs
import express from 'express';
import httpProxy from 'http-proxy';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8080;
const proxy = httpProxy.createProxyServer({});

app.use(cors());

app.use('/api/consumo-energetico', (req, res) => {
    proxy.web(req, res, { target: 'http://127.0.0.1:3006' });
});

// app.use('/api/huella-carbono', (req, res) => {
//     proxy.web(req, res, { target: 'http://localhost:3008' });
// });

app.use('/api/huella-carbono', (req, res) => {
  proxy.web(req, res, { target: 'http://127.0.0.1:3008' }, (err) => {
    console.error('Error al hacer proxy a huella-carbono:', err);
    res.status(500).send('Error al conectar al servidor interno de huella de carbono');
  });
});

app.use('/api/produccion-solar', (req, res) => {
    proxy.web(req, res, { target: 'http://127.0.0.1:3010' });
});

// Health check para Cloud Run (opcional, pero recomendado)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Proxy server listening on port ${port}`);
});
