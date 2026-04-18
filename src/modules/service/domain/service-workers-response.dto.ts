export class ServiceWorkersResponseDto {
  constructor(
    public id: string,
    public name: string,
    public description: string | null,
    public price: number,
    public durationMinutes: number,
    public workerServices: {
      customPrice: number | null;
      customDurationMinutes: number | null;
      worker: {
        id: string;
        fullName: string;
        photoUrl: string | null;
        schedules: {
          dayOfWeek: number;
          startTime: string;
          endTime: string;
          isWorking: boolean;
        }[];
      };
    }[],
  ) {}
}
