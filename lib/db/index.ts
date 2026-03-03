import { drizzle } from 'drizzle-orm/libsql';
import env from '../env';
import * as schema from './schema';

// You can specify any property from the libsql connection options
const isLocalDb = env.TURSO_DATABASE_URL.includes('localhost') || env.TURSO_DATABASE_URL.includes('127.0.0.1');

const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL,
    authToken: isLocalDb ? undefined : env.TURSO_AUTH_TOKEN,
  },
  casing: 'snake_case',
  schema,
});

export default db;