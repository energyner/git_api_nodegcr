// src/server/footprint-server.mjs

import express, { Router } from 'express'; // Importa Router de Express
import cors from 'cors'; // Importa cors para el manejo de CORS
import { calcularHuellaCarbono } from '../calculations/carbon-footprint.mjs'; // Importa la función de cálculo pura
import * as fs from 'fs'; // Importa fs para verificar archivos (en health check)
import * as path from 'path'; // Importa path para manipular rutas (en health check)
import { fileURLToPath } from 'url'; // Necesario para resolver __dirname en módulos ES

// Obtiene __filename y __dirname para resolver rutas relativas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crea una instancia de Router para este módulo de API
const router = Router();

// Middlewares específicos para este router (opcional)
router.use(cors());

// Ruta POST para calcular la huella de carbono
// Esta ruta será accesible en /huella-carbono
router.post('/huella-carbono', (req, res) => {
    console.log("Solicitud POST en /huella-carbono (desde router de huella)");
    try {
        const parametros = req.body; // Los parámetros ya vienen parseados por express.json()

        // Llama a la función de cálculo pura
        const resultadoCalculo = calcularHuellaCarbono(parametros);

        // Maneja el resultado de la función de cálculo
        if (resultadoCalculo.error) {
            // Si la función retornó un error, envía una respuesta 400
            return res.status(400).json({ error: resultadoCalculo.error });
        } else {
            // Si la función retornó un resultado exitoso, envía una respuesta 200
            res.status(200).json(resultadoCalculo);
            console.log("Cálculo completado para huella-carbono:", resultadoCalculo);
        }
    } catch (error) {
        console.error("Error al procesar la solicitud POST /huella-carbono:", error);
        res.status(500).json({ error: "Error interno del servidor. Intente nuevamente más tarde." });
    }
});

// Health Check para el servicio de huella de carbono
// Esta ruta será accesible en /health (o /footprint/health si main.mjs lo monta así)
router.get('/health', (req, res) => {
    // Resuelve la ruta al archivo de cálculo de forma robusta
    const filePath = path.resolve(__dirname, '..', 'calculations', 'carbon-footprint.mjs');
    let isCalculationFilePresent = fs.existsSync(filePath);
    let isCalculationFunctionWorking = typeof calcularHuellaCarbono === 'function';

    // Intenta ejecutar la función de cálculo con datos de prueba para verificar su operatividad
    if (isCalculationFunctionWorking) {
        try {
            // Datos de prueba mínimos para la función calcularHuellaCarbono
            const testData = { state: 'FL', person: 1, elect: 0, gas: 0, water: 0, lpg: 0, gn: 0, fly: 0, cogs: 0 };
            const testResult = calcularHuellaCarbono(testData);
            // Verifica que el resultado tenga el formato esperado (ej. un objeto con 'total')
            if (testResult && typeof testResult.total === 'number') {
                isCalculationFunctionWorking = true;
            } else {
                isCalculationFunctionWorking = false; // La función no retornó el formato esperado
            }
        } catch (error) {
            console.error('Error al ejecutar la función calcularHuellaCarbono en el health check:', error);
            isCalculationFunctionWorking = false;
        }
    }

    if (isCalculationFilePresent && isCalculationFunctionWorking) {
        res.status(200).send('OK - Servicio Huella de Carbono: Archivo de cálculo y función OK');
    } else {
        let message = 'ERROR - Servicio Huella de Carbono: Health Check Fallido:';
        if (!isCalculationFilePresent) {
            message += ' Archivo carbon-footprint.mjs no encontrado.';
        }
        if (!isCalculationFunctionWorking) {
            message += ' Función calcularHuellaCarbono no funciona correctamente o no está definida.';
        }
        res.status(500).send(message);
    }
});

// ELIMINADO: Las líneas de `process.on('SIGINT')` y `app.listen()`
// Se gestionan centralmente en `main.mjs` y por el entorno de Cloud Run.

// EXPORTAR: Exporta el router para que `main.mjs` pueda montarlo
export default router;

