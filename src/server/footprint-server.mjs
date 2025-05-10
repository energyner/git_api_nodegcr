// 1- SERVIDOR EXPRESS - PUERTO 3008
import express from 'express';
import cors from 'cors';
import {calcularHuellaCarbono} from '../calculations/carbon-footprint.mjs';
import * as fs from 'fs'; // Importa el módulo 'fs' para trabajar con el sistema de archivos
import * as path from 'path'; // Importa el módulo 'path' para manipular rutas de archivos

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json());

// 2- RUTAS GET PARA CADA API


console.log("3.1 - Calculando  huella-carbono ")
// Ruta POST para calcular la huella de carbono
app.post('/api/huella-carbono', (req, res) => {
    try {
        const parametros = req.body;

        // Validaciones básicas
        if (!parametros.state || parametros.state === "Select your State") {
            return res.status(400).json({ error: "Estado inválido o no seleccionado" });
        }
        if (!parametros.person || parametros.person <= 0) {
            return res.status(400).json({ error: "Número de personas debe ser mayor a 0" });
        }

        // Normalización de datos y asignación de valores predeterminados
        const datos = {
            state: parametros.state,
            elect: parseFloat(parametros.elect) || 0,
            gas: parseFloat(parametros.gas) || 0,
            water: parseFloat(parametros.water) || 0,
            lpg: parseFloat(parametros.lpg) || 0,
            gn: parseFloat(parametros.gn) || 0,
            fly: parseFloat(parametros.fly) || 0,
            cogs: parseFloat(parametros.cogs) || 0,
            person: parseInt(parametros.person) || 1,
        };

        // Llamar a la función calcularHuellaCarbono
        const resultado = calcularHuellaCarbono(datos);

        if (resultado.error) {
            return res.status(400).json({ error: resultado.error });
        }

        // Respuesta exitosa
        res.status(200).json(resultado);
        console.log("3.2 Cálculo completado para huella-carbono:", resultado);
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).json({ error: "Error interno del servidor. Intente nuevamente más tarde." });
    }
});

// **HEALTH CHECK ENDPOINT (CON CHEQUEO DE IMPORTACIÓN Y FUNCIONAMIENTO)**
app.get('/health', (req, res) => {
    let isServerUp = true;
    let isCalculationFilePresent = false;
    let isCalculationFunctionWorking = false;

    // Chequea si el archivo carbon-footprint.mjs existe
    const filePath = path.resolve('./calculations/carbon-footprint.mjs');
    try {
        if (fs.existsSync(filePath)) {
            isCalculationFilePresent = true;
        }
    } catch (error) {
        console.error('Error al verificar el archivo:', error);
    }

    // Chequea si la función calcularHuellaCarbono está definida e intenta usarla
    if (typeof calcularHuellaCarbono === 'function') {
        try {
            // Intenta ejecutar la función con datos de prueba mínimos
            const testData = { state: 'FL', person: 1 };
            const testResult = calcularHuellaCarbono(testData);
            // Si la función no lanza un error al ejecutarse con datos básicos,
            // asumimos que está funcionando correctamente (para este health check).
            if (typeof testResult === 'object' || typeof testResult === 'number') {
                isCalculationFunctionWorking = true;
            }
        } catch (error) {
            console.error('Error al ejecutar la función calcularHuellaCarbono en el health check:', error);
        }
    }

    if (isServerUp && isCalculationFilePresent && isCalculationFunctionWorking) {
        res.status(200).send('OK - Servidor, archivo de cálculo y función OK');
    } else {
        let message = 'ERROR - Health Check Fallido:';
        if (!isServerUp) {
            message += ' Servidor no responde.';
        }
        if (!isCalculationFilePresent) {
            message += ' Archivo carbon-footprint.mjs no encontrado.';
        }
        if (!isCalculationFunctionWorking) {
            message += ' Función calcularHuellaCarbono no funciona correctamente o no está definida.';
        }
        res.status(500).send(message);
    }
});


//Iniciar el servidor

const PORT = process.env.PORT || 3008;
console.log('2 - CONSUMO-SERVER: Iniciando...');
console.log(`2 - CONSUMO-SERVER: PORT is ${PORT}`);

app.get('/', (req, res) => {
  res.send('2 - Consumo API Activa!');
});

console.log('2 - CONSUMO-SERVER: Intentando escuchar...');

app.listen(PORT, '0.0.0.0', () => {//facilitando acceder desde diferentes maquinas en la misma red
    console.log(`2 - API corriendo en el puerto ${PORT}`);
})