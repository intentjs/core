import {
  InternalMessage,
  JobOptions,
  Message,
} from '@squareboat/nest-queue-strategy';
import { QueueMetadata } from '../metadata';

type Complete<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
    ? T[P]
    : T[P] | undefined;
};

export class PayloadBuilder {
  static build(
    message: Message,
    jobOptions: JobOptions,
  ): Complete<InternalMessage> {
    const defaultOptions = QueueMetadata.getDefaultOptions();
    const payload = {
      attemptCount: 0,
      ...defaultOptions,
      queue: undefined,
      ...jobOptions,
      ...message,
    } as Complete<InternalMessage>;

    payload.connection = payload.connection || defaultOptions.connection;

    if (!payload.queue) {
      const config = QueueMetadata.getData();
      payload.queue =
        payload.connection != undefined
          ? (config.connections[payload.connection].queue as string)
          : undefined;
    }

    return payload;
  }
}
