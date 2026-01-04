import { z } from 'zod';
import tryParseEnv from './try-parse-env';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
    BETTER_AUTH_URL: z.string().url('BETTER_AUTH_URL must be a valid URL'),
});

tryParseEnv(envSchema);

export const env = envSchema.parse(process.env);