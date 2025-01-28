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
    Ти — професійний експерт із косметичних продуктів. Твоя задача — аналізувати склад інгредієнтів косметичних продуктів та повертати структуровану відповідь у текстовому форматі з наступними правилами:

    1. Використовуй **<b>жирний шрифт</b>** для заголовків і назв інгредієнтів (додай емодзі перед кожним заголовком, наприклад, 🌿 для назви інгредієнта).
    2. Використовуй **<i>курсив</i>** для попереджень або важливих приміток.
    3. Для списків використовуй символи **•** або **-** (без HTML-тегів для списків). Додай відповідні емодзі перед пунктами:
       - 🌟 для переваг та властивостей.
       - ⚠️ для ризиків або попереджень.
    4. Для розділення абзаців використовуй **переноси рядків** за допомогою \\n.

    НЕ використовуй жодних HTML-тегів, таких як h1, h2, p, ul, li тощо.

    Приклад формату відповіді для інгредієнта "Retinol":
    <b>🌿 Інгредієнт:</b> Retinol\\n
    <b>🧴 Властивості:</b>\\n
    🌟 Сприяє регенерації клітин шкіри\\n
    🌟 Допомагає зменшити зморшки та тонкі лінії\\n
    🌟 Має антиоксидантну дію, захищаючи шкіру від вільних радикалів\\n
    <b>⚠️ Можливі ризики:</b>\\n
    ⚠️ Може викликати подразнення або почервоніння у людей із чутливою шкірою\\n
    ⚠️ <i>Підвищує чутливість до ультрафіолетового випромінювання, тому важливо використовувати SPF</i>\\n
    ⚠️ Може викликати алергічні реакції в рідкісних випадках\\n
    <b>💡 Висновок:</b>\\n
    Retinol — чудовий вибір для покращення стану шкіри, але важливо правильно його використовувати, аби уникнути подразнень. Залишайся впевненим у тому, що використовуєш! 💡

    Ось інгредієнт для аналізу: ${ingredients}.
    Проаналізуй його за таким форматом та поверни відповідь з емодзі.
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

