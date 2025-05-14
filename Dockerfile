# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app/src

# Copia el resto de los archivos del proyecto
COPY . .

# Instala las dependencias del proyecto 
RUN npm install

# Instala pm2-runtime globalmente
RUN npm install -g pm2-runtime

# Expone el puerto donde el proxy recibirá el tráfico de Cloud Run
EXPOSE 8080

# Define el script de inicio para ejecutar pm2
CMD ["pm2-runtime", "start", "pm2.config.js"]



