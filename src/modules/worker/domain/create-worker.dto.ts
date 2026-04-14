export class CreateWorkerDto {
  constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}
}
