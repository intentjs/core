import {
  DriverJob,
  InternalMessage,
  QueueDriver,
} from '@squareboat/nest-queue-strategy';
import { ListenerOptions } from './interfaces';
import { QueueMetadata } from './metadata';
import { Dispatch } from './queue';
import { JobFailed, JobProcessed, JobProcessing } from './events';
import { ConsoleIO, Logger } from '../console';

export class JobRunner {
  private consoleIo: ConsoleIO;

  constructor(
    private options: ListenerOptions,
    private connection: QueueDriver,
  ) {
    this.consoleIo = new ConsoleIO('', {});
  }

  async run(job: DriverJob) {
    const message = this.fetchMessage(job);
    const { data } = message;
    try {
      this.log('info', `LOG [${message.job}] Job Processing...`);
      const targetJob = QueueMetadata.getJob(message.job);
      if (!targetJob || !targetJob.target) return;
      const event = new JobProcessing(message, job);
      event.emit();
      await targetJob.target(data);
      await this.success(message, job);
      this.log('success', `LOG [${message.job}] Job Processed`);
    } catch (e) {
      const event = new JobFailed(message, job);
      event.emit();
      await this.retry(message, job);
      const errorMessage = (e as Error).message;
      this.log(
        'error',
        `LOG [${message.job}] Job Failed | Error: ${errorMessage}`,
      );
    }
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

  /**
   * Job processed succesfully method
   * @param message
   * @param job
   */
  async success(message: InternalMessage, job: DriverJob): Promise<void> {
    const event = new JobProcessed(message, job);
    event.emit();
    await this.removeJobFromQueue(job);
  }

  /**
   * Retry job after it has failed
   * @param message
   * @param job
   */
  async retry(message: InternalMessage, job: DriverJob): Promise<void> {
    this.removeJobFromQueue(job);
    await this.removeJobFromQueue(job);
    message.attemptCount += 1;
    if (message.attemptCount === message.tries) return;
    Dispatch(message);
  }

  /**
   * Remove job from the queue method
   * @param job
   */
  async removeJobFromQueue(job: DriverJob): Promise<void> {
    await this.connection.remove(job, this.options);
  }

  /**
   * Fetch message out of the driver message
   * @param job
   */
  fetchMessage(job: DriverJob): InternalMessage {
    return JSON.parse(job.getMessage());
  }
}
