import { QueueMetadata } from '../metadata';
import { QueueDriver, InternalMessage, DriverJob } from '../strategy';

export class SyncQueueDriver implements QueueDriver {
  constructor() {}

  async push(message: string, rawPayload: InternalMessage): Promise<void> {
    const job = QueueMetadata.getJob(rawPayload.job);
    job.target(rawPayload.data);
    return;
  }

  async pull(options: Record<string, any>): Promise<DriverJob | null> {
    return null;
  }

  async remove(job: DriverJob, options: Record<string, any>): Promise<void> {
    return;
  }

  async purge(options: Record<string, any>): Promise<void> {
    return;
  }

  async count(options: Record<string, any>): Promise<number> {
    return 0;
  }
}
