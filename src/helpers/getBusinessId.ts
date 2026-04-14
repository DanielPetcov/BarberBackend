import { HttpException, HttpStatus } from '@nestjs/common';
import { auth } from 'src/auth';

export async function getBusinessIdAdmin(headers: Headers) {
  const session = await auth.api.getSession({
    headers: headers,
  });

  if (!session || !session.user.businessId || session.user.role === 'worker') {
    throw new HttpException('Session not present', HttpStatus.FORBIDDEN);
  }

  return session.user.businessId;
}
