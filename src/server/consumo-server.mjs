// src/server/consumo-server.mjs

// Importamos el objeto 'express' completo y 'Router'
import express, { Router } from 'express'; 
import cors from 'cors'; 
import { calcularConsumoEnergetico } from '../calculations/energy-consumption.mjs'; 
import * as fs from 'fs'; 
import * as path from 'path'; 
import { fileURLToPath } from 'url'; 

// Obtenemos __filename y __dirname para resolver rutas relativas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creamos una instancia de Router
const router = Router();

// 🔹 Middlewares específicos para este router (si son necesarios)
// Si `main.mjs` ya tiene `app.use(cors())`, esta línea es redundante.
router.use(cors()); 

// 🔹 Encabezados HTTP mejorados (opcional, si ya están en main.mjs o via cors)
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 🔹 Soporte para `OPTIONS` en solicitudes CORS
router.options('/', (req, res) => {  // Re-escribe '*' manualmente
    res.sendStatus(200);
});

// 🔹 Rutas GET
router.get('/consumo-energetico', (req, res) => { // Re-escribe '/consumo-energetico' manualmente
    console.log("Solicitud GET en /consumo-energetico (desde router de consumo)");
    res.json({ mensaje: 'Usa POST para calcular el consumo energético de equipos.' });
});

// 🔹 Health Check con validaciones
router.get('/health', (req, res) => { // Re-escribe '/health' manualmente
    const filePath = path.resolve(__dirname, '..', 'calculations', 'energy-consumption.mjs');
    let isCalculationFilePresent = fs.existsSync(filePath);
    let isCalculationFunctionWorking = typeof calcularConsumoEnergetico === 'function';

    if (isCalculationFunctionWorking) {
        try {
            const testResult = calcularConsumoEnergetico(100, 10); 
            if (testResult && typeof testResult.consumo_energetico === 'number') {
                isCalculationFunctionWorking = true;
            } else {
                isCalculationFunctionWorking = false; 
            }
        } catch (error) {
            console.error('Error al ejecutar la función calcularConsumoEnergetico en el health check:', error);
            isCalculationFunctionWorking = false;
        }
    }

    if (isCalculationFilePresent && isCalculationFunctionWorking) {
        res.status(200).json({ status: "OK", message: "Servicio de Consumo: Archivo de cálculo y función en buen estado." });
    } else {
        res.status(500).json({
            status: "ERROR",
            message: "Servicio de Consumo: Health Check Fallido.",
            detalles: {
                archivo_existe: isCalculationFilePresent,
                funcion_operativa: isCalculationFunctionWorking
            }
        });
    }
});

// 🔹 Ruta POST para calcular el consumo energético
router.post('/consumo-energetico', (req, res) => { // Re-escribe '/consumo-energetico' manualmente
    console.log("Solicitud POST en /consumo-energetico (desde router de consumo)");
    const { potencia, horas } = req.body; 

    const resultadoCalculo = calcularConsumoEnergetico(parseFloat(potencia), parseFloat(horas));

    if (resultadoCalculo.error) {
        return res.status(400).json({ error: resultadoCalculo.error });
    } else {
        res.status(200).json(resultadoCalculo);
    }
});

// 🔹 Manejo global de errores para este router (opcional, main.mjs puede tener uno global)
// Si main.mjs ya tiene un manejador de errores, este podría ser redundante.
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Error interno del servidor en el módulo de consumo, intenta nuevamente" });
});

export default router;
