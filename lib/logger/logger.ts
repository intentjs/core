import winston from "winston";
import { LoggerService } from "./service";

export function Logger(conn?: string): winston.Logger {
  return LoggerService.getConnection(conn);
}
