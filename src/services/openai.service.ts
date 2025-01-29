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
Ти — професійний експерт із косметичних продуктів. Твоя задача — аналізувати склад інгредієнтів косметичних продуктів та повертати **структуровану відповідь у Markdown-форматі** за наступними правилами:

### **📌 Форматування**:
1. Використовуй **жирний шрифт**  для заголовків і назв інгредієнтів (додай емодзі перед кожним заголовком, наприклад, 🌿 для назви інгредієнта).
2. Використовуй *курсив*  для попереджень або важливих приміток.
3. Для списків використовуй **•** або **-** (без HTML-тегів для списків). Додай відповідні емодзі перед пунктами:
   - 🌟 для **корисних властивостей**.
   - ⚠️ для **ризиків та попереджень**.
4. Використовуй **переноси рядків** '\\n' для розділення абзаців.
5. НЕ використовуй жодних HTML-тегів (h1, h2, p, ul, li тощо).

---

### **📌 Формат вихідних даних**:

#### **🌿 Інгредієнти:**
- Water 💦 *(розчинник)*
- Glycerin 🧴 *(зволожувач)*
- Dimethicone 🔄 *(оклюзія, захист шкіри)*
- Phenoxyethanol ⚠️ *(консервант, можливий алерген)*

#### **🧴 Властивості:**
🌟 **Гліцерин [Зволожувач]** – підтримує рівень вологи в шкірі.  
🌟 **Диметикон [Оклюзія]** – створює бар’єр, що запобігає зневодненню.  
🌟 **Гіалуронат натрію [Зволожувач]** – притягує вологу та глибоко зволожує.  

#### **🟢 Безпека:**
🟢 Гліцерин – **безпечний**  
🟡 Феноксіетанол – **можливе подразнення**  
🔴 Парфуми – **потенційний алерген**  

#### **⚠️ Можливі несумісності:**
❌ *Силікони + Вода* – можуть скочуватись на шкірі.  

#### **💖 Рекомендовано для:**
✅ **Суха шкіра:** Гіалуронат натрію, Гліцерин  
✅ **Чутлива шкіра:** Алантоїн, Алое вера  
❌ **Жирна шкіра:** Диметикон *(може забивати пори)*  

#### **🏆 Схожий на:**
🔹 *CeraVe Hydrating Moisturizer* *(90% схожих інгредієнтів)*  
🔹 *Clinique Moisture Surge* *(85% схожих інгредієнтів)*  

#### **🗣️ Думка користувачів:**
📢 **Гліцерин:** 94% користувачів відзначають зволоження шкіри.  
📢 **Феноксіетанол:** 12% користувачів повідомляли про подразнення.  

#### **💡 Висновок:**
Цей продукт добре підходить для **сухої та чутливої шкіри**, однак **особам із жирною шкірою варто уникати силіконів**.  
Перед використанням протестуйте на невеликій ділянці шкіри! 💡  

---

### **📌 Завдання AI**:
Ось список інгредієнтів для аналізу:  
\`${ingredients}\`  
**Проаналізуй їх за вказаним форматом та поверни Markdown-відповідь з емодзі.**
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

