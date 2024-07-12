import { Inject, Injectable } from '@nestjs/common';
import { QUEUE_OPTIONS } from './constants';
import { QueueOptions } from './interfaces';
import { GenericFunction } from '../interfaces';
import { JobOptions } from './strategy';

interface JobTarget {
  options: JobOptions;
  target: GenericFunction;
}

@Injectable()
export class QueueMetadata {
  private static data: QueueOptions;
  private static defaultOptions: Record<
    string,
    string | number | boolean | undefined
  >;
  private static store: Record<string, any> = { jobs: {} };

  constructor(@Inject(QUEUE_OPTIONS) data: QueueOptions) {
    QueueMetadata.data = data;
    QueueMetadata.defaultOptions = {
      connection: data.default,
      queue: data.connections[data.default].queue as string,
      delay: 10,
      tries: 5,
      timeout: 30,
      sleep: 5000,
    };
  }

  static getDefaultOptions(): Record<string, any> {
    return QueueMetadata.defaultOptions;
  }

  static getData(): QueueOptions {
    return QueueMetadata.data;
  }

  static addJob(jobName: string, target: JobTarget): void {
    QueueMetadata.store.jobs[jobName] = target;
  }

  static getJob(jobName: string): JobTarget {
    return QueueMetadata.store.jobs[jobName];
  }
}
