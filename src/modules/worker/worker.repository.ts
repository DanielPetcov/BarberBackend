import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DrizzleAsyncProvider } from '../drizzle/drizzle.service';
import * as schema from '../drizzle/schemas';
import { WorkerResponseDto } from './domain/worker-response.dto';

type WorkerWithServices = Awaited<
  ReturnType<(typeof WorkerRepository.prototype)['findWorkerWithServicesById']>
>;

@Injectable()
export class WorkerRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly _db: NodePgDatabase<typeof schema>,
  ) {}

  async update(
    workerId: string,
    dto: schema.UpdateWorker,
  ): Promise<WorkerResponseDto | null> {
    const [updated] = await this._db
      .update(schema.worker)
      .set({ ...dto })
      .where(eq(schema.worker.id, workerId))
      .returning({ id: schema.worker.id });

    if (!updated) return null;

    const row = await this.findWorkerWithServicesById(updated.id);
    return row ? this.toDto(row) : null;
  }

  async create(dto: schema.CreateWorker): Promise<WorkerResponseDto> {
    const [created] = await this._db
      .insert(schema.worker)
      .values(dto)
      .returning({ id: schema.worker.id });

    const row = await this.findWorkerWithServicesById(created.id);

    if (!row) {
      throw new Error('Worker was created but could not be reloaded');
    }

    return this.toDto(row);
  }

  async getAll(businessId: string): Promise<WorkerResponseDto[]> {
    const rows = await this._db.query.worker.findMany({
      where: eq(schema.worker.businessId, businessId),
      with: {
        workerServices: {
          with: {
            service: {
              columns: {
                id: true,
              },
            },
          },
        },
      },
    });

    return rows.map((row) => this.toDto(row));
  }

  async getAllPublic(): Promise<WorkerResponseDto[]> {
    const rows = await this._db.query.worker.findMany({
      with: {
        workerServices: {
          with: {
            service: {
              columns: {
                id: true,
              },
            },
          },
        },
      },
    });

    return rows.map((row) => this.toDto(row));
  }

  async get(
    workerId: string,
    businessId: string,
  ): Promise<WorkerResponseDto | null> {
    const row = await this._db.query.worker.findFirst({
      where: and(
        eq(schema.worker.id, workerId),
        eq(schema.worker.businessId, businessId),
      ),
      with: {
        workerServices: {
          with: {
            service: {
              columns: {
                id: true,
              },
            },
          },
        },
      },
    });

    return row ? this.toDto(row) : null;
  }

  async delete(workerId: string): Promise<WorkerResponseDto | null> {
    const existing = await this.findWorkerWithServicesById(workerId);
    if (!existing) return null;

    await this._db.delete(schema.worker).where(eq(schema.worker.id, workerId));

    return this.toDto(existing);
  }

  async assignService(
    workerId: string,
    serviceId: string,
    businessId: string,
  ): Promise<string | null> {
    const existingWorker = await this._db.query.worker.findFirst({
      where: eq(schema.worker.id, workerId),
      columns: { id: true, businessId: true },
    });
    if (!existingWorker) return null;

    const existingService = await this._db.query.service.findFirst({
      where: eq(schema.service.id, serviceId),
      columns: { id: true, businessId: true },
    });
    if (!existingService) return null;

    if (existingWorker.businessId !== existingService.businessId) return null;

    const [inserted] = await this._db
      .insert(schema.workerServices)
      .values({
        workerId,
        serviceId,
        businessId,
      })
      .returning();

    return inserted.id ?? null;
  }

  async removeService(
    workerId: string,
    serviceId: string,
    businessId: string,
  ): Promise<string | null> {
    const existingWorker = await this._db.query.worker.findFirst({
      where: eq(schema.worker.id, workerId),
      columns: { id: true, businessId: true },
    });
    if (!existingWorker) return null;

    const existingService = await this._db.query.service.findFirst({
      where: eq(schema.service.id, serviceId),
      columns: { id: true, businessId: true },
    });
    if (!existingService) return null;

    if (existingWorker.businessId !== existingService.businessId) return null;

    const [removed] = await this._db
      .delete(schema.workerServices)
      .where(
        and(
          eq(schema.workerServices.workerId, workerId),
          eq(schema.workerServices.serviceId, serviceId),
          eq(schema.workerServices.businessId, businessId),
        ),
      )
      .returning();

    return removed.id ?? null;
  }

  private async findWorkerWithServicesById(workerId: string) {
    return this._db.query.worker.findFirst({
      where: eq(schema.worker.id, workerId),
      with: {
        workerServices: {
          with: {
            service: {
              columns: {
                id: true,
              },
            },
          },
        },
      },
    });
  }

  private toDto(row: NonNullable<WorkerWithServices>): WorkerResponseDto {
    return new WorkerResponseDto(
      row.id,
      row.fullName,
      row.phone,
      row.photoUrl,
      row.bio,
      row.workerServices.map((ws) => ({
        id: ws.service.id,
      })),
    );
  }
}
