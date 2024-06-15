import { LoggerService } from './service';

export function Logger(conn?: string) {
  return LoggerService.getConnection(conn);
}
