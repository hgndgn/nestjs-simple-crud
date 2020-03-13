import { DocumentQuery, Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mockUserDtoObject, userDocArray } from '@user/user.mock';

import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { DatabaseModule } from '@database/database.module';
import { IUserDoc } from '@user/document/user.doc';
import { LoggerModule } from '@logger/logger.module';
import { UserModule } from '@user/user.module';
import { createMock } from '@golevelup/nestjs-testing';
import { getModelToken } from '@nestjs/mongoose';
import { mockUserModel } from '@user/user.mock';

describe('AuthService', () => {
  let service: AuthService;
  let model: Model<IUserDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UserModule, LoggerModule, DatabaseModule],
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<IUserDoc>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<DocumentQuery<IUserDoc, IUserDoc>>({
        exec: jest.fn().mockReturnValueOnce(userDocArray[0]),
      }),
    );

    const mock = mockUserDtoObject();
    const user = await service.validateUser(mock.username, mock.password);

    delete mock.password;
    delete user.password;

    expect(user).toEqual(mock);
  });
});
