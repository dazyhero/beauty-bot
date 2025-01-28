import Fastify, { FastifyInstance } from 'fastify';
import { telegramBot } from '../bot/telegram';
import { env } from '../config/environment';
import { Update } from 'telegraf/types';
import { Logger } from '../utils/logger';
import { TelegramUpdateUtils } from '../utils/telegram-updates';

export class Server {
  private fastify: FastifyInstance;
  private logger: Logger;

  constructor() {
    this.fastify = Fastify({
      logger: {
        level: 'info',
        serializers: {
          req(request) {
            return {
              method: request.method,
              url: request.url,
              hostname: request.hostname,
              remoteAddress: request.ip,
              remotePort: request.socket.remotePort
            };
          }
        }
      },
      bodyLimit: 10 * 1024 * 1024
    });
    this.logger = new Logger(this.fastify.log);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.fastify.get('/', async (request) => {
      this.logger.info('Health check request received', {
        ip: request.ip,
        userAgent: request.headers['user-agent']
      });
      return { status: 'Telegram Bot is running!' };
    });

    this.fastify.post(telegramBot.WEBHOOK_PATH, async (request, reply) => {
      try {
        const update = request.body as Update;
        const updateInfo = {
          updateId: update.update_id,
          type: TelegramUpdateUtils.getUpdateType(update),
          chatId: TelegramUpdateUtils.getChatId(update),
        };
        this.logger.debug('Received webhook update', updateInfo);

        await telegramBot.handleUpdate(update);

        this.logger.info('Successfully processed webhook update', {
          updateId: update.update_id
        });
        return { ok: true };
      } catch (error) {
        this.logger.error('Failed to process webhook update', error, {
          body: request.body
        });
        return reply.status(500).send({ ok: false });
      }
    });
  }

  public async start(): Promise<void> {
    try {
      const port = parseInt(env.PORT);
      const address = await this.fastify.listen({
        port,
        host: '0.0.0.0'
      });

      this.logger.info('Server started', {
        address,
        port,
        nodeEnv: process.env.NODE_ENV
      });

      await telegramBot.setWebhook();
      this.logger.info('Telegram webhook configured', {
        webhookUrl: telegramBot.WEBHOOK_URL,
        botInfo: await telegramBot.getBotInfo()
      });
    } catch (error) {
      this.logger.error('Failed to start server', error, {
        port: env.PORT,
        nodeVersion: process.version
      });
      process.exit(1);
    }
  }
}

