import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../../modules/drizzle/schemas';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { UserEntity } from './domain/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly _db: NodePgDatabase<typeof schema>,
  ) {}

  async update(
    userId: string,
    dto: schema.UpdateUser,
  ): Promise<UserEntity | null> {
    const { id, ...rest } = getTableColumns(schema.user);
    const [row] = await this._db
      .update(schema.user)
      .set({ ...dto })
      .where(eq(schema.user.id, userId))
      .returning({ ...rest });
    return row ?? null;
  }

  async getAllWorkers(businessId: string): Promise<UserEntity[]> {
    const { id, ...rest } = getTableColumns(schema.user);
    const rows = await this._db
      .select({ ...rest })
      .from(schema.user)
      .where(
        and(
          eq(schema.user.businessId, businessId),
          eq(schema.user.role, 'worker'),
        ),
      );
    return rows;
  }

  async getWorker(
    userId: string,
    businessId: string,
  ): Promise<UserEntity | null> {
    const { id, ...rest } = getTableColumns(schema.user);
    const [row] = await this._db
      .select({ ...rest })
      .from(schema.user)
      .where(
        and(eq(schema.user.id, userId), eq(schema.user.businessId, businessId)),
      )
      .limit(1);
    return row;
  }

  async deleteWorker(userId: string): Promise<UserEntity | null> {
    const { id, ...rest } = getTableColumns(schema.user);
    const [row] = await this._db
      .delete(schema.user)
      .where(eq(schema.user.id, userId))
      .returning({ ...rest });
    return row ?? null;
  }
}
