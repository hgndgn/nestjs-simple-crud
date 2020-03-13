import { Module, NestModule } from '@nestjs/common';

import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './shared/filter/exception.filter';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesMiddleware } from './shared/middleware/role.middleware';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { config } from '@config/config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    LoggerModule,

    MongooseModule.forRoot(`${config.mongo.url}/${config.mongo.dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: import('@nestjs/common').MiddlewareConsumer) {
    consumer.apply(RolesMiddleware).forRoutes(UserController);
  }
}
