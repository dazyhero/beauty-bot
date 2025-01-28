import { Telegraf } from 'telegraf';
import { Update } from 'telegraf/types';
import { env } from '../config/environment';
import { CommandRegistry } from './commands';
import { FastifyBaseLogger } from 'fastify';

export class TelegramBot {
  private bot: Telegraf;
  public readonly WEBHOOK_PATH = '/webhook';
  public readonly WEBHOOK_URL: string;
  public readonly commandRegistry: CommandRegistry

  constructor(logger: FastifyBaseLogger) {
    this.bot = new Telegraf(env.BOT_TOKEN);
    this.WEBHOOK_URL = `https://${env.DOMAIN}${this.WEBHOOK_PATH}`;
    this.commandRegistry = new CommandRegistry(logger);
    this.setupCommands();
  }

  private setupCommands(): void {
    this.commandRegistry.registerCommands(this.bot);

    void this.bot.telegram.setMyCommands(
      this.commandRegistry.getCommandDescriptions()
    );
  }

  public getWebhookCallback() {
    return this.bot.webhookCallback(this.WEBHOOK_PATH);
  }

  public async handleUpdate(update: Update): Promise<void> {
    return await this.bot.handleUpdate(update);
  }

  public async setWebhook(): Promise<void> {
    await this.bot.telegram.setWebhook(this.WEBHOOK_URL);
  }

  public async getBotInfo() {
    const botInfo = await this.bot.telegram.getMe();
    return {
      username: botInfo.username,
      id: botInfo.id,
      isBot: botInfo.is_bot
    };
  }

}
