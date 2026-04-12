import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../../modules/drizzle/schemas';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly _db: NodePgDatabase<typeof schema>,
  ) {}

  async update(userId: string, dto: schema.UpdateUser): Promise<void> {
    const [row] = await this._db
      .update(schema.user)
      .set({ ...dto })
      .where(eq(schema.user.id, userId))
      .returning();
  }
}
