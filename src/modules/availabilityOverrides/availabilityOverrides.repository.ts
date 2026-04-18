import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../drizzle/schemas';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class AvailabilityOverridesRepositor {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly _db: NodePgDatabase<typeof schema>,
  ) {}

  async get(barberId: string, date?: string) {
    const availabilityOverride =
      await this._db.query.availabilityOverrides.findMany({
        where: and(
          eq(schema.availabilityOverrides.workerId, barberId),
          date ? eq(schema.availabilityOverrides.date, date) : undefined,
        ),
      });
    return availabilityOverride;
  }

  async create(dto: schema.CreateAvailabilityOverride) {
    const [availabilityOverride] = await this._db
      .insert(schema.availabilityOverrides)
      .values(dto)
      .returning();
    return availabilityOverride;
  }

  async delete(availabilityOverrideId: string) {
    const [availabilityOverride] = await this._db
      .delete(schema.availabilityOverrides)
      .where(eq(schema.availabilityOverrides.id, availabilityOverrideId))
      .returning();
    return availabilityOverride;
  }
}
