// 1- SERVIDOR EXPRESS - PUERTO 3006
import express from 'express';
import cors from 'cors';
import { calcularConsumoEnergetico } from '../calculations/energy-consumption.mjs';
import * as fs from 'fs'; // Importa el módulo 'fs' para trabajar con el sistema de archivos
import * as path from 'path'; // Importa el módulo 'path' para manipular rutas de archivos

// Manejo de la señal SIGINT
process.on('SIGINT', () => {
    console.log('Consumo server (3006): Recibida señal SIGINT. Cerrando...');
    // Aquí podrías agregar lógica para cerrar conexiones o limpiar recursos de este servidor
    process.exit(0);
});

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json());

// 2- RUTAS GET PARA CADA API

//  Api consumo-energetico 
app.get('/api/consumo-energetico', (req, res) => {
    console.log("1 - Captando solicitud GET en /api/consumo-energetico");
    res.send('Usa POST para calcular el consumo energético de equipos.');
});

// **HEALTH CHECK ENDPOINT (CON CHEQUEO DE IMPORTACIÓN Y FUNCIONAMIENTO)**
app.get('/health', (req, res) => {
    let isServerUp = true;
    let isCalculationFilePresent = false;
    let isCalculationFunctionWorking = false;

    // Chequea si el archivo energy-consumption.mjs existe
    const filePath = path.resolve('./calculations/energy-consumption.mjs');
    try {
        if (fs.existsSync(filePath)) {
            isCalculationFilePresent = true;
        }
    } catch (error) {
        console.error('Error al verificar el archivo:', error);
    }

    // Chequea si la función calcularConsumoEnergetico está definida e intenta usarla
    if (typeof calcularConsumoEnergetico === 'function') {
        try {
            // Intenta ejecutar la función con datos de prueba mínimos
            const testData = { power: 100, hours: 1 };
            const testResult = calcularConsumoEnergetico(testData);
            // Si la función no lanza un error al ejecutarse con datos básicos,
            // asumimos que está funcionando correctamente (para este health check).
            if (typeof testResult === 'number') {
                isCalculationFunctionWorking = true;
            }
        } catch (error) {
            console.error('Error al ejecutar la función calcularConsumoEnergetico en el health check:', error);
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
            message += ' Archivo energy-consumption.mjs no encontrado.';
        }
        if (!isCalculationFunctionWorking) {
            message += ' Función calcularConsumoEnergetico no funciona correctamente o no está definida.';
        }
        res.status(500).send(message);
    }
});

// 3- PROCESADORES PARA CAPTAR POR POST DE CADA API

// Importamos consumo-energetico 
app.post('/api/consumo-energetico', calcularConsumoEnergetico);

// 4- CODIGO COMUN DEL SERVIDOR 

// Iniciar servidor

const PORT = process.env.PORT || 3006;
console.log('1 - CONSUMO-SERVER: Iniciando...');
console.log(`1 - CONSUMO-SERVER: PORT is ${PORT}`);

app.get('/', (req, res) => {
  res.send('1 - Consumo API Activa!');
});

console.log('1 - CONSUMO-SERVER: Intentando escuchar...');

app.listen(PORT, '0.0.0.0', () => {//facilitando acceder desde diferentes maquinas en la misma red
    console.log(`1 - API corriendo en http://localhost:${PORT}`);
}); 