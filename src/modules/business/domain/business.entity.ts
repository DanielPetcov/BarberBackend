export class BusinessEntity {
  constructor(
    public name: string,
    public phone: string,
    public email: string | null,
    public address: string,
    public city: string | null,
    public description: string | null,
    public logoUrl: string | null,
    public telegramChatId: string | null,
  ) {}
}
