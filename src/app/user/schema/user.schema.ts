import * as validator from 'validator';

import { Schema } from 'mongoose';
import { config } from '@config/config';

export const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, 'firstname is required'],
    },
    lastname: {
      type: String,
      required: [true, 'lastname is required'],
    },
    username: {
      type: String,
      required: [true, 'username is required'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.default.isEmail, 'Invalid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      enum: config.app.roles,
      default: ['User'],
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  },
);

UserSchema.virtual('fullname').get(function() {
  return `${this.firstname} ${this.lastname}`;
});
