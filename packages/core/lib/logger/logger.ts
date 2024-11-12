import { LoggerService } from './service';

export const Log = (name?: string) => {
  return LoggerService.logger(name);
};

export const log = async (payload: any, level?: string) => {
  const logger = Log();
  return await logger[level ?? 'debug'](payload);
};
