import { JobStatusEnum } from '../constants';
import { ListenerOptions } from '../interfaces';
import { QueueMetadata } from '../metadata';
import { InternalMessage } from '../strategy';
import { PollQueueDriver } from '../strategy/pollQueueDriver';

export class JobRunner {
  constructor(
    private options: ListenerOptions,
    private connection: PollQueueDriver,
  ) {}

  async run(message: InternalMessage): Promise<Record<string, any>> {
    const { data } = message;
    try {
      const targetJob = QueueMetadata.getJob(message.job);
      if (!targetJob || !targetJob.target)
        return { status: JobStatusEnum.jobNotFound, message };

      await targetJob.target(data);
      return { status: JobStatusEnum.success, message };
    } catch (e) {
      return { status: JobStatusEnum.retry, error: e, message };
    }
  }
}
