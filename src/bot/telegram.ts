import { Telegraf } from 'telegraf';
import { env } from '../config/environment';

export class TelegramBot {
  private bot: Telegraf;
  public readonly WEBHOOK_PATH = '/webhook';
  public readonly WEBHOOK_URL: string;

  constructor() {
    this.bot = new Telegraf(env.BOT_TOKEN);
    this.WEBHOOK_URL = `https://${env.DOMAIN}${this.WEBHOOK_PATH}`;
    this.setupCommands();
  }

  private setupCommands(): void {
    this.bot.start((ctx) => ctx.reply('Welcome to the Fastify Telegram Bot! 🚀'));
    this.bot.help((ctx) => ctx.reply('Send me any message, and I\'ll echo it back!'));
    this.bot.on('text', (ctx) => ctx.reply(`You said: ${ctx.message.text}`));
  }

  public getWebhookCallback() {
    return this.bot.webhookCallback(this.WEBHOOK_PATH);
  }

  public async setWebhook(): Promise<void> {
    await this.bot.telegram.setWebhook(this.WEBHOOK_URL);
  }
}

export const telegramBot = new TelegramBot();

