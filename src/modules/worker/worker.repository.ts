import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DrizzleAsyncProvider } from '../drizzle/drizzle.service';
import * as schema from '../drizzle/schemas';
import { WorkerResponseDto } from './domain/worker-response.dto';
import { CreateWorkerScheduleDto } from './domain/create-worker-schedule.dto';

type WorkerWithServicesAndSchedules = Awaited<
  ReturnType<
    (typeof WorkerRepository.prototype)['findWorkerWithServicesAndSchedulesById']
  >
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

    const row = await this.findWorkerWithServicesAndSchedulesById(updated.id);
    return row ? this.toDto(row) : null;
  }

  async create(dto: schema.CreateWorker): Promise<WorkerResponseDto> {
    const [created] = await this._db
      .insert(schema.worker)
      .values(dto)
      .returning({ id: schema.worker.id });

    const row = await this.findWorkerWithServicesAndSchedulesById(created.id);

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
        schedules: {
          columns: {
            dayOfWeek: true,
            startTime: true,
            endTime: true,
            isWorking: true,
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
        schedules: {
          columns: {
            dayOfWeek: true,
            startTime: true,
            endTime: true,
            isWorking: true,
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
        schedules: {
          columns: {
            dayOfWeek: true,
            startTime: true,
            endTime: true,
            isWorking: true,
          },
        },
      },
    });

    return row ? this.toDto(row) : null;
  }

  async delete(workerId: string): Promise<WorkerResponseDto | null> {
    const existing =
      await this.findWorkerWithServicesAndSchedulesById(workerId);
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

  async getSchedule(
    workerId: string,
    dayOfWeek: number,
  ): Promise<schema.WorkerSchedule | null> {
    const schedule = await this._db.query.workerSchedule.findFirst({
      where: and(
        eq(schema.workerSchedule.workerId, workerId),
        eq(schema.workerSchedule.dayOfWeek, dayOfWeek),
      ),
    });

    return schedule ?? null;
  }

  async createSchedule(
    workerId: string,
    dto: CreateWorkerScheduleDto,
  ): Promise<schema.WorkerSchedule> {
    const [schedule] = await this._db
      .insert(schema.workerSchedule)
      .values({
        workerId,
        dayOfWeek: dto.day,
        startTime: dto.startHour,
        endTime: dto.endHour,
        isWorking: dto.isWorking,
      })
      .returning();

    return schedule;
  }

  async deleteSchedule(
    workerId: string,
    day: number,
  ): Promise<schema.WorkerSchedule> {
    const [schedule] = await this._db
      .delete(schema.workerSchedule)
      .where(
        and(
          eq(schema.workerSchedule.workerId, workerId),
          eq(schema.workerSchedule.dayOfWeek, day),
        ),
      )
      .returning();
    return schedule;
  }

  private async findWorkerWithServicesAndSchedulesById(workerId: string) {
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
        schedules: {
          columns: {
            dayOfWeek: true,
            startTime: true,
            endTime: true,
            isWorking: true,
          },
        },
      },
    });
  }

  private toDto(
    row: NonNullable<WorkerWithServicesAndSchedules>,
  ): WorkerResponseDto {
    return new WorkerResponseDto(
      row.id,
      row.fullName,
      row.phone,
      row.photoUrl,
      row.bio,
      row.workerServices.map((ws) => ({
        id: ws.service.id,
      })),
      row.schedules.map((schedule) => ({
        day: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        isWorking: schedule.isWorking,
      })),
    );
  }
}
