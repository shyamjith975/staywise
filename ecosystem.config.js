/**
 * ============================================================================
 * STAYWISE PLATFORM — ENTERPRISE PM2 CLUSTER CONFIGURATION
 * ============================================================================
 * Enables automatic multi-core CPU load balancing on a single VPS/Server.
 * Uses Node.js cluster mode with round-robin traffic distribution.
 * ============================================================================
 */

module.exports = {
  apps: [
    {
      name: 'staywise-core',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3005 -H 0.0.0.0',
      instances: 'max', // Scales automatically to all available CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
        CLUSTER_MODE: 'multi-worker'
      },
      error_file: './logs/pm2-err.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    }
  ]
};
