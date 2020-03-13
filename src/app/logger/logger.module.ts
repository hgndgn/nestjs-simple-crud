import * as colors from 'colors/safe';
import * as winston from 'winston';

import { WinstonModule, utilities } from 'nest-winston';

import { AppLogger } from './logger';
import { Module } from '@nestjs/common';
import { config } from '@config/config';
import { format } from 'winston';

const winstonConsoleFormat = format.printf(args => {
  return `[${args.level}]: ${new Date(
    args.timestamp,
  ).toLocaleString()} - [${colors.blue(args.context)}] - ${args.message}`;
});

const combinedFormat = winston.format.combine(
  winston.format.timestamp(),
  utilities.format.nestLike(),
  winstonConsoleFormat,
  winston.format.json(),
  winston.format.prettyPrint(),
  // winston.format.splat(),
  // winston.format.simple(),
);

const options = {
  file: {
    dirname: config.log.dirname,
    filename: config.log.filename.all,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 2,
    colorize: true,
    format: combinedFormat,
  },
  console: {
    level: config.log.level,
    handleExceptions: true,
    colorize: true,
    format: combinedFormat,
  },
};

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        process.env.NODE_ENV !== 'production'
          ? new winston.transports.Console({ ...options.console })
          : undefined,
        new winston.transports.File({ ...options.file }),
        new winston.transports.File({
          ...options.file,
          // override level and filename
          level: 'error',
          filename: 'error.log',
        }),
      ],
      level: config.log.level,
      format: winstonConsoleFormat,
    }),
  ],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
