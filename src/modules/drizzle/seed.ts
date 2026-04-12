import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { business } from './schemas/business';

import { DATABASE_URL } from 'src/databaseURL';
import { auth } from 'src/auth';
import { user } from './schemas';
import { eq } from 'drizzle-orm';

const pool = new Pool({ connectionString: DATABASE_URL });
const db = drizzle(pool);

async function seed() {
  console.log('🌱 Seeding...');

  const [seededBusiness] = await db
    .insert(business)
    .values({
      name: 'My Barber Shop',
      phone: '+1234567890',
      email: 'shop@example.com',
      address: '123 Main St',
      city: 'New York',
      description: 'The best barber shop in town',
    })
    .onConflictDoNothing()
    .returning();

  const email = 'daniel@gmail.com';

  await auth.api.signUpEmail({
    body: {
      name: 'daniel',
      email: email,
      password: 'daniel123',
    },
  });

  await db
    .update(user)
    .set({
      role: 'admin',
      businessId: seededBusiness.id,
    })
    .where(eq(user.email, email));

  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  pool.end();
  process.exit(1);
});
