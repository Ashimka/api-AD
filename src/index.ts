import morgan from 'morgan';

import { buildApp } from './app.js';
import { config } from './config/index.js';

const PORT = config.port;

try {
  const app = buildApp();

  const environment = process.env.NODE_ENV || 'development';
  app.use(environment === 'development' ? morgan('dev') : morgan('tiny'));

  const server = app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
} catch (error) {
  console.error('Ошибка при запуске сервера:', error);
  process.exit(1);
}
