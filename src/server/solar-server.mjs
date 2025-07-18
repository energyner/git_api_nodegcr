// // src/server/solar-server.mjs

import express, { Router } from 'express'; // Importamos Router de Express
// No necesitamos 'cors' aquí si ya se maneja en main.mjs
// import cors from 'cors';
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
// Si `main.mjs` ya tiene `app.use(cors())`, esta línea es redundante.
// router.use(cors());

// 🔹 Rutas GET
router.get('/produccion-solar', (req, res) => {
    res.send('Usa POST para calcular la producción solar de paneles solares.');
});

// 🔹 HEALTH CHECK
router.get('/health', (req, res) => {
    let isServerUp = true; // Este flag no se usa realmente para verificar el servidor en sí, solo la función de cálculo y el archivo.
    let isCalculationFilePresent = false;
    let isCalculationFunctionWorking = false;

    const filePath = path.resolve(__dirname, '..', 'calculations', 'solar-production.mjs');

    try {
        if (fs.existsSync(filePath)) {
            isCalculationFilePresent = true;
        }
    } catch (error) {
        console.error('Error al verificar el archivo de cálculo en health check:', error);
    }

    if (typeof calcularProduccionSolar === 'function') {
        try {
            // ¡CORRECCIÓN CLAVE AQUÍ! Pasar un OBJETO a calcularProduccionSolar en el health check
            const testData = { area: 1, irradiacion: 5, eficiencia: 0.15 };
            const testResult = calcularProduccionSolar(testData);

            // Asumiendo que calcularProduccionSolar devuelve un objeto con 'produccion_solar'
            if (
                typeof testResult === 'object' &&
                typeof testResult.produccion_solar === 'number'
            ) {
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
        // if (!isServerUp) { message += ' Servidor no responde.'; } // No se usa
        if (!isCalculationFilePresent) {
            message += ' Archivo solar-production.mjs no encontrado.';
        }
        if (!isCalculationFunctionWorking) {
            message += ' Función calcularProduccionSolar no funciona correctamente o no está definida.';
        }
        res.status(500).send(message);
    }
});

// 🔹 POST: Calcular producción solar
router.post('/produccion-solar', (req, res) => {
    try {
        let { area, irradiacion, eficiencia } = req.body; // Usa 'let' para reasignar

        // Parsear los parámetros (ya se hace en el manejador del servidor principal, pero es buena práctica aquí también para seguridad)
        area = parseFloat(area);
        irradiacion = parseFloat(irradiacion);
        eficiencia = parseFloat(eficiencia);

        // Validaciones (mantener aquí también para este router específico)
        if (isNaN(area) || isNaN(irradiacion) || isNaN(eficiencia) ||
            area <= 0 || irradiacion <= 0 || eficiencia <= 0 || eficiencia > 1) {
            return res.status(400).json({ error: "Parámetros inválidos. Asegúrese de que área, irradiación y eficiencia son números positivos, y eficiencia está entre 0 y 1." });
        }

        // ¡CORRECCIÓN CLAVE AQUÍ! Pasar un OBJETO a calcularProduccionSolar
        const resultado = calcularProduccionSolar({ area, irradiacion, eficiencia });

        res.status(200).json(resultado);
    } catch (error) {
        console.error("Error al procesar la solicitud POST /produccion-solar:", error);
        res.status(500).json({
            error: "Error interno del servidor al calcular producción solar."
        });
    }
});

// Exportamos el router para usarlo en main.mjs
export default router;

