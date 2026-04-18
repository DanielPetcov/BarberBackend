export interface WorkerBusySlotsDto {
  date: string;
  busySlots: { startTime: string; endTime: string }[];
}
