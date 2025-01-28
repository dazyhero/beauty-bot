import Fastify, { FastifyInstance } from 'fastify';
import middie from '@fastify/middie';
import { telegramBot } from '../bot/telegram';
import { env } from '../config/environment';

export class Server {
  private fastify: FastifyInstance;

  constructor() {
    this.fastify = Fastify({ logger: true });
    this.setupMiddleware();
    this.setupRoutes();
  }

  private async setupMiddleware(): Promise<void> {
    await this.fastify.register(middie);
    // Register the webhook route instead of using a hook
    this.fastify.post(telegramBot.WEBHOOK_PATH, async (request, reply) => {
      await telegramBot.getWebhookCallback()(request.raw, reply.raw);
    });
  }

  private setupRoutes(): void {
    this.fastify.get('/', async () => ({ status: 'Telegram Bot is running!' }));
  }

  public async start(): Promise<void> {
    try {
      const address = await this.fastify.listen({ port: parseInt(env.PORT) });
      this.fastify.log.info(`Server listening at ${address}`);

      await telegramBot.setWebhook();
      this.fastify.log.info(`Webhook set at ${telegramBot.WEBHOOK_URL}`);
    } catch (error) {
      this.fastify.log.error(error);
      process.exit(1);
    }
  }
}

