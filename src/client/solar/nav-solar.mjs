//  Detectar entorno y definir URL base
const BASE_URL = window.location.hostname === "localhost"
  ? "http://127.0.0.1:8080"
  : "https://energy-607964761561.us-east1.run.app/";

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
    resultadoSolar.style.color = "green";
  })
  .catch(error => {
    console.error('Error al calcular la producción solar:', error);

    // Mostrar mensaje de error en el navegador
    const resultadoSolar = document.getElementById('resultadoSolar');
    resultadoSolar.textContent = `Error: ${error.message}`;
    resultadoSolar.style.color = "red";
  });
});