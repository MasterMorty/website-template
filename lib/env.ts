import { z } from 'zod';
import tryParseEnv from './try-parse-env';
import "dotenv/config";

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    APP_URL: z.string().url('APP_URL must be a valid URL').default('http://localhost:3000'),
    BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
    BETTER_AUTH_URL: z.string().url('BETTER_AUTH_URL must be a valid URL'),
    TURSO_DATABASE_URL: z.string().url('TURSO_DATABASE_URL must be a valid URL'),
    TURSO_AUTH_TOKEN: z.string().min(1, 'TURSO_AUTH_TOKEN is required'),
    R2_ACCESS_KEY_ID: z.string().min(1, 'R2_ACCESS_KEY_ID is required'),
    R2_SECRET_ACCESS_KEY: z.string().min(1, 'R2_SECRET_ACCESS_KEY is required'),
    R2_ENDPOINT: z.string().url('R2_ENDPOINT must be a valid URL'),
    R2_BUCKET: z.string().min(1, 'R2_BUCKET is required'),
    R2_PUBLIC_URL: z.string().url('R2_PUBLIC_URL must be a valid URL')
});

tryParseEnv(envSchema);

export default envSchema.parse(process.env);