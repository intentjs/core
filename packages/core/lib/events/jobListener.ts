import { Injectable } from '@nestjs/common';
import { Job } from '../queue/decorators';
import { IntentEventConstants } from './constants';
import { EventListenerRunner } from './runner';

@Injectable()
export class EventQueueWorker {
  @Job(IntentEventConstants.eventJobName)
  async handle(data: Record<string, any>): Promise<void> {
    const { eventName, eventData } = data;
    const runner = new EventListenerRunner();
    await runner.handle(eventName, eventData);
  }
}
