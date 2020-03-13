import { Inject } from '@nestjs/common';
import { Logger } from 'winston';

export class AppLogger {
  private context: string;

  constructor(@Inject('winston') private readonly logger: Logger) {}

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, level: string) {
    this.logger.log(level, message, { context: this.context });
  }

  debug(message: any) {
    this.logger.debug(message, { context: this.context });
  }

  info(message: any) {
    this.logger.info(message, { context: this.context });
  }

  warn(message: any) {
    this.logger.warn(message, { context: this.context });
  }

  error(message: any, trace?: string) {
    this.logger.error(message, { context: this.context, trace });
  }

  verbose(message: any) {
    this.logger.verbose(message, { context: this.context });
  }
}
