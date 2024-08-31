import { ulid } from 'ulid';
import { Package } from '../../utils';
import { validateOptions } from '../../utils/helpers';
import { RedisJob } from '../interfaces/job';
import { RedisQueueOptionsDto } from '../schema';
import { InternalMessage } from '../strategy';
import { PollQueueDriver } from '../strategy/pollQueueDriver';

const FIND_DELAYED_JOB = `
local source_key = KEYS[1]
local destination_key = KEYS[2]
local score_limit = tonumber(ARGV[1])
local max_members = 20

-- Get the member with the lowest score
local results = redis.call('ZRANGEBYSCORE', source_key, '-inf', score_limit, 'WITHSCORES', 'LIMIT', 0, max_members)

local processed = {}
for i = 1, #results, 2 do
    local member = results[i]
    local score = results[i+1]
    
    -- Remove the member from the sorted set
    redis.call('ZREM', source_key, member)
    
    -- Push the member to the destination list
    redis.call('RPUSH', destination_key, member)
    
    table.insert(processed, {member, score})
end

return processed
`;

export class RedisQueueDriver implements PollQueueDriver {
  private client: any;
  private queuePrefix: string;

  constructor(private options: Record<string, any>) {
    validateOptions(this.options, RedisQueueOptionsDto, {
      cls: 'RedisQueueDriver',
    });
    this.queuePrefix = this.options.prefix || 'intent_queue';
    const Redis = Package.load('ioredis');
    this.client = new Redis(options);
    this.client.defineCommand('findDelayedJob', {
      numberOfKeys: 2,
      lua: FIND_DELAYED_JOB,
    });
  }

  async init(): Promise<void> {}

  async push(message: string, rawPayload: InternalMessage): Promise<void> {
    if (rawPayload.delay > Date.now()) {
      await this.pushToDelayedQueue(message, rawPayload);
      return;
    }

    await this.client.rpush(
      this.getQueue(`${rawPayload.queue}`),
      this.getProcessedMessage(message),
    );
  }

  async pull(options: Record<string, any>): Promise<RedisJob[]> {
    const data = await this.client.lpop(this.getQueue(options.queue));
    return data ? [new RedisJob({ message: data })] : [];
  }

  async remove(): Promise<void> {
    return;
  }

  async purge(options: Record<string, any>): Promise<void> {
    await this.client.del(this.getQueue(options.queue));
    await this.client.del(this.getDelayedQueue(options.queue));
  }

  async count(options: Record<string, any>): Promise<number> {
    return await this.client.llen(this.getQueue(options.queue));
  }

  async pushToDelayedQueue(
    message: string,
    rawPayload: InternalMessage,
  ): Promise<void> {
    await this.client.zadd(
      this.getDelayedQueue(`${rawPayload.queue}`),
      Date.now() + rawPayload.delay * 1000,
      this.getProcessedMessage(message),
    );
  }

  getProcessedMessage(message: string): string {
    const data = JSON.parse(message);
    data.id = ulid();
    return JSON.stringify(data);
  }

  async scheduledTask(options: Record<string, any>): Promise<void> {
    await (this.client as any).findDelayedJob(
      this.getDelayedQueue(options.queue),
      this.getQueue(options.queue),
      Date.now(),
    );
  }

  getDelayedQueue(queue: string): string {
    return `${this.queuePrefix}::${queue}::delayed`;
  }

  getQueue(queue: string): string {
    return `${this.queuePrefix}::${queue}`;
  }
}
