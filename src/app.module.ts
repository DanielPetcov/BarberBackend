import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from 'config/configuration';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';

import { LoggerModule } from 'pino-nestjs';
import { BusinessModule } from './modules/business/business.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    ConfigModule.forRoot({
      load: [configuration],
      cache: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),

    BusinessModule,
    UserModule,
  ],
})
export class AppModule {}
