// git_api_nodegcr/pm2.config.js

module.exports = {
  apps: [
    {
      name: "git-api-nodegcr", // Nombre de tu aplicación
      script: "main.mjs",      // El archivo principal a ejecutar
      interpreter: "node",     // Usar el intérprete de Node.js
  
      env: {
        NODE_ENV: "production",
        PORT: 8080 // Aquí puedes poner el puerto por defecto, pero Cloud Run lo sobreescribirá
                   // con su variable de entorno PORT. PM2 leerá process.env.PORT.
      },
      instances: "max", // Escalar a la máxima cantidad de núcleos de CPU disponibles
      exec_mode: "cluster", // Usar modo clúster para aprovechar múltiples núcleos
      max_memory_restart: "300M", // Reiniciar si el uso de memoria supera este límite
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/dev/stderr", // Enviar errores al stderr para que Cloud Run los recoja
      out_file: "/dev/stdout"    // Enviar salida estándar al stdout para que Cloud Run los recoja
    }
  ]
};
