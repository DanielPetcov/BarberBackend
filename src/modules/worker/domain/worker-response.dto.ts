export class WorkerResponseDto {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public image: string | null,
  ) {}
}
