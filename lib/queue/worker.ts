import { ListenerOptions } from './interfaces';
import { QueueMetadata } from './metadata';
import { QueueService } from './service';
import { PollQueueWorker } from './workers/pollQueue';
import { SubscribeQueueWorker } from './workers/subscribeQueue';

interface QueueWorkerOptions extends ListenerOptions {
  listenerType: 'poll' | 'subscribe';
  meta?: Record<string, any>;
  listenerId?: string;
}

export class QueueWorker {
  private options: Record<string, any>;

  constructor(args: Omit<QueueWorkerOptions, 'listenerType'>) {
    const defaultOptions = QueueMetadata.getDefaultOptions();
    this.options = {
      ...defaultOptions,
      schedulerInterval: 10000,
      queue: undefined,
      logger: true,
      ...args,
    };

    const { config } = QueueService.getConnection(this.options.connection);
    this.options.listenerType = config.listenerType;

    if (!this.options.queue) {
      const data = QueueMetadata.getData();
      this.options['queue'] = data.connections[
        this.options.connection || defaultOptions.connection
      ].queue as string;
    }
  }

  static init(options: Omit<QueueWorkerOptions, 'listenerType'>): QueueWorker {
    return new QueueWorker(options);
  }

  async listen(): Promise<void> {
    const options = { ...this.options };

    if (this.options.listenerType === 'poll') {
      await PollQueueWorker.init(options).listen();
    }

    if (this.options.listenerType === 'subscribe') {
      await SubscribeQueueWorker.init({
        listenerId: options?.listenerId ?? 'intent-queue-listener',
        ...options,
      });
    }
  }
}
