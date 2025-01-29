import { Context } from 'telegraf';
import { Command } from './types';
import { OpenAIService } from '../../services/openai.service';
import { Logger } from '../../utils/logger';
import { FastifyBaseLogger } from 'fastify';
import { StatisticsService } from '../../services/statistics.service';

export class AnalyzeCommand implements Command {
  public command = 'analyze';
  public description = 'Analyze cosmetic ingredients';
  private openAIService: OpenAIService;
  private statisticsService: StatisticsService;
  private logger: Logger


  constructor(logger: FastifyBaseLogger) {
    this.logger = new Logger(logger);
    this.openAIService = new OpenAIService(logger);
    this.statisticsService = new StatisticsService(logger);
  }

  public async handler(ctx: Context & { message?: { text?: string } }): Promise<void> {
    const userId = ctx.from?.id;
    const username = ctx.from?.username;

    try {
      this.statisticsService.trackCommand({
        userId: userId || 0,
        username,
        command: this.command,
        timestamp: new Date(),
        success: true
      });

      const text = ctx.message && 'text' in ctx.message ? ctx.message.text : undefined;
      if (!text || text === '/analyze') {
        await ctx.reply(
          'Будь ласка, надішліть список інгредієнтів після команди /analyze.\n' +
          'Наприклад:\n' +
          '/analyze Aqua, Glycerin, Cetearyl Alcohol'
        );
        return;
      }

      const ingredients = text.replace('/analyze', '').trim();

      await ctx.replyWithChatAction('typing');

      const analysis = await this.openAIService.analyzeIngredients(ingredients);

      await ctx.reply(analysis, { parse_mode: 'Markdown' });
    } catch (error) {
      this.statisticsService.trackCommand({
        userId: userId || 0,
        username,
        command: this.command,
        timestamp: new Date(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      this.logger.error('Error analyzing ingredients', error);
      await ctx.reply('Вибачте, сталася помилка при аналізі інгредієнтів. Спробуйте пізніше.');
    }
  }
}

