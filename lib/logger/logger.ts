import { LoggerService } from "./service";

export const Log = (conn?: string) => {
  const logger = LoggerService.getConnection(conn);
  return logger;
};

export const log = (payload: any, level?: string) => {
  const logger = Log();
  return logger[level ?? "debug"](payload);
};
