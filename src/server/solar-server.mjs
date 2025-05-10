// 1- SERVIDOR EXPRESS - PUERTO 3010
import express from 'express';
import cors from 'cors';
import { calcularProduccionSolar } from '../calculations/solar-production.mjs';
import * as fs from 'fs'; // Importa el módulo 'fs' para trabajar con el sistema de archivos
import * as path from 'path'; // Importa el módulo 'path' para manipular rutas de archivos

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json());

// 2- RUTAS GET PARA CADA API

//  Api produccion-solar
app.get('/api/produccion-solar', (req, res) => {
    console.log("1 - Captando solicitud GET en /api/produccion-solar");
    res.send('Usa POST para calcular la produccion-solar de paneles solares.');
});

// **HEALTH CHECK ENDPOINT (CON CHEQUEO DE IMPORTACIÓN Y FUNCIONAMIENTO)**
app.get('/health', (req, res) => {
    let isServerUp = true;
    let isCalculationFilePresent = false;
    let isCalculationFunctionWorking = false;

    // Chequea si el archivo solar-production.mjs existe
    const filePath = path.resolve('./calculations/solar-production.mjs');
    try {
        if (fs.existsSync(filePath)) {
            isCalculationFilePresent = true;
        }
    } catch (error) {
        console.error('Error al verificar el archivo:', error);
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
        res.status(200).send('OK - Servidor, archivo de cálculo y función OK');
    } else {
        let message = 'ERROR - Health Check Fallido:';
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



// 3- PROCESADORES PARA CAPTAR POR POST DE CADA API

// Importamos produccion-solar 
app.post('/api/produccion-solar', calcularProduccionSolar);

// 4- CODIGO COMUN DEL SERVIDOR 

// Iniciar servidor

const PORT = process.env.PORT || 3010;
console.log('4 -CONSUMO-SERVER: Iniciando...');
console.log(`4 -CONSUMO-SERVER: PORT is ${PORT}`);

app.get('/', (req, res) => {
  res.send('4 -Consumo API Activa!');
});

console.log('4 -CONSUMO-SERVER: Intentando escuchar...');

app.listen(PORT, '0.0.0.0', () => {//facilitando acceder desde diferentes maquinas en la misma red
    console.log(`4 - API corriendo en http://localhost:${PORT}`);
}); 