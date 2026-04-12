export class UserEntity {
  constructor(
    public name: string,
    public email: string,
    public emailVerified: boolean,
    public image: string | null,
    public createdAt: Date,
    public updatedAt: Date,
    public role: 'admin' | 'worker',
    public businessId: string | null,
  ) {}
}
