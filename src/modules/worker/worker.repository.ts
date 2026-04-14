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
    dto: schema.UpdateUser,
  ): Promise<WorkerResponseDto | null> {
    const workerColumns = this.getWorkerColumns();
    const [row] = await this._db
      .update(schema.user)
      .set({ ...dto })
      .where(eq(schema.user.id, workerId))
      .returning(workerColumns);
    return row ?? null;
  }

  async getAll(businessId: string): Promise<WorkerResponseDto[]> {
    const workerColumns = this.getWorkerColumns();
    const rows = await this._db
      .select(workerColumns)
      .from(schema.user)
      .where(
        and(
          eq(schema.user.businessId, businessId),
          eq(schema.user.role, 'worker'),
        ),
      );
    return rows;
  }

  async getAllPublic(): Promise<WorkerResponseDto[]> {
    const workerColumns = this.getWorkerColumns();
    const rows = await this._db
      .select(workerColumns)
      .from(schema.user)
      .where(and(eq(schema.user.role, 'worker')));
    return rows;
  }

  async get(
    workerId: string,
    businessId: string,
  ): Promise<WorkerResponseDto | null> {
    const workerColumns = this.getWorkerColumns();
    const [row] = await this._db
      .select(workerColumns)
      .from(schema.user)
      .where(
        and(
          eq(schema.user.id, workerId),
          eq(schema.user.businessId, businessId),
        ),
      )
      .limit(1);
    return row;
  }

  async delete(workerId: string): Promise<WorkerResponseDto | null> {
    const workerColumns = this.getWorkerColumns();
    const [row] = await this._db
      .delete(schema.user)
      .where(eq(schema.user.id, workerId))
      .returning(workerColumns);
    return row ?? null;
  }

  private getWorkerColumns() {
    const {
      createdAt,
      updatedAt,
      role,
      isActive,
      businessId,
      emailVerified,
      ...rest
    } = getTableColumns(schema.user);
    return rest;
  }
}
