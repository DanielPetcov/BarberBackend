import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './modules/drizzle/schemas';

import { DATABASE_URL } from './databaseURL';

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const db = drizzle(pool, { schema });

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ['admin', 'client'],
        required: false,
        defaultValue: 'client',
        input: false,
      },
      businessId: {
        type: 'string',
        required: false,
        input: false,
      },
    },
  },
});
