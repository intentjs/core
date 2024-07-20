import { LoggerService } from './service';

export const Log = (conn?: string) => {
  const logger = LoggerService.getConnection(conn);
  return class {
    constructor() {}

    static emergency(payload: any) {
      return logger.emerg(payload);
    }

    static alert(payload) {
      return logger.alert(payload);
    }

    static critical(payload) {
      return logger.crit(payload);
    }

    static error(payload) {
      return logger.error(payload);
    }

    static warn(payload) {
      return logger.warn(payload);
    }

    static notice(payload) {
      return logger.notice(payload);
    }

    static info(payload) {
      return logger.info(payload);
    }

    static debug(payload) {
      return logger.debug(payload);
    }
  };
};

export const log = (payload: any, level?: string) => {
  const logger = Log();
  return logger[level ?? 'debug'](payload);
};
