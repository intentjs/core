import { EmitsEvent, Event } from '@intentjs/core';

@Event('order_placed')
export class OrderPlacedEvent extends EmitsEvent {
  constructor(public order: Record<string, any>) {
    super();
  }
}
