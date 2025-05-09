# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app/src

# Copia el resto de los archivos del proyecto
COPY . .

# Expone los puertos donde se ejecutan los servidores
EXPOSE 3006 3008 3010

# Define el script de inicio para ejecutar pm2
CMD ["pm2-runtime", "start", "pm2.config.js", "--no-daemon"]

# Crear un archivo pm2.config.js manualmente en el directorio src/ de tu proyecto con el siguiente contenido:
# module.exports = {
#   apps: [
#     {
#       name: 'consumo-server',
#       script: 'server/consumo-server.mjs',
#       node_args: '--experimental-modules --es-module-specifier-resolution=node',
#     },
#     {
#       name: 'footprint-server',
#       script: 'server/footprint-server.mjs',
#       node_args: '--experimental-modules --es-module-specifier-resolution=node',
#     },
#     {
#       name: 'solar-server',
#       script: 'server/solar-server.mjs',
#       node_args: '--experimental-modules --es-module-specifier-resolution=node',
#     },
#   ],
# };
