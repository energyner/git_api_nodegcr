# Usa una imagen oficial de Node.js
FROM node:20

# Establece el directorio de trabajo
WORKDIR /app

# Copia el resto de los archivos del proyecto
COPY package.json package-lock.json ./

# Instala las dependencias del proyecto 
RUN npm install --omit=dev

# Copia todo el código fuente de tu aplicación al directorio de trabajo
COPY . .    

# Expone el puerto donde el proxy recibirá el tráfico de Cloud Run
EXPOSE 8080

# Define el script de inicio para ejecutar pm2
CMD [ "pm2-runtime", "start", "pm2.config.js"]



