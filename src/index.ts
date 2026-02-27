import morgan from 'morgan';

import { disconnectDatabase } from '~/../lib/prisma.js';

import { buildApp } from './app.js';
import { config } from './config/index.js';

const PORT = config.port;

async function startServer() {
  try {
    const app = buildApp();

    const environment = process.env.NODE_ENV || 'development';
    app.use(environment === 'development' ? morgan('dev') : morgan('tiny'));

    const server = app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Получен сигнал завершения, закрытие сервера...');
      server.close(async () => {
        console.log('HTTP сервер закрыт');
        try {
          await disconnectDatabase();
          console.log('Подключение к базе данных закрыто');
        } catch (error) {
          console.error('Ошибка при закрытии подключения к БД:', error);
        }
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Ошибка при запуске сервера:', error);

    process.exit(1);
  }
}

await startServer();
