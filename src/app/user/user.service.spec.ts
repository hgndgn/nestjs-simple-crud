import { Test, TestingModule } from '@nestjs/testing';

import { IUserDoc } from './document/user.doc';
import { LoggerModule } from '@logger/logger.module';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
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

const mockUserDoc: (mock?: {
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  password?: string;
  roles?: string[];
}) => Partial<IUserDoc> = (mock?: {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
}) => ({
  firstname: (mock && mock.firstname) || 'TheFirstName',
  lastname: (mock && mock.lastname) || 'TheLastName',
  username: (mock && mock.username) || 'TheUserName',
  email: (mock && mock.email) || 'TheEmail',
  password: (mock && mock.password) || 'ThePassword',
  roles: (mock && mock.roles) || ['User'],
});

const userArray: UserDto[] = [
  mockUser(),
  mockUser('User 1', 'f1', 'u1', 'example_1@gmail.com', '12345678', ['Admin']),
  mockUser('User 2', 'f2', 'u2', 'example_2@gmail.com', '12345678', [
    'Admin',
    'Special',
  ]),
];

const userDocArray = [
  mockUserDoc({
    firstname: 'User 1',
    lastname: 'f1',
    username: 'u1',
    email: 'example_1@gmail.com',
    password: '12345678',
    roles: ['Admin'],
  }),
];

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UserService,
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

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: tests
});
