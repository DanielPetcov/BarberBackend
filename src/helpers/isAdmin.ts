import { HttpException, HttpStatus } from '@nestjs/common';
import { auth } from 'src/auth';

export async function isAdmin() {
  const session = await auth.api.getSession();
  if (!session || !session.user.businessId || session.user.role === 'worker')
    throw new HttpException('Session not present', HttpStatus.FORBIDDEN);

  return true;
}
