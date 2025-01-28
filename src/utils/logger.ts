import { FastifyBaseLogger } from 'fastify';

export class Logger {
  private logger: FastifyBaseLogger;

  constructor(logger: FastifyBaseLogger) {
    this.logger = logger;
  }

  public info(message: string, data?: object) {
    this.logger.info({
      timestamp: new Date().toISOString(),
      ...data
    }, message);
  }

  public error(message: string, error: unknown, data?: object) {
    this.logger.error({
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      ...data
    }, message);
  }

  public warn(message: string, data?: object) {
    this.logger.warn({
      timestamp: new Date().toISOString(),
      ...data
    }, message);
  }

  public debug(message: string, data?: object) {
    this.logger.debug({
      timestamp: new Date().toISOString(),
      ...data
    }, message);
  }
}
