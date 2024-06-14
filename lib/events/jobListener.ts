import { Injectable } from '@nestjs/common';
import { SquareboatNestEventConstants } from './constants';
import { EventListenerRunner } from './runner';

export const JOB_NAME = '__JOB_NAME__';
export const JOB_OPTIONS = '__JOB_OPTIONS__';

export function Job(job: string, options?: Record<string, any>) {
  options = options || {};
  return function (target: Record<string, any>, propertyKey: string) {
    Reflect.defineMetadata(JOB_NAME, job, target, propertyKey);
    Reflect.defineMetadata(JOB_OPTIONS, options, target, propertyKey);
  };
}

@Injectable()
export class EventQueueWorker {
  @Job(SquareboatNestEventConstants.eventJobName)
  async handle(data: Record<string, any>): Promise<void> {
    const { eventName, eventData } = data;
    const runner = new EventListenerRunner();
    await runner.handle(eventName, eventData);
  }
}
