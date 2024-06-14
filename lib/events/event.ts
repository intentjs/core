import 'reflect-metadata';
import { SquareboatNestEventConstants } from './constants';
import { difference, Package } from './helpers';
import { GenericFunction } from './interfaces';
import { EventListenerRunner } from './runner';

export class EmitsEvent {
  private reservedKeyNames = [
    'fetchPayload',
    'emit',
    'reservedKeyNames',
    'dispatch',
  ];

  /**
   * Emit function
   * @returns Promise<void>
   */
  async emit(): Promise<void> {
    type ObjectKey = keyof typeof this;

    const eventName = Reflect.getMetadata(
      SquareboatNestEventConstants.eventEmitterName,
      this.constructor,
    );

    const shouldBeQueued = this[
      'queueOptions' as ObjectKey
    ] as unknown as GenericFunction;

    if (!shouldBeQueued) {
      const runner = new EventListenerRunner();
      await runner.handle(eventName, this.fetchPayload());
      return;
    }

    const queueConnection = shouldBeQueued();
    await this.dispatch(eventName, queueConnection);
  }

  fetchPayload(): Record<string, any> {
    type ObjectKey = keyof typeof this;

    const payloadKeys = difference(
      Object.getOwnPropertyNames(this),
      this.reservedKeyNames,
    ) as ObjectKey[];

    const payload = {} as { [key: string]: any };
    for (const key of payloadKeys) {
      payload[key as string] = this[key];
    }

    return payload;
  }

  /**
   * Dispatches the job to queue
   * @param eventName
   * @param queueConnection
   *
   * @returns Promise<void>
   */
  async dispatch(
    eventName: string,
    queueConnection: Record<string, any> | Record<string, any>[],
  ): Promise<void> {
    const totalJobOptions = Array.isArray(queueConnection)
      ? queueConnection
      : [queueConnection];

    const queuePkg = Package.load('@squareboat/nest-queue') as Record<
      string,
      GenericFunction
    >;

    const eventData = this.fetchPayload();
    for (const option of totalJobOptions) {
      await queuePkg.Dispatch({
        job: SquareboatNestEventConstants.eventJobName,
        data: {
          eventName,
          eventData,
          discriminator: '@squareboat/nest-event/queueable_event',
        },
        ...(option || {}),
      });
    }
  }
}
