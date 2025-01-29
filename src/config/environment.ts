import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  BOT_TOKEN: z.string(),
  PORT: z.string().default('3000'),
  DOMAIN: z.string(),
  OPENAI_API_KEY: z.string(),
  POSTGRES_URI: z.string(),
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.error('❌ Invalid environment variables:', envParse.error.format());
  process.exit(1);
}

export const env = envParse.data;

