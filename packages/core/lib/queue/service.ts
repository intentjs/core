import { Injectable, Type } from '@nestjs/common';
import { ConfigService } from '../config/service';
import { logTime } from '../utils/helpers';
import { InternalLogger } from '../utils/logger';
import { Str } from '../utils/string';
import {
  DatabaseQueueDriver,
  SqsQueueDriver,
  SyncQueueDriver,
} from './drivers';
import { RedisQueueDriver } from './drivers/redis';
import { QueueDriverOptions, QueueOptions } from './interfaces';
import { QueueMetadata } from './metadata';
import { QueueDrivers } from './strategy';

@Injectable()
export class QueueService {
  private static queueDriverMap = {
    sync: SyncQueueDriver,
    sqs: SqsQueueDriver,
    redis: RedisQueueDriver,
    db: DatabaseQueueDriver,
  };

  private static connections: Record<string, any> = {};

  constructor(private config: ConfigService) {
    const options = this.config.get('queue') as QueueOptions;
    if (!options) return;
    for (const connName in options.connections) {
      const time = Date.now();
      const connection = options.connections[connName];
      const driverName: string | Type<QueueDrivers> = connection.driver;
      const driver: Type<QueueDrivers> = Str.isString(driverName)
        ? QueueService.queueDriverMap[driverName as unknown as string]
        : driverName;

      if (!driver) {
        InternalLogger.error(
          'QueueService',
          `We couldn't find any driver associated with the "${driverName}".`,
        );
        continue;
      }

      QueueService.connections[connName] = {
        config: connection,
        client: new driver(connection),
      };
      InternalLogger.success(
        'QueueService',
        `Queue connection [${connName}] successfully initiailized ${logTime(
          Date.now() - time,
        )}`,
      );
    }
  }

  static getConnection<T = QueueDrivers>(
    connection: string | undefined,
  ): { config: QueueDriverOptions; client: T } {
    const options = QueueMetadata.getData();
    if (!connection) connection = options.default;
    return QueueService.connections[connection];
  }

  static getConnectionClient<T = QueueDrivers>(
    connection: string | undefined,
  ): T {
    const options = QueueMetadata.getData();
    if (!connection) connection = options.default;
    return QueueService.connections[connection].client;
  }
}
