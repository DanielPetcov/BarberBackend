export class WorkerResponseDto {
  constructor(
    public id: string,
    public fullName: string,
    public phone: string | null,
    public photoUrl: string | null,
    public bio: string | null,
    public services: { id: string }[],
  ) {}
}
