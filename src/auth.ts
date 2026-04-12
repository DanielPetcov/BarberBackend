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
  basePath: '/api/auth',
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ['http://localhost:3000'],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    updateAge: 24 * 60 * 60,
    expiresIn: 7 * 24 * 60 * 60,
  },
  user: {
    additionalFields: {
      role: {
        type: ['admin', 'worker'],
        required: false,
        defaultValue: 'worker',
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
