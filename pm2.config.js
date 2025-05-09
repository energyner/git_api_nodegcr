module.exports = {
  apps: [
    {
      name: 'consumo-server',
      script: 'src/server/consumo-server.mjs',
      node_args: '--experimental-modules --es-module-specifier-resolution=node',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        PORT: 3006
      }
    },
    {
      name: 'footprint-server',
      script: 'src/server/footprint-server.mjs',
      node_args: '--experimental-modules --es-module-specifier-resolution=node',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        PORT: 3008
      }
    },
    {
      name: 'solar-server',
      script: 'src/server/solar-server.mjs',
      node_args: '--experimental-modules --es-module-specifier-resolution=node',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        PORT: 3010
      }
    }
  ],
};