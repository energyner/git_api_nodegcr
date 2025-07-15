/**Algoritmo que utilizará métodos del DOM para capturar el evento 
 * de envío de datos, manipularlo y  conectarnos al puerto del servidor local que hemos configurado */

//1- API consumo enrgetico
// 🌐 Detectar entorno y definir URL base
const BASE_URL = window.location.hostname === "localhost"
  ? "http://127.0.0.1:8080"
  : "https://energyner-1015551020086.us-east1.run.app";
// Captando evento del formulario
document.getElementById('consumo-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Evitar que el formulario recargue la página

    const potencia = document.getElementById('potencia').value;
    const horas = document.getElementById('horas').value;

// Realizar la solicitud al servidor
    fetch(`${BASE_URL}/api/consumo/consumo-energetico`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ potencia: potencia, horas: horas })
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
        console.log('Consumo energético:', data);

// Actualizar la interfaz del navegador con el resultado
        const resultadoConsumo = document.getElementById('resultadoConsumo');
        resultadoConsumo.textContent = `Consumo energético calculado: ${data.consumo_energetico} kWh`;
        resultadoConsumo.style.color = "green"; // Estilo opcional para destacar el texto
    })
    .catch(error => {
        console.error('Error al calcular el consumo:', error);

// Mostrar mensaje de error en el navegador
        const resultadoConsumo = document.getElementById('resultadoConsumo');
        resultadoConsumo.textContent = `Error: ${error.message}`;
        resultadoConsumo.style.color = "green"; // Estilo opcional para destacar el error
    });
});


