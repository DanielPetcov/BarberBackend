import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../drizzle/schemas';
import { ServiceEntity } from './domain/service.entity';
import { and, eq } from 'drizzle-orm';
import { ServiceWorkersResponseDto } from './domain/service-workers-response.dto';

@Injectable()
export class ServiceRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly _db: NodePgDatabase<typeof schema>,
  ) {}

  async getAll(businessId: string): Promise<ServiceEntity[]> {
    const rows = await this._db
      .select()
      .from(schema.service)
      .where(eq(schema.service.businessId, businessId));
    return rows;
  }

  async getAllPublic(): Promise<ServiceEntity[]> {
    return await this._db.select().from(schema.service);
  }

  async get(
    serviceId: string,
    businessId: string,
  ): Promise<ServiceEntity | null> {
    const [row] = await this._db
      .select()
      .from(schema.service)
      .where(
        and(
          eq(schema.service.id, serviceId),
          eq(schema.service.businessId, businessId),
        ),
      )
      .limit(1);
    return row ?? null;
  }

  async create(dto: schema.CreateService): Promise<ServiceEntity> {
    const [row] = await this._db.insert(schema.service).values(dto).returning();
    return row;
  }

  async delete(
    serviceId: string,
    businessId: string,
  ): Promise<ServiceEntity | null> {
    const [row] = await this._db
      .delete(schema.service)
      .where(
        and(
          eq(schema.service.id, serviceId),
          eq(schema.service.businessId, businessId),
        ),
      )
      .returning();
    return row ?? null;
  }

  async getServiceAvailableWorkers(
    serviceId: string,
  ): Promise<ServiceWorkersResponseDto | null> {
    const service = await this._db.query.service.findFirst({
      where: eq(schema.service.id, serviceId),
      with: {
        workerServices: {
          with: {
            worker: {
              columns: {
                id: true,
                fullName: true,
                photoUrl: true,
              },
            },
          },
          columns: {
            customPrice: true,
            customDurationMinutes: true,
          },
        },
      },
      columns: {
        id: true,
        name: true,
        description: true,
        durationMinutes: true,
        price: true,
      },
    });

    return service ?? null;
  }
}
