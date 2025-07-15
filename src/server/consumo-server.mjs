// // 1- SERVIDOR EXPRESS - PUERTO 3006
/// src/server/consumo-server.mjs

import { Router } from 'express'; // Importamos Router de Express
import cors from 'cors'; // Para manejar CORS
import { calcularConsumoEnergetico } from '../calculations/energy-consumption.mjs'; // Importamos la función de cálculo
import * as fs from 'fs'; // Para manejo de archivos (usado en health check)
import * as path from 'path'; // Para manipulación de rutas (usado en health check)
import { fileURLToPath } from 'url'; // Necesario para resolver __dirname en módulos ES

// Obtenemos __filename y __dirname para resolver rutas relativas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creamos una instancia de Router en lugar de una aplicación Express completa
const router = Router();

// Middlewares específicos para este router (si son necesarios)

router.use(cors());
router.use(express.json());

// Encabezados HTTP mejorados (generalmente manejados por el middleware `cors` o en `main.mjs`)

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 🔹 Soporte para `OPTIONS` en solicitudes CORS (también manejado por `cors` middleware)
router.options('*', (req, res) => {
    res.sendStatus(200);
});

// 🔹 Rutas GET
// La ruta base para este router será montada en `main.mjs` (ej. `/api/consumo`).
// Por lo tanto, esta ruta GET será accesible en `/api/consumo/api/consumo-energetico`

router.get('/api/consumo-energetico', (req, res) => {
    console.log("Solicitud GET en /api/consumo-energetico (desde router de consumo)");
    res.json({ mensaje: 'Usa POST para calcular el consumo energético de equipos' });
});

// 🔹 Health Check con validaciones
router.get('/health', (req, res) => {
    // Usamos path.resolve con __dirname para asegurar que la ruta sea correcta
    const filePath = path.resolve(__dirname, '..', 'calculations', 'energy-consumption.mjs');
    let isCalculationFilePresent = fs.existsSync(filePath);
    let isCalculationFunctionWorking = typeof calcularConsumoEnergetico === 'function';

    if (isCalculationFilePresent && isCalculationFunctionWorking) {
        res.status(200).json({ status: "OK", message: "Servidor, archivo y función en buen estado" });
    } else {
        res.status(500).json({
            status: "ERROR",
            message: "Health Check Fallido",
            detalles: {
                archivo_existe: isCalculationFilePresent,
                funcion_operativa: isCalculationFunctionWorking
            }
        });
    }
});

// 🔹 Rutas POST
// CORRECCIÓN CRÍTICA: `calcularConsumoEnergetico` es una función de cálculo, no un controlador de Express.
// Necesitamos un controlador que reciba la solicitud y llame a la función de cálculo.
router.post('/api/consumo-energetico', (req, res) => {
    try {
        // Asumiendo que los datos necesarios para el cálculo vienen en el cuerpo de la solicitud
        const datosConsumo = req.body;

        // Aquí deberías validar `datosConsumo` antes de pasarlos a la función
        if (!datosConsumo || typeof datosConsumo !== 'object') {
            return res.status(400).json({ error: "Datos de entrada inválidos para el cálculo de consumo." });
        }

        const resultado = calcularConsumoEnergetico(datosConsumo); // Asegúrate de pasar los argumentos correctos
        res.status(200).json({ resultado });
    } catch (error) {
        console.error("Error al procesar la solicitud POST /api/consumo-energetico:", error);
        res.status(500).json({ error: "Error interno del servidor al calcular consumo energético." });
    }
});

// 🔹 Manejo global de errores para este router (opcional, main.mjs puede tener uno global)
// Si main.mjs ya tiene un manejador de errores, este podría ser redundante.
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Error interno del servidor en el módulo de consumo, intenta nuevamente" });
});


// EXPORTAR: Exportamos el router para que `main.mjs` pueda usarlo
export default router;









