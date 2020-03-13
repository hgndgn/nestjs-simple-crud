import { Test, TestingModule } from '@nestjs/testing';

import { AppLogger } from '@logger/logger';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { UserService } from '@user/user.service';
import { getModelToken } from '@nestjs/mongoose';

const mockUser = (
  firstname: string = 'TheFirstName',
  lastname: string = 'TheLastName',
  username: string = 'TheUserName',
  email: string = 'TheEmail',
  password: string = 'ThePassword',
  roles: string[] = ['User'],
) => ({
  firstname,
  lastname,
  username,
  email,
  password,
  roles,
});

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [
        AuthService,
        UserService,
        AppLogger,
        // { provide: getConnectionToken(), useValue: {} },
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: tests
});
