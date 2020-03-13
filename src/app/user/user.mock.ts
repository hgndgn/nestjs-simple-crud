import { IUserDoc } from './document/user.doc';
import { UserDto } from './dto/user.dto';

export const mockUserModel = () => ({
  new: jest.fn().mockResolvedValue(mockUser()),
  constructor: jest.fn().mockResolvedValue(mockUser()),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  deleteOne: jest.fn(),
  exec: jest.fn(),
});

export const mockUserDtoObject = (
  user = {
    firstname: 'TheFirstName',
    lastname: 'TheLastName',
    username: 'TheUserName',
    email: 'example@example.com',
    password: '12345678',
    roles: ['User'],
  },
): UserDto => user;

export const mockUser = (
  firstname: string = 'TheFirstName',
  lastname: string = 'TheLastName',
  username: string = 'TheUserName',
  email: string = 'example@example.com',
  password: string = '12345678',
  roles: string[] = ['User'],
) => ({
  firstname,
  lastname,
  username,
  email,
  password,
  roles,
});

const hashedPassword =
  '$2b$11$Vgvvv3mSckad2/zyJBzSB.4biIG5OrtbrG9ajooz3sIoBfwNMHtcy';

export const mockUserDoc: (mock?: {
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
  email: (mock && mock.email) || 'example@example.com',
  password: (mock && mock.password) || hashedPassword,
  roles: (mock && mock.roles) || ['User'],
});

export const mockUserDtos: UserDto[] = [
  mockUser(),
  mockUser('User 1', 'f1', 'u1', 'example_1@domain.com', '12345678', ['Admin']),
  mockUser('User 2', 'f2', 'u2', 'example_2@domain.com', '12345678', [
    'Admin',
    'Special',
  ]),
];

export const userDocArray = [
  mockUserDoc(),
  mockUserDoc({
    firstname: 'User 1',
    lastname: 'f1',
    username: 'u1',
    email: 'example_1@domain.com',
    roles: ['Admin'],
  }),
];
