import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}

  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseObject = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      error: error.name || error.response.name || error.response.error,
      message: error.response || error.message || error.response.message,
      errors: error.response.errors || undefined,
    };

    res.status(status).json(responseObject);
  }
}
