module.exports = {
  apps: [
    {
      name: 'forum-backend',
      script: 'dist/main.js',
      instances: '2',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development', // Development environment
      },
      env_production: {
        NODE_ENV: 'production', // Production environment
      },
    },
  ],
};
