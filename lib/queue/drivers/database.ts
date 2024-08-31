import { ObjectionService } from '../../database';
import { DbQueueDriverOptions } from '../interfaces';
import { DbJob } from '../interfaces/job';
import { InternalMessage } from '../strategy';
import { PollQueueDriver } from '../strategy/pollQueueDriver';

export class DatabaseQueueDriver implements PollQueueDriver {
  private client: any;

  constructor(private options: DbQueueDriverOptions) {
    this.client = ObjectionService.connection(options?.connection);
  }

  async init(): Promise<void> {
    return;
  }

  async push(message: string, rawPayload: InternalMessage): Promise<void> {
    const {} = this.options;
    await this.client
      .insert({
        id: rawPayload.id,
        queue: rawPayload.queue,
        payload: message,
        scheduledAt: rawPayload.delay,
      })
      .into(this.options.table);
    return;
  }

  async pull(options: Record<string, any>): Promise<DbJob[] | null> {
    const messages = await this.client
      .select('*')
      .where('queue', options.queue)
      .where('scheduled_at', '<=', Date.now())
      .from(this.options.table);

    return messages.map(m => new DbJob(m));
  }

  async remove(job: DbJob, options: Record<string, any>): Promise<void> {
    await this.client
      .del()
      .where('id', job.getId())
      .where('queue', options.queue)
      .from(this.options.table);
    return;
  }

  async purge(options: Record<string, any>): Promise<void> {
    await this.client
      .del()
      .where('queue', options.queue)
      .from(this.options.table);
    return;
  }

  async count(options: Record<string, any>): Promise<number> {
    const count = await this.client
      .count('1')
      .where('queue', options.queue)
      .from(this.options.table);

    return count;
  }
}
