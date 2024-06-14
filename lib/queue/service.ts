import { Injectable } from '@nestjs/common';
import { QueueOptions } from './interfaces';
import { QueueMetadata } from './metadata';
import { QueueDriver } from '@squareboat/nest-queue-strategy';
import { IntentConfig } from '../config/service';

@Injectable()
export class QueueService {
  private static connections: Record<string, any> = {};

  constructor(private config: IntentConfig) {
    const options = config.get<QueueOptions>('queue');
    for (const connName in options.connections) {
      const connection = options.connections[connName];
      const driver: any = connection.driver;
      QueueService.connections[connName] = new driver(connection);
    }
  }

  static getConnection(connection: string | undefined): QueueDriver {
    const options = QueueMetadata.getData();
    if (!connection) connection = options.default;
    return QueueService.connections[connection];
  }
}
