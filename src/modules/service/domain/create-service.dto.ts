export class CreateServiceDto {
  constructor(
    public name: string,
    public description: string | null,
    public price: number,
    public durationMinutes: number,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date | null,
  ) {}
}
