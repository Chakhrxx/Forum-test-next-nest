import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status = exception.getStatus();
    const message = exception.getResponse();

    // Log the error
    this.logger.error(
      `HTTP Status: ${status} Error: ${JSON.stringify(message)}`,
      {
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    );

    // Prepare the message for the response
    let errorMessage: string;
    if (typeof message === 'string') {
      errorMessage = message; // If the message is a string
    } else if (typeof message === 'object' && 'message' in message) {
      errorMessage = (message as any).message; // If the message is an object with a 'message' property
    } else {
      errorMessage = 'An unexpected error occurred.'; // Fallback message
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
    });
  }
}
