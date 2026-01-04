import { z } from 'zod';
import tryParseEnv from './try-parse-env';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
    BETTER_AUTH_URL: z.string().url('BETTER_AUTH_URL must be a valid URL'),
    TURSO_DATABASE_URL: z.string().url('TURSO_DATABASE_URL must be a valid URL'),
    TURSO_AUTH_TOKEN: z.string().min(1, 'TURSO_AUTH_TOKEN is required')
});

tryParseEnv(envSchema);

export default envSchema.parse(process.env);