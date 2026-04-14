import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '../drizzle/schemas';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { WorkerResponseDto } from './domain/worker-response.dto';

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
    const workerColumns = this.getWorkerColumns();
    const [row] = await this._db
      .update(schema.worker)
      .set({ ...dto })
      .where(eq(schema.worker.id, workerId))
      .returning(workerColumns);
    return row ?? null;
  }

  async create(dto: schema.CreateWorker): Promise<WorkerResponseDto> {
    const workerColumns = this.getWorkerColumns();
    const [row] = await this._db
      .insert(schema.worker)
      .values(dto)
      .returning(workerColumns);
    return row;
  }

  async getAll(businessId: string): Promise<WorkerResponseDto[]> {
    const workerColumns = this.getWorkerColumns();
    const rows = await this._db
      .select(workerColumns)
      .from(schema.worker)
      .where(eq(schema.worker.businessId, businessId));
    return rows;
  }

  async getAllPublic(): Promise<WorkerResponseDto[]> {
    const workerColumns = this.getWorkerColumns();
    const rows = await this._db.select(workerColumns).from(schema.worker);
    return rows;
  }

  async get(
    workerId: string,
    businessId: string,
  ): Promise<WorkerResponseDto | null> {
    const workerColumns = this.getWorkerColumns();
    const [row] = await this._db
      .select(workerColumns)
      .from(schema.worker)
      .where(
        and(
          eq(schema.worker.id, workerId),
          eq(schema.worker.businessId, businessId),
        ),
      )
      .limit(1);
    return row;
  }

  async delete(workerId: string): Promise<WorkerResponseDto | null> {
    const workerColumns = this.getWorkerColumns();
    const [row] = await this._db
      .delete(schema.worker)
      .where(eq(schema.worker.id, workerId))
      .returning(workerColumns);
    return row ?? null;
  }

  private getWorkerColumns() {
    const {
      createdAt,
      updatedAt,
      isActive,
      businessId,
      userId,
      telegramChatId,
      ...rest
    } = getTableColumns(schema.worker);
    return rest;
  }
}
