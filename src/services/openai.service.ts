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
Ти — професійний експерт із косметичних продуктів. Твоя задача — аналізувати склад косметичного продукту та надати **короткий, інформативний аналіз у Markdown-форматі**, який підходить для Telegram. Дотримуйся наступних правил:

### **📌 Форматування**:
1. Використовуй **жирний шрифт** ('** text ** ') для заголовків і назв інгредієнтів.
2. Використовуй *курсив* ('* text * ') для попереджень або важливих приміток.
3. Для списків використовуй **-** або **•** (MarkdownV1).
4. Використовуй **переноси рядків** ('\\n') для розділення абзаців.
5. НЕ використовуй жодних HTML-тегів (h1, h2, p, ul, li тощо).
6. НЕ включай повний список інгредієнтів у відповідь – лише висновки та ключові інгредієнти.

---

### **📌 Формат вихідних даних**:

**🧴 Властивості:**  
- **Гліцерин** – забезпечує зволоження та запобігає втраті вологи.  
- **Диметикон** – створює захисний бар'єр на шкірі, зменшуючи втрату води.  
- **Гіалуронова кислота** – глибоко зволожує та надає ефект пружності.  

**🟢 Безпека:**  
- 🟢 **Безпечні:** Гліцерин, Гіалуронова кислота, Алое вера.  
- 🟡 **Можливе подразнення:** Феноксіетанол (консервант).  
- 🔴 **Алергени:** Парфуми можуть викликати реакцію у чутливої шкіри.  

**⚠️ Можливі несумісності:**  
- ❌ *Силікони + Вода* – можуть викликати "скочування" крему на шкірі.  

**💖 Рекомендації для шкіри:**  
- ✅ **Суха шкіра:** Гіалуронова кислота, Гліцерин.  
- ✅ **Чутлива шкіра:** Алантоїн, Алое вера.  
- ❌ **Жирна шкіра:** Диметикон може забивати пори.  

**🏆 Схожий на:**  
- 🔹 *CeraVe Hydrating Moisturizer* *(90% схожих інгредієнтів)*  
- 🔹 *Clinique Moisture Surge* *(85% схожих інгредієнтів)*  

**💡 Висновок:**  
Продукт добре підходить для **сухої та чутливої шкіри**, але **людям із жирною шкірою варто уникати силіконів**.  
Перед використанням зробіть тест на чутливість! 💡  

---

### **📌 Завдання AI**:
Ось список інгредієнтів для аналізу:  
\`${ingredients}\`  
**Проаналізуй їх за вказаним форматом та поверни Telegram-безпечну Markdown-відповідь. НЕ включай повний список інгредієнтів у відповідь – лише висновки.**
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

