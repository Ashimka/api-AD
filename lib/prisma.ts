import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import config from '../prisma/prisma.config.js';

const pool = new Pool({
  connectionString: config.datasource?.url ?? process.env.DATABASE_URL!,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

/**
 * Проверяет подключение к базе данных
 * @throws {Error} Если подключение не удалось
 */
export async function checkDatabaseConnection(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    throw new Error(
      `Не удалось подключиться к базе данных: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Закрывает подключение к базе данных
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  await pool.end();
}
