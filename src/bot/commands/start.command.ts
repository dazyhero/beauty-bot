import { Context } from 'telegraf';
import { Command } from './types';

export class StartCommand implements Command {
  public command = 'start';
  public description = 'Start the bot';

  public async handler(ctx: Context): Promise<void> {
    await ctx.reply(
      "Привіт! 👋 Я бот, який допоможе тобі дізнатися більше про склад продуктів, які ти використовуєш. \nПросто надішли мені список інгредієнтів, і я розповім:\n- Що це за інгредієнти 🌿\n- Їх властивості 🧴\n- Можливі ризики чи алергени ⚠️\nЗалишайся впевненим у тому, що використовуєш! 💡"
    )
  }
}
