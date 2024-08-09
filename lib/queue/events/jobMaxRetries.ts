import { EmitsEvent, Event } from '../../events';
import { events } from '../constants';

@Event(events.jobMaxRetriesExceeed)
export class JobMaxRetriesExceeed extends EmitsEvent {
  constructor(
    public message: any,
    public job: any,
  ) {
    super();
  }
}
