import { isEmpty } from "./helpers";
import { EventMetadata } from "./metadata";

export class EventListenerRunner {
  async handle(eventName: string, eventData: any): Promise<void> {
    const promises = [];
    const listeners = EventMetadata.getListeners(eventName);
    if (isEmpty(listeners)) return;

    for (const listener of listeners) {
      promises.push(listener(eventData));
    }

    await Promise.all(promises);
  }
}
