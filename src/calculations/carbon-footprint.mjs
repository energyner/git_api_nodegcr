// src/calculations/carbon-footprint.mjs

/**
 * Calcula la huella de carbono basada en el estado y el consumo de varios recursos.
 *
 * @param {object} params - Objeto con los parámetros de cálculo.
 * @param {string} params.state - El estado para el cálculo de emisiones per cápita.
 * @param {number} [params.elect=0] - Consumo de electricidad.
 * @param {number} [params.gas=0] - Consumo de gas.
 * @param {number} [params.water=0] - Consumo de agua.
 * @param {number} [params.lpg=0] - Consumo de GLP.
 * @param {number} [params.gn=0] - Consumo de gas natural.
 * @param {number} [params.fly=0] - Millas de vuelo.
 * @param {number} [params.cogs=0] - Consumo de bienes.
 * @param {number} [params.person=1] - Número de personas en el hogar.
 * @returns {object} - Un objeto con los resultados de la huella de carbono o un objeto de error.
 */
export function calcularHuellaCarbono({ state, elect = 0, gas = 0, water = 0, lpg = 0, gn = 0, fly = 0, cogs = 0, person = 1 }) {
    // Validación del estado
    if (!state || state === "Select your State") {
        return { error: "Estado inválido o no seleccionado" };
    }

    // Datos de emisiones per-cápita de los 50 estados en libras de CO2/mes
    const emisionesPerCapitaPorEstado = {
        "AL": 3593.33, "AK": 9001.67, "AZ": 2053.33, "AR": 3336.67, "CA": 1411.67,
        "CO": 2530.00, "CT": 1723.33, "DE": 2310.00, "FL": 1760.00, "GA": 1998.33,
        "HI": 1888.33, "ID": 1925.00, "IL": 2438.33, "IN": 4161.67, "IA": 3776.67,
        "KS": 3611.67, "KY": 4143.33, "LA": 7223.33, "ME": 1815.00, "MD": 1430.00,
        "MA": 1356.67, "MI": 2493.33, "MN": 2511.67, "MS": 3923.33, "MO": 3245.00,
        "MT": 4418.33, "NE": 4345.00, "NV": 2126.67, "NH": 1650.00, "NJ": 1650.00,
        "NM": 3905.00, "NY": 1301.67, "NC": 1870.00, "ND": 12796.67, "OH": 2878.33,
        "OK": 3868.33, "OR": 1613.33, "PA": 2731.67, "RI": 1650.00, "SC": 2273.33,
        "SD": 3080.00, "TN": 2200.00, "TX": 3923.33, "UT": 3208.33, "VT": 1540.00,
        "VA": 2090.00, "WA": 1631.67, "WV": 7883.33, "WI": 2713.33, "WY": 17673.33
    };

    // Emisiones promedio nacionales y mundiales (libras de CO2/mes)
    const promedioUSA = 2878.33; // Promedio nacional EE.UU.
    const promedioMundial = 788.00; // Promedio mundial

    // Coeficientes de cálculo
    const coef_fly = fly < 1000 ? 0.55 : 0.33;

    // Cálculos individuales
    // Asegurarse de que los valores de entrada sean numéricos antes de operar
    const e = Math.round(parseFloat(elect) * 0.991) || 0;
    const t = Math.round(parseFloat(gas) * 19.6) || 0;
    const c = Math.round(parseFloat(water) * 0.054) || 0;
    const l = Math.round(parseFloat(lpg) * 3) || 0;
    const o = Math.round(parseFloat(gn) * 0.117) || 0;
    const f = Math.round(parseFloat(fly) * coef_fly) || 0;
    const u = Math.round(parseFloat(cogs) * 0.53) || 0;

    // Cálculo total
    const resultado = Math.round(e + t + c + l + o + f + u);
    const estado = state;
    const per_capita = Math.round(resultado / (parseInt(person) || 1)); // Asegurarse que person es un número

    // Emisiones del estado seleccionado
    const per_capita_estado = emisionesPerCapitaPorEstado[state] || 0;

    // Cálculos comparativos
    const porcentajeEstado = per_capita_estado > 0 ? Math.round((per_capita / per_capita_estado) * 100) : 0;
    const porcentajeUSA = Math.round((per_capita / promedioUSA) * 100);
    const porcentajeMundial = Math.round((per_capita / promedioMundial) * 100);

    // Retornar los resultados
    return {
        estado: estado,
        total: resultado,
        per_capita,
        per_capita_estado,
        promedioUSA,
        promedioMundial,
        porcentajeEstado,
        porcentajeUSA,
        porcentajeMundial,
        libras_co2: { elect: e, gas: t, water: c, lpg: l, gn: o, fly: f, cogs: u }
    };
}
