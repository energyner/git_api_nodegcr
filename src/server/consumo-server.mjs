// // src/server/consumo-server.mjs

// // Importamos el objeto 'express' completo y 'Router'
// import express, { Router } from 'express'; 
// import cors from 'cors'; 
// import { calcularConsumoEnergetico } from '../calculations/energy-consumption.mjs'; 
// import * as fs from 'fs'; 
// import * as path from 'path'; 
// import { fileURLToPath } from 'url'; 

// // Obtenemos __filename y __dirname para resolver rutas relativas
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Creamos una instancia de Router
// const router = Router();

// // 🔹 Middlewares específicos para este router (si son necesarios)
// // Si `main.mjs` ya tiene `app.use(cors())`, esta línea es redundante.
// router.use(cors()); 

// // 🔹 Encabezados HTTP mejorados (opcional, si ya están en main.mjs o via cors)
// router.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     next();
// });

// // 🔹 Soporte para `OPTIONS` en solicitudes CORS
// router.options('/', (req, res) => {  // Re-escribe '*' manualmente
//     res.sendStatus(200);
// });

// // 🔹 Rutas GET
// router.get('/consumo-energetico', (req, res) => { // Re-escribe '/consumo-energetico' manualmente
//     console.log("Solicitud GET en /consumo-energetico (desde router de consumo)");
//     res.json({ mensaje: 'Usa POST para calcular el consumo energético de equipos.' });
// });

// // 🔹 Health Check con validaciones
// router.get('/health', (req, res) => { // Re-escribe '/health' manualmente
//     const filePath = path.resolve(__dirname, '..', 'calculations', 'energy-consumption.mjs');
//     let isCalculationFilePresent = fs.existsSync(filePath);
//     let isCalculationFunctionWorking = typeof calcularConsumoEnergetico === 'function';

//     if (isCalculationFunctionWorking) {
//         try {
//             const testResult = calcularConsumoEnergetico(100, 10); 
//             if (testResult && typeof testResult.consumo_energetico === 'number') {
//                 isCalculationFunctionWorking = true;
//             } else {
//                 isCalculationFunctionWorking = false; 
//             }
//         } catch (error) {
//             console.error('Error al ejecutar la función calcularConsumoEnergetico en el health check:', error);
//             isCalculationFunctionWorking = false;
//         }
//     }

//     if (isCalculationFilePresent && isCalculationFunctionWorking) {
//         res.status(200).json({ status: "OK", message: "Servicio de Consumo: Archivo de cálculo y función en buen estado." });
//     } else {
//         res.status(500).json({
//             status: "ERROR",
//             message: "Servicio de Consumo: Health Check Fallido.",
//             detalles: {
//                 archivo_existe: isCalculationFilePresent,
//                 funcion_operativa: isCalculationFunctionWorking
//             }
//         });
//     }
// });

// // 🔹 Ruta POST para calcular el consumo energético
// router.post('/consumo-energetico', (req, res) => { // Re-escribe '/consumo-energetico' manualmente
//     console.log("Solicitud POST en /consumo-energetico (desde router de consumo)");
//     const { potencia, horas } = req.body; 

//     const resultadoCalculo = calcularConsumoEnergetico(parseFloat(potencia), parseFloat(horas));

//     if (resultadoCalculo.error) {
//         return res.status(400).json({ error: resultadoCalculo.error });
//     } else {
//         res.status(200).json(resultadoCalculo);
//     }
// });

// // 🔹 Manejo global de errores para este router (opcional, main.mjs puede tener uno global)
// // Si main.mjs ya tiene un manejador de errores, este podría ser redundante.
// router.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: "Error interno del servidor en el módulo de consumo, intenta nuevamente" });
// });

// export default router;


// src/server/consumo-server.mjs

// Importamos el objeto 'express' completo y 'Router'
import express, { Router } from 'express';
// No necesitamos 'cors' aquí si ya se maneja en main.mjs
// import cors from 'cors';
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
// Si `main.mjs` ya tiene `app.use(cors())`, estas líneas son redundantes y pueden eliminarse.
// Es mejor manejar CORS globalmente en main.mjs para evitar conflictos.
// router.use(cors());
// router.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     next();
// });
// router.options('/', (req, res) => {
//     res.sendStatus(200);
// });

// 🔹 Rutas GET
router.get('/consumo-energetico', (req, res) => {
    console.log("Solicitud GET en /consumo-energetico (desde router de consumo)");
    res.json({ mensaje: 'Usa POST para calcular el consumo energético de equipos.' });
});

// 🔹 Health Check con validaciones
router.get('/health', (req, res) => {
    const filePath = path.resolve(__dirname, '..', 'calculations', 'energy-consumption.mjs');
    let isCalculationFilePresent = fs.existsSync(filePath);
    let isCalculationFunctionWorking = typeof calcularConsumoEnergetico === 'function';

    if (isCalculationFunctionWorking) {
        try {
            // ¡CORRECCIÓN CLAVE AQUÍ! Pasar un OBJETO a calcularConsumoEnergetico en el health check
            const testResult = calcularConsumoEnergetico({ potencia: 100, horas: 10 });
            // Asumiendo que calcularConsumoEnergetico devuelve SOLO el número
            if (typeof testResult === 'number') { // Verifica si el resultado es un número
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
router.post('/consumo-energetico', (req, res) => {
    console.log("Solicitud POST en /consumo-energetico (desde router de consumo)");
    let { potencia, horas } = req.body; // Usa 'let' para permitir reasignación

    // Parsear y validar los parámetros antes de pasarlos a la función de cálculo
    potencia = parseFloat(potencia);
    horas = parseFloat(horas);

    if (isNaN(potencia) || isNaN(horas) || potencia < 0 || horas < 0) {
        return res.status(400).json({ error: "Parámetros inválidos para potencia u horas. Deben ser números positivos." });
    }

    try {
        // ¡CORRECCIÓN CLAVE AQUÍ! Pasar un OBJETO a calcularConsumoEnergetico
        const consumoCalculado = calcularConsumoEnergetico({ potencia, horas });

        // Asumiendo que calcularConsumoEnergetico devuelve SOLO el número
        res.status(200).json({ consumo_energetico: consumoCalculado });
    } catch (error) {
        console.error("Error al calcular el consumo energético en el router:", error);
        res.status(500).json({ error: "Error interno del servidor en el módulo de consumo, intenta nuevamente." });
    }
});

// 🔹 Manejo global de errores para este router (opcional, main.mjs puede tener uno global)
// Si main.mjs ya tiene un manejador de errores global, este es redundante y puede eliminarse.
// router.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: "Error interno del servidor en el módulo de consumo, intenta nuevamente" });
// });

export default router; // Exportar la instancia del router