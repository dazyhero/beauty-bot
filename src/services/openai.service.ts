import OpenAI from 'openai';
import { env } from '../config/environment';
import { Logger } from '../utils/logger';
import { FastifyBaseLogger } from 'fastify';

export class OpenAIService {
  private openai: OpenAI;
  private logger: Logger;

  constructor(logger: FastifyBaseLogger) {
    this.openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY
    });

    this.logger = new Logger(logger);
  }

  public async analyzeIngredients(ingredients: string): Promise<string> {
    try {
      const prompt = `
    Ти — професійний експерт із косметичних продуктів. Твоя задача — аналізувати склад інгредієнтів косметичних продуктів та повертати структуровану HTML-відповідь. У відповіді слід надати максимально деталізовану інформацію про інгредієнт у наступному форматі:

    1. Заголовок кожного розділу повинен містити відповідний емодзі:
       - Інгредієнт: 🌿
       - Властивості: 🧴
       - Можливі ризики: ⚠️
       - Висновок: 💡

    2. Формат відповіді:
       - Починай з заголовка інгредієнта (жирним шрифтом із емодзі).
       - Для властивостей та ризиків використовуй детальний текстовий опис із підпунктами.
       - Завершуй текст позитивною порадою.

    Ось інгредієнт для аналізу: ${ingredients}.
    Проаналізуй його за таким форматом та поверни HTML-відповідь.
  `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a cosmetic ingredient analysis expert. Provide detailed but easy to understand information about cosmetic ingredients."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return response.choices[0].message.content || 'Sorry, I couldn\'t analyze these ingredients.';
    } catch (error) {
      this.logger.error('OpenAI API Error', error);
      throw new Error('Failed to analyze ingredients');
    }
  }
}

