import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../drizzle/schemas';
import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.service';
import { eq, getTableColumns } from 'drizzle-orm';
import { BusinessEntity } from './domain/business.entity';

import { CreateBusiness, UpdateBusiness } from '../drizzle/schemas';

@Injectable()
export class BusinessRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly _db: NodePgDatabase<typeof schema>,
  ) {}

  async get(businessId: string): Promise<BusinessEntity | null> {
    try {
      const { id, ...rest } = getTableColumns(schema.business);

      const [row] = await this._db
        .select(rest)
        .from(schema.business)
        .where(eq(schema.business.id, businessId))
        .limit(1);

      return row ?? null;
    } catch (error) {
      console.error('FULL ERROR:', error);
      console.error('CAUSE:', (error as any)?.cause);
      console.error('CAUSE MESSAGE:', (error as any)?.cause?.message);
      throw error;
    }
  }

  async getIdBySlug(businessSlug: string) {
    const business = await this._db.query.business.findFirst({
      where: eq(schema.business.slug, businessSlug),
      columns: {
        id: true,
      },
    });
    return business?.id;
  }

  async create(model: CreateBusiness): Promise<BusinessEntity> {
    const [row] = await this._db
      .insert(schema.business)
      .values(model)
      .returning();
    return row;
  }

  async update(
    businessId: string,
    model: UpdateBusiness,
  ): Promise<BusinessEntity> {
    const [row] = await this._db
      .update(schema.business)
      .set(model)
      .where(eq(schema.business.id, businessId))
      .returning();
    return row;
  }
}
