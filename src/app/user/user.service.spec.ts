import { BaseTestingModule, baseProviders } from '@shared/base.testing.module';
import { DocumentQuery, Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mockUserDtos, userDocArray } from './user.mock';

import { IUserDoc } from './document/user.doc';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { createMock } from '@golevelup/nestjs-testing';
import { getModelToken } from '@nestjs/mongoose';

describe('UserService', () => {
  let service: UserService;
  let model: Model<IUserDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, BaseTestingModule],
      providers: [UserService, ...baseProviders],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<IUserDoc>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<DocumentQuery<IUserDoc, IUserDoc>>({
        exec: jest.fn().mockReturnValueOnce(null),
      }),
    );
    jest.spyOn(model, 'create').mockReturnValueOnce(userDocArray[1] as any);

    const signUpMock = mockUserDtos[1];
    const createdUser = await service.create(signUpMock);
    delete signUpMock.password;
    delete createdUser.password;

    expect(createdUser).toEqual(signUpMock);
  });

  it('should update user', async () => {
    jest.spyOn(model, 'create').mockReturnValueOnce(userDocArray[1] as any);

    const signUpMock = mockUserDtos[1];
    const createdUser = await service.create(signUpMock);
    const toUpdate = { ...createdUser };
    toUpdate.firstname = 'NewFirstname';

    jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce(
      createMock<DocumentQuery<IUserDoc, IUserDoc>>({
        exec: jest.fn().mockReturnValueOnce(toUpdate),
      }),
    );

    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<DocumentQuery<IUserDoc, IUserDoc>>({
        exec: jest.fn().mockReturnValueOnce(toUpdate),
      }),
    );

    const updateResult = await service.updateOne(
      createdUser.username,
      toUpdate,
    );

    expect(updateResult).toEqual(toUpdate);
  });

  it('should delete one user', async () => {
    jest.spyOn(model, 'remove').mockResolvedValueOnce(true as any);

    const validObjectId = '5e666b200b0b0074fa01e596';

    expect(await service.deleteOne(validObjectId)).toEqual({
      deleted: true,
      id: validObjectId,
    });
  });
});
