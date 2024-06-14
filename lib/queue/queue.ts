import { PayloadBuilder } from './core';
import { QueueMetadata } from './metadata';
import { QueueService } from './service';
import { Message } from '@squareboat/nest-queue-strategy';

export class Queue {
  static async dispatch(message: Message): Promise<void> {
    const job = QueueMetadata.getJob(message.job);
    const payload = PayloadBuilder.build(message, job?.options ?? {});
    const connection = QueueService.getConnection(payload['connection']);
    return connection.push(JSON.stringify(payload), payload);
  }
}

export function Dispatch(message: Message): Promise<void> {
  const job = QueueMetadata.getJob(message.job);
  const payload = PayloadBuilder.build(message, job?.options || {});
  const connection = QueueService.getConnection(payload.connection);
  return connection.push(JSON.stringify(payload), payload);
}
