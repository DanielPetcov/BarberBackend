import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

const databaseHost = process.env.DATABASE_HOST;
const databasePort = process.env.DATABASE_PORT;
const databaseUser = process.env.DATABASE_USER;
const databasePassword = process.env.DATABASE_PASSWORD;
const databaseName = process.env.DATABASE_NAME;

if (!databaseHost) throw new Error('Database host missing');
if (!databaseUser) throw new Error('Database user missing');
if (!databasePassword) throw new Error('Database password missing');
if (!databaseName) throw new Error('Database name missing');
if (!databasePort) throw new Error('Database port missing');

const DATABASE_URL = `postgresql://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseName}?sslmode=disable`;

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/modules/drizzle/schemas',
  out: './drizzle',
  dbCredentials: {
    url: DATABASE_URL,
  },
});
