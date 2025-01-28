import { Server } from './server/fastify';

async function bootstrap() {
  const server = new Server();
  await server.start();
}

bootstrap().catch((error) => {
  console.error('Failed to start the application:', error);
  process.exit(1);
});

