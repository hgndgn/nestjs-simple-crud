import * as BCRYPT from 'bcrypt';
import * as faker from 'faker';

import { IUserDoc } from '../user/document/user.doc';
import { Model } from 'mongoose';
import { UserDto } from '../user/dto/user.dto';
import { config } from '@config/config';
import { uniq } from 'lodash';

export const createMultipleRandom = async (userModel: Model<IUserDoc>) => {
  const users = [];
  for (let i = 0; i < 10; i++) {
    const role1 = Math.floor(Math.random() * 3);
    const role2 = Math.floor(Math.random() * 3);
    const roles = uniq([config.app.roles[role1], config.app.roles[role2]]);
    const salt = BCRYPT.genSaltSync(config.policy.password.salt);
    const user: UserDto = {
      username: faker.internet.userName(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      password: BCRYPT.hashSync('12345678', salt),
      roles,
    };
    users.push(user);
  }

  await userModel.create(users);
  return users;
};
