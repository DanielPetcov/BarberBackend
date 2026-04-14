import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../drizzle/schemas';
import { UserResponseDto } from './domain/user-response.dto';
import { eq, getTableColumns } from 'drizzle-orm';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly _db: NodePgDatabase<typeof schema>,
  ) {}

  async update(
    userId: string,
    dto: schema.UpdateUser,
  ): Promise<UserResponseDto | null> {
    const userColumns = this.getUserColumns();
    const [row] = await this._db
      .update(schema.user)
      .set({ ...dto })
      .where(eq(schema.user.id, userId))
      .returning(userColumns);
    return row ?? null;
  }

  private getUserColumns() {
    const {
      createdAt,
      updatedAt,
      businessId,
      emailVerified,
      isActive,
      role,
      image,
      ...rest
    } = getTableColumns(schema.user);
    return rest;
  }
}
