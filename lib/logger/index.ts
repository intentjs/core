import { LoggerService } from "./service";
import * as winston from "winston";

export function Logger(conn?: string): winston.Logger {
  return LoggerService.getConnection(conn);
}
