// git_api_nodegcr/pm2.config.js

module.exports = {
  apps: [
    {
      name: "energyner",
      script: "main.mjs",
      interpreter: "node",
      watch: false,
      exec_mode: "fork", // Más compatible con Cloud Run
      instances: 1,      // Una instancia por contenedor
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/dev/stderr",
      out_file: "/dev/stdout"
    }
  ]
};
