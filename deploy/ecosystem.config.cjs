// PM2 process definition for the nurul.com.bd Next.js app.
// Start:   pm2 start deploy/ecosystem.config.cjs --env production
// Reload:  pm2 reload nurul
// Save:    pm2 save   (persists the process list for pm2-startup)

module.exports = {
  apps: [
    {
      name: "nurul",
      cwd: "/var/www/nurul",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      kill_timeout: 5000,
      wait_ready: false,
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "127.0.0.1",
      },
      // .env.local is loaded by Next.js itself at runtime, so no need to
      // duplicate RESEND_API_KEY / CONTACT_* here. Keep secrets in .env.local.
      out_file: "/var/log/pm2/nurul.out.log",
      error_file: "/var/log/pm2/nurul.err.log",
      merge_logs: true,
      time: true,
    },
  ],
};
