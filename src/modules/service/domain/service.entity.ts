export class ServiceEntity {
  constructor(
    public id: string,
    public name: string,
    public description: string | null,
    public businessId: string,
    public price: number,
    public durationMinutes: number,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date | null,
  ) {}
}
