import { Obj } from '../../utils';
import { ListenerOptions } from '../interfaces';
import { QueueMetadata } from '../metadata';
import { QueueService } from '../service';
import { SubscribeQueueDriver } from '../strategy/subscribeQueueDriver';

export interface PubSubWorkerOptions extends ListenerOptions {
  listenerId?: string;
  meta?: Record<string, any>;
}

export class SubscribeQueueWorker {
  private options: PubSubWorkerOptions;

  constructor(options?: PubSubWorkerOptions) {
    const defaultOptions = QueueMetadata.getDefaultOptions();
    this.options = options || {};
    this.options = {
      ...defaultOptions,
      schedulerInterval: 10000,
      queue: undefined,
      logger: true,
      ...this.options,
    };

    if (!this.options.queue) {
      const data = QueueMetadata.getData();
      this.options['queue'] = data.connections[
        this.options.connection || defaultOptions.connection
      ].queue as string;
    }
  }

  static async init(options: PubSubWorkerOptions): Promise<void> {
    const worker = new SubscribeQueueWorker(options);
    await worker.initListeners();
  }

  async initListeners(): Promise<void> {
    const jobs = QueueMetadata.getAllJobs();
    await this.initBroker(this.options.connection, jobs);
    const connClient = QueueService.getConnectionClient<SubscribeQueueDriver>(
      this.options.connection,
    );

    await connClient.startListening(this.processIncomingMessage());

    this.attachDeamonListeners();

    await new Promise(() =>
      setInterval(async () => {}, 20 * 24 * 60 * 60 * 1000),
    );
  }

  attachDeamonListeners() {
    process.on('SIGINT', async () => {
      await this.closeConnections();
    });

    process.on('SIGQUIT', async () => {
      await this.closeConnections();
    });

    process.on('SIGTERM', async () => {
      await this.closeConnections();
    });

    process.on('message', async (msg: any) => {
      if (msg === 'shutdown' || msg.type === 'shutdown') {
        await this.closeConnections();
      }
    });
  }

  processIncomingMessage(): (options: Record<string, any>) => void {
    return async ({ topic, value }: Record<string, any>) => {
      const topicListeners = QueueMetadata.getJob(topic);
      await topicListeners.target(value, { ...(this.options.meta || {}) });
    };
  }

  async initBroker(
    broker: string,
    listeners: Record<string, any>,
  ): Promise<void> {
    const topicNames = Object.keys(listeners);

    const brokerClient =
      QueueService.getConnectionClient<SubscribeQueueDriver>(broker);

    const workerOptions = Obj.pick(this.options, ['listenerId']);
    await brokerClient.initListeners({
      topics: topicNames,
      workerOptions: workerOptions,
    });
  }

  async closeConnections() {
    const listeners = QueueMetadata.getAllJobs();
    const brokers = Object.keys(listeners);
    for (const broker of brokers) {
      const brokerClient =
        QueueService.getConnectionClient<SubscribeQueueDriver>(broker);
      await brokerClient.disconnect();
    }

    process.exit(0);
  }
}
