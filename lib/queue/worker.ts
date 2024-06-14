import { ListenerOptions } from './interfaces';
import { QueueMetadata } from './metadata';
import { QueueService } from './service';
import { JobRunner } from './jobrunner';
import { DriverJob, QueueDriver } from '@squareboat/nest-queue-strategy';
import { Logger } from '../console';

export class QueueWorker {
  private options: ListenerOptions;

  constructor(options?: ListenerOptions) {
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

  static init(options?: ListenerOptions): QueueWorker {
    return new QueueWorker(options);
  }

  private async poll(connection: QueueDriver): Promise<DriverJob | null> {
    const job = await connection.pull({ queue: this.options.queue });
    return job;
  }

  /**
   * Listen to the queue
   */
  async listen() {
    this.log('info', 'LOG [QueueWorker] Queue Worker Initialised');
    const connection = QueueService.getConnection(this.options.connection);

    // perform scheduled task of the driver
    if (connection.scheduledTask) this.performScheduledTask(connection);

    const runner = new JobRunner(this.options, connection);
    while (1) {
      const job = await this.poll(connection);
      if (job) {
        await runner.run(job);
      } else {
        await new Promise((resolve) => setTimeout(resolve, this.options.sleep));
      }
    }
  }

  private async performScheduledTask(connection: QueueDriver) {
    if (!connection || !connection.scheduledTask) return;
    setInterval(
      async () =>
        connection.scheduledTask
          ? await connection.scheduledTask(this.options)
          : null,
      this.options.schedulerInterval || 10000,
    );
  }

  async purge(): Promise<void> {
    const connection = QueueService.getConnection(this.options.connection);
    await connection.purge({ queue: this.options.queue });
    return;
  }

  async count(): Promise<number> {
    const connection = QueueService.getConnection(this.options.connection);
    return await connection.count({ queue: this.options.queue });
  }

  log(level: string, msg: string): void {
    if (!this.options.logger) return;
    let logger = undefined;
    switch (level) {
      case 'info':
        logger = Logger.info;
        break;
      case 'success':
        logger = Logger.success;
        break;
      case 'error':
        logger = Logger.error;
        break;
      case 'warn':
        logger = Logger.warn;
        break;
    }

    logger && logger(msg);
  }
}
