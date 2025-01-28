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
      const prompt = `Analyze these cosmetic ingredients and provide information about:
      1. What each ingredient is and its purpose
      2. Potential benefits
      3. Possible risks or allergens
      4. Overall safety assessment
      
      Ingredients list:
      ${ingredients}
      
      Please provide the analysis in a clear, structured format.`;

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

