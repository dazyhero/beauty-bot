import { Server } from './server/fastify';
import { initializeDatabase } from './models/statistics.model';

async function bootstrap() {
  const server = new Server();
  await initializeDatabase();
  await server.start();
}

bootstrap().catch((error) => {
  console.error('Failed to start the application:', error);
  process.exit(1);
});

