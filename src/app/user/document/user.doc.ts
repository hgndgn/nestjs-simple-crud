import { Document } from 'mongoose';
import { UserDto } from '@user/dto/user.dto';

export interface IUserDoc extends Document, UserDto {}
