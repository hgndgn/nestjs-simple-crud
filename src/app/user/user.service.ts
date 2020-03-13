import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Errors } from '@shared/errors';
import { createMultipleRandom } from '@shared/utils';
import { Model } from 'mongoose';
import { AppLogger } from '../logger/logger';
import { IUserDoc } from './document/user.doc';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUserDoc>,
    private logger: AppLogger,
  ) {
    this.logger.setContext(UserService.name);
  }

  async createMultipleRandom() {
    return await createMultipleRandom(this.userModel);
  }

  async create(user: UserDto): Promise<IUserDoc> {
    const usernameExists = await this.userModel
      .findOne({
        username: user.username,
      })
      .exec();

    if (usernameExists) {
      throw new BadRequestException(Errors.AlreadyExistsError('Username'));
    }

    const emailExists = await this.userModel
      .findOne({ email: user.email })
      .exec();
    if (emailExists) {
      throw new BadRequestException(Errors.AlreadyExistsError('Email'));
    }

    try {
      const saved = await this.userModel.create(user);
      this.logger.info(`User '${user.username}' created`);
      return saved;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(Errors.ValidationError(error._message));
    }
  }

  async deleteOne(
    id: string,
  ): Promise<{
    deleted: boolean;
    id?: string;
    error?: any;
    message?: string;
  }> {
    try {
      const deletedUser = await this.userModel.findOneAndDelete({ _id: id });
      if (deletedUser) {
        this.logger.info(`${deletedUser._id} deleted`);
      }

      return { deleted: true, id };
    } catch (error) {
      this.logger.error(error);
      return error.name === Errors.CastError().name
        ? {
            deleted: false,
            error: Errors.CastError(),
          }
        : {
            deleted: false,
            message: 'An error occurred',
          };
    }
  }

  async updateOne(username: string, payload: UserDto): Promise<IUserDoc> {
    const updated = await this.userModel
      .findOneAndUpdate({ username }, payload)
      .exec();

    if (!updated) {
      this.logger.error(`Username '${username}' not exists`);
      throw new BadRequestException(Errors.NotFoundError('User'));
    }

    try {
      this.logger.info(`Update user '${updated._id}'`);
      return await this.userModel.findOne({ username }).exec();
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(Errors.ValidationError());
    }
  }

  async findAll(): Promise<IUserDoc[]> {
    return await this.userModel.find();
  }

  async findAllByRole(role: string) {
    return await this.userModel.find({ roles: { $all: [role] } });
  }

  async findOne(username: string): Promise<IUserDoc | null> {
    return await this.userModel.findOne({ username }).exec();
  }
}
