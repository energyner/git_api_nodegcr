// src/calculations/solar-production.mjs

// /**
//  * Calcula la producción solar esperada.
//  *
//  * @param {number} area - El área de los paneles solares en metros cuadrados (m²).
//  * @param {number} irradiacion - La irradiancia solar promedio en la ubicación (kWh/m²/día).
//  * @param {number} eficiencia - La eficiencia de los paneles solares (ej. 0.15 para 15%).
//  * @returns {{produccion_solar: number}|{error: string}} - La producción solar calculada o un objeto de error.
//  */
// export function calcularProduccionSolar(area, irradiacion, eficiencia) {
//     console.log("1.1 - Calculando produccion-solar (función pura)");

//     // Validar que los parámetros sean números y estén presentes
//     if (
//         typeof area !== 'number' || isNaN(area) || area < 0 ||
//         typeof irradiacion !== 'number' || isNaN(irradiacion) || irradiacion < 0 ||
//         typeof eficiencia !== 'number' || isNaN(eficiencia) || eficiencia < 0 || eficiencia > 1
//     ) {
//         console.log("1.1.1 - Error: Parámetros inválidos o faltantes para producción solar");
//         return {
//             error: "Parámetros inválidos: 'area', 'irradiacion' y 'eficiencia' deben ser números válidos y no negativos. La eficiencia debe estar entre 0 y 1."
//         };
//     }

//     try {
//         console.log("Parámetros recibidos para cálculo:", area, irradiacion, eficiencia);
//         const resultado = area * irradiacion * eficiencia; // Los parseFloat ya no son necesarios si validamos que son números
//         console.log("1.2 - Cálculo de producción solar resuelto:", resultado);
//         return { produccion_solar: resultado }; // Retorna un objeto con el resultado
//     } catch (error) {
//         // En una función de cálculo pura, es mejor retornar el error
//         // para que el llamador (el controlador del servidor) lo maneje.
//         console.error("Error inesperado al calcular la producción solar:", error);
//         return { error: "Error interno al calcular la producción solar." };
//     }
// }


// src/calculations/solar-production.mjs

/**
 * Calcula la producción solar esperada.
 *
 * @param {object} parametros - Un objeto que contiene el área, la irradiancia y la eficiencia.
 * @param {number} parametros.area - El área de los paneles solares en metros cuadrados (m²).
 * @param {number} parametros.irradiacion - La irradiancia solar promedio en la ubicación (kWh/m²/día).
 * @param {number} parametros.eficiencia - La eficiencia de los paneles solares (ej. 0.15 para 15%).
 * @returns {{produccion_solar: number}|{error: string}} - La producción solar calculada o un objeto de error.
 */
export function calcularProduccionSolar(parametros) { // <-- ¡CORRECCIÓN AQUÍ! Espera un solo objeto 'parametros'
    console.log("1.1 - Calculando produccion-solar (función pura)");

    // Desestructuramos los parámetros del objeto 'parametros'
    const { area, irradiacion, eficiencia } = parametros;

    // Validar que los parámetros sean números, estén presentes y cumplan las condiciones
    if (
        typeof area !== 'number' || isNaN(area) || area < 0 ||
        typeof irradiacion !== 'number' || isNaN(irradiacion) || irradiacion < 0 ||
        typeof eficiencia !== 'number' || isNaN(eficiencia) || eficiencia < 0 || eficiencia > 1
    ) {
        console.log("1.1.1 - Error: Parámetros inválidos o faltantes para producción solar");
        return {
            error: "Parámetros inválidos: 'area', 'irradiacion' y 'eficiencia' deben ser números válidos y no negativos. La eficiencia debe estar entre 0 y 1."
        };
    }

    try {
        console.log("Parámetros recibidos para cálculo:", area, irradiacion, eficiencia);
        const resultado = area * irradiacion * eficiencia;
        console.log("1.2 - Cálculo de producción solar resuelto:", resultado);
        return { produccion_solar: resultado }; // Retorna un objeto con el resultado
    } catch (error) {
        console.error("Error inesperado al calcular la producción solar:", error);
        return { error: "Error interno al calcular la producción solar." };
    }
}