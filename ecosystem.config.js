// PM2 process manager config
// Usage on server:
//   npm install -g pm2
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup  (to auto-start on reboot)

module.exports = {
  apps: [
    {
      name: 'ashokmahajan',
      script: 'server.js',
      // Update this path to match where you deployed the files on the server
      cwd: 'C:\\Inetpub\\vhosts\\ashokmahajan.in\\httpdocs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
        DATABASE_URL: 'file:./dev.db',
        NEXTAUTH_SECRET: 'ashok-mahajan-secret-key-change-in-production-2024',
        NEXTAUTH_URL: 'https://www.ashokmahajan.in',
        ADMIN_EMAIL: 'admin@ashokmahajan.in',
        ADMIN_PASSWORD: 'Admin@2024',
      },
    },
  ],
};
