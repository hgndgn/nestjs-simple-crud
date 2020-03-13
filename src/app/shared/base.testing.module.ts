import { DatabaseModule } from '@database/database.module';
import { LoggerModule } from '@logger/logger.module';
import { Module } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { mockUserModel } from '@user/user.mock';

export const baseProviders = [
  {
    provide: getModelToken('User'),
    useValue: mockUserModel,
  },
];

@Module({
  imports: [DatabaseModule, LoggerModule],
  exports: [DatabaseModule, LoggerModule],
})
export class BaseTestingModule {}
