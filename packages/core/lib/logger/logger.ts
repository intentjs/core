import { LoggerService } from './service';

export const Log = (conn?: string) => {
  return LoggerService.logger(conn);
};

export const log = (payload: any, level?: string) => {
  const logger = Log();
  return logger[level ?? 'debug'](payload);
};
