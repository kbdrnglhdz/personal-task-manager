module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './backend',
      script: 'node',
      args: 'index.js',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      }
    },
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev',
      watch: false,
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
};
