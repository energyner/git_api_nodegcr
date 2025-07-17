/**Algoritmo que utilizará métodos del DOM para capturar el evento 
 * de envío de datos, manipularlo y  conectarnos al puerto del servidor local que hemos configurado */


/**  EJECUCION DE CADA API */

// API produccion solar

// // Captando evento del formulario
// document.getElementById('produccion-form').addEventListener('submit', (event) => {
//     event.preventDefault(); // Evitar que el formulario recargue la página

//     const area = document.getElementById('area').value;
//     const irradiacion = document.getElementById('irradiacion').value;
//     const eficiencia = document.getElementById('eficiencia').value;

// // Realizar la solicitud al servidor
//     fetch('https://energyner-1015551020086.us-east1.run.app/api/solar/produccion-solar', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ area: area, irradiacion: irradiacion, eficiencia: eficiencia })
//     })
//     .then(response => {
//         if (!response.ok) {
//             return response.text().then(errorMessage => {
//                 throw new Error(`Error en la solicitud: ${response.status} - ${errorMessage}`);
//             });
//         }
//         return response.json(); // Procesar la respuesta como JSON
//     })
//     .then(data => {
//         console.log('Produccion solar:', data);

// // Actualizar la interfaz del navegador con el resultado
//         const resultadoSolar = document.getElementById('resultadoSolar');
//         resultadoSolar.textContent = `Produccion solar calculada: ${data.produccion_solar} kWh`;
//         resultadoSolar.style.color = "red"; // Estilo opcional para destacar el texto
//     })
//     .catch(error => {
//         console.error('Error al calcular la produccion solar:', error);

// // Mostrar mensaje de error en el navegador
//         const resultadoSolar = document.getElementById('resultadoSolar');
//         resultadoSolar.textContent = `Error: ${error.message}`;
//         resultadoSolar.style.color = "red"; // Estilo opcional para destacar el error
//     });
// });


// 🌐 Detectar entorno y definir URL base
const BASE_URL = window.location.hostname === "localhost"
  ? "http://127.0.0.1:8080"
  : "https://energyner-1015551020086.us-east1.run.app";

// Captando evento del formulario
document.getElementById('produccion-form').addEventListener('submit', (event) => {
  event.preventDefault(); // Evitar que el formulario recargue la página

  const area = document.getElementById('area').value;
  const irradiacion = document.getElementById('irradiacion').value;
  const eficiencia = document.getElementById('eficiencia').value;

  // Realizar la solicitud al servidor
  fetch(`${BASE_URL}/api/solar/produccion-solar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ area, irradiacion, eficiencia })
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(errorMessage => {
        throw new Error(`Error en la solicitud: ${response.status} - ${errorMessage}`);
      });
    }
    return response.json(); // Procesar la respuesta como JSON
  })
  .then(data => {
    console.log('Producción solar:', data);

    // Actualizar la interfaz del navegador con el resultado
    const resultadoSolar = document.getElementById('resultadoSolar');
    resultadoSolar.textContent = `Producción solar calculada: ${data.produccion_solar} Wh`;
    resultadoSolar.style.color = "red";
  })
  .catch(error => {
    console.error('Error al calcular la producción solar:', error);

    // Mostrar mensaje de error en el navegador
    const resultadoSolar = document.getElementById('resultadoSolar');
    resultadoSolar.textContent = `Error: ${error.message}`;
    resultadoSolar.style.color = "red";
  });
});