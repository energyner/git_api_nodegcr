// src/server/solar-server.mjs

import { Router } from 'express'; // Importamos Router de Express
import cors from 'cors'; // Para manejar CORS
import { calcularProduccionSolar } from '../calculations/solar-production.mjs'; // Importamos la función de cálculo
import * as fs from 'fs'; // Para manejo de archivos (usado en health check)
import * as path from 'path'; // Para manipulación de rutas (usado en health check)
import { fileURLToPath } from 'url'; // Necesario para resolver __dirname en módulos ES

// Obtenemos __filename y __dirname para resolver rutas relativas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creamos una instancia de Router
const router = Router();

// Middlewares específicos para este router
router.use(cors());
router.use(express.json());

// Rutas GET para la API de producción solar
router.get('/api/produccion-solar', (req, res) => {
    console.log("Solicitud GET en /api/produccion-solar (desde router solar)");
    res.send('Usa POST para calcular la produccion-solar de paneles solares.');
});

// 🔹 HEALTH CHECK ENDPOINT (CON CHEQUEO DE IMPORTACIÓN Y FUNCIONAMIENTO)
router.get('/health', (req, res) => {
    let isServerUp = true; // Siempre true si el router está respondiendo
    let isCalculationFilePresent = false;
    let isCalculationFunctionWorking = false;

    // Chequea si el archivo solar-production.mjs existe
    const filePath = path.resolve(__dirname, '..', 'calculations', 'solar-production.mjs');
    try {
        if (fs.existsSync(filePath)) {
            isCalculationFilePresent = true;
        }
    } catch (error) {
        console.error('Error al verificar el archivo de cálculo en health check:', error);
    }

    // Chequea si la función calcularProduccionSolar está definida e intenta usarla
    if (typeof calcularProduccionSolar === 'function') {
        try {
            // Intenta ejecutar la función con datos de prueba mínimos
            const testData = { panelArea: 1, efficiency: 0.15, sunlightHours: 5 };
            const testResult = calcularProduccionSolar(testData);
            // Si la función no lanza un error al ejecutarse con datos básicos,
            // asumimos que está funcionando correctamente (para este health check).
            if (typeof testResult === 'object' || typeof testResult === 'number') {
                isCalculationFunctionWorking = true;
            }
        } catch (error) {
            console.error('Error al ejecutar la función calcularProduccionSolar en el health check:', error);
        }
    }

    if (isServerUp && isCalculationFilePresent && isCalculationFunctionWorking) {
        res.status(200).send('OK - Servidor Solar, archivo de cálculo y función OK');
    } else {
        let message = 'ERROR - Health Check Solar Fallido:';
        if (!isServerUp) {
            message += ' Servidor no responde.';
        }
        if (!isCalculationFilePresent) {
            message += ' Archivo solar-production.mjs no encontrado.';
        }
        if (!isCalculationFunctionWorking) {
            message += ' Función calcularProduccionSolar no funciona correctamente o no está definida.';
        }
        res.status(500).send(message);
    }
});

// Rutas POST
// CORRECCIÓN CRÍTICA: `calcularProduccionSolar` es una función de cálculo, no un controlador de Express.
// Necesitamos un controlador que reciba la solicitud y llame a la función de cálculo.
router.post('/api/produccion-solar', (req, res) => {
    try {
        const datosSolar = req.body; // Asumiendo que los datos vienen en el cuerpo

        if (!datosSolar || typeof datosSolar !== 'object') {
            return res.status(400).json({ error: "Datos de entrada inválidos para el cálculo de producción solar." });
        }

        const resultado = calcularProduccionSolar(datosSolar); // Asegúrate de pasar los argumentos correctos
        res.status(200).json({ resultado });
    } catch (error) {
        console.error("Error al procesar la solicitud POST /api/produccion-solar:", error);
        res.status(500).json({ error: "Error interno del servidor al calcular producción solar." });
    }
});

// EXPORTAR: Exportamos el router para que `main.mjs` pueda usarlo
export default router;

