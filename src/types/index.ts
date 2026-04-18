export const reservationStatus = [
  'pending',
  'confirmed',
  'completed',
  'canceled_by_client',
  'canceled_by_staff',
  'declined',
  'no_show',
] as const;
export type ReservationStatus = (typeof reservationStatus)[number];

export type WorkerSchedule = {
  id: string;
  dayOfWeek: number;
  workerId: string;
  startTime: string;
  endTime: string;
  isWorking: boolean;
};
