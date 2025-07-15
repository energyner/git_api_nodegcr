// src/calculations/energy-consumption.mjs
/**
 * Calcula el consumo energético basado en la potencia y las horas de uso.
 *
 * @param {number} potencia - La potencia del equipo en vatios (W).
 * @param {number} horas - Las horas de uso del equipo.
 * @returns {{consumo_energetico: number}|{error: string}} - El consumo energético calculado o un objeto de error.
 */
export function calcularConsumoEnergetico(potencia, horas) {
    console.log("1.1 - Calculando consumo-energetico (función pura)");

    // Validar que los parámetros sean números y estén presentes
    if (typeof potencia !== 'number' || isNaN(potencia) || typeof horas !== 'number' || isNaN(horas)) {
        console.log("1.1.1 - Error: Parámetros inválidos o faltantes");
        return {
            error: "Parámetros inválidos: 'potencia' y 'horas' deben ser números válidos."
        };
    }

    try {
        console.log("Parámetros recibidos para cálculo:", potencia, horas);
        const resultado = potencia * horas; // El parseFloat ya no es necesario si validamos que son números
        console.log("1.2 - Cálculo de consumo resuelto:", resultado);
        return { consumo_energetico: resultado }; // Retorna un objeto con el resultado
    } catch (error) {
        // En una función de cálculo pura, es mejor retornar el error
        // para que el llamador (el controlador del servidor) lo maneje.
        console.error("Error inesperado al calcular el consumo energético:", error);
        return { error: "Error interno al calcular el consumo energético." };
    }
}
